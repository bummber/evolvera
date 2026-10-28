import { z } from 'zod';
import raw from '../../config/operator.json';
export const operatorSchema = z.strictObject({
  schemaVersion: z.literal(1),
  adminOrigin: z
    .string()
    .url()
    .refine((value) => {
      try {
        const url = new URL(value);
        return url.protocol === 'https:' && url.origin === value;
      } catch {
        return false;
      }
    })
    .nullable(),
});
export const operatorSettings = operatorSchema.parse(raw);
