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
      url: 'https://www.bitfinex.com/',
      image: 'https://www.bitfinex.com/assets/logo3-dark-theme-90276da89b3131461fd422756694de9bf75895deee13e02809682be956e229ff.svg'
    },
    {
      name: 'Bittrex',
      url: 'https://bittrex.com/',
      image: 'https://bittrex.com/Content/img/logos/bittrex.ico'
    },
    {
      name: 'Poloniex',
      url: 'https://poloniex.com',
      image: 'https://poloniex.com/images/poloniex_icon.png'
    }
  ]
};
