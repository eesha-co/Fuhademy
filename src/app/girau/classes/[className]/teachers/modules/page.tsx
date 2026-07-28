'use client';

import { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import Sidebar, { SidebarControls, NavSection } from '@/components/girau/Sidebar';
import { supabase, requireRole, edge, getSession } from '@/lib/supabase';

interface ChatMessage {
  role: 'user' | 'ai' | 'error' | 'system' | 'build-now' | 'test-now' | 'timeout' | 'building' | 'thinking';
  text: string;
  icon?: string;
}

interface TestReport {
  overall?: string;
  issues?: string[];
  suggestions?: string[];
  autoFixed?: boolean;
  fixedCount?: number;
}

interface PendingPlan {
  prompt: string;
  plan: string;
  searchResults: string;
  isEdit: boolean;
  html: string;
  sessionId: string;
}

interface ImportedModule {
  name?: string;
  title?: string;
  url?: string;
  size?: number;
  created_at?: string;
}

const RENDER_BUILD_URL = 'https://ai-module-tester.onrender.com/build';
const EMPTY_PREVIEW =
  '<!doctype html><html><body style="font-family:system-ui;padding:2rem;color:#94a3b8;text-align:center;">' +
  '<div style="margin-top:10%"><div style="font-size:3rem;color:#cbd5e1;">📝</div>' +
  '<p style="margin-top:1rem;font-size:0.95rem;">Start writing or ask the AI to begin. Your live preview will appear here.</p></div></body></html>';

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

function slugify(str: string) {
  if (!str) return 'teacher';
  return (
    String(str)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 40) || 'teacher'
  );
}

function starterTemplate() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Lesson Title</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#fafafa;}</style>
</head>
<body class="text-slate-800">
  <div class="max-w-3xl mx-auto p-6 md:p-10">
    <header class="mb-8">
      <span class="inline-block px-3 py-1 bg-[#800020]/10 text-[#800020] rounded-full text-xs font-semibold mb-3">SUBJECT</span>
      <h1 class="text-3xl md:text-4xl font-bold text-[#800020] mb-2">Lesson Title</h1>
      <p class="text-slate-500">A short description of what students will learn in this lesson.</p>
    </header>
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      <h2 class="text-xl font-bold text-slate-800 mb-3"><i class="fas fa-book-open text-[#800020] mr-2"></i>Introduction</h2>
      <p class="text-slate-600 leading-relaxed">Write your lesson content here.</p>
    </section>
    <section class="bg-gradient-to-br from-[#800020] to-[#5c0017] text-white rounded-2xl p-6">
      <h2 class="text-xl font-bold mb-3"><i class="fas fa-pen-to-square mr-2"></i>Practice Question</h2>
      <p class="text-white/90 mb-4">Try this question to test your understanding.</p>
      <button onclick="alert('Correct!')" class="px-4 py-2 bg-white text-[#800020] rounded-xl font-semibold hover:bg-white/90 transition-colors">Show Answer</button>
    </section>
  </div>
