export const allPowerPlants = state => state.powerplants;

export const getPowerPlant = state => id =>
  state.powerplants.find(powerplant => powerplant.powerPlantId === id);

export const getProducingPowerPlant = state =>
  state.powerplants.filter(powerplant => powerplant.producing);

export const getConsumingPowerPlant = state =>
  state.powerplants.filter(powerplant => !powerplant.producing);

export const getPowerPlantCurrentConsumption = (state, getters) => (powerPlant) => {
  let res;

  if (!powerPlant.producing) {
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
    const charge = getters
      .getPowerPlantCurrentStoragePercentage(consumingPowerplants[i].powerPlantId);
    if (charge > 0) {
      cons += getters.getPowerPlantCurrentConsumption(consumingPowerplants[i]);
    }
  }
  return cons;
};

export const getPowerPlantCurrentProduction = (state, getters) => (powerPlant) => {
  let res;

  if (powerPlant.producing) {
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
    const charge = getters
      .getPowerPlantCurrentStoragePercentage(producingPowerPlants[i].powerPlantId);
    if (charge < 100) {
      prod += getters.getPowerPlantCurrentProduction(producingPowerPlants[i]);
    }
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
    res[powerPlant.type] += getters.getPowerPlantCurrentProduction(powerPlant);
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
    res[powerPlant.type] += getters.getPowerPlantCurrentConsumption(powerPlant);
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
      const previousEvent = powerPlantEvents[powerPlantEvents.indexOf(event) + 1];
      console.log(previousEvent);
      let absChargeDifference;
      if (previousEvent) {
        absChargeDifference = Math.abs(previousEvent.powerPlantCharge - event.powerPlantCharge);
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
  const powerplants = state.powerplants;
  const res = [];

  // For the first powerplant, we simply add each {timestamp, charge} couple
  // into the resulting array
  const firstPowerPlantEvents = getters.getPowerPlantEvents(powerplants[0]);
  firstPowerPlantEvents.forEach((event) => {
    const charge = event.powerPlantCharge * powerplants[0].capacity;
    res.push([event.timestamp, charge]);
  });

  // Then, for all the other powerplants, we need to do a few computations
  for (let i = 1; i < powerplants.length; i += 1) {
    const powerPlant = powerplants[i];
    const events = getters.getPowerPlantEvents(powerPlant.powerPlantId);
    const history = [];

    // First build the history for the currently selected powerplant
    events.forEach((event) => {
      const charge = event.powerPlantCharge * powerplants[i].capacity;
      history.push([event.timestamp, charge]);
    });

    // Then, starting with the second point of the history, go through each point of history and
    // retrieve all the points of res that are between the currently studied point and its
    // previous point.
    // For each of those points, adds the studied powerplant's charge at the time of the point.
    for (let j = 1; j < history.length; j += 1) {
      const previousPointTimestamp = history[j - 1][0];
      const thisTimestamp = history[j][0];
      const pointsInTheInterval = res
        .filter(point => point[0] > previousPointTimestamp && point[0] < thisTimestamp);

      pointsInTheInterval.forEach((point) => {
        const indexInRes = res.indexOf(point);
        const newValue = point[1] + chargeAt(history, point[0], powerPlant.powerPlantId, getters);

        res[indexInRes][1] = newValue;
      });

      // As the final step for a specific point from history,
      // Store its data into the res
      const lastPointInInterval = pointsInTheInterval[pointsInTheInterval.length - 1];
      const indexToAddInRes = res.indexOf(lastPointInInterval) + 1;

      const value = history[1] + chargeAt(
          res,
          history[0],
          getPowerPlantIdFromNextTimestamp(res, history[0], state),
          getters);
      const point = [history[0], value];

      res.splice(indexToAddInRes, 0, point);
    }
  }

  // Finally return the resulting array
  return res;
};


// PRIVATE METHODS

const chargeAt = (source, timestamp, powerPlantId, getters) => {
  let res;

  for (let i = 0; i < source.length; i += 1) {
    if (source[i].timestamp > timestamp && i > 0) {
      const previousPoint = source[i - 1];
      const nextPoint = source[i];
      // point[0] is the timestamp ; point[1] is the charge
      const num = (previousPoint[0] * previousPoint[1]) + (nextPoint[0] * nextPoint[1]);
      const denom = previousPoint[0] + nextPoint[0];
      res = num / denom;
    } else if (i === 0) {
      res = 0;
    }
  }

  // If the res is undefined, it means that no point in the source is higher than the timestamp,
  // meaning that this point is the current time. So that, we retrieve the current charge of the
  // powerplant.
  if (!res) {
    res = getters.getPowerPlantCurrentStorage(powerPlantId);
  }

  return res;
};

const getPowerPlantIdFromNextTimestamp = (array, timestamp, state) => {
  // First retrieve the timestamp
  const nextTimestamps = array.filter(el => el[0] > timestamp)
    .map(el => el[0]);
  const nextTimestamp = Math.min.apply(null, nextTimestamps);

  // Then get the event
  const event = state.events.filter(ev => ev.timestamp === nextTimestamp);

  // And finally returns the owning powerplant's id
  return event.owningPowerPlant;
};
