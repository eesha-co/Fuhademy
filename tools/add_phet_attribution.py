import os
import io

ROOT = r"c:\Users\Hp\Downloads\Exam-Prep100"
ATTR = 'Simulation by <a href="https://phet.colorado.edu">Phet Interactive Simulations, University of Colorado Boulder</a>, licensed under CC-BY-4.0.'
ATTR_HTML = '<p style="font-size:0.9rem; margin-top:0.5rem; text-align:center;">' + ATTR + '</p>'

modified = []

for dirpath, dirnames, filenames in os.walk(ROOT):
    # skip node_modules, .git, and large asset folders
    if any(part in ('node_modules', '.git', 'backups', 'backup-untracked') for part in dirpath.split(os.sep)):
        continue
    for fn in filenames:
        if not fn.lower().endswith(('.html', '.htm')):
            continue
        path = os.path.join(dirpath, fn)
        try:
            with io.open(path, 'r', encoding='utf-8') as f:
                s = f.read()
        except Exception:
            # try latin-1
            with io.open(path, 'r', encoding='latin-1') as f:
                s = f.read()
        if 'phet.colorado.edu' in s.lower() and 'phet interactive simulations' not in s.lower():
            new = s
            replaced = [False]
            # insert after each iframe that references phet
            import re
            pattern = re.compile(r"(<iframe[^>]+src=[\"']https?://phet.colorado.edu[^>]*>\s*</iframe>)", re.IGNORECASE)
            def repl(m):
                replaced[0] = True
                return m.group(1) + "\n" + ATTR_HTML
            new2, n = pattern.subn(repl, new)
            new = new2
            if not replaced[0]:
                # fallback: insert attribution before closing </body>
                if '</body>' in new.lower():
                    idx = new.lower().rfind('</body>')
                    new = new[:idx] + '\n    ' + ATTR_HTML + '\n' + new[idx:]
                    replaced = True
            if replaced and new != s:
                try:
                    with io.open(path, 'w', encoding='utf-8') as f:
                        f.write(new)
                    modified.append(path)
                except Exception:
                    with io.open(path, 'w', encoding='latin-1') as f:
                        f.write(new)
                    modified.append(path)

if modified:
    print('Modified files:')
    for p in modified:
        print(p)
else:
    print('No files modified.')
