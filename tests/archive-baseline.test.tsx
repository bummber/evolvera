// @vitest-environment node
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ArtRenderer } from '../src/art/renderer/ArtRenderer';

// EP-01 A-36: frozen regression baseline for archived works.
//
// Listed works must keep their exact bytes and their exact renderer output.
// Works the daily workflow archives later are tolerated as long as they are
// dated after `frozenThrough`; they are unprotected until the baseline is
// extended on purpose:
//
//   ARCHIVE_BASELINE_EXTEND=1 npx vitest run tests/archive-baseline.test.tsx
//   npx playwright test tests/browser/archive-baseline.spec.ts  (new images only)
//
// Extending only appends missing works. Existing entries and reference files
// are never rewritten; a mismatch there is a finding, not something to update.
type Entry = {
  id: string;
  generation: number;
  title: string;
  path: string;
  sha256: string;
  markup: string;
};
type Manifest = { frozenThrough: string; works: Entry[] };

const archiveDir = 'public/artworks';
const baselineDir = 'tests/fixtures/archive-baseline';
const manifestPath = `${baselineDir}/manifest.json`;
const workFile = /^public\/artworks\/(\d{4})\/(\d{4}-\d{2}-\d{2})\.json$/;

const sha256 = (file: string) =>
  createHash('sha256').update(readFileSync(file)).digest('hex');
const readManifest = (): Manifest =>
  existsSync(manifestPath)
    ? (JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest)
    : { frozenThrough: '', works: [] };
const archiveFiles = () =>
  (readdirSync(archiveDir, { recursive: true }) as string[])
    .map((file) => `${archiveDir}/${file.replaceAll('\\', '/')}`)
    .filter((file) => file.endsWith('.json'))
    .sort();
const render = (file: string) => {
  const work = JSON.parse(readFileSync(file, 'utf8')) as {
    id: string;
    generation: number;
    title: string;
    rendererVersion: string;
    dna: unknown;
    description: string;
  };
  // The test runner derives the CSS module suffix from the checkout path, so
  // only the class names are compared. Attribute values are HTML-escaped,
  // which keeps this pattern from matching inside a description.
  const markup = renderToStaticMarkup(<ArtRenderer source={work} />).replace(
    /class="([^"]*)"/g,
    (_, names: string) =>
      `class="${names.replace(/_([\w-]+)_[0-9a-f]{6}(?= |$)/g, '$1')}"`,
  );
  return { work, markup };
};

if (process.env.ARCHIVE_BASELINE_EXTEND === '1') {
  const manifest = readManifest();
  const known = new Set(manifest.works.map((entry) => entry.path));
  mkdirSync(`${baselineDir}/markup`, { recursive: true });
  for (const file of archiveFiles()) {
    if (!workFile.test(file) || known.has(file)) continue;
    const { work, markup } = render(file);
    const markupPath = `${baselineDir}/markup/${work.id}.txt`;
    if (existsSync(markupPath))
      throw new Error(`Referenz existiert bereits: ${markupPath}`);
    writeFileSync(markupPath, markup);
    manifest.works.push({
      id: work.id,
      generation: work.generation,
      title: work.title,
      path: file,
      sha256: sha256(file),
      markup: markupPath,
    });
  }
  manifest.works.sort((a, b) => a.id.localeCompare(b.id));
  manifest.frozenThrough = manifest.works.at(-1)?.id ?? '';
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

const manifest = readManifest();

describe('Archiv-Baseline (EP-01 A-36)', () => {
  it('enthält die eingefrorenen Werke lückenlos und aufsteigend', () => {
    expect(manifest.works.length).toBeGreaterThanOrEqual(7);
    const ids = manifest.works.map((entry) => entry.id);
    expect(ids).toEqual([...ids].sort());
    expect(new Set(ids).size).toBe(ids.length);
    expect(manifest.frozenThrough).toBe(ids.at(-1));
    for (const entry of manifest.works)
      expect(entry.path).toBe(
        `${archiveDir}/${entry.id.slice(0, 4)}/${entry.id}.json`,
      );
  });

  it.each(manifest.works)(
    'hält $id bytegleich (SHA-256)',
    ({ path, sha256: expected }) => {
      expect(sha256(path)).toBe(expected);
    },
  );

  it.each(manifest.works)(
    'stellt $id unverändert dar (serialisierte Renderer-Ausgabe)',
    ({ path, markup }) => {
      const rendered = render(path).markup;
      expect(rendered).toContain('data-renderer="1"');
      expect(rendered).toBe(readFileSync(markup, 'utf8'));
    },
  );

  it('duldet zusätzliche Archivdateien nur als spätere Tageswerke', () => {
    const frozen = new Set(manifest.works.map((entry) => entry.path));
    for (const file of archiveFiles()) {
      if (file === `${archiveDir}/index.json` || frozen.has(file)) continue;
      const match = workFile.exec(file);
      expect(match, `Unerwartete Archivdatei: ${file}`).not.toBeNull();
      expect(match![2]!.slice(0, 4)).toBe(match![1]);
      expect(
        match![2]! > manifest.frozenThrough,
        `Nicht eingefrorenes Werk im geschützten Zeitraum: ${file}`,
      ).toBe(true);
    }
  });

  it('führt die eingefrorenen Werke unverändert im Index', () => {
    const index = JSON.parse(
      readFileSync(`${archiveDir}/index.json`, 'utf8'),
    ) as { works: { id: string; generation: number; title: string }[] };
    const frozenRows = index.works
      .filter((row) => row.id <= manifest.frozenThrough)
      .sort((a, b) => a.id.localeCompare(b.id));
    expect(frozenRows).toEqual(
      manifest.works.map(({ id, generation, title }) => ({
        id,
        generation,
        title,
      })),
    );
  });
});
