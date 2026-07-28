'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Sidebar, { SidebarControls, NavSection } from '@/components/girau/Sidebar';
import { supabase, requireRole, edge, getSession } from '@/lib/supabase';

const CLASSES = [
  { id: 'JSS1', name: 'JSS 1', color: '#0195db', icon: 'fa-seedling' },
  { id: 'JSS2', name: 'JSS 2', color: '#14b8a6', icon: 'fa-leaf' },
  { id: 'JSS3', name: 'JSS 3', color: '#22c55e', icon: 'fa-tree' },
  { id: 'SSS1', name: 'SSS 1', color: '#f59e0b', icon: 'fa-graduation-cap' },
  { id: 'SSS2', name: 'SSS 2', color: '#ef4444', icon: 'fa-award' },
  { id: 'SSS3', name: 'SSS 3', color: '#8b5cf6', icon: 'fa-trophy' },
];

const TOPIC_TEMPLATES: Record<string, string[]> = {
  Mathematics: ['Number Bases', 'Indices', 'Logarithms', 'Sets', 'Algebra', 'Geometry', 'Trigonometry', 'Statistics'],
  'English Language': ['Parts of Speech', 'Sentence Structure', 'Comprehension', 'Essay Writing', 'Summary Writing'],
  Physics: ['Measurements', 'Motion', 'Newton\'s Laws', 'Energy', 'Waves', 'Sound', 'Light', 'Electricity'],
  Chemistry: ['Atomic Structure', 'Periodic Table', 'Chemical Bonding', 'Reactions', 'Stoichiometry', 'Acids & Bases'],
  Biology: ['Cell Structure', 'Nutrition', 'Photosynthesis', 'Respiration', 'Genetics', 'Evolution', 'Ecology'],
  Economics: ['Basic Concepts', 'Demand & Supply', 'Market Structures', 'National Income', 'Money & Banking'],
  Government: ['Basic Concepts', 'Constitution', 'Arms of Government', 'Federalism', 'Political Parties'],
  Commerce: ['Introduction', 'Trade', 'Business Units', 'Banking', 'Insurance', 'Transportation', 'Marketing'],
  Accounting: ['Book-keeping', 'Trial Balance', 'Final Accounts', 'Partnership Accounts', 'Company Accounts'],
  'Literature in English': ['Prose', 'Poetry', 'Drama', 'Literary Devices', 'African Literature'],
};

const EXAM_TYPES = ['CA1', 'CA2', 'CA3', 'Exam', 'Test', 'Quiz', 'Assignment', 'Project'];

function getInitials(fullName: string) {
  try {
    return String(fullName || '')
      .split(' ')
      .slice(0, 2)
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase();
  } catch {
    return 'T';
  }
}

function avatarFor(name: string) {
  return (
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(getInitials(name) || 'T') +
    '&background=800020&color=fff&size=128&bold=true'
  );
}

interface Student {
  id: string;
  full_name?: string;
  name?: string;
  username?: string;
}

interface ScoreRow {
  id?: string;
  student_id?: string;
  student_name?: string;
  subject?: string;
  exam_type?: string;
  score?: number;
  max_score?: number;
  date?: string;
  teacher_remark?: string;
}

