// Example : https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/store/getters.js

export const allPowerPlants = state => state.powerplants;

export const getPowerPlant = state => (id) => {
	return state.powerplants.find(powerplant => powerplant.id === id);
};

export const getPowerPlantEvents = state => (id) => {
	return state.event.filter(event => event.owningPowerPlant === id);
};

export const getNewsfeedEvents = (state, getters) => {
	return state.events.map(event => {
		const powerplant = getters.getPowerPlant(event.owningPowerPlant);
		const lastPeriod = 'TODO';
		const storage = 'TODO';
		const storageQuantity = powerplant.capacity * (storage/100);
		
		return {
			powerPlant: powerplant.name,
			producing: event.producing,
			lastPeriod: // TODO,
			storage: // TODO,
			storageQuantity: // TODO,
		};
	});
};