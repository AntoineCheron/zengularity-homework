export const allPowerPlants = state => state.powerplants;

export const getPowerPlant = state => id =>
  state.powerplants.find(powerplant => powerplant.powerPlantId === id);

export const getProducingPowerPlant = state =>
  state.powerplants.filter(powerplant => powerplant.producing);

export const getConsumingPowerPlant = state =>
  state.powerplants.filter(powerplant => !powerplant.producing);

export const getPowerPlantCurrentConsumption = (state, getters) => (powerPlant) => {
  let res;

  const charge = getters
      .getPowerPlantCurrentStoragePercentage(powerPlant.powerPlantId);

  if (!powerPlant.producing && charge > 0) {
    const type = getters.getType(powerPlant.type);
    res = powerPlant.capacity * (type.percentageConsumedPerHour / 100);
  } else {
    res = 0;
  }

  return res;
};

export const getTotalPowerPlantConsumption = (state, getters) => {
  const consumingPowerplants = getters.getConsumingPowerPlant;
  let cons = 0;
  for (let i = 0; i < consumingPowerplants.length; i += 1) {
    cons += getters.getPowerPlantCurrentConsumption(consumingPowerplants[i]);
  }
  return cons;
};

export const getPowerPlantCurrentProduction = (state, getters) => (powerPlant) => {
  let res;
  const charge = getters
    .getPowerPlantCurrentStoragePercentage(powerPlant.powerPlantId);

  if (powerPlant.producing && charge < 100) {
    const type = getters.getType(powerPlant.type);
    res = powerPlant.capacity * (type.percentageProducedPerHour / 100);
  } else {
    res = 0;
  }

  return res;
};

export const getTotalPowerPlantProduction = (state, getters) => {
  const producingPowerPlants = getters.getProducingPowerPlant;
  let prod = 0;
  for (let i = 0; i < producingPowerPlants.length; i += 1) {
    prod += getters.getPowerPlantCurrentProduction(producingPowerPlants[i]);
  }
  return prod;
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

  const currentStoragePercentage = getters.getPowerPlantCurrentStoragePercentage(id) / 100;
  return currentStoragePercentage * powerPlant.capacity;
};

export const getPowerPlantCurrentStoragePercentage = (state, getters) => (id) => {
  let res;

  const powerPlant = getters.getPowerPlant(id);
  const events = getters.getPowerPlantEvents(id);
  const lastEvent = events[events.length - 1];

  if (lastEvent) {
    const type = getters.getType(powerPlant.type);

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const productionRate = powerPlant.producing ?
      type.percentageProducedPerHour / 3600 : (-type.percentageConsumedPerHour) / 3600;

    res = parseInt(
      lastEvent.powerPlantCharge + ((currentTimestamp - lastEvent.timestamp) * productionRate),
      10);
  } else {
    res = 0;
  }

  if (res < 0) {
    res = 0;
  } else if (res > 100) {
    res = 100;
  }

  return res;
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

  return div > 0 ? (num / div).toFixed(2) : 0;
};

export const getEnergyAutonomy = (state, getters) => {
  const consumption = getters.getTotalPowerPlantConsumption;
  const production = getters.getTotalPowerPlantProduction;

  const currentStorageDecreasing = consumption - production;
  const currentStorage = getters.getCurrentStoredQuantity;

  const nonFormattedAutonomy = currentStorage / currentStorageDecreasing;
  const hours = parseInt(nonFormattedAutonomy, 10);
  const minutes = (nonFormattedAutonomy % hours) * 0.6;
  return currentStorageDecreasing > 0 ? (hours + minutes).toFixed(2) : 'Inf';
};

export const getType = state => name => state.types.filter(type => type.name === name)[0];

export const getPowerPlantEvents = state => id =>
  state.events.filter(event => event.owningPowerPlant === id);

