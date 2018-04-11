import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button/index';
import Utils                  from '~/utils';
import style                  from './style.css';

function Guide({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <section className={style.guide}>
        <img src={require('../../../assets/home/gallery/home-gallery-1-o.jpg')} />
        <h2>
          <Text id="title">Free housing guide</Text>
        </h2>
        <p><Text id="text.0">Where to look for an accomodation?</Text></p>
        <p><Text id="text.1">Which files are required for a student?</Text></p>
        <p><Text id="text.2">What fees to expect when renting a flat?</Text></p>
        <Button
          href="http://forms.chez-nestor.com/cheznestor/HousingGuide"
          target="_blank"
          theme={style}
        >
          <Text id="downlod">Downlod your free housing guide</Text>
        </Button>
        <div style={{ clear: 'both' }} />
      </section>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  title: 'Guide logement gratuit',
  text: [
    'Où rechercher mon logement ?',
    'Quel dossier fournir pour un étudiant ?',
    'Quels sont les frais à prévoir pour une location ?',
  ],
  download: 'Téléchargez votre guide logement offert',
} };

export default Utils.connectLang(Guide);
