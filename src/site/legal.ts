import { z } from 'zod';
import raw from '../../config/legal.json';

const text = z.string().trim().min(1).max(160);
export const legalSchema = z.strictObject({
  schemaVersion: z.literal(1),
  country: z.literal('DE'),
  purpose: z.literal('noncommercial-art'),
  fullName: text.nullable(),
  email: z.email().max(254).nullable(),
  address: z
    .strictObject({
      street: text,
      postalCode: z.string().regex(/^\d{5}$/),
      city: text,
    })
    .nullable(),
  privacyScope: z.literal('pages-only'),
  reviewedOn: z.iso.date().nullable(),
});
export type LegalDetails = z.infer<typeof legalSchema>;
export const legalDetails = legalSchema.parse(raw);

// Technical readiness only; this does not certify legal completeness or accuracy.
export function publicationIssues(
  details: LegalDetails,
  adminOrigin: string | null,
): string[] {
  const issues: string[] = [];
  if (!details.fullName) issues.push('Betreibername fehlt.');
  if (!details.email) issues.push('Kontakt-E-Mail fehlt.');
  if (!details.address) issues.push('Ladungsfähige Anschrift fehlt.');
  if (!details.reviewedOn)
    issues.push('Textdurchsicht vor Veröffentlichung offen.');
  if (adminOrigin)
    issues.push(
      'Datenschutzhinweise für die eingerichtete Betreiberanmeldung ergänzen.',
    );
  return issues;
}
