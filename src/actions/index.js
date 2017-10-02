import { createAction }         from 'redux-act';
import { createActionAsync }    from 'redux-act-async';
import D                        from 'date-fns';
import queryString              from 'query-string';
import Utils                    from '~/utils';
import {
  API_BASE_URL,
  ROOM_SEGMENTS,
}                               from '~/const';

export const updateRoute = createAction('Update route object');

export const {
  updateBooking,
  setBookingErrors,
  deleteBookingError,
  validateBooking,
} = createFormAction('Booking', Utils.bookingSchema);
export const {
  updatePayment,
  setPaymentErrors,
  deletePaymentError,
  validatePayment,
} = createFormAction('Payment', Utils.paymentSchema);

export const getRoom =
  createActionAsync(
    'get Room by id',
    (id) => fetchJson(`/Room?filterType=and&filter[id]=${id}&segment=Availability`)
      .then(throwIfNotFound('Room', id)),
    {
      noRethrow: true,
      ok: { payloadReducer: ({ response: { data, included } }) => {
        const availableAt = new Date(data[0].attributes.availableAt);
        const now = new Date();

        return {
          room: {
            ...data[0].attributes,
            ApartmentId: data[0].relationships.Apartment.data.id,
            availableAt: new Date(data[0].attributes.availableAt),
          },
          apartment: included[0].attributes,
          bookingDate:
            D.compareAsc( availableAt, now ) === -1 ? now : availableAt,
        };
      } },
    }
  );
export const getRenting = createGetActionAsync('Renting');
export const getApartment = createGetActionAsync('Apartment');
export const getOrder =
  createActionAsync(
    'get Order and associated OrderItems by Order id',
    (id) => fetchJson(`/OrderItem?filterType=and&filter[OrderId]=${id}`)
      .then(throwIfNotFound('Order', id)),
    {
      noRethrow: true,
      ok: { payloadReducer: ({ request, response: { meta, data, included } }) => ({
        ...( included.find((inc) => inc.type === 'order').attributes ),
        OrderItems: mapOrderItems(data, request[0]),
      }) },
    }
  );
export const listOrders =
  createActionAsync(
    'list Orders and associated OrderItems',
    ({ rentingId }) => {
      if ( rentingId === undefined ) {
        return Promise.reject('Can only fetch by rentingId for now');
      }

      return fetchJson(`/OrderItem?filterType=and&filter[RentingId]=${rentingId}`);
    },
    { ok: { payloadReducer: ({ response: { data, included } }) => (
      included
        .filter((inc) => inc.type === 'order')
        .map((order) => ({
          ...order.attributes,
          OrderItems: mapOrderItems(data, order.id),
        }))
        .reduce((orders, order) => {
          orders[order.id] = order;
          return orders;
        }, {})
    ) } }
  );
export const saveBooking =
  createActionAsync(
    'save Renting and associated Client in the backoffice',
    ({ room, booking }) => (
      fetchJson(
        '/actions/public/create-client-and-renting',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId: room.id,
            pack: booking.pack,
            client: booking,
            checkinDate: booking.checkinDate,
            currentPrice: room['current price'],
            bookingDate: booking.bookingDate,
          }),
        },
      )
    ),
    { error: { payloadReducer: (payload) => {
      if ( /unavailable/.test(payload.error) ) {
        return { errors: { isUnavailable: true } };
      }

      if ( /price/.test(payload.error) ) {
        return { errors: { hasPriceChanged: true } };
      }

      return { errors: { unexpected: payload.error.message } };
    } } },
  );

export const listRooms =
  createActionAsync('List Rooms', ({ city }) => {
    if ( city === undefined ) {
      return Promise.reject('Can only list Rooms by city for now');
    }

    const params = {
      segment: ROOM_SEGMENTS[city.toLowerCase()],
      'page[number]': 1,
      'page[size]': 10,
    };
    const qs = queryString.stringify(params, { encode: false });

    return fetchJson(`${API_BASE_URL}/forest/Room?${qs}`);
  });

export const listPictures =
  createActionAsync('List pictures', ({ picturesUrl, roomId }) => (
    fetchJson(`${API_BASE_URL}${picturesUrl}`)
      .then(result => Object.assign(result, { roomId }))
  ));

export const savePayment =
  createActionAsync(
    'save Payment and associated Order in the backoffice',
    (payment) => {
      const {
        cardNumber,
        cvv,
        expiryMonth,
        expiryYear,
        holderName,
        orderId,
      } = payment;

      return fetchJson(
        '/actions/public/create-payment',
        {
          method: 'post',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            cardNumber,
            cvv,
            expiryMonth,
            expiryYear,
            holderName,
            orderId,
          }),
        },
      );
    },
    { error: { payloadReducer: (payload) => {
      if ( /Balance/.test(payload.error) ) {
        return { errors: { payment: { hasWrongBalance: true } } };
      }
      if ( /Order/.test(payload.error) ) {
        return { errors: { payment: { hasNoOrder: true  } } };
      }
      if ( /Card Type/.test(payload.error) ) {
        return { errors: { cardNumber: 'Invalid card type (only Visa and Mastercard are allowed)' } };
      }
      if ( /Invalid card/.test(payload.error) ) {
        return { errors: { cardNumber: 'Invalid card number' } };
      }
      if ( /CVV2/i.test(payload.error) ) {
        return { errors: { cvv: 'Invalid cvv' } };
      }
      if ( /booked/i.test(payload.error) ) {
        return { errors: { payment: { isBooked: 'This room has been booked by someone else.' } } };
      }
      return { errors: { payment: { unexpected: payload.error.message } } };
    } } },
  );

function fetchJson(url, options) {
  return fetch(`${API_BASE_URL}${url}`, options)
    .then((response) => {
      if ( !response.ok ) {
        /* eslint-disable promise/no-nesting */
        return response.text()
          .then((message) => {
            throw new Error(message);
          });
        /* eslint-enable promise/no-nesting */
      }

      return response.json();
    });
}

function throwIfNotFound(modelName, id) {
  return (response) => {
    if ( response.meta.count === 0 ) {
      throw new Error(`${modelName} ${id} not found`);
    }

    return response;
  };
}

function createGetActionAsync(modelName) {
  return createActionAsync(
    `get ${modelName} by id`,
    (id) => fetchJson(`/${modelName}/${id}`),
    { ok: { payloadReducer: ({ response }) => ({
      ...response.data.attributes,
      ...response.included.reduce((attributes, value) => {
        attributes[`${value.type}Id`] = value.id;
        attributes[`_${value.type}`] = value.attributes;

        return attributes;
      }, {}),
    }) } }
  );
}

function createFormAction(formName, schema) {
  return {
    [`update${formName}`]: createAction(`Update ${formName} details`),
    [`set${formName}Errors`]: createAction(`Set ${formName} errors`),
    [`delete${formName}Error`]: createAction(`Delete a specific ${formName} error`),
    [`validate${formName}`]: createActionAsync(
      `Validate ${formName}`,
      (content) => schema.validate(content, { abortEarly: false }),
      { error: { payloadReducer: ({ error }) => (
        error.inner.reduce((errors, error) => {
          errors[error.path] = error.message;
          return errors;
        }, {})
      ) } }
    ),
  };
}

function mapOrderItems(data, orderId) {
  return data
    .filter((item) => (
      item.relationships.Order.data.id === orderId
    ))
    .map((item) => ({
      ...item.attributes,
      RentingId: item.relationships.Renting.data.id,
      ProductId: item.relationships.Product.data.id,
    }));
}
