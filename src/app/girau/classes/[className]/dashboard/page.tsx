'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Sidebar, { SidebarControls, NavSection } from '@/components/girau/Sidebar';
import { supabase, requireRole, edge } from '@/lib/supabase';

const MODULES_BUCKET = 'modules';
const MODULES_PUBLIC_BASE =
  'https://kruwfhzfqieuiuhqlutt.supabase.co/storage/v1/object/public/modules/';

const SUBJECT_THEME: Record<string, { color: string; gradient: string; icon: string }> = {
  mathematics: { color: 'red', gradient: 'from-red-400 to-red-600', icon: 'fa-calculator' },
  maths: { color: 'red', gradient: 'from-red-400 to-red-600', icon: 'fa-calculator' },
  math: { color: 'red', gradient: 'from-red-400 to-red-600', icon: 'fa-calculator' },
  english: { color: 'violet', gradient: 'from-violet-400 to-violet-600', icon: 'fa-book-open' },
  physics: { color: 'amber', gradient: 'from-amber-400 to-amber-600', icon: 'fa-atom' },
  chemistry: { color: 'pink', gradient: 'from-pink-400 to-pink-600', icon: 'fa-flask' },
  biology: { color: 'green', gradient: 'from-green-400 to-green-600', icon: 'fa-dna' },
  economics: { color: 'cyan', gradient: 'from-cyan-400 to-cyan-600', icon: 'fa-chart-line' },
  government: { color: 'rose', gradient: 'from-rose-400 to-rose-600', icon: 'fa-landmark' },
  commerce: { color: 'teal', gradient: 'from-teal-400 to-teal-600', icon: 'fa-store' },
  accounting: { color: 'slate', gradient: 'from-slate-400 to-slate-600', icon: 'fa-coins' },
  literature: { color: 'purple', gradient: 'from-purple-400 to-purple-600', icon: 'fa-feather' },
  default: { color: 'slate', gradient: 'from-[#800020] to-[#5c0017]', icon: 'fa-book' },
};

function subjectTheme(subject: string) {
  const key = (subject || '').toLowerCase().trim();
  for (const k of Object.keys(SUBJECT_THEME)) {
    if (k === 'default') continue;
    if (key.indexOf(k) !== -1 || k.indexOf(key) !== -1) return SUBJECT_THEME[k];
  }
  return SUBJECT_THEME.default;
}

function titleCase(str: string) {
  if (!str) return '';
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseModuleFilename(name: string) {
  const clean = name.replace(/\.html?$/i, '');
  const parts = clean.split('_');
  const info: { teacher: string; subject: string; title: string } = {
    teacher: '',
    subject: '',
    title: clean,
  };
  if (parts.length >= 3) {
    info.teacher = parts[0].replace(/-/g, ' ');
    info.subject = parts[1].replace(/-/g, ' ');
    info.title = parts.slice(2).join(' ').replace(/-/g, ' ');
  } else if (parts.length === 2) {
    info.teacher = parts[0].replace(/-/g, ' ');
    info.title = parts[1].replace(/-/g, ' ');
  } else {
    info.title = clean.replace(/-/g, ' ');
  }
  info.teacher = titleCase(info.teacher);
  info.subject = titleCase(info.subject);
  info.title = titleCase(info.title);
  return info;
}

function formatModuleDate(ts?: string) {
  if (!ts) return 'Recently';
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}

function getInitials(fullName: string) {
  try {
    return String(fullName || '')
      .split(' ')
      .slice(0, 2)
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase();
  } catch {
    return 'S';
  }
}

function avatarFor(name: string) {
  return (
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(getInitials(name) || 'S') +
    '&background=800020&color=fff&size=128&bold=true'
  );
}

interface ModuleFile {
  name: string;
  updated_at?: string;
  created_at?: string;
}

interface TimetableItem {
  start?: string;
  end?: string;
  subject?: string;
  teacher?: string;
  room?: string;
  day?: string;
  live?: boolean;
}

interface ResultItem {
  subject?: string;
  title?: string;
  score?: number | null;
  date?: string;
  duration?: string;
}

interface AssignmentItem {
  title?: string;
  subject?: string;
  due_date?: string;
}

const QUOTES = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Success is not final, failure is not fatal.', author: 'Winston Churchill' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Education is the most powerful weapon.', author: 'Nelson Mandela' },
  { text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'The more that you read, the more things you will know.', author: 'Dr. Seuss' },
];

