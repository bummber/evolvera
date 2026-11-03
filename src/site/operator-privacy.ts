import { z } from 'zod';
import raw from '../../config/operator-privacy.json';

export const operatorPrivacyVersion = '2026-11-03.1';
export const operatorPrivacySchema = z.strictObject({
  schemaVersion: z.literal(1),
  adminOrigin: z.url().refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.origin === value;
    } catch {
      return false;
    }
  }),
  reviewedOn: z.iso.date().nullable(),
  reviewedVersion: z.string().min(1).max(80).nullable(),
  providerReviewedOn: z.iso.date().nullable(),
});
export type OperatorPrivacy = z.infer<typeof operatorPrivacySchema>;
export const operatorPrivacy = operatorPrivacySchema.parse(raw);

export function operatorPrivacyIssues(
  review: OperatorPrivacy,
  adminOrigin: string,
): string[] {
  const issues: string[] = [];
  if (review.adminOrigin !== adminOrigin)
    issues.push('Datenschutzdurchsicht gilt nicht für diese Betreiberadresse.');
  if (!review.reviewedOn || review.reviewedVersion !== operatorPrivacyVersion)
    issues.push('Eigenständige Textdurchsicht der Betreiberanmeldung offen.');
  if (!review.providerReviewedOn)
    issues.push('Cloudflare-Vertrag und Kontoeinstellungen noch zu prüfen.');
  return issues;
}
