import type { ReactNode } from 'react';

/** Shell decoration only: the supplied stage and its renderer stay unchanged. */
export function StageFrame({
  generation,
  children,
}: {
  generation?: number;
  children: ReactNode;
}) {
  return (
    <div className="stage-frame">
      <div className="stage-frame-marks" aria-hidden="true">
        <span className="cut-mark cut-top-left" />
        <span className="cut-mark cut-top-right" />
        <span className="cut-mark cut-bottom-left" />
        <span className="cut-mark cut-bottom-right" />
        {generation !== undefined && (
          <span className="generation-sticker">
            <span>Gen.</span>
            <strong>{String(generation).padStart(3, '0')}</strong>
          </span>
        )}
        <span className="stage-material">
          {generation === undefined ? 'Leere Kunstbühne' : 'Nur HTML + CSS'}
        </span>
      </div>
      {children}
    </div>
  );
}