export default function StudentDashboardPage() {
  const params = useParams();
  const className = (params?.className as string) || 'JSS1';

  const [session, setSession] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [modules, setModules] = useState<ModuleFile[] | null>(null);
  const [modulesError, setModulesError] = useState('');
  const [timetable, setTimetable] = useState<TimetableItem[]>([]);
  const [recentResults, setRecentResults] = useState<ResultItem[]>([]);
  const [pending, setPending] = useState<AssignmentItem[]>([]);
  const [stats, setStats] = useState({ attendance: '—', avgScore: '—', pending: '—', live: '—' });
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Focus timer state
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Focus Session');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Auth gate
  useEffect(() => {
    const s = requireRole('student');
    if (!s) return;
    setSession(s);
    setUser(s.user || {});
    setAuthChecked(true);
  }, []);

  // Load modules from Supabase storage
  const loadModules = useCallback(async () => {
    setModules(null);
    setModulesError('');
    try {
      const res = await supabase.storage
        .from(MODULES_BUCKET)
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
      if (res.error) throw res.error;
      const files = (res.data || []).filter(
        (item: any) => item && !String(item.id || '').endsWith('.') && /\.html?$/i.test(item.name),
      );
      files.sort((a: any, b: any) => {
        const ta = new Date(a.updated_at || a.created_at || 0).getTime();
        const tb = new Date(b.updated_at || b.created_at || 0).getTime();
        return tb - ta;
      });
      setModules(files);
    } catch (err: any) {
      console.warn('[Girau] modules list failed:', err);
      setModulesError(err?.message || 'Unable to reach storage.');
      setModules([]);
    }
  }, []);

  // Load dashboard data via edge function (with client-side fallback)
  const loadDashboardData = useCallback(
    async (s: any) => {
      const userId = s?.user?.id || null;
      try {
        const res = await edge('get-student-dashboard', { body: { user_id: userId } });
        if (res.ok && res.data) {
          const p = res.data;
          if (p.stats) {
            setStats({
              attendance: p.stats.attendance != null ? p.stats.attendance + '%' : '—',
              avgScore: p.stats.average_score != null ? p.stats.average_score + '%' : '—',
              pending: p.stats.pending_assignments != null ? String(p.stats.pending_assignments) : '—',
              live: p.stats.live_sessions != null ? String(p.stats.live_sessions) : '—',
            });
          }
          if (Array.isArray(p.timetable)) setTimetable(p.timetable);
          if (Array.isArray(p.recent_results)) setRecentResults(p.recent_results);
          if (Array.isArray(p.pending_assignments)) setPending(p.pending_assignments);
        } else {
          await clientSideFallback(s);
        }
      } catch (err) {
        console.warn('[Girau] edge function failed, falling back:', err);
        await clientSideFallback(s);
      }
      loadModules();
    },
    [loadModules],
  );

  const clientSideFallback = async (s: any) => {
    const userId = s?.user?.id || null;
    try {
      const sc = await supabase
        .from('scores')
        .select('subject, title, score, date, duration')
        .eq('student_id', userId)
        .order('date', { ascending: false })
        .limit(5);
      if (sc.data) setRecentResults(sc.data as ResultItem[]);
    } catch {}
    try {
      const asg = await supabase
        .from('assignments')
        .select('title, subject, due_date')
        .eq('student_id', userId)
        .eq('status', 'pending')
        .order('due_date', { ascending: true });
      if (asg.data) {
        setPending(asg.data as AssignmentItem[]);
        setStats((prev) => ({ ...prev, pending: String(asg.data?.length || 0) }));
      }
    } catch {}
    try {
      const tt = await supabase
        .from('timetable')
        .select('day, start, end, subject, teacher, room, live')
        .order('start', { ascending: true });
      if (tt.data) setTimetable(tt.data as TimetableItem[]);
    } catch {}
    setStats((prev) => ({ ...prev, attendance: '—', avgScore: '—', live: '0' }));
  };

  useEffect(() => {
    if (authChecked && session) loadDashboardData(session);
  }, [authChecked, session, loadDashboardData]);

  // Focus timer
  useEffect(() => {
    if (!timerRunning) return;
    timerRef.current = setInterval(() => {
      setTimerSeconds((prevSec) => {
        if (prevSec === 0) {
          if (timerMinutes === 0) {
            setTimerRunning(false);
            setTimerLabel('Session complete! 🎉');
            showToast('Focus session complete. Well done!', 'success');
            return 0;
          }
          setTimerMinutes((m) => m - 1);
          return 59;
        }
        return prevSec - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timerMinutes]);

  const setTimer = (mins: number) => {
    setTimerRunning(false);
    setTimerMinutes(mins);
    setTimerSeconds(0);
    setTimerLabel('Focus Session');
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerMinutes(25);
    setTimerSeconds(0);
    setTimerLabel('Focus Session');
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) return 'Good Afternoon';
    if (h >= 17) return 'Good Evening';
    return 'Good Morning';
  })();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const name = user?.full_name || user?.name || user?.username || 'Student';
  const firstName = name.split(' ')[0];

  const sidebarSections: NavSection[] = [
    {
      title: 'Main Menu',
      items: [
        {
          label: 'Dashboard',
          href: `/girau/classes/${className}/dashboard`,
          icon: 'fas fa-home',
          active: true,
        },
        {
          label: 'Learning Modules',
          href: '#learningModules',
          icon: 'fas fa-cube',
          iconColor: 'text-[#800020]',
        },
        {
          label: 'Messenger',
          href: '/girau/messenger',
          icon: 'fas fa-comments',
          iconColor: 'text-[#a63d56]',
        },
        {
          label: 'Assignments',
          href: '#pendingAssignments',
          icon: 'fas fa-tasks',
          iconColor: 'text-amber-500',
        },
        {
          label: 'My Scores',
          href: '#recentResults',
          icon: 'fas fa-chart-bar',
          iconColor: 'text-green-600',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar
        sections={sidebarSections}
        user={{ name, subtitle: className + ' Student', avatarUrl: avatarFor(name) }}
      />

      <div className="flex-1 flex flex-col lg:ml-80">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-6 py-3.5">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => SidebarControls.toggle()}
              className="p-2 rounded-xl hover:bg-slate-100 lg:hidden transition-colors"
              aria-label="Toggle sidebar"
            >
              <i className="fas fa-bars text-slate-500" />
            </button>
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search subjects, topics, resources…"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-[#800020]/15 focus:border-[#800020]/40 focus:bg-white transition-all"
                />
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="flex-1 md:hidden">
              <h1 className="font-bold text-slate-800">{className} Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors" aria-label="Notifications">
                <i className="fas fa-bell text-slate-500 text-lg" />
              </a>
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <div className="font-semibold text-slate-800 text-sm">{name}</div>
                  <div className="text-xs text-slate-500">{className}</div>
                </div>
                
                <img
                  src={avatarFor(name)}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-[#800020]/30 object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 space-y-6">
          {/* Hero */}
          <section
            className="rounded-3xl p-6 md:p-8 text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(-45deg, #800020, #5c0017, #a63d56, #800020)',
              backgroundSize: '400% 400%',
              animation: 'girau-gradient 18s ease infinite',
            }}
          >
            <style>{`@keyframes girau-gradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                    {greeting}
                  </span>
                  <span className="text-white/70 text-sm">{currentDate}</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold mb-3">
                  Welcome back, {firstName}! <span className="inline-block">👋</span>
                </h1>
                <p className="text-white/85 text-base md:text-lg mb-6 max-w-xl">
                  Your learning journey continues. Every study session brings you closer to your goals.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#learningModules"
                    className="px-5 py-2.5 bg-white text-[#800020] rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:bg-white/95 transition-colors"
                  >
                    <i className="fas fa-book-open" />
                    <span>Browse Modules</span>
                  </a>
                  <a
                    href="/girau/messenger"
                    className="px-5 py-2.5 bg-white/20 backdrop-blur rounded-xl font-medium flex items-center gap-2 hover:bg-white/30 transition-colors"
                  >
                    <i className="fas fa-comments" />
                    <span>Message Teacher</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Stat Cards */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon="fa-calendar-check"
              gradient="from-[#800020] to-[#5c0017]"
              value={stats.attendance}
              label="Attendance Rate"
              trend="Good"
              trendColor="text-emerald-600"
            />
            <StatCard
              icon="fa-star"
              gradient="from-emerald-500 to-teal-600"
              value={stats.avgScore}
              label="Average Score"
              trend="Improving"
              trendColor="text-emerald-600"
            />
            <StatCard
              icon="fa-tasks"
              gradient="from-amber-500 to-orange-600"
              value={stats.pending}
              label="Pending Assignments"
              trend="Due soon"
              trendColor="text-amber-600"
            />
            <StatCard
              icon="fa-video"
              gradient="from-rose-500 to-pink-600"
              value={stats.live}
              label="Live Sessions Today"
              trend="Live"
              trendColor="text-rose-600"
            />
          </section>

          {/* Learning Modules */}
          <section id="learningModules">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Learning Modules</h2>
                <p className="text-sm text-slate-500">Interactive lessons uploaded by your teachers</p>
              </div>
              <button
                onClick={() => {
                  showToast('Refreshing modules…', 'info');
                  loadModules();
                }}
                className="text-sm font-medium text-[#800020] hover:text-[#5c0017] flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#800020]/5 transition-colors"
              >
                <i className="fas fa-rotate-right" /> Refresh
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {modules === null && <ModulesSkeleton />}
              {modules !== null && modules.length === 0 && !modulesError && <ModulesEmpty />}
              {modules !== null && modulesError && (
                <div className="col-span-full text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <i className="fas fa-cloud-exclamation text-4xl text-rose-400" />
                  </div>
                  <p className="text-base font-medium text-slate-700">Could not load modules.</p>
                  <p className="text-sm text-slate-500 mt-1">{modulesError}</p>
                  <button
                    onClick={loadModules}
                    className="mt-4 px-4 py-2 bg-[#800020] text-white text-sm rounded-xl hover:bg-[#5c0017] transition-colors"
                  >
                    <i className="fas fa-rotate-right mr-1" /> Try again
                  </button>
                </div>
              )}
              {modules !== null &&
                modules.map((f) => {
                  const info = parseModuleFilename(f.name);
                  const theme = subjectTheme(info.subject);
                  const url = MODULES_PUBLIC_BASE + encodeURIComponent(f.name);
                  const dateLabel = formatModuleDate(f.updated_at || f.created_at);
                  return (
                    <div
                      key={f.name}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}
                          >
                            <i className={`fas ${theme.icon} text-white text-xl`} />
                          </div>
                          <span
                            className={`text-[10px] font-semibold text-${theme.color}-700 bg-${theme.color}-50 px-2 py-1 rounded-full uppercase tracking-wide`}
                          >
                            {info.subject || 'General'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2" title={info.title}>
                          {info.title || 'Untitled Module'}
                        </h3>
                        <div className="text-xs text-slate-500 space-y-1 mt-auto mb-4">
                          <div className="flex items-center gap-1.5">
                            <i className="fas fa-user-tie w-3.5 text-slate-400" />
                            <span className="truncate">{info.teacher || 'Teacher'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <i className="fas fa-clock w-3.5 text-slate-400" />
                            <span>{dateLabel}</span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center py-3 bg-gradient-to-r from-[#800020] to-[#5c0017] text-white text-sm font-semibold hover:brightness-110 transition-all"
                      >
                        <i className="fas fa-up-right-from-square mr-1.5" /> Open Module
                      </a>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming classes */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Upcoming Classes</h2>
                    <p className="text-xs text-slate-500">Your timetable for today &amp; tomorrow</p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {timetable.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                      <i className="fas fa-calendar-day text-4xl mb-3 opacity-40" />
                      <p className="text-sm">No upcoming classes scheduled.</p>
                      <p className="text-xs mt-1">Your timetable will appear here when classes are added.</p>
                    </div>
                  ) : (
                    timetable.slice(0, 6).map((it, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
                      >
                        <div className="text-center min-w-[64px]">
                          <div className="text-sm font-bold text-[#800020]">{it.start || '--:--'}</div>
                          <div className="text-[10px] text-slate-400">{it.end || '--:--'}</div>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-800 text-sm truncate">
                            {it.subject || 'Class'}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>
                              <i className="fas fa-user-tie mr-1" />
                              {it.teacher || 'TBA'}
                            </span>
                            {it.room && (
                              <span>
                                <i className="fas fa-map-marker-alt mr-1" />
                                {it.room}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">{it.day || ''}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Recent results */}
              <section id="recentResults" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800">Recent Results</h2>
                  <p className="text-xs text-slate-500">Your latest practice test scores</p>
                </div>
                <div className="p-5 space-y-3">
                  {recentResults.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                      <i className="fas fa-chart-bar text-4xl mb-3 opacity-40" />
                      <p className="text-sm">No recent results yet.</p>
                      <p className="text-xs mt-1">Take a practice test to see your scores here.</p>
                    </div>
                  ) : (
                    recentResults.slice(0, 5).map((r, i) => {
                      const pct = r.score != null ? Math.round(r.score) : null;
                      const tone = pct == null ? 'slate' : pct >= 75 ? 'emerald' : pct >= 50 ? 'amber' : 'rose';
                      return (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className={`w-11 h-11 rounded-xl bg-${tone}-100 flex items-center justify-center`}>
                            <i className={`fas fa-${pct == null ? 'circle-notch' : 'star'} text-${tone}-600`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-800 text-sm truncate">
                              {r.subject || 'Test'} — {r.title || 'Practice Test'}
                            </div>
                            <div className="text-xs text-slate-500">
                              {r.date ? new Date(r.date).toLocaleDateString() : ''}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-${tone}-600`}>{pct == null ? '—' : pct + '%'}</div>
                            <div className="text-[10px] text-slate-400">{r.duration || ''}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              {/* Daily motivation */}
              <div className="bg-gradient-to-br from-[#800020] to-[#5c0017] rounded-2xl p-5 text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-quote-left" />
                  </div>
                  <div>
                    <p className="italic text-sm leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
                    <p className="text-white/70 text-xs font-medium mt-2">— {quote.author}</p>
                  </div>
                </div>
              </div>

              {/* Focus timer */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Focus Timer</h3>
                  <p className="text-xs text-slate-500">Stay productive with Pomodoro</p>
                </div>
                <div className="p-5">
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold text-[#800020] mb-1">
                      {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                    </div>
                    <p className="text-sm text-slate-500">{timerLabel}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTimerRunning(true)}
                      className={`flex-1 py-2.5 bg-[#800020] text-white font-medium rounded-xl hover:bg-[#5c0017] transition-colors text-sm ${
                        timerRunning ? 'hidden' : ''
                      }`}
                    >
                      <i className="fas fa-play mr-1" /> Start
                    </button>
                    <button
                      onClick={() => setTimerRunning(false)}
                      className={`flex-1 py-2.5 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors text-sm ${
                        timerRunning ? '' : 'hidden'
                      }`}
                    >
                      <i className="fas fa-pause mr-1" /> Pause
                    </button>
                    <button
                      onClick={resetTimer}
                      className="py-2.5 px-4 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors text-sm"
                    >
                      <i className="fas fa-redo" />
                    </button>
                  </div>
                  <div className="flex justify-center gap-2 mt-3">
                    {[15, 25, 45, 60].map((m) => (
                      <button
                        key={m}
                        onClick={() => setTimer(m)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          timerMinutes === m && !timerRunning
                            ? 'bg-[#800020]/10 text-[#800020]'
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pending assignments */}
              <div id="pendingAssignments" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Pending Assignments</h3>
                  <span className="text-xs text-slate-500">
                    {pending.length > 0 ? `${pending.length} pending` : '0'}
                  </span>
                </div>
                <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
                  {pending.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <i className="fas fa-check-circle text-3xl mb-2 text-emerald-300" />
                      <p className="text-sm">You&apos;re all caught up!</p>
                    </div>
                  ) : (
                    pending.slice(0, 6).map((a, i) => {
                      const due = a.due_date ? new Date(a.due_date) : null;
                      const overdue = due ? due < new Date() : false;
                      return (
                        <div
                          key={i}
                          className="p-3 rounded-xl border border-slate-100 hover:border-[#800020]/30 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-slate-800 text-sm truncate">
                                {a.title || 'Assignment'}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">{a.subject || ''}</div>
                            </div>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full ${
                                overdue ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {overdue ? 'Overdue' : 'Due'}
                            </span>
                          </div>
                          {due && (
                            <div className="text-xs text-slate-400 mt-2">
                              <i className="fas fa-clock mr-1" />
                              Due {due.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </aside>
          </div>

          <footer className="text-center text-xs text-slate-400 py-6">
            &copy; {new Date().getFullYear()} Girau International School. E-Learning Platform. Learn, Live, Achieve.
          </footer>
        </main>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] px-5 py-3.5 rounded-xl text-white text-sm shadow-2xl ${
            toast.type === 'success'
              ? 'bg-green-600'
              : toast.type === 'error'
                ? 'bg-red-600'
                : 'bg-[#800020]'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  gradient,
  value,
  label,
  trend,
  trendColor,
}: {
  icon: string;
  gradient: string;
  value: string;
  label: string;
  trend: string;
  trendColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <i className={`fas ${icon} text-white`} />
        </div>
        <span className={`text-xs font-medium ${trendColor}`}>{trend}</span>
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function ModulesSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl"
              style={{
                background: 'linear-gradient(90deg,#eef2f7 25%,#dbe3ee 50%,#eef2f7 75%)',
                backgroundSize: '200% 100%',
                animation: 'girau-skel 1.5s infinite',
              }}
            />
            <div
              className="h-5 w-16 rounded-full"
              style={{
                background: 'linear-gradient(90deg,#eef2f7 25%,#dbe3ee 50%,#eef2f7 75%)',
                backgroundSize: '200% 100%',
                animation: 'girau-skel 1.5s infinite',
              }}
            />
          </div>
          <div
            className="h-4 w-2/3 rounded mb-2"
            style={{
              background: 'linear-gradient(90deg,#eef2f7 25%,#dbe3ee 50%,#eef2f7 75%)',
              backgroundSize: '200% 100%',
              animation: 'girau-skel 1.5s infinite',
            }}
          />
          <div
            className="h-3 w-1/2 rounded mb-3"
            style={{
              background: 'linear-gradient(90deg,#eef2f7 25%,#dbe3ee 50%,#eef2f7 75%)',
              backgroundSize: '200% 100%',
              animation: 'girau-skel 1.5s infinite',
            }}
          />
          <div
            className="h-8 w-full rounded-xl"
            style={{
              background: 'linear-gradient(90deg,#eef2f7 25%,#dbe3ee 50%,#eef2f7 75%)',
              backgroundSize: '200% 100%',
              animation: 'girau-skel 1.5s infinite',
            }}
          />
          <style>{`@keyframes girau-skel { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        </div>
      ))}
    </>
  );
}

function ModulesEmpty() {
  return (
    <div className="col-span-full text-center py-16 text-slate-400">
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center">
        <i className="fas fa-folder-open text-4xl opacity-50" />
      </div>
      <p className="text-base font-medium text-slate-600">No modules uploaded yet.</p>
      <p className="text-sm mt-1">Check back soon! Your teachers are preparing lessons.</p>
    </div>
  );
}
