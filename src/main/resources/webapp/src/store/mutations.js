import EventBus from '@/services/EventBus';
import * as types from './mutation-types';

// Must not contain any API call !

/* ----------------------------------------------------------------------------
                            PRIVATE METHODS
---------------------------------------------------------------------------- */

const setProductionState = (state, powerPlant, productionState) => {
  const index = state.powerplants.indexOf(powerPlant);

  state.powerplants[index].producing = productionState;

  // temporary fix for the chart
  EventBus.$emit('re-render-chart');
};

/* ----------------------------------------------------------------------------
                        ACTUAL MUTATION METHODS
---------------------------------------------------------------------------- */

export default {
  [types.REMOVE_POWER_PLANT](state, powerPlant) {
    // Remove it using the Array.prototype.splice method
    state.powerplants.splice(state.powerplants.indexOf(powerPlant), 1);

    // temporary fix for the chart
    EventBus.$emit('re-render-chart');
  },

  [types.TURN_PRODUCTION_ON](state, powerPlant) {
    setProductionState(state, powerPlant, true);
  },

  [types.TURN_PRODUCTION_OFF](state, powerPlant) {
    setProductionState(state, powerPlant, false);
  },

  [types.ADD_POWER_PLANT](state, powerplant) {
    state.powerplants.push(powerplant);

    // temporary fix for the chart
    EventBus.$emit('re-render-chart');
  },

  [types.SET_TYPES](state, newTypes) {
    state.types = newTypes;
  },

  [types.SET_EVENTS](state, events) {
    state.events = events;

    // temporary fix for the chart
    EventBus.$emit('re-render-chart');
  },

  [types.SET_POWER_PLANTS](state, powerPlants) {
    state.powerplants = powerPlants;

    // temporary fix for the chart
    EventBus.$emit('re-render-chart');
  },
};
