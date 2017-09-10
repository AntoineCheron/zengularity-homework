import * as types from './mutation-types';

// Must not contain any API call !

/* ----------------------------------------------------------------------------
                            PRIVATE METHODS
---------------------------------------------------------------------------- */

const setProductionState = (state, powerPlant, productionState) => {
  const index = state.powerplants.indexOf(powerPlant);

  state.powerplants[index].producing = productionState;
};

/* ----------------------------------------------------------------------------
                        ACTUAL MUTATION METHODS
---------------------------------------------------------------------------- */

export default {
  [types.REMOVE_POWER_PLANT](state, powerPlant) {
    // Remove it using the Array.prototype.splice method
    state.powerplants.splice(state.powerplants.indexOf(powerPlant), 1);
  },

  [types.TURN_PRODUCTION_ON](state, powerPlant) {
    setProductionState(state, powerPlant, true);
  },

  [types.TURN_PRODUCTION_OFF](state, powerPlant) {
    setProductionState(state, powerPlant, false);
  },

  [types.ADD_POWER_PLANT](state, powerplant) {
    state.powerplants.push(powerplant);
  },

  [types.SET_TYPES](state, newTypes) {
    state.types = newTypes;
  },

  [types.SET_EVENTS](state, events) {
    state.events = events;
  },

  [types.SET_POWER_PLANTS](state, powerPlants) {
    state.powerplants = powerPlants;
  },
};