export const getProductionDistribution = (state, getters) => {
  const producingPowerPlants = getters.getProducingPowerPlant;
  const types = state.types;
  const res = {};

  for (let i = 0; i < types.length; i += 1) {
    res[types[i].name] = 0;
  }

  for (let i = 0; i < producingPowerPlants.length; i += 1) {
    const powerPlant = producingPowerPlants[i];
    const id = powerPlant.powerPlantId;
    const powerPlantCharge = getters.getPowerPlantCurrentStoragePercentage(id);
    if (powerPlantCharge < 100) {
      res[powerPlant.type] += getters.getPowerPlantCurrentProduction(powerPlant);
    }
  }

  return res;
};

export const getConsumptionDistribution = (state, getters) => {
  const consumingPowerPlants = getters.getConsumingPowerPlant;
  const types = state.types;
  const res = {};

  for (let i = 0; i < types.length; i += 1) {
    res[types[i].name] = 0;
  }

  for (let i = 0; i < consumingPowerPlants.length; i += 1) {
    const powerPlant = consumingPowerPlants[i];
    const id = powerPlant.powerPlantId;
    const powerPlantCharge = getters.getPowerPlantCurrentStoragePercentage(id);
    if (powerPlantCharge > 0) {
      res[powerPlant.type] += getters.getPowerPlantCurrentConsumption(powerPlant);
    }
  }
  return res;
};

export const getNewsfeedEvents = (state, getters) =>
  state.events.map((event) => {
    const powerplant = getters.getPowerPlant(event.owningPowerPlant);
    const powerPlantEvents = getters.getPowerPlantEvents(event.owningPowerPlant);

    let res;
    if (powerplant) {
      const storageQuantity = powerplant.capacity * (event.powerPlantCharge / 100);
      const previousEvent = powerPlantEvents[powerPlantEvents.indexOf(event) - 1];
      let absChargeDifference;
      if (previousEvent) {
        absChargeDifference = Math.abs(previousEvent.powerPlantCharge - event.powerPlantCharge);
        absChargeDifference /= 100;
      } else {
        absChargeDifference = 0;
      }

      res = {
        powerPlant: powerplant.name,
        producing: event.producing,
        lastPeriod: absChargeDifference * powerplant.capacity,
        powerPlantCharge: event.powerPlantCharge,
        storageQuantity: (event.powerPlantCharge / 100) * powerplant.capacity,
        timestamp: event.timestamp,
      };
    } else {
      res = event;
    }

    return res;
  }).reverse();

export const getProductionHistory = (state, getters) => {
  const events = state.events;
  const res = [];

  events.forEach((event, i) => {
    const powerPlant = getters.getPowerPlant(event.owningPowerPlant);
    const nextEvent = events[i + 1];
    const type = getters.getType(powerPlant.type);
    let value = computePowerPlantProductionAtEvent(powerPlant, event, nextEvent, type);
    if (i > 0) {
      value += res[i - 1][1];
    }
    res.push([event.timestamp, value]);
  });

  // Add the current prod at the end of the res array
  const currentProd =
    getters.getTotalPowerPlantProduction
    - getters.getTotalPowerPlantConsumption;
  const point = [Math.floor(Date.now() / 1000), currentProd];
  res.push(point);

  // Finally return the resulting array
  removeDuplicate(res);
  return res.map(r => [r[0] * 1000, r[1]]);
};

// PRIVATE METHODS

const removeDuplicate = (array) => {
  array.forEach((data, index) => {
    if (index > 0 && array[index - 1][0] === data[0]) {
      array[index][1] = (array[index][1] + array[index - 1][1]) / 2;
      array.splice(index - 1, 1);
    }
  });
};

const computePowerPlantProductionAtEvent = (powerplant, event, nextEvent, type) => {
  let res;

  if (!nextEvent || event.powerPlantCharge !== nextEvent.powerPlantCharge) {
    let rate = event.producing ? type.percentageProducedPerHour : -type.percentageConsumedPerHour;
    rate /= 100;
    res = rate * powerplant.capacity;
  } else {
    res = 0;
  }
  return res; // in kWh
};
