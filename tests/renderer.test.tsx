import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArtRenderer } from '../src/art/renderer/ArtRenderer';
import { ArtStage } from '../src/art/renderer/ArtStage';
import { generateStudy } from '../src/art/generator/study';
import { renderToStaticMarkup } from 'react-dom/server';
import userEvent from '@testing-library/user-event';

const source = generateStudy({
  family: 'geometric',
  seed: 'evolvera:phase-1:1',
});
describe('Renderer V1', () => {
  it('stellt nur gespeicherte DNA dar und hält Vorschauen im Ruhezustand', () => {
    const { container } = render(
      <ArtRenderer source={source} presentation="rest" playback="playing" />,
    );
    expect(screen.getByRole('img')).toHaveAccessibleName(source.description);
    expect(screen.getByRole('img')).toHaveAttribute('data-state', 'rest');
    expect(container.querySelectorAll('[data-art-element]')).toHaveLength(
      source.dna.elements.length,
    );
    expect(container.querySelector('img,svg,canvas,script,iframe')).toBeNull();
    expect(container.querySelector('[data-art-element]')).toHaveStyle({
      left: `${source.dna.elements[0]!.x * 1000}px`,
    });
  });
  it('bleibt für dieselben Parameter stabil und lässt HTML-ähnliche Beschreibungen Text sein', () => {
    const input = { ...source, description: '<img src=x onerror=alert(1)>' };
    const markup = renderToStaticMarkup(<ArtRenderer source={input} />);
    expect(markup).toBe(renderToStaticMarkup(<ArtRenderer source={input} />));
    expect(markup).not.toContain('<img');
    expect(markup).toContain('&lt;img');
  });
  it.each([
    { ...source, rendererVersion: '999' },
    {
      ...source,
      dna: { ...source.dna, background: 'url(https://example.com/x)' },
    },
  ])('stoppt bei ungültigen Eingaben und unbekannter Version', (input) => {
    const { container } = render(<ArtRenderer source={input} />);
    expect(screen.getByRole('alert')).toBeVisible();
    expect(container.querySelector('[data-art-element]')).toBeNull();
  });
  it('startet bei unbekannter/reduzierter Bewegung statisch und erlaubt explizites Abspielen und Pausieren', async () => {
    render(<ArtStage source={source} />);
    expect(screen.getByRole('img')).toHaveAttribute('data-state', 'rest');
    await userEvent.click(
      screen.getByRole('button', { name: 'Animation abspielen' }),
    );
    expect(screen.getByRole('img')).toHaveAttribute('data-state', 'playing');
    expect(screen.getByRole('img')).toHaveAttribute('data-opt-in', 'true');
    await userEvent.click(
      screen.getByRole('button', { name: 'Animation pausieren' }),
    );
    expect(screen.getByRole('img')).toHaveAttribute('data-state', 'paused');
  });
  it('bietet bei statischer DNA keinen vorgetäuschten Animationsschalter', () => {
    render(
      <ArtStage
        source={generateStudy({ family: 'color-field', seed: 'ruhig' })}
      />,
    );
    expect(screen.getByText('Statische Komposition')).toBeVisible();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
