import { legalDetails, publicationIssues } from '../src/site/legal';
import { operatorSettings } from '../src/operator/access';

const issues = publicationIssues(legalDetails, operatorSettings.adminOrigin);
if (issues.length) {
  console.error(
    `Veröffentlichung noch nicht vorbereitet:\n${issues.join('\n')}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    'Technische Angabenprüfung erfolgreich; ersetzt keine Text- oder Rechtsprüfung.',
  );
}
