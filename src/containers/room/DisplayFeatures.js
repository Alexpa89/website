import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import values                 from 'lodash/values';
import mapValues              from 'lodash/mapValues';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import _const                 from '~/const';
import CroppedContainer       from '~/components/room/CroppedContainer';
import style from './style.css';

const _ = { capitalize, values, mapValues };
const { ENUMS } = _const;

class DisplayFeatures extends PureComponent {
  renderFeatures(category, _taxonomy, features = [], featureDetails, lang) {
    if ( features.length === 0 ) {
      return '';
    }

    let leftFeatures = features.slice(0, Math.ceil(features.length / 2));
    let rightFeatures = features.slice(Math.ceil(features.length / 2));

    const renderFeature = (name) => {
      const details = featureDetails[name];

      if ( details === undefined) {
        return (<li>{name}</li>);
      }
      return (<li>
        <i className={`icon-24 ${details.css}`} />
        <span>{details[lang]}</span>
      </li>);
    };

    return (
      <section className={[style.featuresColumn, features.length > 10 ? style.featuresColumnLarge: ''].join(' ')}>
        <h5 className={style.featuresRoom}>
          <Text id={category}>{_.capitalize(category)}</Text>
        </h5>
        <CroppedContainer height={170}>
          { features.length > 10 ? (
            <div className="grid-2">
              <div className="one-half">
                <ul>
                  {leftFeatures.map(renderFeature)}
                </ul>
              </div>
              <div className="one-half">
                <ul>
                  {rightFeatures.map(renderFeature)}
                </ul>
              </div>
            </div>
          ) : <ul>{features.map(renderFeature)}</ul> }
        </CroppedContainer>
      </section>
    );
  }

  render() {
    const {
      lang,
      roomFeatures,
      apartmentFeatures,
    } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <h3 className={style.heading}><Text id="title">Features</Text></h3>
          <br />
          <h4 className={style.subtitle}>
            <span>
              <Text id="room" >Room</Text>
            </span>
          </h4>
          <div className={style.featuresContent}>
            {['sleep', 'dress', 'work', 'general'].map((taxonomy) =>
              this.renderFeatures(
                taxonomy,
                `room-features-${taxonomy}`,
                roomFeatures[taxonomy],
                ENUMS[`room-features-${taxonomy}`],
                lang
              )
            )}
          </div>
          <h4 className={style.subtitle}>
            <span>
              <Text id="apartment">Apartment</Text>
            </span>
          </h4>
          <div className={style.featuresContent}>
            {['kitchen', 'bathroom', 'general'].map((taxonomy) =>
              this.renderFeatures(
                taxonomy,
                `apartment-features-${taxonomy}`,
                apartmentFeatures[taxonomy],
                ENUMS[`apartment-features-${taxonomy}`],
                lang
              )
            )}
          </div>
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Equipements',
  room: 'Chambre',
  apartment: 'Appartement',
  sleep: 'Dormir',
  dress: 'S\'habiller',
  work: 'Travailler',
  general: 'Général',
  kitchen: 'Cuisine',
  bathroom: 'Salle de Bain',
} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    lang,
    room,
    apartment,
    roomFeatures: room && Utils.getFeatures(room),
    apartmentFeatures: apartment && Utils.getFeatures(apartment),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayFeatures);
