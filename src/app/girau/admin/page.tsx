'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import Sidebar, { SidebarControls, NavSection } from '@/components/girau/Sidebar';
import { supabase, requireRole, edge, getSession } from '@/lib/supabase';

type View =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'timetables'
  | 'scores'
  | 'assignments'
  | 'subscriptions'
  | 'attendance'
  | 'live-sessions'
  | 'reports'
  | 'settings';

const CLASSES = ['JSS1', 'JSS2', 'JSS3', 'SSS1', 'SSS2', 'SSS3'];
const SUBJECTS = [
  'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology',
  'Government', 'Economics', 'Commerce', 'Accounting', 'Literature in English',
  'Geography', 'Civic Education', 'Computer Science', 'Further Mathematics',
  'Agricultural Science', 'Christian Religious Studies', 'Islamic Religious Studies',
  'French', 'Yoruba', 'Visual Arts', 'Technical Drawing', 'Home Economics',
];

const VIEW_META: Record<View, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'School-wide overview' },
  students: { title: 'Students', subtitle: 'Manage student accounts across all classes' },
  teachers: { title: 'Teachers', subtitle: 'Manage teaching staff' },
  classes: { title: 'Classes', subtitle: 'Overview of JSS1 – SSS3' },
  timetables: { title: 'Timetables', subtitle: 'Weekly schedules per class' },
  scores: { title: 'Scores', subtitle: 'All scores entered by teachers' },
  assignments: { title: 'Assignments', subtitle: 'All assignments posted by teachers' },
  subscriptions: { title: 'Subscriptions', subtitle: 'Track monthly payments' },
  attendance: { title: 'Attendance', subtitle: 'Online tracker with print export' },
  'live-sessions': { title: 'Live Sessions', subtitle: 'Ongoing & ended live class sessions' },
  reports: { title: 'Reports', subtitle: 'Generate CSV exports' },
  settings: { title: 'Settings', subtitle: 'School-wide configuration' },
};

interface Student {
  id: string;
  full_name?: string;
  name?: string;
  username: string;
  class_name?: string;
  email?: string;
  phone?: string;
  guardian_name?: string;
  status?: string;
  created_at?: string;
}

