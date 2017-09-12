import axios from 'axios';
import AuthService from '@/services/AuthService';
import ServerInfo from '@/api/ServerInfo';
import * as GenericMethods from './GenericMethods';

export const getAllPowerPlants = (callback, catchMethod) =>
  axios({
    method: 'GET',
    crossDomain: this.isCrossOrigin,
    url: `${ServerInfo.BASE_URL}/API/powerplants/`,
    headers: {
      Authorization: AuthService.getAccessToken(),
    },
  })
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));

export const getOnePowerPlant = (id, callback, catchMethod) =>
  axios({
    method: 'GET',
    crossDomain: this.isCrossOrigin,
    url: `${ServerInfo.BASE_URL}/API/powerplants/${id}`,
    headers: {
      Authorization: AuthService.getAccessToken(),
    },
  })
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));

export const deleteOnePowerPlant = (id, callback, catchMethod) =>
  axios({
    method: 'DELETE',
    crossDomain: this.isCrossOrigin,
    url: `${ServerInfo.BASE_URL}/API/powerplants/${id}`,
    headers: {
      Authorization: AuthService.getAccessToken(),
    },
  })
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));

export const updateOnePowerPlant = (powerplant, callback, catchMethod) =>
  axios({
    method: 'POST',
    crossDomain: this.isCrossOrigin,
    url: `${ServerInfo.BASE_URL}/API/powerplants/${powerplant.powerPlantId}`,
    data: powerplant,
    headers: {
      Authorization: AuthService.getAccessToken(),
    },
  })
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));

export const addPowerPlant = (powerplant, callback, catchMethod) =>
  axios({
    method: 'PUT',
    crossDomain: this.isCrossOrigin,
    url: `${ServerInfo.BASE_URL}/API/powerplants/`,
    data: powerplant,
    headers: {
      Authorization: AuthService.getAccessToken(),
    },
  })
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));
