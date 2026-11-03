import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { WorkTitle } from '../src/app/WorkTitle';
import { reviewChains } from '../src/preview/review';
import { family } from './fixtures/artworks';

const child = reviewChains[0]!.works[2]!;

it('erhält den exakten Werktitel und ordnet gespeicherte Fragmente über Eltern-IDs zu', () => {
  const { container } = render(<WorkTitle work={child} />);
  const title = screen.getByRole('heading', { level: 1 });
  expect(title.textContent).toBe(child.title);
  expect(title.querySelector('.dna-a')).toHaveTextContent('Ch');
  expect(title.querySelector('.dna-b')).toHaveTextContent('mir');
  expect(container.querySelector('.title-dna-legend')).toHaveTextContent(
    '„Ch“ von A„Mir“ von B',
  );
});

it('lässt eine mehrfach vorkommende Fundstelle unmarkiert und behält die gespeicherte Legende', () => {
  const work = structuredClone(child);
  work.title = 'Ch-Ch-Mir';
  render(<WorkTitle work={work} />);
  const title = screen.getByRole('heading', { level: 1 });
  expect(title.textContent).toBe(work.title);
  expect(title.querySelector('.dna-a')).toBeNull();
  expect(title.querySelector('.dna-b')).toHaveTextContent('Mir');
  expect(screen.getByRole('list', { name: 'Titelherkunft' })).toHaveTextContent(
    '„Ch“ von A',
  );
});

it('rät bei sich überlappenden Fragmenten keine Titelbereiche', () => {
  const work = structuredClone(child);
  work.titleDna.parentFragments[0]!.fragment = 'Chm';
  work.titleDna.parentFragments[1]!.fragment = 'hmi';
  render(<WorkTitle work={work} />);
  const title = screen.getByRole('heading', { level: 1 });
  expect(title.textContent).toBe(work.title);
  expect(title.querySelectorAll('.title-fragment')).toHaveLength(0);
  expect(screen.getByRole('list', { name: 'Titelherkunft' })).toBeVisible();
});

it('ergänzt bei Ursprung und historischem V1-Werk keine Titelherkunft', () => {
  const { rerender } = render(<WorkTitle work={reviewChains[0]!.works[0]!} />);
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
  const work = family().child;
  rerender(<WorkTitle work={work} />);
  expect(screen.getByRole('heading').textContent).toBe(work.title);
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});
