// Riverbraid-Judicial-Gold – Fail-Closed Gate
// 7-bit ASCII only.

export const evaluateSignal = (signal, rules) => {
  if (!signal || !rules) return { decision: 'DENY', reason: 'AMBIGUOUS_INPUT' };

  const isCoherent = rules.every(rule => signal.includes(rule));
  
  return {
    decision: isCoherent ? 'ALLOW' : 'DENY',
git push origin mainjudicial): inject LEAST_ENTROPY + DENY-by-default logic v1.1"c/judge.mjs'}; require('fs').writeFileSync('package.json', JSON.stringify(p, null, 2))"
From github.com:Riverbraid/Riverbraid-Judicial-Gold
 * branch            main       -> FETCH_HEAD
HEAD is now at 3991def chore: institutional-grade governance (10/10 reference complete)
[main 962de7c] feat(judicial): inject LEAST_ENTROPY + DENY-by-default logic v1.1
 3 files changed, 25 insertions(+), 6 deletions(-)
 create mode 100644 src/judge.mjs
Enumerating objects: 10, done.
Counting objects: 100% (10/10), done.
Delta compression using up to 2 threads
Compressing objects: 100% (6/6), done.
Writing objects: 100% (6/6), 1.03 KiB | 1.03 MiB/s, done.
Total 6 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To github.com:Riverbraid/Riverbraid-Judicial-Gold.git
   3991def..962de7c  main -> main
@Riverbraid ➜ /workspaces/Riverbraid-Judicial-Gold (main) $ cd /workspaces/Riverbraid-Memory-Gold
@Riverbraid ➜ /workspaces/Riverbraid-Judicial-Gold (main) $ cd /workspaces/Riverbraid-Memory-Gold
sudo chown -R $(whoami):$(whoami) .
git fetch origin mainin/main
git reset --hard origin/main
# Inject Identity
# Inject Identityentity.contract.json
cat << 'EOF' > identity.contract.json
{ "name": "Riverbraid-Memory-Gold",
  "name": "Riverbraid-Memory-Gold",modynamic Signal",
  "role": "Persistence Layer – Thermodynamic Signal",
  "signal": "MEANING_CENTRIC",
  "version": "1.1",ropy < 0.5",
  "threshold": "entropy < 0.5",okens, store meaning"
  "persistence_rule": "Reject tokens, store meaning"
}OF
