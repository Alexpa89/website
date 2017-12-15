import { IntlProvider }       from 'preact-i18n';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import { bindActionCreators } from 'redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import DisplayFeatures        from '~/containers/room/DisplayFeatures';
import Pictures               from '~/containers/room/Pictures';
import HouseMates             from '~/containers/room/HouseMates';
import Description            from '~/containers/room/Description';
import ApartmentDescription   from '~/containers/room/ApartmentDescription';
import * as actions           from '~/actions';


class Room extends PureComponent {
  async loadData(roomId) {
    const { actions } = this.props;
    const { response: roomRes } = await actions.getRoom(roomId);

    if ( roomRes.data[0].id !== roomId ) {
      return route(window.location.pathname.replace(/[\w-]+$/, roomRes.data[0].id));
    }

    const [{ response }] = await Promise.all([
      actions.getDistrict(roomRes.included[0].id),
      actions.listFeatures(roomId, roomRes.included[0].id),
      actions.listPictures(roomId, roomRes.included[0].id),
    ]);

    return Promise.all([
      actions.getDistrictDetails(response.included[0].id, response.data[0].id),
      actions.getDistrictTerms(response.included[0].id, response.data[0].id),
      actions.getHouseMates(response.data[0].id),
    ]);
  }

  componentWillMount() {
    const { roomId } = this.props;
    return this.loadData(roomId);
  }

  componentWillReceiveProps(nextProps) {
    if ( this.props.roomId !== nextProps.roomId ) {
      this.loadData(nextProps.roomId);
    }
  }

  render() {
    const {
      roomId,
      apartmentId,
      lang,
      room,
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
          <section>
            <img src={room['cover picture']} />
            <h2>{room.name}</h2>
            <Pictures roomId={roomId} apartmentId={apartmentId} />
            <Description roomId={roomId} apartmentId={apartmentId} />
            <DisplayFeatures roomId={roomId} apartmentId={apartmentId} />
            <HouseMates apartmentId={apartmentId} roomId={roomId} />
            <ApartmentDescription apartmentId={apartmentId} />
          </section>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route: { lang }, apartments, rooms }, { roomId }) {
  const room = rooms[roomId];

  return {
    roomId,
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
