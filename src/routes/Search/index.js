import random                 from 'lodash/random';
import Promise from 'bluebird';
import { PureComponent }      from 'react';
import autobind               from 'autobind-decorator';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import SameSearchCount        from '~/components/search/SameSearchCount';
import SearchForm             from '~/components/SearchForm';
import ResultsList            from '~/containers/search/ResultsList';
import ResultsMap             from '~/containers/search/ResultsMap';
import Paging                 from '~/containers/search/Paging';
// import { CreateAlertButton }  from '~/components/CreateAlertButton';
import * as actions           from '~/actions';
import {
  mapPane,
  leftPane,
  searchEngineAndAlerts,
  switchMapList,
  mobileHide,
  selected,
  viewport,
  mobileShow,
}                             from './style.css';

const _ = { random };

export class Search extends PureComponent {
  @autobind
  onRoomOver(room) {
    this.setState({ overRoom: room });
  }

  @autobind
  switchToList() {
    this.setState({ mobilePane: 'list' });
  }

  @autobind
  switchToMap() {
    this.setState({ mobilePane: 'map' });
  }

  getUsersCount() {
    return _.random(750, 950);
  }

  constructor(props) {
    super(props);

    this.state = {
      overRoom: null,
      sameSearchCounter: this.getUsersCount(),
      mobilePane: 'list',
    };
  }

  componentDidMount() {
    const { city, date, page } = this.props;

    this.props.actions.listRooms({ city, date, page });
  }

  componentWillReceiveProps({ city, date, page }) {
    if (
      city !== this.props.city ||
      date !== this.props.date ||
      page !== this.props.page
    ) {
      this.props.actions.listRooms({ city, date, page });
      this.setState({
        sameSearchCounter: this.getUsersCount(),
      });
    }
  }

  render() {
    const {
      city,
      date,
      isLoading,
    } = this.props;

    return (
      <div className={viewport}>
        <div
          className={this.state.mobilePane !== 'map' ? mobileHide : mobileShow}
        >
          <div className={mapPane}>
            <ResultsMap
              highlightedRoomId={this.state.overRoom}
              currentlyShowing={this.state.mobilePane}
            />
          </div>
        </div>
        <div
          className={this.state.mobilePane !== 'list' ? mobileHide : mobileShow}
        >
          <div className={leftPane}>
            <div className={searchEngineAndAlerts}>
              <SearchForm mode="noSubmit" {...{ city, date }} />
              { /* TODO: implement alerts: <CreateAlertButton /> */ }
            </div>
            { isLoading ? (
              <div class="text-center">
                <ProgressBar type="circular" mode="indeterminate" />
              </div> ) : (
              <div>
                <SameSearchCount count={this.state.sameSearchCounter} />
                <ResultsList onRoomOver={this.onRoomOver} />
                <Paging />
              </div>
            ) }
          </div>
        </div>
        <div className={switchMapList}>
          <span
            onClick={this.switchToList}
            className={this.state.mobilePane === 'list' ? selected : null}
          >
            Liste
          </span>
          <span
            onClick={this.switchToMap}
            className={this.state.mobilePane === 'map' ? selected : null}
          >
            Plan
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ route: { date }, rooms }, { city }) {
  return {
    city,
    date: date && Number(date),
    isLoading: rooms.isLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
