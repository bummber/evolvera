import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
const storage = await mkdtemp(path.join(tmpdir(), 'evolvera-worker-runtime-'));
const child = spawn(
  process.execPath,
  [
    'node_modules/wrangler/bin/wrangler.js',
    'dev',
    '--local',
    '--ip',
    '127.0.0.1',
    '--port',
    '8789',
    '--config',
    'tests/runtime/wrangler.jsonc',
    '--persist-to',
    storage,
  ],
  {
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);
let output = '';
child.stdout.on('data', (chunk) => {
  output += String(chunk);
});
child.stderr.on('data', (chunk) => {
  output += String(chunk);
});
try {
  let result: unknown;
  for (let attempt = 0; attempt < 80; attempt++) {
    if (child.exitCode !== null)
      throw new Error('Lokale Worker-Laufzeit beendet: ' + output.slice(-1500));
    try {
      const response = await fetch('http://127.0.0.1:8789/', {
        signal: AbortSignal.timeout(500),
      });
      if (response.ok) {
        result = await response.json();
        break;
      }
    } catch {
      /* Wait only while the isolated test server starts. */
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.deepEqual(result, {
    disabledCorrectly: true,
    atomicConsumeCount: 1,
    sessionSeen: true,
    sessionRevoked: true,
    legalWithoutSession: true,
    privacyGateClosed: true,
  });
  console.log(
    'Lokaler workerd-/SQLite-Durable-Object-Test erfolgreich: sichere Deaktivierung, atomarer Callback, Sitzung und Widerruf, öffentliche Rechtstexte und Datenschutzgate.',
  );
} finally {
  child.kill('SIGTERM');
  await new Promise<void>((resolve) => {
    if (child.exitCode !== null) resolve();
    else child.once('exit', () => resolve());
  });
  await rm(storage, { recursive: true, force: true });
}
