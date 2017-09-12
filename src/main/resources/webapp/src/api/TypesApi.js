import axios from 'axios';
import AuthService from '@/services/AuthService';
import ServerInfo from '@/api/ServerInfo';
import * as GenericMethods from './GenericMethods';

const BASE_URL = document.location.origin.replace('8080', '8888');

export const getAllTypes = (callback, catchMethod) => {
  axios({
    method: 'GET',
    crossDomain: this.isCrossOrigin,
    url: `${ServerInfo.BASE_URL}/API/powerplants/types`,
    headers: {
      Authorization: AuthService.getAccessToken(),
    },
  })
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));
};

export const a = 0;
