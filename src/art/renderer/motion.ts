import { dnaSchema } from '../schema/artwork';
import { dnaV3Schema } from '../schema/artwork-v3';

/** Whether stored DNA of either renderer version contains a moving element. */
export function hasMotion(source: { rendererVersion: string; dna: unknown }) {
  const parsed =
    source.rendererVersion === '2'
      ? dnaV3Schema.safeParse(source.dna)
      : dnaSchema.safeParse(source.dna);
  return (
    parsed.success &&
    parsed.data.elements.some((element) => element.motion.kind !== 'static')
  );
}
