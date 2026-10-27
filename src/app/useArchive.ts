import { useEffect, useState } from 'react';
import { loadArchiveIndex } from '../archive';
import type { ArchiveIndex } from '../archive';

type ArchiveState =
  | { status: 'loading' }
  | { status: 'ready'; index: ArchiveIndex }
  | { status: 'error' };

export function useArchive(): ArchiveState {
  const [state, setState] = useState<ArchiveState>({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    loadArchiveIndex(controller.signal).then(
      (index) => {
        if (!controller.signal.aborted) setState({ status: 'ready', index });
      },
      () => {
        if (!controller.signal.aborted) setState({ status: 'error' });
      },
    );
    return () => controller.abort();
  }, []);
  return state;
}
