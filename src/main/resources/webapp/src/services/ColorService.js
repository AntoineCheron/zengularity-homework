export default {
  getColor(powerPlantType) {
    let res;

    switch (powerPlantType) {
      case 'solar' || 'nuclear':
        res = 'green';
        break;
      case 'hydroelectric' || 'geothermal':
        res = 'red';
        break;
      case 'biomass' || 'gas':
        res = 'purple';
        break;
      default:
        res = 'yellow';
        break;
    }

    return res;
  },
};
