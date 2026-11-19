import {
  contrastLabels,
  familyLabels,
  featureLabels,
  frequencyLabels,
  intensityLabels,
  strategyLabels,
  strengthLabels,
} from '../app/work-labels';
import { defaultProfile } from '../art/schema/profile';
import {
  densityOptions,
  layerOptions,
  modeOptions,
} from '../operator/profile-form';

// EP-01 P8: the switches of the operator page in seven sections, each with
// one sentence on what it does. View only; values come from the shared schema.

export type ChoiceField = {
  kind: 'choice';
  path: string;
  label: string;
  help: string;
  options: Record<string, string>;
  numeric?: boolean;
};
export type ListField = {
  kind: 'list';
  path: string;
  label: string;
  help: string;
  options: Record<string, string>;
};
export type NumberField = {
  kind: 'number';
  path: string;
  label: string;
  help: string;
  min: number;
  max: number;
};
export type ToggleField = {
  kind: 'toggle';
  path: string;
  label: string;
  help: string;
};
export type Field = ChoiceField | ListField | NumberField | ToggleField;
export type Section = { id: string; title: string; fields: Field[] };

const frequency = (key: keyof typeof featureLabels, help: string): Field => ({
  kind: 'choice',
  path: `features.${key}`,
  label: featureLabels[key],
  help,
  options: frequencyLabels,
});

export const sections: Section[] = [
  {
    id: 'composition',
    title: 'Komposition',
    fields: [
      {
        kind: 'choice',
        path: 'composition.density',
        label: 'Dichte',
        help: 'Sparsam baut Werke mit weniger Formen, dicht mit mehr. Vererbt werden nur einzelne Eigenschaften, deshalb wirkt das ab dem nächsten Werk; in Simulationen lagen die Werke sparsam etwa 20 Prozent unter, dicht etwa 15 bis 20 Prozent über dem Standard.',
        options: densityOptions,
      },
      {
        kind: 'choice',
        path: 'composition.maxLayers',
        label: 'Höchste Ebenenzahl',
        help: 'Höchstens so viele Ebenen (Hintergrund, Struktur, Akzent) hat ein Werk; das ändert vor allem den Aufbau. Weniger Ebenen ergeben etwas weniger Formen (in Simulationen mit 2 Ebenen etwa 8 Prozent), stärker wirkt die Dichte. Nachvollziehbare Vererbung braucht mindestens 2 Ebenen.',
        options: layerOptions,
        numeric: true,
      },
      {
        kind: 'choice',
        path: 'composition.symmetry',
        label: 'Symmetrie',
        help: 'Wie oft eine neue Ebene spiegelbildlich aufgebaut wird.',
        options: frequencyLabels,
      },
    ],
  },
  {
    id: 'evolution',
    title: 'Evolution',
    fields: [
      {
        kind: 'choice',
        path: 'inheritanceMode',
        label: 'Vererbungsmodus',
        help: 'Ein Kind übernimmt von jedem Elternteil höchstens drei Eigenschaften (Farbe, Form oder Familie einer Ebene), alles andere entsteht neu. Nachvollziehbar: von jedem Elternteil mindestens eine, sichtbar. Frei: auch keine; etwa jedes vierzehnte Kind entsteht ganz neu.',
        options: modeOptions,
      },
      {
        kind: 'choice',
        path: 'variation.mutationStrength',
        label: 'Mutationsstärke',
        help: 'Wie weit sich ein Kind in Farben, Maßen und Lage von seinen Eltern entfernt.',
        options: strengthLabels,
      },
      {
        kind: 'number',
        path: 'variation.noveltyWindow',
        label: 'Ähnlichkeitsfenster',
        help: 'Mit wie vielen vorherigen Werken (1 bis 30) ein neues Werk verglichen wird, damit es sich genug unterscheidet.',
        min: 1,
        max: 30,
      },
    ],
  },
  {
    id: 'forms',
    title: 'Formen',
    fields: [
      {
        kind: 'list',
        path: 'families',
        label: 'Kompositionsfamilien',
        help: 'Welche Familien neue Ebenen aufbauen dürfen; mindestens eine bleibt aktiv.',
        options: Object.fromEntries(
          Object.keys(defaultProfile.families).map((key) => [
            key,
            familyLabels[key]!,
          ]),
        ),
      },
      frequency('lines', 'Wie oft gerade Linien vorkommen.'),
      frequency('curves', 'Wie oft Bögen, Ringe und Kurven vorkommen.'),
      frequency(
        'generativeShapes',
        'Wie oft regelbasiert erzeugte Formen vorkommen.',
      ),
    ],
  },
  {
    id: 'surface',
    title: 'Oberfläche',
    fields: [
      frequency(
        'gradients',
        'Wie oft Flächen mit einem Farbverlauf statt einer Vollfarbe gefüllt werden.',
      ),
      frequency('patterns', 'Wie oft Flächen ein Muster tragen.'),
      frequency('masks', 'Wie oft Formen teilweise ausgeblendet werden.'),
      frequency(
        'blendModes',
        'Wie oft sich Formen über Mischmodi farbig überlagern.',
      ),
      frequency(
        'blurShadow',
        'Wie oft Formen Schatten oder Unschärfe bekommen.',
      ),
    ],
  },
  {
    id: 'color',
    title: 'Farbe',
    fields: [
      {
        kind: 'list',
        path: 'palette.strategies',
        label: 'Palettenstrategien',
        help: 'Nach welchen Regeln neue Paletten entstehen; mindestens eine bleibt aktiv.',
        options: strategyLabels,
      },
      {
        kind: 'choice',
        path: 'palette.contrast',
        label: 'Kontrast',
        help: 'Wie stark sich die Farben einer neuen Palette voneinander abheben.',
        options: contrastLabels,
      },
    ],
  },
  {
    id: 'motion',
    title: 'Bewegung',
    fields: [
      frequency('animation', 'Wie oft Werke bewegte Formen enthalten.'),
      {
        kind: 'choice',
        path: 'motion.intensity',
        label: 'Bewegungsstärke',
        help: 'Wie deutlich sich bewegte Formen bewegen.',
        options: intensityLabels,
      },
    ],
  },
  {
    id: 'experimental',
    title: 'Experimente',
    fields: [
      {
        kind: 'toggle',
        path: 'experimental.mutationJumps',
        label: 'Mutationssprünge',
        help: 'Bei etwa jedem zehnten Kind ein Sprung: eine neue Palette und eine Ebene aus einer Familie, die keiner der Eltern hatte.',
      },
    ],
  },
];
