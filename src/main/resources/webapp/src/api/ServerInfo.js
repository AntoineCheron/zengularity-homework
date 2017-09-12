const info = {
  SERVER_PORT: '8888',
  BASE_URL: undefined,
  isCrossDomain: undefined,
};

info.BASE_URL = document.location.origin.replace('8080', info.SERVER_PORT);
info.isCrossDomain = document.location.origin !== info.BASE_URL;

export default info;
