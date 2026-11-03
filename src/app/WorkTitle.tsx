import type { ReactNode } from 'react';
import type { Artwork } from '../art/schema/artwork';

export function WorkTitle({ work }: { work: Artwork }) {
  const fragments =
    work.schemaVersion === 2
      ? work.titleDna.parentFragments.flatMap(({ parentId, fragment }) => {
          const parent = work.parentIds.indexOf(parentId);
          return parent === 0 || parent === 1 ? [{ fragment, parent }] : [];
        })
      : [];
  // Stored fragments have no offsets. Only underline unique, non-overlapping
  // occurrences; keep every recorded attribution in the legend below.
  const candidates = fragments.flatMap(({ fragment, parent }) => {
    const value = fragment.toLocaleLowerCase('de-DE');
    const positions: number[] = [];
    for (let index = 0; index <= work.title.length - fragment.length; index++) {
      if (
        work.title
          .slice(index, index + fragment.length)
          .toLocaleLowerCase('de-DE') === value
      )
        positions.push(index);
    }
    const start = positions[0];
    return positions.length === 1 && start !== undefined
      ? [{ start, end: start + fragment.length, parent }]
      : [];
  });
  const ranges = candidates
    .filter(
      (range) =>
        !candidates.some(
          (other) =>
            other !== range &&
            other.start < range.end &&
            other.end > range.start,
        ),
    )
    .sort((a, b) => a.start - b.start);
  const title: ReactNode[] = [];
  let cursor = 0;
  for (const range of ranges) {
    title.push(work.title.slice(cursor, range.start));
    title.push(
      <span
        key={range.start}
        className={`title-fragment dna-${range.parent === 0 ? 'a' : 'b'}`}
      >
        {work.title.slice(range.start, range.end)}
      </span>,
    );
    cursor = range.end;
  }
  title.push(work.title.slice(cursor));
  return (
    <>
      <h1 className="work-title">{title}</h1>
      {fragments.length > 0 && (
        <ul className="title-dna-legend" aria-label="Titelherkunft" role="list">
          {fragments.map(({ fragment, parent }, index) => (
            <li key={index}>
              <span
                className={`dna-key dna-${parent === 0 ? 'a' : 'b'}`}
                aria-hidden="true"
              />
              „{fragment}“ von {parent === 0 ? 'A' : 'B'}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
