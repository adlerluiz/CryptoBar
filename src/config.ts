export const API_URLS = {
  'coinmarketcap': {
    ticker: 'https://api.coinmarketcap.com/v2/ticker/',
    chart: 'https://graphs.coinmarketcap.com/currencies/'
  }
};

export const DEFAULT_SETTINGS = {
  /** Api selected by user */
  API_SELECTED: 'coinmarketcap',

  /** Time to get data from site api (in seconds) */
  TIMEOUT: 60,

  /** Type of display coin on bar */
  COIN_DISPLAY: 'name',

  /** Type of display change percent coin values on bar */
  PERCENT_CHANGE: 'percent_change_1h',

  /** Show image of coin on bar */
  SHOW_IMAGE_BAR: true,

  /** Show only image of coin on bar */
  SHOW_ONLY_IMAGE_BAR: false,

  /** Use dark theme for app */
  DARK_THEME: true,

  /** Default coin to show on bar */
  COINS: [ 'bitcoin' ],

  /** Default exchanges to show on bar */
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
