import type { AnyArtwork } from '../art/schema/artwork-v3';
import { modeLabels } from '../art/schema/config';
import { familyKeys } from '../art/schema/profile';
import {
  contrastLabels,
  densityLabels,
  familyLabels,
  featureLabels,
  frequencyLabels,
  intensityLabels,
  strategyLabels,
  strengthLabels,
} from './work-labels';

const decimal = (value: number) =>
  value.toLocaleString('de-DE', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

/**
 * Historical frame of a work, read from its own stored snapshot (EP-01 P6).
 * Older works have no such snapshot: nothing is invented for them.
 */
export function WorkConditions({ work }: { work: AnyArtwork }) {
  if (work.schemaVersion !== 3)
    return (
      <details className="work-conditions">
        <summary>Rahmenbedingungen ansehen</summary>
        <dl>
          <div>
            <dt>Evolution</dt>
            <dd>
              {modeLabels[work.inheritanceMode]} · Revision{' '}
              {work.settingsRevision}
            </dd>
          </div>
        </dl>
        <p>
          Weitere Rahmenbedingungen sind in dieser Version nicht gespeichert.
        </p>
      </details>
    );
  const { settings, novelty } = work;
  const level = (name: keyof typeof featureLabels) =>
    `${featureLabels[name]}: ${frequencyLabels[settings.features[name]]}`;
  const families = familyKeys.filter((key) => settings.families[key]);
  return (
    <details className="work-conditions">
      <summary>Rahmenbedingungen ansehen</summary>
      <p>
        Gespeicherte Einstellungen des Laufs, der dieses Werk erzeugt hat.
        Spätere Änderungen wirken nicht zurück.
      </p>
      <dl>
        <div>
          <dt>Evolution</dt>
          <dd>
            {modeLabels[settings.inheritanceMode]} · Revision{' '}
            {work.settingsRevision}
            <br />
            Mutationsstärke:{' '}
            {strengthLabels[settings.variation.mutationStrength]}
            <br />
            Ähnlichkeitsfenster: {settings.variation.noveltyWindow} Werke
          </dd>
        </div>
        <div>
          <dt>Formen</dt>
          <dd>
            {level('lines')}
            <br />
            {level('curves')}
            <br />
            {level('generativeShapes')}
          </dd>
        </div>
        <div>
          <dt>Oberfläche</dt>
          <dd>
            {level('gradients')}
            <br />
            {level('patterns')}
            <br />
            {level('masks')}
            <br />
            {level('blendModes')}
            <br />
            {level('blurShadow')}
          </dd>
        </div>
        <div>
          <dt>Farbe</dt>
          <dd>
            Strategien:{' '}
            {settings.palette.strategies
              .map((strategy) => strategyLabels[strategy])
              .join(', ')}
            <br />
            Kontrast: {contrastLabels[settings.palette.contrast]}
          </dd>
        </div>
        <div>
          <dt>Komposition</dt>
          <dd>
            Familien ({families.length} von {familyKeys.length}):{' '}
            {families.map((key) => familyLabels[key]).join(', ')}
            <br />
            Höchstens {settings.composition.maxLayers}{' '}
            {settings.composition.maxLayers === 1 ? 'Ebene' : 'Ebenen'}
            <br />
            Symmetrie: {frequencyLabels[settings.composition.symmetry]}
            <br />
            Dichte: {densityLabels[settings.composition.density]}
          </dd>
        </div>
        <div>
          <dt>Bewegung</dt>
          <dd>
            Häufigkeit: {frequencyLabels[settings.features.animation]}
            <br />
            Intensität: {intensityLabels[settings.motion.intensity]}
          </dd>
        </div>
        <div>
          <dt>Experimente</dt>
          <dd>
            Mutationssprünge:{' '}
            {settings.experimental.mutationJumps ? 'An' : 'Aus'}
          </dd>
        </div>
        <div>
          <dt>Ähnlichkeitsprüfung</dt>
          <dd>
            {novelty.distance === null ? (
              'Kein Vergleichswerk: erstes Werk der Kette.'
            ) : (
              <>
                Abstand zum Fenster: {decimal(novelty.distance)} (Abstandsmaß
                Version {novelty.distanceVersion})
                <br />
                {novelty.minimumReached ? (
                  'Mindestabstand erreicht'
                ) : (
                  <strong>Mindestabstand nicht erreicht</strong>
                )}
              </>
            )}
          </dd>
        </div>
      </dl>
    </details>
  );
}
