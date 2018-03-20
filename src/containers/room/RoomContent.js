import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider }       from 'preact-i18n';
import Features               from '~/containers/room/Features';
import Pictures               from '~/containers/room/Pictures';
import Housemates             from '~/containers/room/Housemates';
import Description            from '~/containers/room/Description';
import ApartmentDescription   from '~/containers/room/ApartmentDescription';
import BookingInfo            from '~/containers/room/BookingInfo';
import SingleMap              from '~/containers/room/Map';
import RoomServices           from '~/components/room/RoomServices';
import Questions              from '~/components/room/Questions';
import Guide                  from '~/components/room/Guide';
import * as actions           from '~/actions';

import style from './style.css';

function Availability({ availableAt }) {
  if ( availableAt === null ) {
    return (
      <b>
        <i className="icon-32 picto-picto_disponibilite_indisponible" />
        <span>Non disponible</span>
      </b>
    );
  }
  else if ( +availableAt > +Date.now() ) {
    return (
      <b>
        <i className="icon-32 picto-picto_disponibilite_attention" />
        <span>Dispo. </span>{availableAt.toLocaleDateString()}
      </b>
    );
  }

  return (
    <b>
      <i className="icon-32 picto-picto_disponibilite_ok" />
      <span>Dispo. immédiate</span>
    </b>

  );
}

const RoomContent = ({ lang, roomId, apartmentId, roomName, room, apartment }) => (console.log(room),
  <IntlProvider definition={definition[lang]}>
    <div className={style.roomPage}>
      <div className={['content', 'content-wide', style.roomContent].join(' ')}>
        <div className={style.mainColumns}>
          <div>
            <div className={[style.leftHeader]}>
              {room.name}
            </div>
            <div className={style.links}>
              <ul>
                <li>
                  <a href="#pictures">Photos</a>
                </li>
                <li>
                  <a href="#description">Description</a>
                </li>
                <li>
                  <a href="#features">Equipements</a>
                </li>
                <li>
                  <a href="#housemates">Colocataires</a>
                </li>
                <li>
                  <a href="#map">Plan</a>
                </li>
                <li>
                  <a href="#district">Quartier</a>
                </li>
              </ul>
            </div>
            <a id="pictures" className={style.roomAnchor} />
            <Pictures roomId={roomId} apartmentId={apartmentId} />
            <a id="description" className={style.roomAnchor} />
            <Description roomId={roomId} apartmentId={apartmentId} />
            <a id="features" className={style.roomAnchor} />
            <Features roomId={roomId} apartmentId={apartmentId} />
            <a id="housemates" className={style.roomAnchor} />
            <Housemates apartmentId={apartmentId} />
            <a id="district" className={style.roomAnchor} />
            <ApartmentDescription />
          </div>
          <div>
            <div className={style.rightHeader}>
              <Availability availableAt={room.availableAt} />
            </div>
            <BookingInfo roomId={roomId} apartmentId={apartmentId} />
            <div className={style.sameRoomCount}>
              423 autres personnes ont consulté cette annonce au cours
              des 7 derniers jours. Nous vous recommandons de réserver
              sans tarder.
            </div>
          </div>
        </div>
      </div>
      <a id="map" className={style.roomAnchor} />
      <SingleMap apartment={apartment} />
      <RoomServices />
      <Questions />
      <Guide />
    </div>
  </IntlProvider>
);

const definition = { 'fr-FR': {} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    lang,
    room,
    apartment,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomContent);
