import { legalDetails, publicationIssues } from '../site/legal';
import { operatorSettings } from '../operator/access';

function Contact() {
  const { fullName, address, email } = legalDetails;
  return (
    <address className="legal-contact">
      <span>{fullName ?? 'Betreibername noch offen'}</span>
      {address ? (
        <>
          <span>{address.street}</span>
          <span>
            {address.postalCode} {address.city}
          </span>
        </>
      ) : (
        <span>Ladungsfähige Anschrift noch offen</span>
      )}
      <span>Deutschland</span>
      {email ? (
        <a href={`mailto:${email}`}>{email}</a>
      ) : (
        <span>E-Mail noch offen</span>
      )}
    </address>
  );
}

export default function LegalPages({ view }: { view: 'imprint' | 'privacy' }) {
  const issues = publicationIssues(legalDetails, operatorSettings.adminOrigin);
  return (
    <>
      <p className="eyebrow">Evolvera · Informationen</p>
      <h1>{view === 'imprint' ? 'Impressum' : 'Datenschutz'}</h1>
      {issues.length > 0 && (
        <aside className="notice" aria-label="Entwurfsstatus">
          <strong>Entwurf · noch nicht zur Veröffentlichung freigegeben</strong>
          <ul>
            {issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </aside>
      )}
      <div className="reading legal-reading">
        <section>
          <h2>
            {view === 'imprint'
              ? 'Anbieter'
              : 'Verantwortlich für diese Website'}
          </h2>
          <Contact />
        </section>
        {view === 'imprint' ? (
          <section>
            <h2>Über dieses Angebot</h2>
            <p>
              Evolvera ist ein nichtkommerzielles Kunstprojekt aus Deutschland.
              Es entstehen algorithmisch erzeugte abstrakte Werke aus HTML und
              CSS. Mit dem Projekt werden keine Einnahmen erzielt.
            </p>
          </section>
        ) : (
          <>
            <section>
              <h2>Die öffentliche Galerie</h2>
              <p>
                Die Galerie ist ohne Anmeldung nutzbar. Die App verwendet keine
                Analyse- oder Werbedienste, keine extern geladenen Schriftarten
                und keine eingebetteten Medien anderer Anbieter. Sie setzt keine
                eigenen Cookies und speichert keine Besucherprofile in
                localStorage oder sessionStorage. Die Kunst wird im Browser aus
                gespeicherten Werkdaten dargestellt. Auch Eingaben im
                Testatelier werden nur dort verarbeitet und nicht an den
                Betreiber gesendet.
              </p>
            </section>
            <section>
              <h2>Bereitstellung über GitHub Pages</h2>
              <p>
                Für die öffentliche Bereitstellung wird GitHub Pages genutzt,
                ein Dienst von GitHub. Beim Seitenabruf werden technisch
                notwendige Verbindungsdaten an GitHub übermittelt. GitHub
                dokumentiert, dass IP-Adressen der Besuchenden zu
                Sicherheitszwecken protokolliert und gespeichert werden, auch
                ohne GitHub-Anmeldung.
              </p>
              <p>
                Zweck ist die Auslieferung und der sichere Betrieb der Galerie.
                Soweit der Betreiber dabei personenbezogene Daten verarbeitet,
                stützt er dies auf Art. 6 Abs. 1 lit. f DSGVO: das berechtigte
                Interesse an einer technisch zuverlässigen und sicheren
                Bereitstellung des Kunstprojekts. GitHub beschreibt eigene
                Verarbeitungsvorgänge und Rechtsgrundlagen in seiner
                Datenschutzerklärung.
              </p>
              <p>
                GitHub nennt keine feste, speziell für Pages geltende
                Aufbewahrungsdauer der IP-Protokolle. Die Dauer richtet sich
                nach dem Verarbeitungszweck und gesetzlichen Anforderungen. Der
                Betreiber erhält über diese App keine Besucherstatistik und
                führt keine eigenen Zugriffsprotokolle. GitHub verarbeitet Daten
                auch in den USA und anderen Ländern. Informationen zu
                Empfängern, internationalen Übermittlungen und Schutzmechanismen
                stehen in der{' '}
                <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
                  Datenschutzerklärung von GitHub
                </a>
                . Anbieteranschriften: GitHub B.V., Prins Bernhardplein 200,
                1097JB Amsterdam, Niederlande, und GitHub, Inc., 88 Colin P.
                Kelly Jr. St., San Francisco, CA 94107, USA.
              </p>
              <p>
                <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection">
                  Hinweise von GitHub zur Datenerfassung bei Pages
                </a>
              </p>
            </section>
            <section>
              <h2>Kontakt per E-Mail</h2>
              <p>
                Wenn du die Kontaktadresse anschreibst, verarbeitet der
                Betreiber deine E-Mail-Adresse, den Nachrichteninhalt und
                gegebenenfalls mitgesendete Angaben zur Bearbeitung deiner
                Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; das
                berechtigte Interesse liegt in der Beantwortung von Fragen zum
                Projekt. Angaben sind freiwillig. Ohne eine erreichbare
                Absenderadresse ist eine Antwort nicht möglich.
              </p>
              <p>
                Das Kontaktpostfach wird bei Proton Mail geführt (Proton AG,
                Route de la Galaise 32, 1228 Plan-les-Ouates, Schweiz). Proton
                verarbeitet Nachrichten und technische Daten für den
                Mailbetrieb. Die Schweiz verfügt über einen{' '}
                <a href="https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en">
                  Angemessenheitsbeschluss der Europäischen Kommission
                </a>
                . Einzelheiten enthält die{' '}
                <a href="https://proton.me/legal/privacy">
                  Datenschutzerklärung von Proton
                </a>
                . Nachrichten werden nach abschließender Bearbeitung gelöscht,
                sobald sie für die Kommunikation und etwaige gesetzliche
                Pflichten oder Rechtsansprüche nicht mehr benötigt werden.
              </p>
            </section>
            <section>
              <h2>Deine Rechte</h2>
              <p>
                Unter den gesetzlichen Voraussetzungen hast du Rechte auf
                Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung
                und Datenübertragbarkeit. Du kannst einer auf berechtigte
                Interessen gestützten Verarbeitung aus Gründen deiner besonderen
                Situation widersprechen. Wende dich hierzu an den oben genannten
                Kontakt. Du kannst dich außerdem bei einer
                Datenschutzaufsichtsbehörde beschweren, insbesondere an deinem
                Wohnort. Für den Betreiber im Saarland ist das{' '}
                <a href="https://www.datenschutz.saarland.de/">
                  Unabhängige Datenschutzzentrum Saarland
                </a>{' '}
                zuständig. Soweit GitHub Daten in eigener Verantwortung
                verarbeitet, findest du Kontaktmöglichkeiten und Rechte in
                dessen Datenschutzerklärung.
              </p>
            </section>
            <section>
              <h2>Externe Links und Betreiberanmeldung</h2>
              <p>
                Externe Seiten werden durch Links nicht automatisch geladen.
                Folgst du einem Link, gelten dort die Datenschutzinformationen
                des jeweiligen Angebots. Die spätere
                GitHub-/Cloudflare-Anmeldung ist ausschließlich für den
                Betreiber vorgesehen und derzeit nicht eingerichtet. Vor ihrer
                Aktivierung werden diese Hinweise um die tatsächlichen
                Datenflüsse und Sitzungscookies ergänzt.
              </p>
            </section>
            <section>
              <h2>Stand</h2>
              <p>
                2. November 2026 · öffentliche Galerie ohne Betreiberanmeldung.
              </p>
            </section>
          </>
        )}
      </div>
    </>
  );
}