export default function TeacherDashboardPage() {
  const params = useParams();
  const className = (params?.className as string) || 'SSS3';

  const [authChecked, setAuthChecked] = useState(false);
  const [teacher, setTeacher] = useState<any>(null);

  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({});
  const [recentScores, setRecentScores] = useState<ScoreRow[]>([]);
  const [studentQuestions, setStudentQuestions] = useState<any[]>([]);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [stats, setStats] = useState({ students: '—', classesToday: '—', assignments: '—', unread: '—' });

  // Assignment form
  const [assignForm, setAssignForm] = useState({
    title: '',
    description: '',
    class_name: '',
    subject: '',
    due_date: '',
  });
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  // Score form
  const [scoreForm, setScoreForm] = useState({
    class_name: '',
    student_id: '',
    subject: '',
    exam_type: 'CA1',
    max_score: '100',
    score: '',
    teacher_remark: '',
  });
  const [studentsByClass, setStudentsByClass] = useState<Record<string, Student[]>>({});
  const [scoreSubmitting, setScoreSubmitting] = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fallbackTeacherData = async (u: any) => {
    const subject = u.subject || '';
    const classAccess: string[] = u.class_access || [];
    // Count students per class
    const counts: Record<string, number> = {};
    await Promise.all(
      classAccess.map(async (c) => {
        try {
          const r = await supabase.from('students').select('id', { count: 'exact', head: true }).eq('class_name', c);
          counts[c] = r.count || 0;
        } catch {
          counts[c] = 0;
        }
      }),
    );
    setStudentCounts(counts);
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    setStats((s) => ({ ...s, students: String(total), classesToday: '0', assignments: '0', unread: '0' }));
    // Recent scores
    try {
      const sc = await supabase
        .from('scores')
        .select('id,student_id,subject,exam_type,score,max_score,date,teacher_remark')
        .eq('teacher_id', u.id)
        .order('date', { ascending: false })
        .limit(5);
      if (sc.data) setRecentScores(sc.data as ScoreRow[]);
    } catch {}
  };

  const loadTeacherData = useCallback(async (u: any) => {
    const teacherId = u.id || null;
    try {
      const res = await edge('get-teacher-dashboard', { body: { teacher_id: teacherId } });
      if (res.ok && res.data) {
        const p = res.data;
        if (p.student_counts) setStudentCounts(p.student_counts);
        if (Array.isArray(p.recent_scores)) setRecentScores(p.recent_scores);
        if (Array.isArray(p.student_questions)) setStudentQuestions(p.student_questions);
        if (Array.isArray(p.live_sessions)) setLiveSessions(p.live_sessions);
        if (Array.isArray(p.timetable)) setTimetable(p.timetable);
        if (p.stats) {
          setStats({
            students: p.stats.students != null ? String(p.stats.students) : '—',
            classesToday: p.stats.classes_today != null ? String(p.stats.classes_today) : '—',
            assignments: p.stats.assignments != null ? String(p.stats.assignments) : '—',
            unread: p.stats.unread != null ? String(p.stats.unread) : '—',
          });
        }
        return;
      }
    } catch (err) {
      console.warn('[Girau] teacher edge failed, falling back:', err);
    }
    // Client-side fallback
    await fallbackTeacherData(u);
  }, []);

  // Auth gate
  useEffect(() => {
    const s = requireRole('teacher');
    if (!s) return;
    const u = s.user || {};
    setTeacher(u);
    setAuthChecked(true);
    setAssignForm((f) => ({ ...f, subject: u.subject || '' }));
    setScoreForm((f) => ({ ...f, subject: u.subject || '' }));
    loadTeacherData(u);
  }, []);

  // Load students when score class changes
  useEffect(() => {
    const c = scoreForm.class_name;
    if (!c) return;
    if (studentsByClass[c]) return;
    (async () => {
      try {
        const r = await supabase
          .from('students')
          .select('id, full_name, name, username')
          .eq('class_name', c)
          .order('full_name', { ascending: true });
        setStudentsByClass((prev) => ({ ...prev, [c]: (r.data as Student[]) || [] }));
      } catch {
        setStudentsByClass((prev) => ({ ...prev, [c]: [] }));
      }
    })();
  }, [scoreForm.class_name, studentsByClass]);

  const handleAssignmentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!assignForm.title || !assignForm.description || !assignForm.class_name || !assignForm.due_date) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setAssignSubmitting(true);
    try {
      const res = await edge('post-assignment', {
        body: {
          teacher_id: teacher?.id,
          teacher_name: teacher?.full_name || teacher?.username,
          ...assignForm,
        },
      });
      setAssignSubmitting(false);
      if (res.ok && res.data?.success) {
        showToast('Assignment posted successfully!', 'success');
        setAssignForm((f) => ({ ...f, title: '', description: '', due_date: '' }));
      } else {
        showToast(res.data?.error || 'Failed to post assignment.', 'error');
      }
    } catch (err) {
      setAssignSubmitting(false);
      showToast('Network error. Please retry.', 'error');
    }
  };

  const handleScoreSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!scoreForm.class_name || !scoreForm.student_id || !scoreForm.score) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setScoreSubmitting(true);
    try {
      const selectedStudent = (studentsByClass[scoreForm.class_name] || []).find(
        (s) => s.id === scoreForm.student_id,
      );
      const res = await edge('save-score', {
        body: {
          teacher_id: teacher?.id,
          student_id: scoreForm.student_id,
          student_name: selectedStudent?.full_name || selectedStudent?.name || selectedStudent?.username,
          ...scoreForm,
          score: Number(scoreForm.score),
          max_score: Number(scoreForm.max_score),
        },
      });
      setScoreSubmitting(false);
      if (res.ok && res.data?.success) {
        showToast('Score saved successfully!', 'success');
        setScoreForm((f) => ({ ...f, score: '', teacher_remark: '' }));
      } else {
        showToast(res.data?.error || 'Failed to save score.', 'error');
      }
    } catch (err) {
      setScoreSubmitting(false);
      showToast('Network error. Please retry.', 'error');
    }
  };

  const prefillClass = (c: string) => {
    setAssignForm((f) => ({ ...f, class_name: c }));
    document.getElementById('postAssignment')?.scrollIntoView({ behavior: 'smooth' });
  };

  const applyTopicTemplate = (topic: string) => {
    setAssignForm((f) => ({ ...f, title: topic + ' — Assignment' }));
    showToast('Template applied: ' + topic, 'info');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#800020]/20 border-t-[#800020] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading your teacher dashboard…</p>
        </div>
      </div>
    );
  }

  const name = teacher?.full_name || teacher?.name || teacher?.username || 'Teacher';
  const firstName = name.split(' ')[0];
  const subject = teacher?.subject || 'General';

  const greeting = (() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) return 'Good Afternoon';
    if (h >= 17) return 'Good Evening';
    return 'Good Morning';
  })();
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const session = getSession();
  const classAccess: string[] = (session?.user?.class_access as string[]) || teacher?.class_access || [];

  const sidebarSections: NavSection[] = [
    {
      title: 'Main Menu',
      items: [
        {
          label: 'Dashboard',
          href: `/girau/classes/${className}/teachers`,
          icon: 'fas fa-home',
          active: true,
        },
        {
          label: 'Modules',
          href: `/girau/classes/${className}/teachers/modules`,
          icon: 'fas fa-cube',
          iconColor: 'text-[#800020]',
          badge: 'NEW',
        },
        { label: 'My Classes', href: '#myClasses', icon: 'fas fa-chalkboard', iconColor: 'text-emerald-500' },
        { label: 'Timetable', href: '#timetable', icon: 'fas fa-calendar-alt', iconColor: 'text-rose-500' },
      ],
    },
    {
      title: 'Teaching',
      items: [
        { label: 'Post Assignment', href: '#postAssignment', icon: 'fas fa-plus-circle', iconColor: 'text-amber-500' },
        { label: 'Scores', href: '#scoresSection', icon: 'fas fa-chart-bar', iconColor: 'text-cyan-600' },
        { label: 'Student Questions', href: '#studentQuestions', icon: 'fas fa-question-circle', iconColor: 'text-teal-500' },
      ],
    },
    {
      title: 'Communication',
      items: [
        { label: 'Messenger', href: '/girau/messenger', icon: 'fas fa-comments', iconColor: 'text-[#a63d56]' },
      ],
    },
  ];

  const subjectTopics = TOPIC_TEMPLATES[subject] || [];

  return (
    <div className="min-h-screen flex">
      <Sidebar
        sections={sidebarSections}
        user={{ name, subtitle: subject + ' Teacher', avatarUrl: avatarFor(name) }}
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
            <div className="flex-1 min-w-0">
              <h1 className="text-base md:text-lg font-bold text-slate-800 truncate">Teacher Dashboard</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Manage your classes, assignments &amp; results</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#postAssignment"
                className="hidden sm:inline-flex px-4 py-2 bg-[#800020] text-white rounded-xl font-medium text-sm hover:bg-[#5c0017] transition-colors items-center gap-2"
              >
                <i className="fas fa-plus" />
                <span>New Assignment</span>
              </a>
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <div className="font-semibold text-slate-800 text-sm">{name}</div>
                  <div className="text-xs text-slate-500">{subject}</div>
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
              animation: 'girau-tg 18s ease infinite',
            }}
          >
            <style>{`@keyframes girau-tg { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-medium">{greeting}</span>
                  <span className="text-white/70 text-sm">{currentDate}</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold mb-3">
                  Welcome back, {firstName}! <span className="inline-block">👋</span>
                </h1>
                <p className="text-white/85 text-base md:text-lg mb-6 max-w-xl">
                  Subject: <span className="font-semibold">{subject}</span> · Empower your students with assignments, scores &amp; live sessions.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="#postAssignment" className="px-5 py-2.5 bg-white text-[#800020] rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:bg-white/95 transition-colors">
                    <i className="fas fa-plus-circle" />
                    <span>Post Assignment</span>
                  </a>
                  <a href="#scoresSection" className="px-5 py-2.5 bg-white/20 backdrop-blur rounded-xl font-medium flex items-center gap-2 hover:bg-white/30 transition-colors">
                    <i className="fas fa-edit" />
                    <span>Enter Scores</span>
                  </a>
                  <a href="/girau/messenger" className="px-5 py-2.5 bg-white/20 backdrop-blur rounded-xl font-medium flex items-center gap-2 hover:bg-white/30 transition-colors">
                    <i className="fas fa-comments" />
                    <span>Open Messenger</span>
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center bg-white/10 backdrop-blur rounded-2xl p-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-users text-white text-2xl" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.students}</div>
                  <div className="text-white/70 text-sm">Total Students</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur rounded-2xl p-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-calendar-day text-white text-2xl" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.classesToday}</div>
                  <div className="text-white/70 text-sm">Classes Today</div>
                </div>
              </div>
            </div>
          </section>

          {/* Stat cards */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="fa-user-graduate" gradient="from-[#800020] to-[#5c0017]" value={stats.students} label="Total Students" trend="Active" trendColor="text-emerald-600" />
            <StatCard icon="fa-calendar-check" gradient="from-amber-500 to-orange-600" value={stats.classesToday} label="Classes Today" trend="Today" trendColor="text-amber-600" />
            <StatCard icon="fa-tasks" gradient="from-rose-500 to-pink-600" value={stats.assignments} label="Pending Assignments" trend="Posted" trendColor="text-rose-600" />
            <StatCard icon="fa-envelope" gradient="from-[#a63d56] to-[#800020]" value={stats.unread} label="Unread Messages" trend="New" trendColor="text-cyan-600" />
          </section>

          {/* My Classes */}
          <section id="myClasses">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">My Classes</h2>
                <p className="text-sm text-slate-500">Classes you teach across JSS1–SSS3</p>
              </div>
              <span className="text-sm text-slate-400">{CLASSES.length} classes</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {CLASSES.map((cls) => {
                const count = studentCounts[cls.id] ?? 0;
                const hasAccess = classAccess.length === 0 || classAccess.includes(cls.id);
                return (
                  <button
                    key={cls.id}
                    onClick={() => hasAccess && prefillClass(cls.id)}
                    className="text-left bg-white rounded-2xl p-5 border border-slate-200 shadow-sm block cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all relative overflow-hidden"
                    style={{ borderTopColor: cls.color, borderTopWidth: 4 }}
                    disabled={!hasAccess}
                  >
                    <div
                      className="absolute -bottom-1/2 -right-1/2 w-full h-full pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${cls.color} 0%, transparent 70%)`, opacity: 0.05 }}
                    />
                    <div className="flex items-start justify-between mb-3 relative">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#800020] to-[#5c0017] flex items-center justify-center shadow-lg">
                        <i className={`fas ${cls.icon} text-white`} />
                      </div>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{cls.id}</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1 relative">{cls.name}</h3>
                    <p className="text-xs text-slate-500 relative">{count} Students</p>
                    {!hasAccess && <p className="text-[10px] text-slate-400 mt-1 relative">No access</p>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Post Assignment + Recent Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section id="postAssignment" className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <i className="fas fa-plus-circle text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Post Assignment</h2>
                  <p className="text-xs text-slate-500">Create a new assignment for your students</p>
                </div>
              </div>
              <form onSubmit={handleAssignmentSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Title *</label>
                  <input
                    required
                    value={assignForm.title}
                    onChange={(e) => setAssignForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Quadratic Equations Worksheet"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={assignForm.description}
                    onChange={(e) => setAssignForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Instructions for the assignment…"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Class *</label>
                    <select
                      required
                      value={assignForm.class_name}
                      onChange={(e) => setAssignForm((f) => ({ ...f, class_name: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                    >
                      <option value="">Select class…</option>
                      {CLASSES.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Subject (auto-filled)</label>
                    <input
                      readOnly
                      value={assignForm.subject || '—'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Due Date *</label>
                  <input
                    required
                    type="date"
                    value={assignForm.due_date}
                    onChange={(e) => setAssignForm((f) => ({ ...f, due_date: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={assignSubmitting}
                    className="flex-1 py-2.5 bg-[#800020] text-white rounded-xl font-medium hover:bg-[#5c0017] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <i className="fas fa-paper-plane" />
                    <span>{assignSubmitting ? 'Posting…' : 'Post Assignment'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignForm({ title: '', description: '', class_name: '', subject: teacher?.subject || '', due_date: '' })}
                    className="py-2.5 px-4 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors text-sm"
                  >
                    <i className="fas fa-redo" />
                  </button>
                </div>
              </form>
            </section>

            <section id="scoresSection" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                  <i className="fas fa-chart-bar text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-800">Recent Scores</h2>
                  <p className="text-xs text-slate-500">Last 5 scores you entered</p>
                </div>
              </div>
              <div className="p-3 space-y-2 max-h-[28rem] overflow-y-auto">
                {recentScores.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <i className="fas fa-chart-bar text-3xl mb-2 opacity-40" />
                    <p className="text-sm">No scores entered yet.</p>
                  </div>
                ) : (
                  recentScores.map((s, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-800 text-sm truncate">{s.student_name || 'Student'}</div>
                          <div className="text-xs text-slate-500">{s.subject || ''} · {s.exam_type || ''}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#800020]">{s.score ?? '—'}/{s.max_score ?? 100}</div>
                          <div className="text-[10px] text-slate-400">{s.date ? new Date(s.date).toLocaleDateString() : ''}</div>
                        </div>
                      </div>
                      {s.teacher_remark && <div className="text-xs text-slate-500 mt-1 italic">&ldquo;{s.teacher_remark}&rdquo;</div>}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Enter Score + Student Questions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <i className="fas fa-edit text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Enter Score</h2>
                  <p className="text-xs text-slate-500">Record a student&apos;s score for an assessment</p>
                </div>
              </div>
              <form onSubmit={handleScoreSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Class *</label>
                    <select
                      required
                      value={scoreForm.class_name}
                      onChange={(e) => setScoreForm((f) => ({ ...f, class_name: e.target.value, student_id: '' }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                    >
                      <option value="">Select class…</option>
                      {CLASSES.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Student *</label>
                    <select
                      required
                      value={scoreForm.student_id}
                      onChange={(e) => setScoreForm((f) => ({ ...f, student_id: e.target.value }))}
                      disabled={!scoreForm.class_name}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white disabled:opacity-60"
                    >
                      <option value="">{scoreForm.class_name ? 'Select student…' : 'Select class first…'}</option>
                      {(studentsByClass[scoreForm.class_name] || []).map((s) => (
                        <option key={s.id} value={s.id}>{s.full_name || s.name || s.username}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Subject (auto)</label>
                    <input readOnly value={scoreForm.subject || '—'} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Exam Type *</label>
                    <select
                      value={scoreForm.exam_type}
                      onChange={(e) => setScoreForm((f) => ({ ...f, exam_type: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                    >
                      {EXAM_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Max Score *</label>
                    <input
                      type="number"
                      min={1}
                      value={scoreForm.max_score}
                      onChange={(e) => setScoreForm((f) => ({ ...f, max_score: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Score *</label>
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={scoreForm.score}
                      onChange={(e) => setScoreForm((f) => ({ ...f, score: e.target.value }))}
                      placeholder="0"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Teacher Remark</label>
                    <input
                      value={scoreForm.teacher_remark}
                      onChange={(e) => setScoreForm((f) => ({ ...f, teacher_remark: e.target.value }))}
                      placeholder="e.g. Excellent work!"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={scoreSubmitting}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <i className="fas fa-save" />
                    <span>{scoreSubmitting ? 'Saving…' : 'Save Score'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScoreForm((f) => ({ ...f, score: '', teacher_remark: '' }))}
                    className="py-2.5 px-4 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors text-sm"
                  >
                    <i className="fas fa-redo" />
                  </button>
                </div>
              </form>
            </section>

            <section id="studentQuestions" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <i className="fas fa-question-circle text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-800">Student Questions</h2>
                  <p className="text-xs text-slate-500">Recent questions from your students</p>
                </div>
              </div>
              <div className="p-3 space-y-2 max-h-[28rem] overflow-y-auto">
                {studentQuestions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <i className="fas fa-question-circle text-3xl mb-2 opacity-40" />
                    <p className="text-sm">No questions yet.</p>
                  </div>
                ) : (
                  studentQuestions.map((q, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="font-medium text-slate-800 text-sm truncate">{q.student_name || 'Student'}</div>
                      <div className="text-xs text-slate-600 mt-1">{q.question || q.content || ''}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{q.created_at ? new Date(q.created_at).toLocaleString() : ''}</div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Topic templates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <i className="fas fa-folder-tree text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Topic Templates</h2>
                  <p className="text-xs text-slate-500">Pre-built lesson templates for your subject</p>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjectTopics.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-slate-400">
                    <i className="fas fa-folder-open text-3xl mb-2 opacity-40" />
                    <p className="text-sm">No templates for your subject yet.</p>
                  </div>
                ) : (
                  subjectTopics.slice(0, 8).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => applyTopicTemplate(t)}
                      className="text-left p-3 rounded-xl border border-slate-100 hover:border-[#800020]/30 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <i className="fas fa-bookmark text-violet-400 group-hover:text-violet-600 transition-colors" />
                        <span className="font-medium text-slate-700 text-sm">{t}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <i className="fas fa-video text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Upcoming Live Sessions</h2>
                  <p className="text-xs text-slate-500">Your scheduled classes</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {liveSessions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <i className="fas fa-video text-3xl mb-2 opacity-40" />
                    <p className="text-sm">No live sessions scheduled.</p>
                  </div>
                ) : (
                  liveSessions.map((s, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-100">
                      <div className="font-medium text-slate-800 text-sm">{s.title || s.subject || 'Session'}</div>
                      <div className="text-xs text-slate-500 mt-1">{s.start_time ? new Date(s.start_time).toLocaleString() : ''}</div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Today's timetable */}
          <section id="timetable" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Today&apos;s Timetable</h2>
                <p className="text-xs text-slate-500">Your classes scheduled for today</p>
              </div>
              <span className="text-xs text-slate-400">{timetable.length} class(es)</span>
            </div>
            <div className="p-5 space-y-3">
              {timetable.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <i className="fas fa-calendar-day text-4xl mb-3 opacity-40" />
                  <p className="text-sm">No classes scheduled for today.</p>
                </div>
              ) : (
                timetable.map((it, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="text-center min-w-[64px]">
                      <div className="text-sm font-bold text-[#800020]">{it.start || '--:--'}</div>
                      <div className="text-[10px] text-slate-400">{it.end || '--:--'}</div>
                    </div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 text-sm truncate">{it.subject || 'Class'}</div>
                      <div className="text-xs text-slate-500">{it.class_name || ''} {it.room ? `· ${it.room}` : ''}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <footer className="text-center text-xs text-slate-400 py-6">
            &copy; {new Date().getFullYear()} Girau International School. Teacher Portal. Learn, Live, Achieve.
          </footer>
        </main>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] px-5 py-3.5 rounded-xl text-white text-sm shadow-2xl ${
            toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-[#800020]'
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
