// fall back renderer for repoll
var fallbackChart = (function() {
  var chart;
  var canvas;
  var colorSet = ["#F38630", "#E0E4CC", "#69D2E7", "#F7464A", "#949FB1", "#4D5360"];
  var chartData = [];

  function init(data) {
  	initData(data);
    loadChartjs(function() {
      console.log('chartjs loaded');
    });
  }

  function initData(data) {
    var options = data.options;
    for(i = 0 ; i < options.length ; i++) {
      chartData[i] = {
        value: 0,
        color: colorSet[i % colorSet.length],
        desc: options.text
      }
    }
  }

  function loadChartjs(callback) {
    if (window.Chart) return;
    head.js(
      'https://raw.github.com/nnnick/Chart.js/master/Chart.min.js',
      callback
    );
  }

  function createCanvas(currentSlide) {
    var anchor = currentSlide.querySelector('.repoll-result');
    // TODO if anchor has children remove them.
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', 600);
    canvas.setAttribute('height', 300);
    anchor.appendChild(canvas);
  }

  function createChart() {
    if (window.Chart) {
      var ctx = canvas.getContext('2d');
      chart = new Chart(ctx);
    } else {
      loadChartjs(function() {
        console.log("after render?");
        createChart();
        chart.Pie(chartData);
      });
    }
  }

  function render(currentSlide, vote) {
    console.log("draw chart");
    var voteIndex = vote.selected;
    chartData[voteIndex].value += 1;
    console.dir(chartData);
    if (!canvas) {
      createCanvas(currentSlide);
      createChart();
      return;
    }
    chart.Pie(chartData);
  }

  return {
    init  : init,
    render: render
  };
})();