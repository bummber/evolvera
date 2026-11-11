import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { configSchema } from '../src/art/schema/config';
import { releaseSchema, assertSeriesGate } from '../src/automation/release';
import { readArchive, indexText, indexPath } from '../src/automation/archive';
import { canonicalHistory, git } from '../src/automation/git';
import { operatorSchema } from '../src/operator/access';
const readJson = async (file: string) =>
  JSON.parse(await readFile(file, 'utf8')) as unknown;
const settings = configSchema.parse(await readJson('config/generation.json'));
const release = releaseSchema.parse(await readJson('config/release.json'));
operatorSchema.parse(await readJson('config/operator.json'));
assertSeriesGate(settings, release);
if (release.artReview.workCount !== 40)
  throw new Error('Abnahmeumfang passt nicht zur festen 40er-Testsammlung.');
for (const [name, file] of [
  ['phase2', 'fixtures/preview/phase-2.json'],
  ['phase3', 'fixtures/preview/phase-3.json'],
] as const) {
  const digest = createHash('sha256')
    .update(await readFile(file))
    .digest('hex');
  if (digest !== release.artReview.fixtureSha256[name])
    throw new Error(
      'Abgenommene Testreferenzen wurden verändert. Neue Abnahme erforderlich.',
    );
}
const files = new Map<string, string>();
for (const file of await readdir('public/artworks', { recursive: true })) {
  if (file.endsWith('.json'))
    files.set(
      `public/artworks/${file}`,
      await readFile(`public/artworks/${file}`, 'utf8'),
    );
}
const works = readArchive(files, settings.seriesStartDate);
if (
  !files.has(indexPath) ||
  JSON.stringify(JSON.parse(files.get(indexPath)!)) !==
    JSON.stringify(JSON.parse(indexText(works)))
)
  throw new Error('Index entspricht nicht den validen Werkdateien.');
if (works.length && !release.seriesAuthorized)
  throw new Error('Offizielle Werke vor Serienfreigabe unzulässig.');
const canonical = canonicalHistory(
  process.cwd(),
  git(process.cwd(), ['rev-parse', 'HEAD']).trim(),
);
for (const [file, text] of canonical)
  if (files.get(file) !== text)
    throw new Error(
      'Historische Daten beschädigt: exakt aus Git wiederherstellen. Nicht neu erzeugen oder veröffentlichen.',
    );
for (const file of files.keys())
  if (file !== indexPath && !canonical.has(file))
    throw new Error('Offizielles Werk noch nicht sicher in Git archiviert.');
console.log(
  `Datenprüfung erfolgreich: ${works.length} offizielle Werke, konsistenter Index; Kunstabnahme ${release.artReview.status}, Serienfreigabe ${release.seriesAuthorized}.`,
);
