import { git, planAt, publishPlan } from '../src/automation/git';
function run() {
  const root = process.cwd();
  const args = process.argv.slice(2);
  if (args.length !== 1 || !['--dry-run', '--apply'].includes(args[0]!))
    throw new Error('Explizit --dry-run oder --apply wählen.');
  const apply = args[0] === '--apply';
  if (apply) {
    if (
      process.env.GITHUB_ACTIONS !== 'true' ||
      process.env.EVOLVERA_RUNNER_ENABLED !== 'true' ||
      process.env.GITHUB_REPOSITORY !== 'bummber/evolvera'
    )
      throw new Error(
        'Schreibender Lauf nur im ausdrücklich freigegebenen Projektworkflow.',
      );
    if (
      !/^https:\/\/github\.com\/bummber\/evolvera(?:\.git)?$/.test(
        git(root, ['remote', 'get-url', 'origin']).trim(),
      )
    )
      throw new Error('Unerwartetes Remote.');
    if (git(root, ['status', '--porcelain']).trim())
      throw new Error('Arbeitsverzeichnis nicht sauber.');
    git(root, ['fetch', 'origin', 'main']);
    if (
      git(root, ['rev-parse', 'HEAD']).trim() !==
      git(root, ['rev-parse', 'FETCH_HEAD']).trim()
    )
      throw new Error('Veralteter Checkout vor Laufstart.');
  }
  const base = git(root, ['rev-parse', 'HEAD']).trim();
  const plan = planAt(root, base, new Date().toISOString(), () =>
    new Date().toISOString(),
  );
  const commit =
    apply && plan.changes.size ? publishPlan(root, base, plan) : base;
  console.log(
    JSON.stringify({
      dryRun: !apply,
      commit,
      generationEnabled: plan.settings.generationEnabled,
      settingsRevision: plan.settings.revision,
      added: plan.added.length,
      restored: plan.restored.length,
      works: plan.workCount,
    }),
  );
}
try {
  run();
} catch {
  console.error(
    'Tageslauf sicher gestoppt. Git-Historie, Freigabe und Workflowstand prüfen; keine unsicheren Daten veröffentlichen.',
  );
  process.exitCode = 1;
}
