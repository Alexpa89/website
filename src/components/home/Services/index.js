import { Button }             from 'react-toolbox/lib/button/index';
import { IntlProvider, Text } from 'preact-i18n';
import style                  from './style.css';

export default function Services({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <section>
        <div class="grid-6-large-2 grid-6-small-1 has-gutter">
          {definition[lang].list.map((s, i) => (
            <Service
              title={s.title}
              subtitle={s.subtitle}
              image={require(`../../../assets/home/experience-${i+1}-imageoptim.png`)}
            />
          ))}
        </div>
        <div className="button-bar text-center">
          <Button href={`/${lang}/services`} theme={style}>
            <Text id="discover">Discover all included services</Text>
          </Button>
        </div>
      </section>
    </IntlProvider>
  );
}

function Service({ title, subtitle, image }) {
  return (
    <div className={style.service}>
      <img src={image} alt={title} />
      <h3>
        {' '}{title}{' '}
      </h3>
      <h4>
        {' '}{subtitle}{' '}
      </h4>
    </div>
  );
}

const definition = {
  'en-US': {
    list: [{
      title: 'Central location',
      subtitle: 'In the heart of the city',
    }, {
      title: 'Furnished',
      subtitle: 'From A to Z',
    }, {
      title: 'Fully equiped',
      subtitle: 'From floor to ceiling',
    }, {
      title: 'All inclusive',
      subtitle: 'Insurance, water, gaz…',
    }, {
      title: 'Wifi',
      subtitle: 'High bandwidth',
    }, {
      title: '3 clicks',
      subtitle: 'to complete booking',
    }],
  },
  'fr-FR': {
    discover: 'Découvrez nos services inclus',
    list: [{
      title: 'Plein centre',
      subtitle: 'Au cœur de la ville',
    }, {
      title: 'Meublé',
      subtitle: 'De A à Z',
    }, {
      title: 'Equipé',
      subtitle: 'Du sol au plafond',
    }, {
      title: 'Tout inclus',
      subtitle: 'Assurance, eau, gaz…',
    }, {
      title: 'Wifi',
      subtitle: 'Haut débit',
    }, {
      title: '3 clics',
      subtitle: 'Pour réserver',
    }],
  },
};
