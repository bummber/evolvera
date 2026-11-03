import type { PrivacyPolicy } from '../../workers/admin/legal';
import { operatorPrivacyVersion } from '../../src/site/operator-privacy';

export const readyPolicy: PrivacyPolicy = {
  legal: {
    schemaVersion: 1,
    country: 'DE',
    purpose: 'noncommercial-art',
    fullName: 'Testperson Beispiel',
    email: 'kontakt@example.test',
    address: { street: 'Teststraße 1', postalCode: '12345', city: 'Testort' },
    privacyScope: 'pages-and-operator',
    reviewedOn: '2026-11-02',
  },
  review: {
    schemaVersion: 1,
    adminOrigin: 'https://admin.example.test',
    reviewedOn: '2026-11-03',
    reviewedVersion: operatorPrivacyVersion,
    providerReviewedOn: '2026-11-03',
  },
};
