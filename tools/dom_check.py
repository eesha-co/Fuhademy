import re
path = r'c:\\Users\\Hp\\Downloads\\Exam-Prep100\\students\\subjects\\chemistry\\Praticals\\waec-titration-practical.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()
ids = ['final-1','initial-1','used-1','titrant-select','indicator-select','btn-add-drop','submit-readings','sim-drop-volume','sim-endpoint-volume']
results = {id_: ("id=\"%s\"" % id_) in html or ("id='%s'" % id_) in html for id_ in ids}
funcs = ['selectTitrant','addDrop','swirl','computeUsed','computeAverage','updateFlaskColor']
funcs_found = {fn: bool(re.search(r'function\s+' + re.escape(fn) + r'\s*\(', html)) for fn in funcs}
# use simpler patterns for let declarations
drop_decl = bool(re.search(r'let\s+dropVolume\s*=\s*', html))
endpoint_decl = bool(re.search(r'let\s+endpointVolume\s*=\s*', html))
print('IDS:')
for k,v in results.items(): print(f'  {k}: {v}')
print('FUNCTIONS:')
for k,v in funcs_found.items(): print(f'  {k}: {v}')
print('DECLARATIONS: dropVolume let:', drop_decl, 'endpointVolume let:', endpoint_decl)
