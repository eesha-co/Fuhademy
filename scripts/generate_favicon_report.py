import os

ROOT = r"c:\Users\Hp\Downloads\Exam-Prep100"
SNIPPET = 'href="/favicon-32x32.png"'
report_path = os.path.join(ROOT, 'scripts', 'favicon_report.txt')
missing = []
all_html = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        if fn.lower().endswith('.html'):
            path = os.path.join(dirpath, fn)
            all_html.append(path)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                if SNIPPET not in content:
                    missing.append(path)
            except Exception as e:
                missing.append(path + '  # READ_ERROR: ' + str(e))

with open(report_path, 'w', encoding='utf-8') as out:
    out.write(f'Total HTML files: {len(all_html)}\n')
    out.write(f'Files containing favicon: {len(all_html) - len(missing)}\n')
    out.write(f'Files missing favicon: {len(missing)}\n\n')
    for p in missing:
        out.write(p + '\n')

print('Report written to', report_path)
