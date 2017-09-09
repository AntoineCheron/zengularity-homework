import * as types from './mutation-types';

// Must not contain any API call !

/* ----------------------------------------------------------------------------
                            PRIVATE METHODS
---------------------------------------------------------------------------- */

const setProductionState = (state, getters, id, productionState) => {
  const powerPlantToEdit = getters.getPowerPlant(id);
  const index = state.powerPlants.indexOf(powerPlantToEdit);

  state.powerplants[index].producing = productionState;
};

/* ----------------------------------------------------------------------------
                        ACTUAL MUTATION METHODS
---------------------------------------------------------------------------- */

export default {
  [types.REMOVE_POWER_PLANT](state, getters, id) {
    // Retrieve the powerplant to remove
    const powerPlantToRemove = getters.getPowerPlant(id);
    // Remove it using the Array.prototype.splice method
    state.powerplants.splice(state.powerplants.indexOf(powerPlantToRemove), 1);
  },

  [types.TURN_PRODUCTION_ON](state, getters, id) {
    setProductionState(state, getters, id, true);
  },

  [types.TURN_PRODUCTION_OFF](state, getters, id) {
    setProductionState(state, getters, id, false);
  },

  [types.ADD_POWER_PLANT](state, powerplant) {
    state.powerplants.push(powerplant);
  },
};
