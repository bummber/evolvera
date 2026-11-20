import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readGenerationConfig } from '../src/art/schema/config';
import { releaseSchema, assertSeriesGate } from '../src/automation/release';
import { readArchive, indexText, indexPath } from '../src/automation/archive';
import { canonicalHistory, git } from '../src/automation/git';
import { checkFavorites } from '../src/automation/favorites';
import { operatorSchema } from '../src/operator/access';
const readJson = async (file: string) =>
  JSON.parse(await readFile(file, 'utf8')) as unknown;
const settings = readGenerationConfig(await readJson('config/generation.json'));
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
// EP-01 P7: once the art review of generator 0.3.0 is recorded, its
// acceptance works are frozen as well.
if (release.artReviewV3)
  for (const [name, file] of [
    ['standard', 'fixtures/preview/ep01-review.json'],
    ['profiles', 'fixtures/preview/ep01-review-profiles.json'],
  ] as const) {
    const digest = createHash('sha256')
      .update(await readFile(file))
      .digest('hex');
    if (digest !== release.artReviewV3.fixtureSha256[name])
      throw new Error(
        'Abgenommene Werke von Generator 0.3.0 wurden verändert. Neue Abnahme erforderlich.',
      );
  }
// Light review of generator 0.4.0 (operator decision of 2026-11-18).
if (release.artReviewV4) {
  const digest = createHash('sha256')
    .update(await readFile('fixtures/preview/review-v4.json'))
    .digest('hex');
  if (digest !== release.artReviewV4.fixtureSha256.standard)
    throw new Error(
      'Abgenommene Werke von Generator 0.4.0 wurden verändert. Neue Abnahme erforderlich.',
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
// Package B: favourites are byte copies of archived works, checked against Git.
const favoriteFiles = new Map<string, string>();
for (const file of await readdir('public/favorites', { recursive: true }))
  if (
    file.endsWith('.json') &&
    !(await stat(`public/favorites/${file}`)).isDirectory()
  )
    favoriteFiles.set(
      `public/favorites/${file}`,
      await readFile(`public/favorites/${file}`, 'utf8'),
    );
const favorites = checkFavorites(
  process.cwd(),
  git(process.cwd(), ['rev-parse', 'HEAD']).trim(),
  favoriteFiles,
);
console.log(
  `Datenprüfung erfolgreich: ${works.length} offizielle Werke, konsistenter Index, ${favorites.favorites.length} Favoriten; Kunstabnahme ${release.artReview.status}, Serienfreigabe ${release.seriesAuthorized}.`,
);
