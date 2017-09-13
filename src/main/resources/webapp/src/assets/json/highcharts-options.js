export default {
  week: {
    chart: {
      type: 'spline',
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
    },
    series: [{
      data: [],
      color: '#42B975',
      name: 'Energy storage',
    }],
  },
};
