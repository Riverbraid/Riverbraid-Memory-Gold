import json, hashlib, os, sys
def compute_anchor(state):
    canonical = json.dumps(state, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(canonical.encode()).hexdigest()
state = {}
if os.path.exists('protocol.steps'):
    with open('protocol.steps', 'r') as f: state['protocol_steps'] = f.read()
if os.path.exists('build.py'):
    with open('build.py', 'r') as f: state['build_logic'] = f.read()
if os.path.exists('braid_sync.py'):
    with open('braid_sync.py', 'r') as f: state['sync_logic'] = f.read()
if os.path.exists('src/riverbraid/core/metrics.py'):
    with open('src/riverbraid/core/metrics.py', 'r') as f: state['metrics_logic'] = f.read()
anchor_file = '.anchor'
if not os.path.exists(anchor_file):
    h = compute_anchor(state); f = open(anchor_file, 'w'); f.write(h); f.close()
    print(f"Sealed: {h}")
else:
    with open(anchor_file, 'r') as f: ex = f.read().strip()
    if compute_anchor(state) != ex: print("DRIFT_DETECTED"); sys.exit(1)
print("[Signal: — | Braid: CLOSED-LOOP]")
