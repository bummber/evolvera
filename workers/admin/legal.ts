import { publicationIssues } from '../../src/site/legal';
import type { LegalDetails } from '../../src/site/legal';
import type { OperatorPrivacy } from '../../src/site/operator-privacy';
import { operatorPrivacySections } from '../../src/site/operator-privacy-content';

export type PrivacyPolicy = { legal: LegalDetails; review: OperatorPrivacy };
export const escapeHtml = (value: unknown) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ]!,
  );

export function workerPublicationIssues(
  policy: PrivacyPolicy,
  adminOrigin: string,
) {
  const issues = publicationIssues(policy.legal, adminOrigin, policy.review);
  if (policy.legal.privacyScope !== 'pages-and-operator' && !adminOrigin)
    issues.push(
      'Datenschutzhinweise für die eingerichtete Betreiberanmeldung ergänzen.',
    );
  return issues;
}

export function legalPage(
  policy: PrivacyPolicy,
  view: 'privacy' | 'imprint',
  adminOrigin: string,
) {
  const { legal, review } = policy;
  const issues = workerPublicationIssues(policy, adminOrigin);
  const address = legal.address;
  const contact = `<address>${escapeHtml(legal.fullName ?? 'Betreibername noch offen')}<br>${address ? `${escapeHtml(address.street)}<br>${escapeHtml(address.postalCode)} ${escapeHtml(address.city)}` : 'Ladungsfähige Anschrift noch offen'}<br>Deutschland<br>${legal.email ? `<a href="mailto:${escapeHtml(legal.email)}">${escapeHtml(legal.email)}</a>` : 'E-Mail noch offen'}</address>`;
  const notice = issues.length
    ? `<aside class="notice" aria-label="Entwurfsstatus"><strong>Entwurf · noch nicht zur Veröffentlichung freigegeben</strong><ul>${issues.map((issue) => `<li>${escapeHtml(issue)}</li>`).join('')}</ul></aside>`
    : '';
  const sections =
    view === 'privacy'
      ? operatorPrivacySections(review.adminOrigin)
          .map(
            (section) =>
              `<section><h2>${escapeHtml(section.title)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}${section.links ? `<ul>${section.links.map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`).join('')}</ul>` : ''}</section>`,
          )
          .join('') +
        '<section><h2>Deine Rechte</h2><p>Unter den gesetzlichen Voraussetzungen hast du Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Einer Verarbeitung aufgrund berechtigter Interessen kannst du aus Gründen deiner besonderen Situation widersprechen. Nutze den oben genannten Kontakt. Du kannst dich bei einer Datenschutzaufsichtsbehörde beschweren; für den Betreiber im Saarland ist das <a href="https://www.datenschutz.saarland.de/">Unabhängige Datenschutzzentrum Saarland</a> zuständig.</p><p><a href="https://bummber.github.io/evolvera/#/datenschutz">Vollständige Datenschutzerklärung der Galerie mit Hosting- und Kontakthinweisen</a></p></section>'
      : '<p>Evolvera ist ein nichtkommerzielles Kunstprojekt aus Deutschland. Die abstrakten Werke entstehen algorithmisch aus HTML und CSS. Mit dem Projekt werden keine Einnahmen erzielt.</p>';
  return `<h1>${view === 'privacy' ? 'Datenschutz' : 'Impressum'}</h1>${notice}<h2>${view === 'privacy' ? 'Verantwortlich für diesen Betreiberbereich' : 'Anbieter'}</h2>${contact}${sections}`;
}
