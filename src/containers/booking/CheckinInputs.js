import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { IntlProvider }       from 'preact-i18n';
import autobind               from 'autobind-decorator';
import D                      from 'date-fns';
import { DatePicker }         from 'react-toolbox/lib/date_picker';
import { TimePicker }         from 'react-toolbox/lib/time_picker';
import * as actions           from '~/actions';

class CheckinInputs extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { updateBooking, deleteBookingError } = this.props.actions;

    batch(
      updateBooking({ [event.target.name]: value }),
      deleteBookingError(event.target.name)
    );
  }

  // for some reason, event is sometimes undefined with DatePicker
  @autobind
  handleDateChange(value, event) {
    this.handleChange(value, { target: { name: 'checkinDate' } });
  }

  render({ lang }) {
    const { bookingDate, checkinDate, checkinDateError } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <DatePicker
            label="Check-in Date"
            name="checkinDate"
            locale={lang.split('-')[0]}
            value={checkinDate}
            onChange={this.handleDateChange}
            error={checkinDateError}
            minDate={D.startOfDay(bookingDate)}
          />
          <TimePicker
            label="Check-in Time"
            name="checkinDate"
            value={checkinDate}
            onChange={this.handleDateChange}
            error={checkinDateError}
          />
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
} };

function mapStateToProps({ booking: { checkinDate, bookingDate, errors } }) {
  return {
    checkinDate,
    bookingDate,
    checkinDateError: errors.checkinDate,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckinInputs);
