'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { clearSession } from '@/lib/supabase';

export interface NavItem {
  label: string;
  href: string;
  icon: string; // font-awesome class, e.g. "fas fa-home"
  iconColor?: string; // tailwind text color class, e.g. "text-[#800020]"
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

interface SidebarProps {
  sections: NavSection[];
  user: {
    name: string;
    subtitle: string;
    avatarUrl?: string;
  };
  onNavigate?: () => void;
}

export default function Sidebar({ sections, user, onNavigate }: SidebarProps) {
  const [hidden, setHidden] = useState(true); // hidden on mobile by default

  // Allow external toggle via custom event
  useEffect(() => {
    const open = () => setHidden(false);
    const close = () => setHidden(true);
    const toggle = () => setHidden((v) => !v);
    window.addEventListener('girau:sidebar-open', open);
    window.addEventListener('girau:sidebar-close', close);
    window.addEventListener('girau:sidebar-toggle', toggle);
    return () => {
      window.removeEventListener('girau:sidebar-open', open);
      window.removeEventListener('girau:sidebar-close', close);
      window.removeEventListener('girau:sidebar-toggle', toggle);
    };
  }, []);

  const handleSignOut = () => {
    clearSession();
    window.location.href = '/girau/login';
  };

  const initials = (user.name || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase();

  const avatarUrl =
    user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(initials || 'U')}&background=800020&color=fff&size=128&bold=true`;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={() => setHidden(true)}
        aria-hidden="true"
      />

      <aside
        className={`w-72 lg:w-80 fixed left-0 top-0 h-full bg-white border-r border-slate-200 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
          hidden ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Logo (centered, NO text below) */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex justify-center">
            <Image
              src="/girau/logo.png"
              alt="Girau International School logo"
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
              priority
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-5" style={{ maxHeight: 'calc(100vh - 13rem)' }}>
          {sections.map((section, si) => (
            <div key={si}>
              {section.title && (
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </div>
              )}
              <ul className="space-y-1">
                {section.items.map((item, ii) => (
                  <li key={ii}>
                    {item.onClick ? (
                      <button
                        type="button"
                        onClick={() => {
                          item.onClick?.();
                          setHidden(true);
                          onNavigate?.();
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                          item.active
                            ? 'text-[#800020] font-semibold bg-gradient-to-br from-[#800020]/10 to-[#a63d56]/5'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <IconSpan item={item} />
                        <span>{item.label}</span>
                        {item.badge != null && (
                          <span className="ml-auto text-[10px] bg-[#a63d56] text-white px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        onClick={() => {
                          setHidden(true);
                          onNavigate?.();
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                          item.active
                            ? 'text-[#800020] font-semibold bg-gradient-to-br from-[#800020]/10 to-[#a63d56]/5'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <IconSpan item={item} />
                        <span>{item.label}</span>
                        {item.badge != null && (
                          <span className="ml-auto text-[10px] bg-[#a63d56] text-white px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-[#800020]/30 object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 truncate text-sm">{user.name || 'User'}</div>
              <div className="text-xs text-slate-500 truncate">{user.subtitle || ''}</div>
            </div>
            <button
              type="button"
              title="Sign out"
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <i className="fas fa-sign-out-alt" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function IconSpan({ item }: { item: NavItem }) {
  return (
    <i
      className={`${item.icon} w-5 text-center ${item.iconColor || 'text-[#800020]'}`}
      aria-hidden="true"
    />
  );
}

/** Helper hook: returns [open, toggle, openFn, closeFn] for the mobile hamburger in the parent header. */
export function useSidebarToggle() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setOpen((v) => !v);
    window.addEventListener('girau:sidebar-toggle', fn);
    return () => window.removeEventListener('girau:sidebar-toggle', fn);
  }, []);
  return open;
}

/** Convenience: dispatch open/close/toggle events that the Sidebar listens for. */
export const SidebarControls = {
  open: () => window.dispatchEvent(new Event('girau:sidebar-open')),
  close: () => window.dispatchEvent(new Event('girau:sidebar-close')),
  toggle: () => window.dispatchEvent(new Event('girau:sidebar-toggle')),
};
