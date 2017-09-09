export const allPowerPlants = state => state.powerplants;

export const getPowerPlant = state => id =>
  state.powerplants.find(powerplant => powerplant.id === id);

export const getProducingPowerPlant = state =>
  state.powerplants.filter(powerplant => powerplant.producing);

export const getConsumingPowerPlant = state =>
  state.powerplants.filter(powerplant => !powerplant.producing);

export const getTotalPowerPlantConsumption = (state, getters) => {
  const consumingPowerplants = getters.getConsumingPowerPlant();
  let cons = 0;
  for (let i = 0; i < consumingPowerplants.length; i += 1) {
    const type = getters.getType(consumingPowerplants[i]);
    if (consumingPowerplants[i].capacity > 0) {
      cons += consumingPowerplants[i].capacity * type.percentageConsumedPerHour;
    }
  }
  return cons;
};

export const getTotalPowerPlantProduction = (state, getters) => {
  const producingPowerPlants = getters.getProducingPowerPlant();
  let cons = 0;
  for (let i = 0; i < producingPowerPlants.length; i += 1) {
    const type = getters.getType(producingPowerPlants[i]);
    if (producingPowerPlants[i].capacity < 100) {
      cons += producingPowerPlants[i].capacity * type.percentageProducedPerHour;
    }
  }
  return cons;
};

export const getCurrentStoredQuantity = (state, getters) => {
  let acc = 0;
  for (let i = 0; i < state.powerplants.length; i += 1) {
    acc += getters.getPowerPlantCurrentStorage(state.powerplants[i].powerPlantId);
  }
  return acc;
};

export const getPowerPlantCurrentStorage = (state, getters) => (id) => {
  const powerPlant = getters.getPowerPlant(id);

  const currentStoragePercentage = getters.getPowerPlantCurrentStoragePercentage(id);
  return currentStoragePercentage * powerPlant.capacity;
};

export const getPowerPlantCurrentStoragePercentage = (state, getters) => (id) => {
  const powerPlant = getters.getPowerPlant(id);
  const lastEvent = getters.getPowerPlantEvents(id)[0];
  // ^ TODO : verify that this is the first one and not the last one
  const type = getters.getType(powerPlant.type);

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const productionRate = powerPlant.producing ?
    type.percentageProducedPerHour : (-type.percentageConsumedPerHour);
  return lastEvent.powerPlantCharge + ((currentTimestamp - lastEvent.timestamp) * productionRate);
};

export const getCurrentStorageLevel = (state, getters) => {
  let num = 0;
  let div = 0;

  for (let i = 0; i < state.powerplants.length; i += 1) {
    const powerplant = state.powerplants[i];
    const id = powerplant.powerPlantId;
    num += getters.getPowerPlantCurrentStoragePercentage(id) * powerplant.capacity;
    div += powerplant.capacity;
  }

  return num / div;
};

export const getEnergyAutonomy = (state, getters) => {
  const consumption = getters.getTotalPowerPlantConsumption();
  const production = getters.getTotalPowerPlantProduction();

  const currentStorageDecreasing = consumption - production;
  const currentStorage = getters.getCurrentStoredQuantity();

  const nonFormattedAutonomy = currentStorage / currentStorageDecreasing;
  const hours = parseInt(nonFormattedAutonomy, 10);
  const minutes = (nonFormattedAutonomy % hours) * 0.6;
  return (hours + minutes).toFixed(2);
};

export const getType = state => name => state.types.filter(type => type.name === name);

export const getPowerPlantEvents = state => id =>
  state.event.filter(event => event.owningPowerPlant === id);

export const getNewsfeedEvents = (state, getters) =>
  state.events.map((event) => {
    const powerplant = getters.getPowerPlant(event.owningPowerPlant);
    const storageQuantity = powerplant.capacity * (event.powerPlantCharge / 100);
    const previousEvent = state.events[state.event.indexOf(event) + 1];
    const absChargeDifference = Math.abs(previousEvent.powerPlantCharge - event.powerPlantCharge);

    return {
      powerPlant: powerplant.name,
      producing: event.producing,
      lastPeriod: absChargeDifference * powerplant.capacity,
      powerPlantCharge: event.powerPlantCharge,
      storageQuantity: event.powerPlantCharge * powerplant.capacity,
      timestamp: event.timestamp,
    };
  });
