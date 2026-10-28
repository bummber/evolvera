import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { family } from './fixtures/artworks';
import { WorkProvenance } from '../src/app/WorkProvenance';
import { reviewChains } from '../src/preview/review';
it('stellt alte V1-Belege für Hintergrundfarbe und Geometrie ohne falsche Einheiten dar', () => {
  const { child, a } = family();
  child.evolution.decisions.push({
    parentId: a.id,
    source: { path: 'background', value: a.dna.background },
    target: { path: 'background', value: child.dna.background },
    operation: { kind: 'copy' },
  });
  render(<WorkProvenance work={child} />);
  expect(
    screen.getByText('Elternteil A · Hintergrundfarbe #101d34 übernommen'),
  ).toBeVisible();
  expect(
    screen.getByText(
      'Elternteil B · Horizontale Position von 50 % auf 60 % verändert',
    ),
  ).toBeVisible();
  expect(document.body.textContent).not.toContain('NaN');
});
it('behauptet bei einer freien Neuschöpfung keine sichtbare Elternübernahme', () => {
  const work = reviewChains[1]!.works.find(
    (candidate) =>
      candidate.generation > 2 &&
      candidate.evolution.recipe.base.source === 'new' &&
      candidate.evolution.decisions.length === 0,
  )!;
  expect(work).toBeDefined();
  render(<WorkProvenance work={work} />);
  expect(
    screen.getByText(/Vollständige gestalterische Neuschöpfung/),
  ).toBeVisible();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});
