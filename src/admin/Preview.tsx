import { useEffect, useState } from 'react';
import { createPreviewChainV3 } from '../art/generator/preview-chain-v3';
import { ArtDispatch } from '../art/renderer/ArtDispatch';
import type { ArtworkV3 } from '../art/schema/artwork-v3';
import { defaultProfile } from '../art/schema/profile';
import type { Settings } from '../operator/profile-form';

// EP-01 P8: preview in the browser with the same generator and renderer as
// the series. Simulation only (A-33): no files, no archive IDs, no commits;
// the works live in this component's memory and are shown as "Probe n".

const LENGTH = 8;
/** The generator the series uses for new works (restart of 2026-11-19). */
export const PREVIEW_GENERATOR = '0.4.0';
type Probe = { work: ArtworkV3; parents: number[] };
type Result = { request: string } & (
  | { kind: 'ready'; probes: Probe[]; mean: number; standard: number | null }
  | { kind: 'failed' }
);

function chain(key: string, settings: Settings) {
  const { inheritanceMode, ...profile } = settings;
  return createPreviewChainV3({
    key,
    mode: inheritanceMode,
    length: LENGTH,
    prefix: 'evolvera:operator-preview',
    profile,
    generator: PREVIEW_GENERATOR,
  }).works;
}
/** Chain keys allow letters only: 1 → a, 26 → z, 27 → aa. */
function letters(value: number) {
  let text = '';
  for (let rest = value; rest > 0; rest = Math.floor((rest - 1) / 26))
    text = String.fromCharCode(97 + ((rest - 1) % 26)) + text;
  return text;
}
const mean = (works: ArtworkV3[]) =>
  works.reduce((sum, work) => sum + work.dna.elements.length, 0) / works.length;

export function Preview({
  settings,
  valid,
}: {
  settings: Settings;
  valid: boolean;
}) {
  const [round, setRound] = useState(1);
  const [latest, setLatest] = useState<Result | null>(null);
  const fingerprint = JSON.stringify(settings);
  const request = `${round}:${fingerprint}`;
  // A result of other settings or dice counts as still being computed.
  const result = latest?.request === request ? latest : null;

  useEffect(() => {
    if (!valid) return;
    // Short pause so that several quick changes compute only once.
    const timer = setTimeout(() => {
      const current = JSON.parse(fingerprint) as Settings;
      const key = `probe-${letters(round)}`;
      try {
        const works = chain(key, current);
        const ids = works.map((work) => work.id);
        // Comparison with the standard profile and the same dice.
        const { inheritanceMode, ...profile } = current;
        let standard: number | null = null;
        if (JSON.stringify(profile) !== JSON.stringify(defaultProfile))
          try {
            standard = mean(
              chain(key, {
                inheritanceMode,
                ...structuredClone(defaultProfile),
              }),
            );
          } catch {
            // Only a comparison; the preview itself stays valid.
          }
        setLatest({
          request: `${round}:${fingerprint}`,
          kind: 'ready',
          probes: works.map((work) => ({
            work,
            parents: work.parentIds.map((id) => ids.indexOf(id) + 1),
          })),
          mean: mean(works),
          standard,
        });
      } catch {
        setLatest({ request: `${round}:${fingerprint}`, kind: 'failed' });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [fingerprint, round, valid]);

  return (
    <section aria-labelledby="preview-title" className="preview">
      <h2 id="preview-title">Vorschau</h2>
      <p className="help">
        {LENGTH} Probewerke mit den Einstellungen oben: zwei unabhängige
        Ursprünge und ihre Nachkommen. Keine Vorhersage der Serie: Die Würfel
        sind andere, die Vorschau zeigt nur die Wirkung der Einstellungen.
        Nichts davon wird gespeichert.
      </p>
      <button type="button" onClick={() => setRound(round + 1)}>
        Neu würfeln
      </button>
      {!valid ? (
        <p className="notice">
          Keine Vorschau, solange die Einstellungen gegen eine Regel verstoßen.
        </p>
      ) : !result ? (
        <p role="status">Vorschau wird berechnet …</p>
      ) : result.kind === 'failed' ? (
        <p className="notice" role="alert">
          Der Generator fand für diese Probe kein gültiges Werk. Mit „Neu
          würfeln“ eine andere Probe versuchen; tritt das oft auf, die
          Einstellungen lockern.
        </p>
      ) : (
        <>
          <p role="status" className="mean">
            Ø {result.mean.toFixed(0)} Formen je Probewerk
            {result.standard !== null &&
              ` · Standardprofil mit denselben Würfeln: Ø ${result.standard.toFixed(0)}`}
          </p>
          <ol className="probes">
            {result.probes.map(({ work, parents }, index) => (
              <li key={work.id}>
                <ArtDispatch source={work} />
                <p>
                  <strong>Probe {index + 1}</strong> ·{' '}
                  {parents.length
                    ? `Kind von Probe ${parents.join(' und ')}`
                    : 'Ursprung'}{' '}
                  · {work.dna.elements.length} Formen
                </p>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
