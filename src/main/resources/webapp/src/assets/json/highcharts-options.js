export default {
  week: {
    chart: {
      type: 'areaspline',
      height: '200px',
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: null,
    },
    xAxis: {
      type: 'datetime',
      opposite: true,
    },
    yAxis: {
      title: {
        text: null,
      },
      min: 0,
      max: 100,
    },
    series: [{
      data: [],
      color: '#42B975',
      name: 'Energy storage',
    }],
  },
};