</body>
</html>`;
}

const QUICK_PROMPTS = [
  { label: 'Photosynthesis quiz', prompt: 'Create a 5-question multiple-choice quiz on photosynthesis with answer explanations.' },
  { label: 'Quadratic equations', prompt: 'Build an interactive lesson on quadratic equations with examples and a practice problem.' },
  { label: 'Human heart diagram', prompt: 'Make a labelled diagram of the human heart with hover descriptions for each part.' },
];

export default function TeacherModulesPage() {
  const params = useParams();
  const className = (params?.className as string) || 'SSS3';

  const [authChecked, setAuthChecked] = useState(false);
  const [teacher, setTeacher] = useState<any>(null);

  const [mode, setMode] = useState<'self' | 'ai'>('self');
  const [aiSubTab, setAISubTab] = useState<'chat' | 'preview'>('chat');
  const [search, setSearch] = useState(true);
  const [html, setHtml] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastTest, setLastTest] = useState<TestReport | null>(null);
  const [pendingPlan, setPendingPlan] = useState<PendingPlan | null>(null);
  const [retryContext, setRetryContext] = useState<{ sessionId: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [error, setError] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [importList, setImportList] = useState<{ loading: boolean; empty: boolean; error: string; items: ImportedModule[] }>({
    loading: false,
    empty: false,
    error: '',
    items: [],
  });
  const [uploadClassOpen, setUploadClassOpen] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLPreElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const previewSelfRef = useRef<HTMLIFrameElement>(null);
  const previewAIRef = useRef<HTMLIFrameElement>(null);
  const currentSessionId = useRef<string>('');
  const retryCtxRef = useRef<{ sessionId: string } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Auth gate + seed initial AI message + restore chat from cookie
  useEffect(() => {
    const s = requireRole('teacher');
    if (!s) return;
    const u = s.user || {};
    setTeacher(u);
    setAuthChecked(true);
    // restore chat from cookie
    loadChatFromCookie();
  }, []);

  // Seed initial AI message if chat empty
  useEffect(() => {
    if (authChecked && chat.length === 0) {
      setChat([
        {
          role: 'ai',
          text: "Hello! I'm your AI module assistant. Describe the lesson you want and I'll generate, browser-test, and (if needed) auto-fix the HTML for you. You can also ask me to edit specific parts.",
        },
      ]);
    }
  }, [authChecked]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chat, isThinking]);

  // Update preview whenever html changes
  useEffect(() => {
    const content = html || EMPTY_PREVIEW;
    if (previewSelfRef.current) previewSelfRef.current.srcdoc = content;
    if (previewAIRef.current) previewAIRef.current.srcdoc = content;
  }, [html, mode, aiSubTab]);

  // Update line numbers when html changes
  const updateLineNumbers = useCallback(() => {
    const editor = editorRef.current;
    const ln = lineNumbersRef.current;
    if (!editor || !ln) return;
    const lineCount = editor.value.split('\n').length;
    ln.textContent = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
  }, []);

  useEffect(() => {
    updateLineNumbers();
  }, [html, updateLineNumbers]);

  // ---- Chat persistence (cookie, NO localStorage) ----
  const saveChatToCookie = useCallback((ch: ChatMessage[]) => {
    try {
      const toSave = ch.filter((m) => m.role !== 'thinking').slice(-50);
      const encoded = btoa(encodeURIComponent(JSON.stringify(toSave)));
      document.cookie = `girau-module-chat=${encoded};path=/;max-age=3600;SameSite=Lax`;
    } catch {}
  }, []);

  function loadChatFromCookie() {
    try {
      const m = document.cookie.match(/girau-module-chat=([^;]+)/);
      if (m) {
        const c = JSON.parse(decodeURIComponent(atob(m[1])));
        if (Array.isArray(c) && c.length > 0) setChat(c);
      }
    } catch {}
  }

  function clearChatCookie() {
    document.cookie = 'girau-module-chat=;path=/;max-age=0';
  }

  const addChatMessage = useCallback(
    (role: ChatMessage['role'], text: string, icon?: string) => {
      setChat((prev) => {
        const next = [...prev, { role, text, icon }];
        saveChatToCookie(next);
        return next;
      });
    },
    [saveChatToCookie],
  );

  const setThinking = useCallback(
    (thinking: boolean) => {
      setIsThinking(thinking);
      if (thinking) {
        setChat((prev) => {
          const filtered = prev.filter((m) => m.role !== 'thinking');
          const next = [...filtered, { role: 'thinking' as const, text: '' }];
          saveChatToCookie(next);
          return next;
        });
      } else {
        setChat((prev) => {
          const next = prev.filter((m) => m.role !== 'thinking');
          saveChatToCookie(next);
          return next;
        });
      }
    },
    [saveChatToCookie],
  );

  // ---- Code editor input ----
  const onEditorInput = () => {
    const editor = editorRef.current;
    if (!editor) return;
    setHtml(editor.value);
    const ln = lineNumbersRef.current;
    if (ln) {
      const lineCount = editor.value.split('\n').length;
      ln.textContent = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
    }
  };

  const onEditorScroll = () => {
    if (lineNumbersRef.current && editorRef.current) {
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  const onEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const editor = e.currentTarget;
      const s = editor.selectionStart;
      const en = editor.selectionEnd;
      const newValue = editor.value.substring(0, s) + '  ' + editor.value.substring(en);
      editor.value = newValue;
      editor.selectionStart = editor.selectionEnd = s + 2;
      setHtml(newValue);
    }
  };

  const insertTemplate = () => {
    if (editorRef.current && editorRef.current.value.trim()) {
      if (!confirm('Inserting a template will replace your current content. Continue?')) return;
    }
    setHtml(starterTemplate());
    showToast('Starter template inserted.', 'success');
  };

  const clearEditor = () => {
    if (!editorRef.current?.value.trim() || confirm('Clear the editor and preview?')) {
      setHtml('');
      setLastTest(null);
    }
  };

  const clearChat = () => {
    if (isThinking) return;
    clearChatCookie();
    setChat([
      {
        role: 'ai',
        text: "Hello! I'm your AI module assistant. Describe the lesson you want and I'll generate, browser-test, and (if needed) auto-fix the HTML for you. You can also ask me to edit specific parts.",
      },
    ]);
    showToast('Chat cleared.', 'info');
  };

  const autoResizeChatInput = () => {
    const ta = chatInputRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 128) + 'px';
  };

  // =====================================================
  // PHASE 1: sendChat — Plan (ai-session-start)
  // =====================================================
  const sendChat = useCallback(
    (prompt: string) => {
      if (!prompt || !prompt.trim()) return;
      if (isThinking) {
        showToast('Please wait for the AI to finish responding.', 'info');
        return;
      }
      const userPrompt = prompt.trim();
      addChatMessage('user', userPrompt);
      if (chatInputRef.current) {
        chatInputRef.current.value = '';
        autoResizeChatInput();
      }
      setThinking(true);

      const isEdit = !!(html && html.length > 50);
      const searchEnabled = !!search;

      addChatMessage('system', '🤔 Understanding your request...', 'fa-brain');

      const sessionId =
        typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID
          ? window.crypto.randomUUID()
          : 'sess_' + Date.now();
      currentSessionId.current = sessionId;

      edge('ai-session-start', {
        body: {
          prompt: userPrompt,
          current_html: html || '',
          search: searchEnabled,
          session_id: sessionId,
        },
      })
        .then((res) => {
          setThinking(false);
          if (!res || !res.ok || !res.data || !res.data.success) {
            const errMsg = (res && res.data && res.data.error) || 'Could not create a plan. Please try again.';
            addChatMessage('error', errMsg);
            retryCtxRef.current = { sessionId };
            setRetryContext({ sessionId });
            addChatMessage('system', '⏱️ The AI saved its progress. Click Continue to resume from where it stopped.', 'fa-clock');
            addChatMessage('timeout', '');
            return;
          }
          const planData = res.data;
          if (planData.searched && planData.searchResults) {
            addChatMessage('system', '🌐 Web research complete:\n' + String(planData.searchResults).substring(0, 300), 'fa-globe');
          }
          if (planData.plan) {
            addChatMessage('ai', '📋 Here is my plan:\n\n' + planData.plan);
          }
          setPendingPlan({
            prompt: userPrompt,
            plan: planData.plan || '',
            searchResults: planData.searchResults || '',
            isEdit,
            html: html || '',
            sessionId: planData.session_id || sessionId,
          });
          addChatMessage('build-now', '');
        })
        .catch(() => {
          setThinking(false);
          retryCtxRef.current = { sessionId };
          setRetryContext({ sessionId });
          addChatMessage('system', '⏱️ The AI saved its progress. Click Continue to resume from where it stopped.', 'fa-clock');
          addChatMessage('timeout', '');
        });
    },
    [addChatMessage, html, isThinking, search, setThinking],
  );

  // =====================================================
  // PHASE 2: executePlan — Build (save-build + Render stream)
  // =====================================================
  const executePlan = useCallback(() => {
    if (!pendingPlan) {
      showToast('No plan to execute. Send a message first.', 'error');
      return;
    }
    if (isThinking) {
      showToast('Already building. Please wait...', 'info');
      return;
    }
    const p = pendingPlan;
    setThinking(true);
    setChat((prev) => {
      const next = prev.filter((m) => m.role !== 'build-now');
      const withBuilding = [...next, { role: 'building' as const, text: '' }];
      saveChatToCookie(withBuilding);
      return withBuilding;
    });
    addChatMessage('system', '⚙️ ' + (p.isEdit ? 'Editing' : 'Building') + ' the module based on the plan...', 'fa-cog');

    const editMode = p.isEdit;
    const savedPlan = p.plan || '';
    const currentHtml = html || p.html;
    const userPrompt = p.prompt;

    let buildMessages: { role: string; content: string }[];
    if (editMode) {
      const userContent =
        'EXISTING HTML MODULE:\n\n' +
        currentHtml +
        '\n\nPLAN:\n' +
        savedPlan +
        '\n\nEDIT INSTRUCTION: ' +
        userPrompt +
        '\n\nReturn ONLY the changes as SEARCH/REPLACE blocks.';
      buildMessages = [
        {
          role: 'system',
          content:
            'You are an expert HTML editor. Return ONLY changes as SEARCH/REPLACE blocks.\nFormat:\n<<<< SEARCH\n[text to find]\n==== REPLACE\n[new text]\n>>>>\nAfter blocks, write one sentence about what you changed.',
        },
        { role: 'user', content: userContent },
      ];
    } else {
      buildMessages = [
        {
          role: 'system',
          content:
            'You are an expert educational content creator. Create a complete HTML document with inline CSS and JS. Use maroon #800020. Wrap in a code block.',
        },
        { role: 'user', content: 'USER REQUEST: ' + userPrompt + '\n\nPLAN:\n' + savedPlan + '\n\nBuild the module.' },
      ];
    }

    edge('ai-module', { body: { action: 'save-build', session_id: p.sessionId, messages: buildMessages } })
      .then(() => {
        return fetch(RENDER_BUILD_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: buildMessages,
            max_tokens: editMode ? 4096 : 8192,
            temperature: editMode ? 0.2 : 0.5,
          }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        const processLine = (line: string) => {
          try {
            const msg = JSON.parse(line);
            if (msg.chunk) {
              fullContent += msg.chunk;
            } else if (msg.done) {
              setThinking(false);
              setChat((prev) => {
                const next = prev.filter((m) => m.role !== 'building');
                saveChatToCookie(next);
                return next;
              });
              setPendingPlan(null);
              // save result to DB
              edge('ai-module', {
                body: { action: 'save-result', session_id: p.sessionId, content: fullContent, phase: 'build' },
              });
              if (editMode) {
                const edits: { search: string; replace: string }[] = [];
                const regex = /<<<<\s*SEARCH\s*\n([\s\S]*?)\n====\s*REPLACE\s*\n([\s\S]*?)\n>>>>/g;
                let match;
                while ((match = regex.exec(fullContent)) !== null) {
                  edits.push({ search: match[1], replace: match[2] });
                }
                let summary = fullContent.replace(/<<<<\s*SEARCH[\s\S]*?>>>>/g, '').trim();
                if (!summary) summary = 'Applied ' + edits.length + ' edit(s).';
                let applied = 0;
                let failed = 0;
                setHtml((cur) => {
                  let h = cur;
                  edits.forEach((edit, i) => {
                    if (h && h.indexOf(edit.search) !== -1) {
                      h = h.replace(edit.search, edit.replace);
                      applied++;
                      addChatMessage('system', '✏️ Applied edit ' + (i + 1) + '/' + edits.length + ': ' + edit.search.substring(0, 40) + '...', 'fa-pen');
                    } else {
                      failed++;
                    }
                  });
                  return h;
                });
                addChatMessage('ai', '✅ ' + summary + ' (' + applied + ' applied, ' + failed + ' not found)');
              } else {
                const htmlMatch = fullContent.match(/```html\s*\n?([\s\S]*?)```/i);
                if (htmlMatch) {
                  setHtml(htmlMatch[1].trim());
                } else {
                  setHtml(fullContent.trim());
                }
                addChatMessage('ai', '✅ Module generated.');
              }
              setAISubTab('preview');
              addChatMessage('test-now', '');
            } else if (msg.error) {
              setThinking(false);
              setChat((prev) => {
                const next = prev.filter((m) => m.role !== 'building');
                saveChatToCookie(next);
                return next;
              });
              addChatMessage('error', msg.error);
              retryCtxRef.current = { sessionId: p.sessionId };
              setRetryContext({ sessionId: p.sessionId });
              addChatMessage('timeout', '');
            }
          } catch {
            /* not JSON, ignore */
          }
        };

        const pump = (): Promise<void> => {
          return reader.read().then((result) => {
            if (result.done) {
              if (buffer.trim()) processLine(buffer);
              return;
            }
            buffer += decoder.decode(result.value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            lines.forEach(processLine);
            return pump();
          });
        };
        return pump();
      })
      .catch(() => {
        setThinking(false);
        setChat((prev) => {
          const next = prev.filter((m) => m.role !== 'building');
          saveChatToCookie(next);
          return next;
        });
        retryCtxRef.current = { sessionId: p.sessionId };
        setRetryContext({ sessionId: p.sessionId });
        addChatMessage('system', '⏱️ Build timed out. The AI saved its progress. Click Continue to resume from where it stopped.', 'fa-clock');
        addChatMessage('timeout', '');
      });
  }, [addChatMessage, html, isThinking, pendingPlan, saveChatToCookie, setThinking]);

  // Continue from timeout
  const continueFromTimeout = useCallback(() => {
    const ctx = retryCtxRef.current || retryContext;
    if (!ctx) {
      showToast('Nothing to continue. Send a new message.', 'info');
      return;
    }
    retryCtxRef.current = null;
    setRetryContext(null);
    setChat((prev) => {
      const next = prev.filter((m) => m.role !== 'timeout');
      saveChatToCookie(next);
      return next;
    });
    addChatMessage('system', '🔄 Resuming from where the AI stopped...', 'fa-rotate-right');
    setThinking(true);
    edge('ai-module', { body: { action: 'continue', session_id: ctx.sessionId } })
      .then((res) => {
        setThinking(false);
        setChat((prev) => {
          const next = prev.filter((m) => m.role !== 'building');
          saveChatToCookie(next);
          return next;
        });
        if (!res || !res.ok || !res.data || res.data.error) {
          retryCtxRef.current = ctx;
          setRetryContext(ctx);
          addChatMessage('system', '⏱️ Still working. Click Continue to retry.', 'fa-clock');
          addChatMessage('timeout', '');
          return;
        }
        const data = res.data;
        if (data.edits && Array.isArray(data.edits)) {
          let applied = 0;
          let failed = 0;
          setHtml((cur) => {
            let h = cur;
            data.edits.forEach((edit: { search: string; replace: string }, i: number) => {
              if (h && h.indexOf(edit.search) !== -1) {
                h = h.replace(edit.search, edit.replace);
                applied++;
                addChatMessage('system', '✏️ Applied edit ' + (i + 1) + '/' + data.edits.length + ': ' + edit.search.substring(0, 40) + '...', 'fa-pen');
              } else {
                failed++;
              }
            });
            return h;
          });
          addChatMessage('ai', '✅ ' + (data.summary || 'Applied ' + applied + ' edit(s).') + ' (' + applied + ' applied, ' + failed + ' not found)');
          setAISubTab('preview');
          addChatMessage('test-now', '');
        }
      })
      .catch(() => {
        setThinking(false);
        retryCtxRef.current = ctx;
        setRetryContext(ctx);
        addChatMessage('system', '⏱️ Still working. Click Continue to retry.', 'fa-clock');
        addChatMessage('timeout', '');
      });
  }, [addChatMessage, retryContext, saveChatToCookie, setThinking]);

  // =====================================================
  // PHASE 3: testAndFix — Test (ai-module action=test) + Fix (action=fix)
  // =====================================================
  const testAndFix = useCallback(() => {
    if (isThinking) {
      showToast('Already testing. Please wait...', 'info');
      return;
    }
    if (!html || html.length < 10) {
      showToast('No module to test. Build one first.', 'error');
      return;
    }
    setThinking(true);
    setChat((prev) => {
      const next = prev.filter((m) => m.role !== 'test-now');
      saveChatToCookie(next);
      return next;
    });
    addChatMessage('system', '🧪 Testing the module with the browser...', 'fa-vial');

    edge('ai-module', { body: { action: 'test', current_html: html } }).then((res) => {
      if (!res || !res.ok || !res.data) {
        setThinking(false);
        addChatMessage('error', 'Could not run the test. Please try again.');
        return;
      }
      const testData = res.data;
      if (testData.test) {
        setLastTest(testData.test);
        const overall = testData.test.overall || 'unknown';
        const issueCount = (testData.test.issues || []).length;
        addChatMessage('system', '📋 Test result: ' + overall.toUpperCase() + (issueCount > 0 ? ' (' + issueCount + ' issue(s))' : ' — no issues!'), 'fa-clipboard-check');
        if ((overall === 'needs_work' || overall === 'broken') && issueCount > 0) {
          addChatMessage('system', '🔧 Auto-fixing ' + issueCount + ' issue(s)...', 'fa-wrench');
          edge('ai-module', { body: { action: 'fix', current_html: html, issues: testData.test.issues, suggestions: testData.test.suggestions || [] } }).then((fixRes) => {
            setThinking(false);
            if (fixRes && fixRes.ok && fixRes.data && fixRes.data.edits) {
              let applied = 0;
              setHtml((cur) => {
                let h = cur;
                fixRes.data.edits.forEach((edit: { search: string; replace: string }) => {
                  if (h && h.indexOf(edit.search) !== -1) {
                    h = h.replace(edit.search, edit.replace);
                    applied++;
                  }
                });
                return h;
              });
              addChatMessage('system', '✅ Auto-fix applied! ' + applied + ' fix(es) applied. Module updated.', 'fa-check-circle');
              addChatMessage('system', '🎉 Module is ready! You can save it or upload to students.', 'fa-check-double');
            } else if (fixRes && fixRes.ok && fixRes.data && fixRes.data.html) {
              setHtml(fixRes.data.html);
              addChatMessage('system', '✅ Auto-fix applied! Module updated and verified.', 'fa-check-circle');
              addChatMessage('system', '🎉 Module is ready! You can save it or upload to students.', 'fa-check-double');
            } else {
              addChatMessage('system', '⚠️ Could not auto-fix all issues. You can edit manually in Self mode.', 'fa-triangle-exclamation');
            }
          });
        } else {
          setThinking(false);
          if (overall === 'good') {
            addChatMessage('system', '🎉 Module is ready! You can save it or upload to students.', 'fa-check-double');
          }
        }
      } else {
        setThinking(false);
      }
    });
  }, [addChatMessage, html, isThinking, saveChatToCookie, setThinking]);

  // ---- Test Again (re-run Playwright test on current HTML) ----
  const testAgain = useCallback(() => {
    if (isTesting) return;
    if (!html || !html.trim()) {
      showToast('Nothing to test. Write or generate some HTML first.', 'error');
      return;
    }
    setIsTesting(true);
    edge('ai-module', { method: 'POST', body: { action: 'test', current_html: html } })
      .then((res) => {
        setIsTesting(false);
        if (!res || !res.ok || !res.data) {
          const msg = (res && res.data && res.data.error) || 'Test failed to run. Please try again.';
          showToast(msg, 'error');
          setLastTest(null);
          return;
        }
        const test = res.data.test || res.data;
        setLastTest(test);
        const overall = String((test && test.overall) || 'unknown').toLowerCase();
        if (overall === 'good') showToast('Test complete — module looks great!', 'success');
        else if (overall === 'broken') showToast('Test complete — issues found. See the report below.', 'error');
        else showToast('Test complete — see the report below.', 'info');
      })
      .catch(() => {
        setIsTesting(false);
        showToast('Network error running the test. Please try again.', 'error');
      });
  }, [html, isTesting]);

  // ---- Upload to Students ----
  const uploadToStudents = () => {
    if (isUploading) return;
    if (!html || !html.trim()) {
      showToast('Nothing to upload. Write or generate some HTML first.', 'error');
      return;
    }
    if (!teacher) {
      showToast('Teacher session not loaded.', 'error');
      return;
    }
    const session = getSession();
    const classAccess: string[] = (session?.user?.class_access as string[]) || teacher?.class_access || [];
    if (!classAccess.length) {
      showToast('No classes assigned. Contact admin.', 'error');
      return;
    }
    if (classAccess.length === 1) {
      doUpload(classAccess[0]);
      return;
    }
    setUploadClassOpen(true);
  };

  const doUpload = (classNameToUpload: string) => {
    setIsUploading(true);
    const filename =
      slugify(teacher?.username || 'teacher') + '_' + slugify(teacher?.subject || 'general') + '_' + Date.now() + '.html';
    edge('save-module', {
      body: {
        teacher_id: teacher?.id,
        teacher_name: teacher?.full_name || teacher?.username,
        subject: teacher?.subject,
        filename,
        html,
        mode: 'save',
        class_name: classNameToUpload,
      },
    })
      .then((res) => {
        setIsUploading(false);
        const data = res.data || res;
        if (data.success) {
          showToast('Module uploaded to ' + classNameToUpload + '! Students can now access it.', 'success');
        } else {
          showToast('Upload failed: ' + (data.error || ''), 'error');
        }
      })
      .catch((err) => {
        setIsUploading(false);
        showToast('Upload failed: ' + (err.message || ''), 'error');
      });
  };

  // ---- Save Module modal ----
  const openSaveModal = () => {
    if (!html || !html.trim()) {
      showToast('Nothing to save. Write or generate some HTML first.', 'error');
      return;
    }
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const defaultName = titleMatch
      ? slugify(titleMatch[1])
      : slugify(teacher?.username || 'module') + '-' + Date.now();
    setSaveName(defaultName);
    setSaveModalOpen(true);
  };

  const saveOnly = () => {
    setSaveModalOpen(false);
    showToast('Module kept in editor.', 'success');
  };

  const saveAndUpdateBucket = () => {
    if (!teacher) {
      showToast('Teacher session not loaded. Please reload the page.', 'error');
      return;
    }
    if (!html || !html.trim()) {
      showToast('Nothing to save.', 'error');
      return;
    }
    const raw = (saveName || '').trim();
    if (!raw) {
      showToast('Please enter a module name.', 'error');
      return;
    }
    const filename = raw.replace(/\.html?$/i, '') + '.html';
    edge('save-module', {
      body: {
        teacher_id: teacher.id,
        teacher_name: teacher.full_name || teacher.username,
        subject: teacher.subject,
        filename,
        html,
        mode: 'update',
      },
    })
      .then((res) => {
        const data = (res && res.data) || res || {};
        if (data.success) {
          showToast('Module saved to bucket as ' + filename, 'success');
          setSaveModalOpen(false);
        } else {
          showToast('Save failed: ' + (data.error || data.message || 'Unknown error'), 'error');
        }
      })
      .catch((err) => {
        showToast('Save failed: ' + (err?.message || 'Network error'), 'error');
      });
  };

  // ---- Import Existing Module ----
  const openImportModal = () => {
    if (!teacher || !teacher.subject) {
      showToast('Your teacher profile is still loading. Please try again in a moment.', 'info');
      return;
    }
    setImportOpen(true);
    setImportList({ loading: true, empty: false, error: '', items: [] });
    const subject = (teacher.subject || '').toLowerCase().trim();
    if (!subject) {
      setImportList({ loading: false, empty: false, error: 'No subject found on your teacher profile.', items: [] });
      return;
    }
    edge('list-modules', { body: { subject } })
      .then((res) => {
        if (!res || !res.ok || !res.data || !res.data.success) {
          const msg = (res && res.data && res.data.error) || 'The module service did not respond correctly.';
          setImportList({ loading: false, empty: false, error: msg, items: [] });
          return;
        }
        const items = res.data.modules || [];
        setImportList({ loading: false, empty: items.length === 0, error: '', items });
      })
      .catch(() => {
        setImportList({ loading: false, empty: false, error: 'Network error reaching the module service.', items: [] });
      });
  };

  const importModule = (mod: ImportedModule) => {
    if (!mod || !mod.url) {
      showToast('This module has no downloadable URL.', 'error');
      return;
    }
    const title = formatModuleTitle(mod);
    setImportList((prev) => ({ ...prev, loading: true }));
    fetch(mod.url)
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then((htmlContent) => {
        setHtml(htmlContent);
        setMode('self');
        setImportOpen(false);
        setImportList({ loading: false, empty: false, error: '', items: [] });
        showToast("Module '" + title + "' loaded. You can now edit it or ask the AI to modify it.", 'success');
      })
      .catch(() => {
        setImportList({ loading: false, empty: false, error: 'Could not download that module. Please try another one.', items: [] });
        showToast('Could not download that module. Please try another one.', 'error');
      });
  };

  function formatModuleTitle(mod: ImportedModule) {
    const t = (mod && mod.title ? String(mod.title).trim() : '') || '';
    if (t) return t;
    const name = (mod && mod.name ? String(mod.name).replace(/\.html?$/i, '') : '') || 'Untitled Module';
    const stripped = name.replace(/^[a-z0-9-]+_[a-z0-9-]+_/i, '').replace(/[-_]+/g, ' ').trim() || 'Untitled Module';
    return stripped.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function formatBytes(bytes?: number) {
    const b = Number(bytes);
    if (!b || isNaN(b)) return '—';
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / (1024 * 1024)).toFixed(1) + ' MB';
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#800020]/20 border-t-[#800020] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading Module Builder…</p>
        </div>
      </div>
    );
  }

  const name = teacher?.full_name || teacher?.name || teacher?.username || 'Teacher';
  const subject = teacher?.subject || 'General';
  const session = getSession();
  const classAccess: string[] = (session?.user?.class_access as string[]) || teacher?.class_access || [];

  const sidebarSections: NavSection[] = [
    {
      title: 'Main Menu',
      items: [
        { label: 'Dashboard', href: `/girau/classes/${className}/teachers`, icon: 'fas fa-home' },
        { label: 'Modules', href: `/girau/classes/${className}/teachers/modules`, icon: 'fas fa-cube', iconColor: 'text-[#800020]', active: true, badge: 'NEW' },
        { label: 'My Classes', href: `/girau/classes/${className}/teachers#myClasses`, icon: 'fas fa-chalkboard', iconColor: 'text-emerald-500' },
        { label: 'Timetable', href: `/girau/classes/${className}/teachers#timetable`, icon: 'fas fa-calendar-alt', iconColor: 'text-rose-500' },
      ],
    },
    {
      title: 'Communication',
      items: [
        { label: 'Messenger', href: '/girau/messenger', icon: 'fas fa-comments', iconColor: 'text-[#a63d56]' },
        { label: 'Student Questions', href: `/girau/classes/${className}/teachers#studentQuestions`, icon: 'fas fa-question-circle', iconColor: 'text-teal-500' },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar
        sections={sidebarSections}
        user={{ name, subtitle: subject + ' Teacher', avatarUrl: avatarFor(name) }}
      />

      <div className="flex-1 flex flex-col lg:ml-80 min-w-0">
        <style>{`
          @keyframes girau-mb-spin { to { transform: rotate(360deg); } }
          .girau-mb-spinner { width:14px;height:14px;border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:girau-mb-spin 0.7s linear infinite;display:inline-block; }
          .girau-mb-spinner-dark { width:14px;height:14px;border:2px solid rgba(128,0,32,0.2);border-top-color:#800020;border-radius:50%;animation:girau-mb-spin 0.7s linear infinite;display:inline-block; }
          @keyframes girau-mb-dotpulse { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        `}</style>

        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-6 py-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => SidebarControls.toggle()}
                className="p-2 rounded-xl hover:bg-slate-100 lg:hidden transition-colors"
                aria-label="Toggle sidebar"
              >
                <i className="fas fa-bars text-slate-500" />
              </button>
              <div className="min-w-0">
                <h1 className="text-base md:text-lg font-bold text-slate-800 truncate flex items-center gap-2">
                  <i className="fas fa-cube text-[#800020]" /> Module Builder
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">Create interactive HTML lessons &amp; share with students</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={openImportModal}
                className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-semibold text-sm transition-all bg-white border border-[#800020]/35 text-[#800020] hover:bg-gradient-to-br hover:from-[#800020] hover:to-[#5c0017] hover:text-white hover:border-transparent"
                title="Import an existing module for your subject"
              >
                <i className="fas fa-folder-open" />
                <span className="hidden sm:inline">Import Existing Module</span>
                <span className="sm:hidden">Import</span>
              </button>
              <button
                onClick={openSaveModal}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
                title="Save this module"
              >
                <i className="fas fa-floppy-disk" />
                <span className="hidden sm:inline">Save Module</span>
                <span className="sm:hidden">Save</span>
              </button>
              <button
                onClick={uploadToStudents}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-3 md:px-4 py-2 text-white rounded-xl font-semibold text-sm transition-all bg-gradient-to-br from-green-600 to-green-700 shadow-lg disabled:bg-slate-400 disabled:shadow-none"
              >
                {isUploading ? <span className="girau-mb-spinner" /> : <i className="fas fa-cloud-arrow-up" />}
                <span className="hidden sm:inline">{isUploading ? 'Uploading…' : 'Upload to Students'}</span>
                <span className="sm:hidden">{isUploading ? '…' : 'Upload'}</span>
              </button>
              <div className="hidden sm:flex items-center gap-3">
                
                <img
                  src={avatarFor(name)}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-[#800020]/30 object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 md:p-5">
          {error && (
            <div className="mb-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-3 text-sm flex items-center gap-3">
              <i className="fas fa-exclamation-triangle" />
              <span>{error}</span>
              <button onClick={() => setError('')} className="ml-auto p-1 hover:bg-rose-100 rounded">
                <i className="fas fa-times" />
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button
                  onClick={() => setMode('self')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    mode === 'self' ? 'bg-gradient-to-br from-[#800020] to-[#5c0017] text-white shadow-md' : 'text-slate-500'
                  }`}
                >
                  <i className="fas fa-code" /> Self
                </button>
                <button
                  onClick={() => setMode('ai')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    mode === 'ai' ? 'bg-gradient-to-br from-[#800020] to-[#5c0017] text-white shadow-md' : 'text-slate-500'
                  }`}
                >
                  <i className="fas fa-wand-magic-sparkles" /> AI
                </button>
              </div>
              {mode === 'ai' && (
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={search}
                    onChange={(e) => {
                      setSearch(e.target.checked);
                      showToast(e.target.checked ? 'Web search enabled.' : 'Web search disabled.', 'info');
                    }}
                    className="w-4 h-4 accent-[#800020]"
                  />
                  <i className="fas fa-globe text-[#a63d56]" /> Search web for context
                </label>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg">
                <i className="fas fa-font" /> <span>{html.length}</span> chars
              </span>
              <button
                onClick={() => {
                  const content = html || EMPTY_PREVIEW;
                  if (previewSelfRef.current) previewSelfRef.current.srcdoc = content;
                  if (previewAIRef.current) previewAIRef.current.srcdoc = content;
                  showToast('Preview refreshed.', 'info');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                <i className="fas fa-rotate-right" /> <span className="hidden sm:inline">Refresh</span> Preview
              </button>
            </div>
          </div>

          {/* AI sub-toggle bar */}
          {mode === 'ai' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 mb-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="inline-flex bg-slate-100 rounded-xl p-1 border border-slate-200">
                  <button
                    onClick={() => setAISubTab('chat')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      aiSubTab === 'chat' ? 'bg-gradient-to-br from-[#800020] to-[#5c0017] text-white shadow-md' : 'text-slate-500'
                    }`}
                  >
                    <i className="fas fa-comments" /> 💬 Chat Console
                  </button>
                  <button
                    onClick={() => setAISubTab('preview')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      aiSubTab === 'preview' ? 'bg-gradient-to-br from-[#800020] to-[#5c0017] text-white shadow-md' : 'text-slate-500'
                    }`}
                  >
                    <i className="fas fa-eye" /> 👁 Preview
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5">
                  <i className="fas fa-circle-info" /> AI auto-tests everything it generates — switch to Preview to see results.
                </div>
              </div>
            </div>
          )}

          {/* ==================== SELF MODE ==================== */}
          {mode === 'self' && (
            <div className="flex flex-col gap-3">
              {/* Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <i className="fas fa-eye text-[#800020]" /> Live Preview
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div className="bg-white p-2" style={{ minHeight: 360 }}>
                  <iframe ref={previewSelfRef} className="w-full bg-white border-0 rounded-xl" style={{ minHeight: 320 }} sandbox="allow-scripts" title="Module preview" />
                </div>
              </div>

              {/* Test Report */}
              <TestReportPanel lastTest={lastTest} isTesting={isTesting} onTestAgain={testAgain} />

              {/* Code editor */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <i className="fas fa-code text-[#800020]" /> HTML Editor
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={insertTemplate} className="text-[11px] text-[#800020] hover:underline font-medium">
                      <i className="fas fa-file-circle-plus" /> Template
                    </button>
                    <button onClick={clearEditor} className="text-[11px] text-rose-500 hover:underline font-medium">
                      <i className="fas fa-eraser" /> Clear
                    </button>
                  </div>
                </div>
                <div className="flex bg-[#0f172a] rounded-b-xl overflow-hidden border border-[#1e293b]" style={{ minHeight: 240, maxHeight: 460 }}>
                  <pre
                    ref={lineNumbersRef}
                    className="text-right text-slate-500 text-xs leading-[1.55] bg-[#0b1220] py-3.5 px-2.5 select-none overflow-hidden whitespace-pre"
                    style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", minWidth: '3rem' }}
                  >
                    1
                  </pre>
                  <textarea
                    ref={editorRef}
                    value={html}
                    onChange={onEditorInput}
                    onScroll={onEditorScroll}
                    onKeyDown={onEditorKeyDown}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    placeholder="<!-- Write your HTML here. Preview updates as you type. -->&#10;<h1>Hello, students!</h1>&#10;<p>Lesson content goes here…</p>"
                    className="flex-1 bg-transparent text-slate-200 border-0 outline-none resize-none py-3.5 px-4 text-[0.82rem] leading-[1.55] whitespace-pre overflow-auto"
                    style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", tabSize: 2 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================== AI MODE ==================== */}
          {mode === 'ai' && (
            <div className="flex flex-col gap-3">
              {/* Chat Console view */}
              {aiSubTab === 'chat' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: 520 }}>
                  <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-[#800020] to-[#5c0017] text-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-robot" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">AI Module Assistant</div>
                        <div className="text-[11px] text-white/70 flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-amber-300 animate-pulse' : 'bg-emerald-300'}`} />
                          <span>{isThinking ? 'Working…' : 'Ready'}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors" title="Clear chat">
                      <i className="fas fa-broom text-sm" />
                    </button>
                  </div>

                  <div
                    ref={chatMessagesRef}
                    className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col"
                    style={{ minHeight: 320, maxHeight: '60vh' }}
                  >
                    {chat.map((msg, idx) => (
                      <ChatBubble key={idx} msg={msg} onBuildNow={executePlan} onTestNow={testAndFix} onContinue={continueFromTimeout} />
                    ))}
                  </div>

                  {chat.length <= 1 && (
                    <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                      {QUICK_PROMPTS.map((qp) => (
                        <button
                          key={qp.label}
                          onClick={() => sendChat(qp.prompt)}
                          className="text-[11px] px-2.5 py-1.5 bg-slate-100 hover:bg-[#800020]/10 text-slate-700 hover:text-[#800020] rounded-full transition-colors"
                        >
                          <i className="fas fa-lightbulb" /> {qp.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <form
                    onSubmit={(e: FormEvent) => {
                      e.preventDefault();
                      if (chatInputRef.current) sendChat(chatInputRef.current.value);
                    }}
                    className="p-3 border-t border-slate-100 flex items-end gap-2 bg-white"
                  >
                    <textarea
                      ref={chatInputRef}
                      rows={1}
                      onInput={autoResizeChatInput}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (chatInputRef.current) sendChat(chatInputRef.current.value);
                        }
                      }}
                      placeholder="Describe the lesson you want to create…"
                      className="flex-1 resize-none px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#800020]/15 focus:border-[#800020]/40 focus:bg-white text-sm transition-all max-h-32"
                    />
                    <button
                      type="submit"
                      disabled={isThinking}
                      className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#800020] to-[#5c0017] text-white flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isThinking ? <span className="girau-mb-spinner" /> : <i className="fas fa-paper-plane" />}
                    </button>
                  </form>
                </div>
              )}

              {/* Preview view */}
              {aiSubTab === 'preview' && (
                <div className="flex flex-col gap-3">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <i className="fas fa-eye text-[#800020]" /> Live Preview
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                    <div className="bg-white p-2" style={{ minHeight: 360 }}>
                      <iframe ref={previewAIRef} className="w-full bg-white border-0 rounded-xl" style={{ minHeight: 320 }} sandbox="allow-scripts" title="Module preview (AI)" />
                    </div>
                  </div>
                  <TestReportPanel lastTest={lastTest} isTesting={isTesting} onTestAgain={testAgain} />
                </div>
              )}
            </div>
          )}

          <footer className="text-center text-xs text-slate-400 py-4 px-4">
            &copy; {new Date().getFullYear()} Girau International School. Module Builder. Learn, Live, Achieve.
          </footer>
        </main>
      </div>

      {/* Save Module modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSaveModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Save Module</h3>
            <p className="text-sm text-slate-500 mb-4">Choose how to save your module.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Module Name</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="my-edited-module"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#800020]"
                />
                <p className="text-xs text-slate-400 mt-1">.html extension added automatically</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={saveOnly} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl">
                  Save Only
                </button>
                <button onClick={saveAndUpdateBucket} className="flex-1 bg-[#800020] hover:bg-[#5c0017] text-white text-sm font-semibold py-2.5 rounded-xl">
                  Save &amp; Update Bucket
                </button>
              </div>
              <button onClick={() => setSaveModalOpen(false)} className="w-full text-slate-400 hover:text-slate-600 text-sm py-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import modal */}
      {importOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setImportOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-[#800020] to-[#5c0017] text-white p-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-bold flex items-center gap-2">
                  <i className="fas fa-folder-open" /> Import Existing Module
                </h2>
                <p className="text-xs text-white/80 mt-0.5">Select a {subject} module to edit</p>
              </div>
              <button onClick={() => setImportOpen(false)} className="p-2 rounded-lg hover:bg-white/15 transition-colors flex-shrink-0" aria-label="Close">
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              {importList.loading && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <div className="w-10 h-10 border-4 border-[#800020]/20 border-t-[#800020] rounded-full animate-spin mb-3" />
                  <p className="text-sm">Loading modules…</p>
                </div>
              )}
              {!importList.loading && importList.error && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-3">
                    <i className="fas fa-triangle-exclamation text-rose-500 text-xl" />
                  </div>
                  <p className="text-sm text-slate-700 font-semibold mb-1">Couldn&apos;t load modules.</p>
                  <p className="text-xs text-slate-500 max-w-sm">{importList.error}</p>
                  <button
                    onClick={openImportModal}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#5c0017] text-white text-xs font-semibold transition-colors"
                  >
                    <i className="fas fa-rotate-right mr-1" /> Retry
                  </button>
                </div>
              )}
              {!importList.loading && !importList.error && importList.empty && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#800020]/10 flex items-center justify-center mb-3">
                    <i className="fas fa-folder-open text-[#800020] text-xl" />
                  </div>
                  <p className="text-sm text-slate-700 font-semibold mb-1">No modules found for {subject}.</p>
                  <p className="text-xs text-slate-500 max-w-sm">You can still create one from scratch using AI or Self mode.</p>
                </div>
              )}
              {!importList.loading && !importList.error && !importList.empty && importList.items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {importList.items.map((m, i) => {
                    const title = formatModuleTitle(m);
                    return (
                      <button
                        key={i}
                        onClick={() => importModule(m)}
                        className="text-left border border-slate-200 rounded-xl p-4 bg-white transition-all hover:border-[#800020] hover:shadow-lg hover:-translate-y-0.5 flex flex-col gap-1.5"
                      >
                        <div className="font-bold text-[#800020] text-sm leading-snug break-words">{title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                          <span>
                            <i className="fas fa-database text-[10px]" /> {formatBytes(m.size)}
                          </span>
                          {m.created_at && (
                            <span>
                              <i className="fas fa-calendar text-[10px]" /> {new Date(m.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <span className="self-start mt-1 bg-gradient-to-br from-[#800020] to-[#5c0017] text-white text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
                          <i className="fas fa-download" /> Load
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-3.5 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setImportOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload class selection modal */}
      {uploadClassOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setUploadClassOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Upload to Students</h3>
            <p className="text-sm text-slate-500 mb-4">Select which class should receive this module:</p>
            <div className="space-y-2 mb-4">
              {classAccess.map((c) => (
                <label key={c} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="uploadClass" value={c} className="w-4 h-4 accent-[#800020]" onChange={() => {}} />
                  <span className="font-semibold text-slate-700">{c}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setUploadClassOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl">
                Cancel
              </button>
              <button
                onClick={() => {
                  const selected = document.querySelector<HTMLInputElement>('input[name="uploadClass"]:checked');
                  if (!selected) {
                    showToast('Please select a class.', 'error');
                    return;
                  }
                  setUploadClassOpen(false);
                  doUpload(selected.value);
                }}
                className="flex-1 bg-[#800020] hover:bg-[#5c0017] text-white text-sm font-semibold py-2.5 rounded-xl"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] px-5 py-3.5 rounded-xl text-white text-sm shadow-2xl flex items-center gap-2 max-w-[380px] ${
            toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-[#800020]'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function ChatBubble({
  msg,
  onBuildNow,
  onTestNow,
  onContinue,
}: {
  msg: ChatMessage;
  onBuildNow: () => void;
  onTestNow: () => void;
  onContinue: () => void;
}) {
  if (msg.role === 'build-now') {
    return (
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-[#800020]/10 flex items-center justify-center flex-shrink-0">
          <i className="fas fa-hammer text-[#800020] text-xs" />
        </div>
        <div className="bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 rounded-br-sm p-3" style={{ maxWidth: '88%' }}>
          <p className="text-sm text-slate-700 mb-2">Review the plan above, then click to build:</p>
          <button onClick={onBuildNow} className="bg-[#800020] hover:bg-[#5c0017] text-white text-sm font-bold px-5 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <i className="fas fa-play" /> Build Now
          </button>
        </div>
      </div>
    );
  }
  if (msg.role === 'test-now') {
    return (
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <i className="fas fa-vial-circle-check text-emerald-600 text-xs" />
        </div>
        <div className="bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 rounded-br-sm p-3" style={{ maxWidth: '88%' }}>
          <p className="text-sm text-slate-700 mb-2">Module built! Click to test &amp; verify:</p>
          <button onClick={onTestNow} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <i className="fas fa-vial" /> Test Now
          </button>
        </div>
      </div>
    );
  }
  if (msg.role === 'timeout') {
    return (
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
          <i className="fas fa-clock text-amber-500 text-xs" />
        </div>
        <div className="bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 rounded-br-sm p-3" style={{ maxWidth: '88%' }}>
          <p className="text-sm text-slate-700 mb-1">⏱️ The AI is taking longer than expected.</p>
          <p className="text-xs text-slate-500 mb-2">Click Continue to retry — the AI may respond faster on the next attempt.</p>
          <button onClick={onContinue} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <i className="fas fa-rotate-right" /> Continue
          </button>
        </div>
      </div>
    );
  }
  if (msg.role === 'building') {
    return (
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-[#800020]/10 flex items-center justify-center flex-shrink-0">
          <i className="fas fa-cog fa-spin text-[#800020] text-xs" />
        </div>
        <div className="bg-slate-100 text-slate-500 rounded-2xl border border-slate-200 rounded-br-sm p-3 text-sm" style={{ maxWidth: '88%' }}>
          Building module based on the plan...
        </div>
      </div>
    );
  }
  if (msg.role === 'thinking') {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <div className="w-7 h-7 rounded-full bg-[#800020]/10 flex items-center justify-center">
          <i className="fas fa-robot text-[#800020]" />
        </div>
        <div className="bg-slate-100 rounded-2xl border border-slate-200 p-3">
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#800020] inline-block" style={{ animation: 'girau-mb-dotpulse 1.2s infinite ease-in-out' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#800020] inline-block" style={{ animation: 'girau-mb-dotpulse 1.2s infinite ease-in-out 0.2s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#800020] inline-block" style={{ animation: 'girau-mb-dotpulse 1.2s infinite ease-in-out 0.4s' }} />
          </span>
        </div>
      </div>
    );
  }
  const isUser = msg.role === 'user';
  const isError = msg.role === 'error';
  const isSystem = msg.role === 'system';
  const cls = isUser ? 'bg-gradient-to-br from-[#800020] to-[#5c0017] text-white rounded-br-sm' : isError ? 'bg-red-50 text-red-800 border border-red-200 rounded-br-sm' : isSystem ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-xl text-xs' : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-sm';
  const defIcon = isUser ? 'fa-user' : isError ? 'fa-triangle-exclamation' : isSystem ? msg.icon || 'fa-circle-info' : 'fa-robot';
  const align = isUser ? 'flex justify-end' : 'flex items-start gap-2';
  return (
    <div className={align}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#800020]/10 flex items-center justify-center flex-shrink-0">
          <i className={`fas ${defIcon} text-[#800020] text-xs`} />
        </div>
      )}
      <div className={`p-2.5 px-3.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${cls}`} style={{ maxWidth: '88%' }}>
        {msg.text}
      </div>
    </div>
  );
}

function TestReportPanel({
  lastTest,
  isTesting,
  onTestAgain,
}: {
  lastTest: TestReport | null;
  isTesting: boolean;
  onTestAgain: () => void;
}) {
  const overall = String(lastTest?.overall || 'unknown').toLowerCase();
  const overallMap: Record<string, { label: string; cls: string; icon: string }> = {
    good: { label: 'All Good', cls: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: 'fa-circle-check' },
    needs_work: { label: 'Needs Work', cls: 'bg-amber-50 border-amber-200 text-amber-800', icon: 'fa-triangle-exclamation' },
    broken: { label: 'Broken', cls: 'bg-rose-50 border-rose-200 text-rose-800', icon: 'fa-circle-xmark' },
  };
  const info = overallMap[overall] || { label: 'Unknown', cls: 'bg-slate-50 border-slate-200 text-slate-700', icon: 'fa-circle-question' };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <i className="fas fa-vial text-[#800020]" /> Test Report
        </div>
        <button
          onClick={onTestAgain}
          disabled={isTesting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#800020] hover:bg-[#5c0017] text-white rounded-lg font-medium text-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isTesting ? <span className="girau-mb-spinner-dark" /> : <i className="fas fa-vial" />} Test Again
        </button>
      </div>
      <div className="p-4">
        {isTesting ? (
          <div className="flex items-center gap-2 justify-center text-[#800020] text-sm py-5">
            <span className="girau-mb-spinner-dark" /> Running Playwright test on current HTML…
          </div>
        ) : !lastTest ? (
          <div className="text-center text-slate-400 text-sm py-5">
            <i className="fas fa-flask-vial text-2xl block mb-1 text-slate-300" />
            No tests run yet. Click <strong>Test Again</strong> to validate your HTML with a real browser (Playwright).
          </div>
        ) : (
          <div className={`rounded-xl p-4 text-sm border ${info.cls}`}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="font-bold inline-flex items-center gap-2">
                <i className={`fas ${info.icon}`} /> {info.label}
              </div>
              <div className="text-xs opacity-85">
                {(lastTest.issues || []).length} issue(s) · {(lastTest.suggestions || []).length} suggestion(s)
                {lastTest.autoFixed && (
                  <span className="inline-flex items-center gap-1 bg-[#800020]/12 text-[#800020] px-2 py-0.5 rounded-full font-semibold text-[11px] ml-1">
                    <i className="fas fa-wrench" /> auto-fixed{lastTest.fixedCount ? ' ' + lastTest.fixedCount : ''}
                  </span>
                )}
              </div>
            </div>
            {(lastTest.issues || []).length > 0 && (
              <div className="mt-2">
                <div className="font-bold text-xs mb-1">⚠️ Issues Found</div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {lastTest.issues!.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>
            )}
            {(lastTest.suggestions || []).length > 0 && (
              <div className="mt-2">
                <div className="font-bold text-xs mb-1">💡 Suggestions</div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {lastTest.suggestions!.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {(!lastTest.issues || lastTest.issues.length === 0) && (!lastTest.suggestions || lastTest.suggestions.length === 0) && (
              <div className="italic opacity-85">No issues or suggestions — the module looks great! 🎉</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
