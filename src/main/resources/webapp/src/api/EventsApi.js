import axios from 'axios';
import AuthService from '@/services/AuthService';
import ServerInfo from '@/api/ServerInfo';
import * as GenericMethods from './GenericMethods';

export const getAllEvents = (callback, catchMethod) =>
  axios({
    method: 'GET',
    crossDomain: this.isCrossOrigin,
    url: `${ServerInfo.BASE_URL}/API/powerplants/events`,
    headers: {
      Authorization: AuthService.getAccessToken(),
    },
  })
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));

export const getPowerPlantEvents = (powerPlantId, callback, catchMethod) =>
  axios({
    method: 'GET',
    crossDomain: this.isCrossOrigin,
    url: `${ServerInfo.BASE_URL}/API/powerpants/events/${powerPlantId}`,
    headers: {
      Authorization: AuthService.getAccessToken(),
    },
  })
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));

export const getEvent = (powerPlantId, eventId, callback, catchMethod) =>
  axios({
    method: 'GET',
    crossDomain: this.isCrossOrigin,
    url: `${ServerInfo.BASE_URL}/API/powerpants/events/${powerPlantId}/event/${eventId}`,
    headers: {
      Authorization: AuthService.getAccessToken(),
    },
  })
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));
