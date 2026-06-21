import os
import sys

ROOT = r"c:\Users\Hp\Downloads\Exam-Prep100"
EXTS = ['.html', '.js', '.ts', '.jsx', '.tsx']
report = []

for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        if any(fn.lower().endswith(ext) for ext in EXTS):
            path = os.path.join(dirpath, fn)
            try:
                with open(path, 'rb') as f:
                    data = f.read()
                if b"\x00" in data or b"\xef\xbf\xbd" in data:
                    # capture a small hexdump/snippet
                    idx_null = data.find(b"\x00")
                    idx_rep = data.find(b"\xef\xbf\xbd")
                    idx = -1
                    if idx_null!=-1:
                        idx = idx_null
                        kind = 'NULL_BYTE'
                    else:
                        idx = idx_rep
                        kind = 'REPLACEMENT_CHAR'
                    start = max(0, idx-40)
                    snippet = data[start:start+120]
                    report.append((path, kind, snippet))
            except Exception as e:
                report.append((path, 'READ_ERROR', str(e).encode('utf-8', errors='replace')))

out_path = os.path.join(ROOT, 'scripts', 'garbled_report.txt')
with open(out_path, 'wb') as out:
    out.write(b"Garbled files report\n")
    out.write(b"=====================\n\n")
    for p, kind, snippet in report:
        out.write(p.encode('utf-8') + b"\n")
        out.write(b"Type: " + kind.encode('utf-8') + b"\n")
        out.write(b"Snippet (hex/bytes):\n")
        out.write(snippet + b"\n\n")

print('Wrote report to', out_path)

