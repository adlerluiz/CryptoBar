export const API_URLS = {
  'coinmarketcap': 'https://api.coinmarketcap.com/v1/ticker/'
};

export const DEFAULT_SETTINGS = {
  /* Api selected by user */
  API_SELECTED: 'coinmarketcap',

  /* Time to get data from site api (in seconds) */
  TIMEOUT: 60,

  /* Type of display coin on bar */
  COIN_DISPLAY: 'name',

  /* Show image of coin on bar */
  SHOW_IMAGE_BAR: true,

  /* Use dark theme for app */
  DARK_THEME: true,

  /* Default coin to show on bar */
  COINS: [ 'btc' ],

  /* Default exchanges to show on bar */
  EXCHANGES: [
    {
      name: 'Bitfinex',
      url: 'https://www.bitfinex.com/'
    },
    {
      name: 'Bittrex',
      url: 'https://bittrex.com/'
    },
    {
      name: 'Poloniex',
      url: 'https://poloniex.com'
    }
  ]
};
