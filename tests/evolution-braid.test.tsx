import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import { EvolutionBraid } from '../src/app/EvolutionBraid';
import { createReader } from '../src/archive/reader';
import { reviewChains } from '../src/preview/review';

const works = reviewChains[0]!.works;
const reader = createReader(
  'traceable',
  {
    schemaVersion: 1,
    works: works
      .toReversed()
      .map(({ id, generation, title }) => ({ id, generation, title })),
  },
  async () => undefined,
);

it('behält Eltern-IDs als A/B-Quelle, auch wenn die Vorschauen umgekehrt eintreffen', () => {
  const work = works[2]!;
  render(
    <MemoryRouter>
      <EvolutionBraid
        reader={reader}
        work={work}
        parents={[works[1]!, works[0]!]}
      />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole('link', { name: /^Elternteil A · Generation 1:/ }),
  ).toHaveAttribute('href', `/werk/${work.parentIds[0]}?sammlung=traceable`);
  expect(
    screen.getByRole('link', { name: /^Elternteil B · Generation 2:/ }),
  ).toHaveAttribute('href', `/werk/${work.parentIds[1]}?sammlung=traceable`);
  expect(
    screen.getByRole('link', { name: /^Ausgewähltes Werk · Generation 3:/ }),
  ).toHaveAttribute('aria-current', 'true');
  const list = screen
    .getByRole('region', { name: 'Abstammung des ausgewählten Werks' })
    .querySelector('ol')!;
  expect(
    [...list.querySelectorAll('time')].map((node) =>
      node.getAttribute('datetime'),
    ),
  ).toEqual([work.id, works[1]!.id, works[0]!.id]);
});

it('zeichnet bei Generation 2 keine Beziehung zu Generation 1', () => {
  const { container } = render(
    <MemoryRouter>
      <EvolutionBraid reader={reader} work={works[1]!} parents={[]} />
    </MemoryRouter>,
  );
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(container.querySelectorAll('.lineage-edge')).toHaveLength(0);
  expect(screen.getByText(/Dieses Werk hat keine Eltern/)).toBeVisible();
});
