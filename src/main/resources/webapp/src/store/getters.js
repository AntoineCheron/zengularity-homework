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
      const previousEvent = powerPlantEvents[powerPlantEvents.indexOf(event) + 1];
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

  if (powerplants && powerplants.length > 0) {
    // For the first powerplant, we simply add each {timestamp, production} couple
    // into the resulting array
    const firstPPEvents = getters.getPowerPlantEvents(powerplants[0].powerPlantId);
    const fstPPType = getters.getType(powerplants[0].type);

    for (let i = 0; i < firstPPEvents.length - 1; i += 1) {
      const event = firstPPEvents[i];
      const nextEvent = firstPPEvents[i + 1];
      const prod = computePowerPlantProductionAtEvent(powerplants[0], event, nextEvent, fstPPType);
      if (typeof prod === 'number') {
        res.push([event.timestamp, prod]);
      } else {
        res.push([event.timestamp, 0]);
        res.push([prod.timestamp, 0]);
      }
    }

    // Then, for all the other powerplants, we need to do a few computations
    for (let i = 1; i < powerplants.length; i += 1) {
      const powerPlant = powerplants[i];
      const events = getters.getPowerPlantEvents(powerPlant.powerPlantId);
      const type = getters.getType(powerPlant.type);
      const history = [];

      // First build the history for the currently selected powerplant
      for (let j = 0; j < events.length - 1; j += 1) {
        const event = events[j];
        const nextEvent = events[j + 1];
        const prod = computePowerPlantProductionAtEvent(powerPlant, event, nextEvent, type);
        if (typeof prod === 'number') {
          history.push([event.timestamp, prod]);
        } else {
          history.push([event.timestamp, 0]);
          history.push([prod.timestamp, 0]);
        }
      }

      if (history.length > 0) {
        // Add a point in res on the creation of powerplant. After it,
        // the production will increase.
        let closerPoint = res.filter(r => r[0] < history[0][0]);
        closerPoint = closerPoint[closerPoint.length - 1];
        const indexOfClosePoint = res.indexOf(closerPoint);
        res.splice(indexOfClosePoint + 1, 0, [history[0][0], closerPoint[1]]);
      }

      // Then, starting with the second point of the history, go through each point of history and
      // retrieve all the points of res that are between the currently studied point and its
      // previous point.
      // For each of those points, adds the studied powerplant's prod at the time of the point.
      for (let j = 1; j < history.length; j += 1) {
        const previousPointTimestamp = history[j - 1][0];
        const thisTimestamp = history[j][0];
        const pointsInTheInterval = res
          .filter(point => point[0] >= previousPointTimestamp && point[0] < thisTimestamp);

        pointsInTheInterval.forEach((point) => {
          const indexInRes = res.indexOf(point);
          const newValue = point[1] + history[j - 1][1];
          res[indexInRes][1] = newValue;
        });

        // As the final step for a specific point from history, compute its prod
        // plus the current prod in res. Then store this data into the res array
        const lastPointInInterval = pointsInTheInterval[pointsInTheInterval.length - 1];
        let indexToAddInRes = res.indexOf(lastPointInInterval) + 1;
        if (indexToAddInRes === 0 && res.filter(r => r[0] < history[j][0]).length > 0) {
          indexToAddInRes = res.length;
        }

        let value;
        if (lastPointInInterval) {
          value = history[j][1] + lastPointInInterval[1];
        } else {
          value = history[j][1];
        }
        const point = [history[j][0], value];
        res.splice(indexToAddInRes, 0, point);
      }
    }

    // Add the current prod at the end of the res array
    const currentProd =
      getters.getTotalPowerPlantProduction
      - getters.getTotalPowerPlantConsumption;
    const point = [Math.floor(Date.now() / 1000), currentProd];
    res.push(point);
  }

  // Finally return the resulting array
  return res.map(r => [r[0] * 1000, r[1]]);
};


// PRIVATE METHODS

const computePowerPlantProductionAtEvent = (powerplant, event, nextEvent, type) => {
  let res;

  if (nextEvent.powerPlantCharge && event.powerPlantCharge !== nextEvent.powerPlantCharge) {
    let rate = event.producing ? type.percentageProducedPerHour : -type.percentageConsumedPerHour;
    rate /= 100;

    const timeBetweenTwoEvents = nextEvent.timestamp - event.timestamp;
    const charge = (event.powerPlantCharge + (timeBetweenTwoEvents * rate * powerplant.capacity));
    const isFullAndProducing = event.producing && charge >= 1;
    const isEmptyAndConsuming = !event.producing && charge <= 0;

    if (isFullAndProducing) {
      const t = event.timestamp + (((100 - event.powerPlantCharge) / (rate * 100)) * 3600);
      res = { isFullAndProducing, timestamp: t };
    } else if (isEmptyAndConsuming) {
      const t = event.timestamp + (((event.powerPlantCharge) / (-rate * 100)) * 3600);
      res = { isFullAndProducing, timestamp: t };
    } else {
      res = rate * powerplant.capacity;
    }
  } else {
    res = event.powerPlantCharge;
  }
  return res; // in kWh
};
