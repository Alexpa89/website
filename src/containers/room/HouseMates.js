import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import D                      from 'date-fns';
import * as actions           from '~/actions';


class HouseMates extends PureComponent {

  renderHouseMate(houseMate) {
    const { lang } = this.props;

    return (
      <div>
        <li>{houseMate.name.split('-')[1]}</li>
        {houseMate.client ?
          <li>{houseMate.client}</li>
          : <li><Text id="available">Available</Text> {D.differenceInDays(houseMate.availableAt, new Date()) === 0 ? lang === 'en-US' ? 'now' : 'immédiatement' : lang === 'en-US' ? `at ${D.format(houseMate.availableAt, 'DD/MM/YYYY')}`: `le ${D.format(houseMate.availableAt, 'DD/MM/YYYY')}`}</li>
        }
      </div>
    );
  }
  render() {
    const {
      lang,
      roomId,
      HouseMates,
    } = this.props;
    if ( !HouseMates ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <h3><Text id="title">HouseMates</Text></h3>
          <ul class="grid-6 has-gutter">
            {HouseMates.filter((data) => data.roomId !== roomId).map((houseMate) => (
              this.renderHouseMate(houseMate)
            ))}
          </ul>
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Colocataires',
  available: 'Disponible',
} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const apartment = apartments[apartmentId];

  return {
    lang,
    roomId,
    HouseMates: apartment && apartment.HouseMates,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(HouseMates);
