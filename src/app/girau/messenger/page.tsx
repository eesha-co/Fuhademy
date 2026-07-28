'use client';

import { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import Image from 'next/image';
import { supabase, requireAuth, edge } from '@/lib/supabase';
import { BHE2EE } from '@/lib/e2ee';

interface Contact {
  id: string;
  full_name: string;
  subject?: string;
  class_name?: string;
  public_key?: string;
}

interface Message {
  id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  iv?: string | null;
  created_at: string;
}

interface State {
  session: any;
  user: any;
  userId: string;
  role: string;
  className?: string;
  classAccess?: string[];
  privateKeyB64?: string;
  privateKeyCrypto: CryptoKey | null;
  publicKeyB64?: string;
}

function avatarFor(name: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
}

function escapeHtml(s: string) {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default function MessengerPage() {
  const [state, setState] = useState<State | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [e2eeReady, setE2eeReady] = useState(false);
  const [encrypted, setEncrypted] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sharedKeysRef = useRef<Record<string, CryptoKey>>({});
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth gate
  useEffect(() => {
    const s = requireAuth();
    if (!s) return;
    const user = s.user || {};
    const newState: State = {
      session: s,
      user,
      userId: user.id,
      role: user.role,
      className: user.class_name,
      classAccess: user.class_access || [],
      privateKeyB64: user.private_key,
      publicKeyB64: user.public_key,
      privateKeyCrypto: null,
    };
    setState(newState);
    // Import private key for E2EE
    if (user.private_key && BHE2EE) {
      BHE2EE.importPrivateKeyFromBase64(user.private_key)
        .then((k) => {
          setState((prev) => (prev ? { ...prev, privateKeyCrypto: k } : prev));
          setE2eeReady(true);
        })
        .catch((e) => console.warn('[E2EE] import failed:', e));
    }
  }, []);

  // Load contacts
  const loadContacts = useCallback(async () => {
    if (!state) return;
    setLoadingContacts(true);
    const body: any = { user_id: state.userId, role: state.role };
    if (state.role === 'student') body.class_name = state.className;
    else body.class_access = state.classAccess || [];
    try {
      const res = await edge('get-class-contacts', { body });
      const data = res.data || res;
      if (data.success) {
        setContacts(data.contacts || []);
        setFilteredContacts(data.contacts || []);
      }
    } catch (e) {
      console.error('contacts error:', e);
    } finally {
      setLoadingContacts(false);
    }
  }, [state]);

  useEffect(() => {
    if (state) loadContacts();
  }, [state, loadContacts]);

  // Filter contacts based on search
  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredContacts(
      contacts.filter((c) => {
        const name = (c.full_name || '').toLowerCase();
        const subject = (c.subject || '').toLowerCase();
        return !q || name.indexOf(q) !== -1 || subject.indexOf(q) !== -1;
      }),
    );
  }, [contacts, search]);

  const getSharedKeyFor = useCallback(
    async (contact: Contact): Promise<CryptoKey | null> => {
      if (!contact || !e2eeReady || !state?.privateKeyCrypto || !contact.public_key) return null;
      if (sharedKeysRef.current[contact.id]) return sharedKeysRef.current[contact.id];
      try {
        const pub = await BHE2EE.importPublicKey(contact.public_key);
        const shared = await BHE2EE.deriveSharedKey(state.privateKeyCrypto!, pub);
        sharedKeysRef.current[contact.id] = shared;
        return shared;
      } catch (e) {
        console.warn('[E2EE] derive failed:', e);
        return null;
      }
    },
    [e2eeReady, state],
  );

  const decryptMsg = useCallback(
    async (content: string, iv: string | null | undefined, contactId: string, senderId: string): Promise<string> => {
      if (!content) return '';
      if (!iv) return content;
      // If I'm the sender, decrypt with the contact's key; if they're the sender, decrypt with my key
      const lookupId = senderId === state?.userId ? contactId : state?.userId || '';
      const contact = contacts.find((c) => c.id === lookupId);
      if (!contact) return content;
      const shared = await getSharedKeyFor(contact);
      if (!shared) return content;
      try {
        return await BHE2EE.decryptMessage(content, iv, shared);
      } catch {
        return content;
      }
    },
    [contacts, getSharedKeyFor, state],
  );

  const loadMessages = useCallback(
    async (contactId: string, silent = false) => {
      if (!state) return;
      if (!silent) setLoadingMessages(true);
      try {
        const res = await edge('get-messages', { body: { user_id: state.userId, partner_id: contactId } });
        const data = res.data || res;
        if (data.success) {
          const msgs: Message[] = data.messages || [];
          // Decrypt messages
          const decrypted: Message[] = [];
          for (const m of msgs) {
            const text = await decryptMsg(m.content, m.iv, contactId, m.sender_id);
            decrypted.push({ ...m, content: text });
          }
          setMessages(decrypted);
        }
      } catch (e) {
        if (!silent) console.error('load messages error:', e);
      } finally {
        if (!silent) setLoadingMessages(false);
      }
    },
    [state, decryptMsg],
  );

  const openChat = useCallback(
    async (contactId: string) => {
      setActiveContactId(contactId);
      const contact = contacts.find((c) => c.id === contactId);
      if (!contact) return;
      // Show E2EE badge if both have keys
      setEncrypted(!!(e2eeReady && contact.public_key));
      await getSharedKeyFor(contact);
      await loadMessages(contactId);
      // Start polling
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => {
        loadMessages(contactId, true);
      }, 3000);
    },
    [contacts, e2eeReady, getSharedKeyFor, loadMessages],
  );

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = messageInput.trim();
    if (!text || !activeContactId || !state) return;
    setMessageInput('');
    const contact = contacts.find((c) => c.id === activeContactId);
    if (!contact) return;

    const payload: any = {
      sender_id: state.userId,
      sender_role: state.role,
      sender_name: state.user.full_name || state.user.username,
      receiver_id: contact.id,
      receiver_role: state.role === 'student' ? 'teacher' : 'student',
      receiver_name: contact.full_name,
      ciphertext: text,
      iv: null,
    };

    if (e2eeReady && contact.public_key) {
      try {
        const shared = await getSharedKeyFor(contact);
        if (shared) {
          const enc = await BHE2EE.encryptMessage(text, shared);
          payload.ciphertext = enc.ciphertext;
          payload.iv = enc.iv;
        }
      } catch (err) {
        console.warn('encrypt failed, sending plaintext', err);
      }
    }

    try {
      const res = await edge('send-message', { body: payload });
      const data = res.data || res;
      if (!data.success) {
        showToast('Failed to send', 'error');
        return;
      }
      await loadMessages(activeContactId, true);
    } catch {
      showToast('Network error', 'error');
    }
  };

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#800020]/20 border-t-[#800020] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading messenger…</p>
        </div>
      </div>
    );
  }

  const activeContact = contacts.find((c) => c.id === activeContactId) || null;
  const userInitials = avatarFor(state.user.full_name || state.user.username);
  const userRoleLabel =
    state.role === 'teacher'
      ? (state.user.subject || '') + ' Teacher'
      : state.role === 'admin'
        ? 'Administrator'
        : (state.className || '') + ' Student';

  const backHref =
    state.role === 'teacher'
      ? `/girau/classes/${state.user.primary_class || 'SSS3'}/teachers`
      : state.role === 'student'
        ? `/girau/classes/${state.className}/dashboard`
        : '/girau/admin';

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}`}</style>
      {/* Sidebar (contacts) */}
      <aside className="w-full sm:w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {mounted ? (
              <Image src="/girau/logo.png" alt="Girau" width={32} height={32} className="h-8 w-auto object-contain" />
            ) : null}
            <div>
              <div className="font-bold text-slate-800 text-sm">GIRAU INTL SCHOOL</div>
              <div className="text-xs text-slate-400">Messenger</div>
            </div>
          </div>
        </div>
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#800020]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingContacts ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-[#800020] rounded-full animate-spin mr-2 align-middle" />
              Loading contacts…
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No contacts found</div>
          ) : (
            filteredContacts.map((c) => {
              const active = c.id === activeContactId;
              const sub = c.subject || c.class_name || '';
              return (
                <button
                  key={c.id}
                  onClick={() => openChat(c.id)}
                  className={`w-full text-left px-4 py-3 cursor-pointer border-b border-slate-50 transition-colors ${
                    active ? 'bg-[#800020]/8 border-l-[3px] border-l-[#800020]' : 'hover:bg-[#800020]/4'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#800020] text-white flex items-center justify-center text-sm font-bold">
                      {avatarFor(c.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 text-sm truncate">{c.full_name}</div>
                      <div className="text-xs text-slate-400 truncate">{sub}</div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#800020] text-white flex items-center justify-center text-xs font-bold">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800 truncate">
                {state.user.full_name || state.user.username}
              </div>
              <div className="text-xs text-slate-400">{userRoleLabel}</div>
            </div>
            <a href={backHref} className="text-slate-400 hover:text-slate-700 p-2" title="Back to dashboard">
              <i className="fas fa-arrow-left" />
            </a>
          </div>
        </div>
      </aside>

      {/* Chat area (hidden on mobile when no contact selected) */}
      <main className={`flex-1 flex flex-col ${!activeContactId ? 'hidden sm:flex' : 'flex'}`}>
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveContactId(null)}
              className="sm:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700"
              aria-label="Back to contacts"
            >
              <i className="fas fa-arrow-left" />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
              {activeContact ? (
                <span className="text-sm font-bold">{avatarFor(activeContact.full_name)}</span>
              ) : (
                <i className="fas fa-user" />
              )}
            </div>
            <div>
              <div className="font-semibold text-slate-800">
                {activeContact ? activeContact.full_name : 'Select a contact'}
              </div>
              <div className="text-xs text-slate-400">
                {activeContact ? activeContact.subject || activeContact.class_name || '' : 'Choose someone to start chatting'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Connected
            </span>
            {encrypted && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                <i className="fas fa-lock" /> Encrypted
              </span>
            )}
          </div>
        </header>

        <div ref={messagesRef} className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50">
          {!activeContactId ? (
            <div className="text-center text-slate-400 py-20">
              <i className="fas fa-comments text-5xl mb-3 opacity-30" />
              <p className="text-sm">Select a contact to view messages</p>
            </div>
          ) : loadingMessages && messages.length === 0 ? (
            <div className="text-center text-slate-400 py-20">
              <span className="inline-block w-5 h-5 border-2 border-slate-300 border-t-[#800020] rounded-full animate-spin align-middle mr-2" />
              <span className="text-sm">Loading messages…</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-slate-400 py-20">
              <i className="fas fa-comment text-4xl mb-3 opacity-30" />
              <p className="text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((m, i) => {
              const mine = m.sender_id === state.userId;
              const time = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={i} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`px-4 py-2 max-w-[70%] text-sm ${
                      mine
                        ? 'bg-[#800020] text-white rounded-2xl rounded-br-sm'
                        : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm'
                    }`}
                  >
                    <span style={{ whiteSpace: 'pre-wrap' }}>{escapeHtml(m.content)}</span>
                    {m.iv && <i className="fas fa-lock text-[10px] opacity-60 ml-1" />}
                    <div className={`text-[10px] mt-1 ${mine ? 'text-white/60' : 'text-slate-400'}`}>{time}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <footer className="bg-white border-t border-slate-200 p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message…"
              disabled={!activeContactId}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#800020] text-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!activeContactId}
              className="bg-[#800020] hover:bg-[#5c0017] text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              <i className="fas fa-paper-plane" />
            </button>
          </form>
        </footer>
      </main>

      {toast && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-xl text-white text-sm z-[9999] shadow-2xl ${
            toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-amber-600'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
