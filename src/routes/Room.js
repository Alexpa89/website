import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import Promise                from 'bluebird';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import FeaturesDetails           from '~/containers/room/FeaturesDetails';
import * as actions           from '~/actions';


class Room extends PureComponent {
  componentWillMount() {
    const { roomId, actions } = this.props;

    Promise.resolve()
      .then(() => actions.getRoom(roomId))
      .then(({ response }) =>  actions.listFeatures(roomId, response.included[0].id))
      .catch((e) => console.log(e));
  }

  render() {
    const {
      roomId,
      roomName,
      apartmentId,
      lang,
      isRoomLoading,
    } = this.props;
    if ( isRoomLoading ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }
    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content">
          <h1>
            <Text id="title">Détail de la chambre</Text><br />
            <em>{roomName}</em>
          </h1>

          <section>
            <FeaturesDetails roomId={roomId} apartmentId={apartmentId} />
          </section>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route: { lang, roomId }, apartments, rooms }) {
  const room = rooms[roomId];

  return {
    roomId,
    roomName: room && room.name,
    apartmentId: room && room.ApartmentId,
    lang,
    roomError: room && room.error,
    room,
    isRoomLoading: !room || room.isLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