interface Teacher {
  id: string;
  full_name?: string;
  name?: string;
  username: string;
  subject?: string;
  email?: string;
  phone?: string;
  primary_class?: string;
  class_access?: string[];
  status?: string;
  created_at?: string;
}

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const [view, setView] = useState<View>('dashboard');

  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 6, assignments: 0, subscriptions: 0, active: 0 });
  const [loadingTable, setLoadingTable] = useState(false);
  const [tableError, setTableError] = useState('');

  // Modals
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [registering, setRegistering] = useState(false);

  // Student form
  const [studentForm, setStudentForm] = useState({
    full_name: '',
    username: '',
    password: '',
    class_name: '',
    email: '',
    phone: '',
    guardian_name: '',
  });

  // Teacher form
  const [teacherForm, setTeacherForm] = useState({
    full_name: '',
    username: '',
    password: '',
    subject: '',
    email: '',
    phone: '',
    class_access: [] as string[],
    primary_class: '',
  });

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const s = requireRole('admin');
    if (!s) return;
    setAdmin(s.user || {});
    setAuthChecked(true);
    loadDashboard();
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      const res = await edge('admin-dashboard', { body: {} });
      if (res.ok && res.data) {
        const p = res.data;
        setStats({
          students: p.students ?? 0,
          teachers: p.teachers ?? 0,
          classes: p.classes ?? 6,
          assignments: p.assignments ?? 0,
          subscriptions: p.subscriptions ?? 0,
          active: p.active ?? 0,
        });
        return;
      }
    } catch (err) {
      console.warn('[Girau] admin dashboard edge failed:', err);
    }
    // Client-side fallback
    try {
      const [st, te] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
      ]);
      setStats((s) => ({ ...s, students: st.count || 0, teachers: te.count || 0 }));
    } catch {}
  }, []);

  const loadStudents = useCallback(async () => {
    setLoadingTable(true);
    setTableError('');
    try {
      const res = await edge('admin-list-students', { body: {} });
      if (res.ok && res.data?.success) {
        setStudents(res.data.students || []);
        return;
      }
    } catch {}
    try {
      const r = await supabase.from('students').select('*').order('created_at', { ascending: false });
      setStudents((r.data as Student[]) || []);
    } catch (e: any) {
      setTableError(e?.message || 'Could not load students.');
    } finally {
      setLoadingTable(false);
    }
  }, []);

  const loadTeachers = useCallback(async () => {
    setLoadingTable(true);
    setTableError('');
    try {
      const res = await edge('admin-list-teachers', { body: {} });
      if (res.ok && res.data?.success) {
        setTeachers(res.data.teachers || []);
        return;
      }
    } catch {}
    try {
      const r = await supabase.from('teachers').select('*').order('created_at', { ascending: false });
      setTeachers((r.data as Teacher[]) || []);
    } catch (e: any) {
      setTableError(e?.message || 'Could not load teachers.');
    } finally {
      setLoadingTable(false);
    }
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (view === 'students') loadStudents();
    if (view === 'teachers') loadTeachers();
  }, [view, authChecked, loadStudents, loadTeachers]);

  const handleRegisterStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!studentForm.full_name || !studentForm.username || !studentForm.password || !studentForm.class_name) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setRegistering(true);
    const session = getSession();
    const adminId = (session?.user?.id as string) || admin?.id || null;
    try {
      const res = await edge('admin-register-student', {
        method: 'POST',
        body: { admin_id: adminId, student: studentForm },
      });
      setRegistering(false);
      if (res && res.ok && res.data && (res.data.success || res.data.student)) {
        showToast(`Student "${studentForm.full_name}" registered successfully!`, 'success');
        setStudentModalOpen(false);
        setStudentForm({ full_name: '', username: '', password: '', class_name: '', email: '', phone: '', guardian_name: '' });
        loadStudents();
        loadDashboard();
      } else {
        showToast(res.data?.error || res.data?.message || 'Failed to register student.', 'error');
      }
    } catch (err) {
      setRegistering(false);
      showToast('Network error. Please retry.', 'error');
    }
  };

  const handleRegisterTeacher = async (e: FormEvent) => {
    e.preventDefault();
    if (!teacherForm.full_name || !teacherForm.username || !teacherForm.password || !teacherForm.subject) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (teacherForm.class_access.length === 0) {
      showToast('Please select at least one class for the teacher.', 'error');
      return;
    }
    if (!teacherForm.primary_class) {
      showToast('Please select a primary class.', 'error');
      return;
    }
    if (!teacherForm.class_access.includes(teacherForm.primary_class)) {
      showToast('Primary class must be one of the selected classes above.', 'error');
      return;
    }
    setRegistering(true);
    const session = getSession();
    const adminId = (session?.user?.id as string) || admin?.id || null;
    try {
      const res = await edge('admin-register-teacher', {
        method: 'POST',
        body: { admin_id: adminId, teacher: teacherForm },
      });
      setRegistering(false);
      if (res && res.ok && res.data && (res.data.success || res.data.teacher)) {
        showToast(`Teacher "${teacherForm.full_name}" registered successfully!`, 'success');
        setTeacherModalOpen(false);
        setTeacherForm({ full_name: '', username: '', password: '', subject: '', email: '', phone: '', class_access: [], primary_class: '' });
        loadTeachers();
        loadDashboard();
      } else {
        showToast(res.data?.error || res.data?.message || 'Failed to register teacher.', 'error');
      }
    } catch (err) {
      setRegistering(false);
      showToast('Network error. Please retry.', 'error');
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-slate-200 border-t-[#800020] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  const adminName = admin?.full_name || admin?.name || admin?.username || 'Administrator';
  const adminUsername = admin?.username || '@admin';
  const initials = adminName.split(/\s+/).slice(0, 2).map((n: string) => n.charAt(0)).join('').toUpperCase();

  const sidebarSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', href: '#', icon: 'fas fa-gauge-high', active: view === 'dashboard', onClick: () => setView('dashboard') },
      ],
    },
    {
      title: 'People',
      items: [
        { label: 'Students', href: '#', icon: 'fas fa-user-graduate', active: view === 'students', onClick: () => setView('students') },
        { label: 'Teachers', href: '#', icon: 'fas fa-chalkboard-user', active: view === 'teachers', onClick: () => setView('teachers') },
        { label: 'Classes', href: '#', icon: 'fas fa-school', active: view === 'classes', onClick: () => setView('classes') },
      ],
    },
    {
      title: 'Academics',
      items: [
        { label: 'Timetables', href: '#', icon: 'fas fa-calendar-days', active: view === 'timetables', onClick: () => setView('timetables') },
        { label: 'Scores', href: '#', icon: 'fas fa-chart-line', active: view === 'scores', onClick: () => setView('scores') },
        { label: 'Assignments', href: '#', icon: 'fas fa-file-pen', active: view === 'assignments', onClick: () => setView('assignments') },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Subscriptions', href: '#', icon: 'fas fa-credit-card', active: view === 'subscriptions', onClick: () => setView('subscriptions') },
        { label: 'Attendance', href: '#', icon: 'fas fa-clipboard-check', active: view === 'attendance', onClick: () => setView('attendance') },
        { label: 'Live Sessions', href: '#', icon: 'fas fa-video', active: view === 'live-sessions', onClick: () => setView('live-sessions') },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Reports', href: '#', icon: 'fas fa-file-export', active: view === 'reports', onClick: () => setView('reports') },
        { label: 'Settings', href: '#', icon: 'fas fa-gear', active: view === 'settings', onClick: () => setView('settings') },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar
        sections={sidebarSections}
        user={{ name: adminName, subtitle: adminUsername, avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=800020&color=fff&size=128&bold=true` }}
      />

      <main className="flex-1 lg:ml-80 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/85 backdrop-blur border-b border-slate-200">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
            <button onClick={() => SidebarControls.toggle()} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600" aria-label="Open menu">
              <i className="fas fa-bars text-lg" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 truncate">{VIEW_META[view].title}</h1>
              <p className="text-xs text-slate-400 truncate">{VIEW_META[view].subtitle}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <i className="far fa-calendar" />
              <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <button onClick={() => window.location.reload()} className="ml-1 p-2 rounded-lg hover:bg-slate-100 text-slate-600" title="Refresh">
              <i className="fas fa-rotate" />
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
          {/* ============== DASHBOARD ============== */}
          {view === 'dashboard' && (
            <>
              <div
                className="rounded-2xl p-5 sm:p-7 text-white mb-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(-45deg, #800020, #5c0017, #a63d56, #800020)', backgroundSize: '400% 400%', animation: 'girau-adm 18s ease infinite' }}
              >
                <style>{`@keyframes girau-adm { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>
                <div className="relative z-10">
                  <div className="text-xs uppercase tracking-wider opacity-80 mb-1">Welcome back</div>
                  <h2 className="text-xl sm:text-2xl font-extrabold mb-1">{adminName}</h2>
                  <p className="text-sm opacity-90 max-w-xl">
                    You have school-wide visibility across all 6 classes (JSS1–SSS3). Use the sidebar to manage students, teachers, timetables, scores, payments and more.
                  </p>
                </div>
                <i className="fas fa-graduation-cap absolute -right-6 -bottom-8 text-[8rem] opacity-10" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
                <AdminStatCard icon="fa-user-graduate" color="bg-[#800020]/10 text-[#800020]" value={stats.students} label="Total Students" />
                <AdminStatCard icon="fa-chalkboard-user" color="bg-emerald-50 text-emerald-600" value={stats.teachers} label="Total Teachers" />
                <AdminStatCard icon="fa-school" color="bg-amber-50 text-amber-600" value={stats.classes} label="Classes" />
                <AdminStatCard icon="fa-file-pen" color="bg-rose-50 text-rose-600" value={stats.assignments} label="Assignments" />
                <AdminStatCard icon="fa-credit-card" color="bg-cyan-50 text-cyan-600" value={stats.subscriptions} label="Subscriptions" />
                <AdminStatCard icon="fa-circle-check" color="bg-violet-50 text-violet-600" value={stats.active} label="Active Today" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={() => setStudentModalOpen(true)} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#800020]/40 hover:bg-[#800020]/5 transition-colors text-left">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#800020] to-[#5c0017] flex items-center justify-center">
                        <i className="fas fa-user-plus text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">Register Student</div>
                        <div className="text-xs text-slate-500">Add a new student account</div>
                      </div>
                    </button>
                    <button onClick={() => setTeacherModalOpen(true)} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#800020]/40 hover:bg-[#800020]/5 transition-colors text-left">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <i className="fas fa-user-plus text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">Register Teacher</div>
                        <div className="text-xs text-slate-500">Add a new teacher account</div>
                      </div>
                    </button>
                    <button onClick={() => setView('students')} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#800020]/40 hover:bg-[#800020]/5 transition-colors text-left">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <i className="fas fa-users text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">View Students</div>
                        <div className="text-xs text-slate-500">Manage all students</div>
                      </div>
                    </button>
                    <button onClick={() => setView('teachers')} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#800020]/40 hover:bg-[#800020]/5 transition-colors text-left">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <i className="fas fa-chalkboard-user text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">View Teachers</div>
                        <div className="text-xs text-slate-500">Manage teaching staff</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Classes Overview</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CLASSES.map((c) => (
                      <div key={c} className="p-4 rounded-xl border border-slate-200 hover:border-[#800020]/30 transition-colors text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#800020] to-[#5c0017] flex items-center justify-center mx-auto mb-2">
                          <i className="fas fa-school text-white" />
                        </div>
                        <div className="font-bold text-slate-800">{c}</div>
                        <div className="text-xs text-slate-500">Class</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ============== STUDENTS ============== */}
          {view === 'students' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">All Students</h2>
                  <p className="text-xs text-slate-500">{students.length} registered student(s)</p>
                </div>
                <button onClick={() => setStudentModalOpen(true)} className="bg-[#800020] hover:bg-[#5c0017] text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
                  <i className="fas fa-user-plus" /> Register Student
                </button>
              </div>
              {tableError && <div className="p-4 text-sm text-rose-600 bg-rose-50 border-b border-rose-100">{tableError}</div>}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Username</th>
                      <th className="p-3 text-left">Class</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Guardian</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingTable ? (
                      <tr><td colSpan={8} className="p-10 text-center text-slate-400"><div className="w-8 h-8 border-4 border-slate-200 border-t-[#800020] rounded-full animate-spin mx-auto mb-2" />Loading students…</td></tr>
                    ) : students.length === 0 ? (
                      <tr><td colSpan={8} className="p-10 text-center text-slate-400"><i className="fas fa-inbox text-3xl opacity-50 mb-2 block" />No students registered yet.</td></tr>
                    ) : (
                      students.map((s) => (
                        <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-800">{s.full_name || s.name || '—'}</td>
                          <td className="p-3 text-slate-600">{s.username}</td>
                          <td className="p-3"><span className="text-xs font-medium bg-[#800020]/10 text-[#800020] px-2 py-1 rounded-full">{s.class_name || '—'}</span></td>
                          <td className="p-3 text-slate-600">{s.email || '—'}</td>
                          <td className="p-3 text-slate-600">{s.phone || '—'}</td>
                          <td className="p-3 text-slate-600">{s.guardian_name || '—'}</td>
                          <td className="p-3"><span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">{s.status || 'active'}</span></td>
                          <td className="p-3 text-slate-500 text-xs">{s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============== TEACHERS ============== */}
          {view === 'teachers' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">All Teachers</h2>
                  <p className="text-xs text-slate-500">{teachers.length} registered teacher(s)</p>
                </div>
                <button onClick={() => setTeacherModalOpen(true)} className="bg-[#800020] hover:bg-[#5c0017] text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
                  <i className="fas fa-user-plus" /> Register Teacher
                </button>
              </div>
              {tableError && <div className="p-4 text-sm text-rose-600 bg-rose-50 border-b border-rose-100">{tableError}</div>}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Username</th>
                      <th className="p-3 text-left">Subject</th>
                      <th className="p-3 text-left">Primary Class</th>
                      <th className="p-3 text-left">Class Access</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingTable ? (
                      <tr><td colSpan={8} className="p-10 text-center text-slate-400"><div className="w-8 h-8 border-4 border-slate-200 border-t-[#800020] rounded-full animate-spin mx-auto mb-2" />Loading teachers…</td></tr>
                    ) : teachers.length === 0 ? (
                      <tr><td colSpan={8} className="p-10 text-center text-slate-400"><i className="fas fa-inbox text-3xl opacity-50 mb-2 block" />No teachers registered yet.</td></tr>
                    ) : (
                      teachers.map((t) => (
                        <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-800">{t.full_name || t.name || '—'}</td>
                          <td className="p-3 text-slate-600">{t.username}</td>
                          <td className="p-3"><span className="text-xs font-medium bg-[#800020]/10 text-[#800020] px-2 py-1 rounded-full">{t.subject || '—'}</span></td>
                          <td className="p-3 text-slate-600">{t.primary_class || '—'}</td>
                          <td className="p-3 text-slate-600 text-xs">{(t.class_access || []).join(', ') || '—'}</td>
                          <td className="p-3 text-slate-600">{t.email || '—'}</td>
                          <td className="p-3 text-slate-600">{t.phone || '—'}</td>
                          <td className="p-3"><span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">{t.status || 'active'}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============== CLASSES ============== */}
          {view === 'classes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CLASSES.map((c) => (
                <div key={c} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:-translate-y-1 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#800020] to-[#5c0017] flex items-center justify-center">
                      <i className="fas fa-school text-white text-xl" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-lg">{c}</div>
                      <div className="text-xs text-slate-500">Class</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">Click Students in the sidebar to view all students in this class.</p>
                </div>
              ))}
            </div>
          )}

          {/* ============== PLACEHOLDER VIEWS ============== */}
          {['timetables', 'scores', 'assignments', 'subscriptions', 'attendance', 'live-sessions', 'reports', 'settings'].includes(view) && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#800020]/10 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-tools text-[#800020] text-2xl" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-1">{VIEW_META[view as View].title}</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                This module is part of the Girau admin panel. Use the sidebar to navigate to Dashboard, Students or Teachers for full functionality. {VIEW_META[view as View].subtitle}.
              </p>
            </div>
          )}

          <footer className="text-center text-xs text-slate-400 py-6 mt-6">
            &copy; {new Date().getFullYear()} Girau International School. Admin Panel. Learn, Live, Achieve.
          </footer>
        </div>
      </main>

      {/* ============== REGISTER STUDENT MODAL ============== */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setStudentModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Register Student</h3>
                <p className="text-xs text-slate-500">Create a new student account across any class.</p>
              </div>
              <button onClick={() => setStudentModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-2">
                <i className="fas fa-xmark text-lg" />
              </button>
            </div>
            <form onSubmit={handleRegisterStudent} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Full Name *</label>
                  <input
                    required
                    value={studentForm.full_name}
                    onChange={(e) => setStudentForm((f) => ({ ...f, full_name: e.target.value }))}
                    placeholder="Jane Doe"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Username *</label>
                  <input
                    required
                    value={studentForm.username}
                    onChange={(e) => setStudentForm((f) => ({ ...f, username: e.target.value }))}
                    placeholder="jane.doe"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Password *</label>
                  <input
                    required
                    type="password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Min 8 characters"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Class *</label>
                  <select
                    required
                    value={studentForm.class_name}
                    onChange={(e) => setStudentForm((f) => ({ ...f, class_name: e.target.value }))}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  >
                    <option value="">Select class…</option>
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="student@example.com"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Phone</label>
                  <input
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+234…"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Guardian Name</label>
                <input
                  value={studentForm.guardian_name}
                  onChange={(e) => setStudentForm((f) => ({ ...f, guardian_name: e.target.value }))}
                  placeholder="Parent / Guardian full name"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setStudentModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl">Cancel</button>
                <button type="submit" disabled={registering} className="bg-[#800020] hover:bg-[#5c0017] text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-60">
                  <i className="fas fa-user-plus" />
                  <span>{registering ? 'Registering…' : 'Register'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============== REGISTER TEACHER MODAL ============== */}
      {teacherModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setTeacherModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Register Teacher</h3>
                <p className="text-xs text-slate-500">Create a new teacher account.</p>
              </div>
              <button onClick={() => setTeacherModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-2">
                <i className="fas fa-xmark text-lg" />
              </button>
            </div>
            <form onSubmit={handleRegisterTeacher} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Full Name *</label>
                  <input
                    required
                    value={teacherForm.full_name}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, full_name: e.target.value }))}
                    placeholder="John Smith"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Username *</label>
                  <input
                    required
                    value={teacherForm.username}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, username: e.target.value }))}
                    placeholder="john.smith"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Password *</label>
                  <input
                    required
                    type="password"
                    value={teacherForm.password}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Min 8 characters"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Subject *</label>
                  <select
                    required
                    value={teacherForm.subject}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, subject: e.target.value }))}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  >
                    <option value="">Select subject…</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                  <input
                    type="email"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="teacher@example.com"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Phone</label>
                  <input
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+234…"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Class Access (classes this teacher teaches) *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1.5">
                  {CLASSES.map((c) => {
                    const checked = teacherForm.class_access.includes(c);
                    return (
                      <label
                        key={c}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors text-sm ${
                          checked ? 'border-[#800020] bg-[#800020]/5' : 'border-slate-200 bg-slate-50/60 hover:bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setTeacherForm((f) => ({
                              ...f,
                              class_access: e.target.checked
                                ? [...f.class_access, c]
                                : f.class_access.filter((x) => x !== c),
                            }));
                          }}
                          className="w-4 h-4 accent-[#800020]"
                        />
                        <span className="font-medium text-slate-700">{c}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">Select at least one class. The teacher will only see students in the classes you grant access to.</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Primary Class (determines dashboard folder) *</label>
                <select
                  required
                  value={teacherForm.primary_class}
                  onChange={(e) => setTeacherForm((f) => ({ ...f, primary_class: e.target.value }))}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/50 focus:bg-white"
                >
                  <option value="">Select primary class…</option>
                  {teacherForm.class_access.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">The teacher&apos;s dashboard will be in this class folder. Must be one of the selected classes above.</p>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setTeacherModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl">Cancel</button>
                <button type="submit" disabled={registering} className="bg-[#800020] hover:bg-[#5c0017] text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-60">
                  <i className="fas fa-user-plus" />
                  <span>{registering ? 'Registering…' : 'Register'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] px-5 py-3.5 rounded-xl text-white text-sm shadow-2xl flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-[#800020]'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function AdminStatCard({ icon, color, value, label }: { icon: string; color: string; value: number; label: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
        <i className={`fas ${icon}`} />
      </div>
      <div className="mt-3 text-2xl font-extrabold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
