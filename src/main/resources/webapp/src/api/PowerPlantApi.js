import axios from '@/api/AxiosConfig';
import * as GenericMethods from './GenericMethods';

export const getAllPowerPlants = (callback, catchMethod) =>
  axios.get('http://localhost:8888/API/powerplants/')
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));

export const getOnePowerPlant = (id, callback, catchMethod) =>
  axios.get(`http://localhost:8888/API/powerplants/${id}`)
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));

export const deleteOnePowerPlant = (id, callback, catchMethod) =>
  axios.delete(`http://localhost:8888/API/powerplants/${id}`)
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));

export const updateOnePowerPlant = (powerplant, callback, catchMethod) =>
  axios.post(`http://localhost:8888/API/powerplants/${powerplant.powerPlantId}`, powerplant)
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));

export const addPowerPlant = (powerplant, callback, catchMethod) =>
  axios.put('http://localhost:8888/API/powerplants/', powerplant)
    .then(response => GenericMethods.thenGeneric(response, callback, catchMethod))
    .catch(error => GenericMethods.catchGeneric(error, catchMethod));
