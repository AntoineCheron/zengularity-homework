import * as TypesApi from '@/api/TypesApi';
import * as EventsApi from '@/api/EventsApi';
import * as PowerPlantApi from '@/api/PowerPlantApi';
import * as types from './mutation-types';

export const fetchTypes = ({ commit }) => {
  TypesApi.getAllTypes(
    data => commit(types.SET_TYPES, data),
    error => console.error(error));
};

export const fetchAllEvents = ({ commit }) => {
  EventsApi.getAllEvents(
    events => commit(types.SET_EVENTS, events),
    error => console.error(error));
};

export const addPowerPlant = (store, powerplant) => {
  PowerPlantApi.addPowerPlant(powerplant,
    (data) => {
      store.commit(types.ADD_POWER_PLANT, data);
      store.dispatch('fetchAllEvents');
    },
    error => console.error(error));
};

export const fetchAllPowerPlants = ({ commit }) => {
  PowerPlantApi.getAllPowerPlants(
    powerPlants => commit(types.SET_POWER_PLANTS, powerPlants),
    error => console.error(error));
};

export const removePowerPlant = ({ commit }, powerPlant) => {
  PowerPlantApi.deleteOnePowerPlant(
    powerPlant.powerPlantId,
    data => commit(types.REMOVE_POWER_PLANT, powerPlant),
    error => console.error(error));
};

const updatePowerPlantProducing = (store, powerPlant, producing, type) => {
  const newPowerPlant = Object.assign({}, powerPlant);
  newPowerPlant.producing = producing;

  PowerPlantApi.updateOnePowerPlant(
    newPowerPlant,
    ok => store.commit(type, powerPlant),
    error => console.error(error));

  store.dispatch('fetchAllEvents');
};

export const turnProductionOff = (store, powerPlant) => {
  updatePowerPlantProducing(store, powerPlant, false, types.TURN_PRODUCTION_OFF);
};

export const turnProductionOn = (store, powerPlant) => {
  updatePowerPlantProducing(store, powerPlant, true, types.TURN_PRODUCTION_ON);
};
