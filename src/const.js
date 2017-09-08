module.exports = {
  PACK_PRICES: {
    lyon: {
      basic:      59000,
      comfort:    79000,
      privilege:  99000,
    },
    montpellier: {
      basic:      49000,
      comfort:    69000,
      privilege:  89000,
    },
    paris: {
      basic:      89000,
      comfort:   109000,
      privilege: 129000,
    },
  },

  DEPOSIT_PRICES: {
    lyon:        69000,
    paris:       89000,
    montpellier: 49000,
  },

  SPECIAL_CHECKIN_PRICE: 7900,

  SERVICE_FEES: {
    1:       5000, // 1 room
    2:       4000, // 2 rooms
    default: 3000, // 3 or more rooms
  },

  UNAVAILABLE_DATE: new Date(1E14),

  API_BASE_URL: process.env.NODE_ENV !== 'production' ?
    'http://localhost:3000/forest' :
    'https://scqg8r1bs4.execute-api.eu-west-1.amazonaws.com/latest/forest',
  PAYMENT_FORM_URL: 'https://payment.chez-nestor.com/view',
  IDENTITY_FORM_URL: 'https://forms.chez-nestor.com/50392735671964',
};
