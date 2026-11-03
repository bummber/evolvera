// Shared plain text: rendered by React and escaped by the separate Worker UI.
// Bump operatorPrivacyVersion when changing the reviewed text or its data flow.
export function operatorPrivacySections(adminOrigin: string) {
  return [
    {
      title: 'Betreiberbereich und GitHub-Anmeldung',
      paragraphs: [
        `Der Betreiberbereich ist für ${adminOrigin} vorgesehen. Die öffentliche Galerie bleibt ohne Anmeldung nutzbar und ruft den Worker nicht automatisch auf. Nur der Betreiber meldet sich zur Verwaltung an; andere GitHub-Konten erhalten keinen Zugang.`,
        'Beim Öffnen des Betreiberbereichs erhält Cloudflare technische Verbindungsdaten, insbesondere IP-Adresse und HTTP-Metadaten. Für die Anmeldung wechselt der Browser zu GitHub. Ein kurzlebiger Code wird serverseitig gegen ein User-Token getauscht; der Worker übernimmt aus dem GitHub-Profil ausschließlich die numerische Konto-ID zur Berechtigungsprüfung. Dein GitHub-Passwort erhält Evolvera nicht.',
        'Zweck ist der geschützte Zugang und das sichere Speichern des Vererbungsmodus für zukünftige Generierungen. Rechtsgrundlage für die Verarbeitung durch den Betreiber ist Art. 6 Abs. 1 lit. f DSGVO: das berechtigte Interesse an der sicheren Verwaltung des Kunstprojekts. Ohne die erforderlichen Anmeldedaten funktioniert die Betreiberanmeldung nicht. Der Galeriebesuch bleibt möglich.',
      ],
    },
    {
      title: 'Erforderliche Cookies und Sitzungsdaten',
      paragraphs: [
        '__Host-evolvera-login bindet den ausdrücklich gestarteten Anmeldevorgang für höchstens zehn Minuten an den Browser. __Host-evolvera-session enthält eine zufällige Sitzungskennung und ist höchstens eine Stunde gültig. Beide Cookies gelten nur auf der Worker-Adresse und sind Secure, HttpOnly und SameSite=Lax. Sie enthalten keine GitHub-Tokens. Es gibt keine gleitende Sitzungsverlängerung.',
        'Die Cookies dienen ausschließlich der angeforderten Anmeldung und Sitzung. Für diese technisch erforderliche Funktion wird § 25 Abs. 2 Nr. 2 TDDDG zugrunde gelegt. Eine Nutzung zur Analyse oder Werbung ist nicht vorgesehen. Die Betreiberanmeldung verwendet Top-Level-Navigation und benötigt keine Drittanbieter-Cookies.',
        'State und PKCE-Verifier liegen für höchstens zehn Minuten verwendbar in Cloudflares SQLite-Durable-Objects. Die Sitzung enthält Betreiber-ID, CSRF-Wert und Ablaufzeit und ist absolut eine Stunde verwendbar. Beim erfolgreichen Login wird das Login-Cookie entfernt; beim Abmelden werden Sitzung und Sitzungscookie widerrufen beziehungsweise entfernt. Abgelaufene Datensätze werden anwendungsseitig per Alarm zur Löschung vorgesehen. Dies ist keine Zusage sofortiger physischer Löschung in Anbietersystemen oder Sicherungen.',
      ],
    },
    {
      title: 'Tokens, Speicherung und öffentliche Modusänderungen',
      paragraphs: [
        'Das GitHub-User-Token wird im Worker-Arbeitsspeicher zur Identitätsprüfung verwendet und weder in der Sitzung noch im Browser oder Repository gespeichert. Ein aktiver Widerruf dieses Tokens ist nicht implementiert; die GitHub App verwendet ablaufende User-Tokens. Ein separates kurzlebiges Installationstoken erlaubt dem Worker den Zugriff auf die Moduskonfiguration. App-Schlüssel und Client-Secret bleiben serverseitig.',
        'Ein erfolgreicher Moduswechsel wird mit Revision und Commitmetadaten dauerhaft im öffentlichen Repository bummber/evolvera gespeichert. Er enthält keine Sitzung oder Anmeldetokens und verändert keine alten Kunstwerke. Die Git-Historie ist ein öffentliches, dauerhaftes Änderungsprotokoll.',
        'Der Callback enthält technisch bedingt Code und State in der URL. Nach erfolgreicher Anmeldung führt die Weiterleitung zu /settings ohne diese Parameter. Antworten verwenden no-store und no-referrer. Der Worker schreibt keine eigenen Requestlogs; Workers-Observability ist in der vorgesehenen Konfiguration aus. Technische Verarbeitung durch Anbieter und Browser bleibt davon unberührt.',
      ],
    },
    {
      title: 'Cloudflare, Empfänger und internationale Verarbeitung',
      paragraphs: [
        'Anbieterinformationen: Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, USA. Für anvertraute Sitzungsinhalte beschreibt Cloudflare Auftragsverarbeitung im Data Processing Addendum. Eigene Verarbeitung von Netzwerk- und Sicherheitsdaten wird in der Datenschutzerklärung beschrieben.',
        'Empfänger können Cloudflare-Gesellschaften und eingesetzte Dienstleister sowie gesetzlich berechtigte Stellen sein. Cloudflare verarbeitet Daten international, unter anderem in den USA. Die Anbieterinformationen erläutern Schutzmechanismen wie Standardvertragsklauseln und das Data Privacy Framework sowie zweck- und gesetzesabhängige Aufbewahrung. Eine ausschließlich europäische Verarbeitung oder feste Anbieter-Löschfrist wird nicht zugesagt.',
        'Für die Anmeldung und Repository-Zugriffe ist außerdem GitHub Empfänger. Die übrigen Hinweise zu GitHub, Kontakt, Betroffenenrechten und Aufsicht in der Datenschutzerklärung der Galerie gelten ergänzend. Für die Datenverarbeitung des Betreibers wende dich an den genannten Kontakt; für eigene Verarbeitung der Anbieter gelten zusätzlich deren Kontakt- und Rechteinformationen.',
      ],
      links: [
        {
          label: 'Cloudflare-Datenschutzerklärung',
          href: 'https://www.cloudflare.com/privacypolicy/',
        },
        {
          label: 'Cloudflare Data Processing Addendum',
          href: 'https://www.cloudflare.com/cloudflare-customer-dpa/',
        },
        {
          label: 'Cloudflare-Unterauftragnehmer',
          href: 'https://www.cloudflare.com/cloudflare-subprocessors/',
        },
        {
          label: 'GitHub-Datenschutzerklärung',
          href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
        },
      ],
    },
  ];
}
