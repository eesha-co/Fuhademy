'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { supabase, edge, setSession, getSession } from '@/lib/supabase';
import { BHE2EE } from '@/lib/e2ee';

const STD_ERROR =
  'Please ensure your credentials are correct or ensure you are registered by your school admin. ' +
  'If not registered, contact your school admin. ' +
  'You can also contact your school admin for a change in credentials.';

type Role = 'student' | 'teacher' | 'admin';

function dashboardUrlForRole(role: Role, className?: string, primaryClass?: string): string {
  if (role === 'admin') return '/girau/admin';
  if (role === 'teacher') {
    const pc = primaryClass || className || 'SSS3';
    return `/girau/classes/${pc}/teachers`;
  }
  // student
  const cn = className && className !== '_template' ? className : 'JSS1';
  return `/girau/classes/${cn}/dashboard`;
}

export default function LoginPage() {
  const [role, setRole] = useState<Role>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    const session = getSession();
    if (session?.user?.role) {
      const url = dashboardUrlForRole(
        session.user.role as Role,
        session.user.class_name,
        session.user.primary_class,
      );
      window.location.replace(url);
    }
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' | 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const u = username.trim();
    const p = password;
    if (!u || !p) {
      setError('Please enter both your username and password.');
      return;
    }

    setLoading(true);

    try {
      const result = await edge('auth-login', {
        body: { username: u, password: p, role },
      });

      setLoading(false);

      if (result.ok && result.data && result.data.success) {
        const session = result.data;
        const user = session.user || {};
        const redirect =
          session.redirect || dashboardUrlForRole(role, user.class_name, user.primary_class);

        await persistSessionAndRedirect(session, redirect, u, p);
      } else {
        setError(STD_ERROR);
      }
    } catch (err) {
      console.error('[Girau] auth-login error', err);
      setLoading(false);
      setError('Unable to reach the sign-in service. Please check your internet connection and try again.');
    }
  };

  const persistSessionAndRedirect = async (
    session: any,
    redirect: string,
    _username: string,
    pw: string,
  ) => {
    const userData = { ...(session.user || session) };

    // ---- E2EE: decrypt private key client-side using the password ----
    if (session.e2ee?.encrypted_private_key && pw && BHE2EE) {
      try {
        const privateKeyBuf = await BHE2EE.decryptPrivateKey(
          session.e2ee.encrypted_private_key,
          pw,
        );
        const privateKeyB64 = BHE2EE._bytesToBase64(new Uint8Array(privateKeyBuf));
        userData.private_key = privateKeyB64;
        userData.public_key = session.e2ee.public_key || null;
      } catch (e) {
        console.warn('[Girau][E2EE] Private key decryption failed — messaging will fall back to plaintext.', e);
        if (session.e2ee.public_key) userData.public_key = session.e2ee.public_key;
      }
    } else if (session.e2ee?.public_key) {
      userData.public_key = session.e2ee.public_key;
    }

    setSession(userData);
    showToast('Welcome back! Redirecting…', 'success');
    setTimeout(() => {
      window.location.href = redirect;
    }, 600);
  };

  const roles: { key: Role; label: string; icon: string }[] = [
    { key: 'student', label: 'Student', icon: 'fa-user-graduate' },
    { key: 'teacher', label: 'Teacher', icon: 'fa-chalkboard-teacher' },
    { key: 'admin', label: 'Admin', icon: 'fa-user-shield' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">
      {/* Decorative blobs */}
      <div
        className="absolute w-72 h-72 rounded-full filter blur-3xl opacity-30 top-10 left-10"
        style={{ background: '#800020', animation: 'girau-float 14s ease-in-out infinite' }}
      />
      <div
        className="absolute w-80 h-80 rounded-full filter blur-3xl opacity-25 bottom-0 right-10"
        style={{ background: '#a63d56', animation: 'girau-float 14s ease-in-out infinite', animationDelay: '-4s' }}
      />
      <style>{`
        @keyframes girau-float {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(20px,-30px) scale(1.1); }
        }
        @keyframes girau-spin { to { transform: rotate(360deg); } }
        .girau-spinner {
          width:16px;height:16px;border:2px solid rgba(255,255,255,0.4);
          border-top-color:#fff;border-radius:50%;
          animation: girau-spin 0.7s linear infinite;display:inline-block;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-6">
            <Image
              src="/girau/logo.png"
              alt="Girau International School"
              width={80}
              height={80}
              className="h-20 w-20 mx-auto mb-3 object-contain rounded-2xl"
              priority
            />
            <h1 className="text-2xl font-extrabold tracking-wide text-[#800020]">
              GIRAU INTERNATIONAL SCHOOL
            </h1>
            <p className="text-xs text-slate-500 -mt-0.5">E-Learning Platform · Learn, Live, Achieve</p>
          </div>

          {/* Card */}
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6 sm:p-8 border border-white/40">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Welcome back</h2>
            <p className="text-sm text-slate-500 mb-5">Sign in to continue to your dashboard.</p>

            {/* Role selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Sign in as
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      setRole(r.key);
                      setError('');
                    }}
                    className={`py-2.5 rounded-xl text-sm flex flex-col items-center gap-1 transition-all border-[1.5px] ${
                      role === r.key
                        ? 'border-[#800020] text-[#800020] font-semibold bg-gradient-to-br from-[#800020]/6 to-[#a63d56]/4'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <i className={`fas ${r.icon} text-base`} />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} autoComplete="on" noValidate>
              {/* Username */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Username or Email
                </label>
                <div className="relative">
                  <i className="fas fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="username"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="e.g. john.doe or john@girau.edu"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]/50 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Password
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]/50 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    title="Show/Hide password"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#800020] p-1"
                  >
                    <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>

              {/* Help link */}
              <div className="flex items-center justify-end text-xs mt-3 mb-5">
                <button
                  type="button"
                  onClick={() => setHelpOpen(true)}
                  className="text-[#800020] hover:underline cursor-pointer"
                >
                  Need help?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-xs mb-4 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <i className="fas fa-exclamation-circle mt-0.5" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all bg-gradient-to-br from-[#800020] to-[#5c0017] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110"
              >
                {loading ? (
                  <>
                    <span className="girau-spinner" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <i className="fas fa-arrow-right" />
                  </>
                )}
              </button>
            </form>

            {/* Footer info — NO signup */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 leading-relaxed">
                Accounts are created by the school administrator.<br />
                Need access or forgot your password?<br />
                <span className="text-[#800020] font-medium">Please contact your school admin.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Help modal */}
      {helpOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setHelpOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setHelpOpen(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
              aria-label="Close"
            >
              <i className="fas fa-times text-slate-500" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#800020]/10 flex items-center justify-center">
                <i className="fas fa-headset text-[#800020] text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Need help signing in?</h3>
                <p className="text-xs text-slate-500">We&apos;re here to assist.</p>
              </div>
            </div>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong className="text-slate-700">No account yet?</strong> Students and teachers are
                registered by the school administrator. Please contact your school admin to request access.
              </p>
              <p>
                <strong className="text-slate-700">Forgot your password?</strong> Your school admin can
                reset your credentials. Reach out to them directly.
              </p>
              <p>
                <strong className="text-slate-700">Wrong credentials?</strong> Double-check your username
                and password. If issues persist, contact your school admin for a change in credentials.
              </p>
            </div>
            <button
              onClick={() => setHelpOpen(false)}
              className="mt-5 w-full py-2.5 bg-[#800020] text-white rounded-xl font-medium hover:bg-[#5c0017] transition-colors text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3.5 rounded-xl text-white text-sm shadow-2xl max-w-[92vw] text-center ${
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
