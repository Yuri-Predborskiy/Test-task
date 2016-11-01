var Vue = require("vue/dist/vue.js");
var Highcharts = require("highcharts");

function str(s) {
  return JSON.stringify(s).replace(/"/g, "'");
}

$("#insertChart").click(function() {
  var e = document.getElementById("chart-type");
  var title = "Points scored";
  var chartType = e.options[e.selectedIndex].value;
  var categories = ['Team 1', 'Team 2', 'Team 3', 'Team 4'];
  var series = [{
    name: 'Period 1',
    data: [25, 37, 12, 40]
  }, {
    name: 'Period 2',
    data: [85, 23, 35, 65]
  }];
  var template = "<chart type=\"" + chartType + 
    "\" title=\"" + title + 
    "\" :data-set=\"{categories: " + str(categories) + 
    ", series: " + str(series) + " }\"></chart>";
  var element = $(template).appendTo("#charts");
  console.log(element);
  $('html, body').animate({scrollTop: $(element).offset().top + 'px'}, 'fast');
  var chart = new Vue({
    el: element[0]
  });
});

Vue.component('chart', {
  props: ['type', 'title', 'dataSet'],
  template: '<div class=\"column-container shadow-border\"></div>',
  mounted() {
    if (this.type === "pie") {
      // change dataSet.series to fit "pie" chart series
      var mySeries = [{}];
      mySeries[0].name = "Score";
      mySeries[0].data = [];
      var data = mySeries[0].data;
      for (var i = 0; i < this.dataSet.series[0].data.length; i++) {
        var item = {
          name: (this.dataSet.categories[i]) ? (this.dataSet.categories[i]) : (""),
          y: this.dataSet.series[0].data[i]
        };
        data.push(item);
      }
      this.dataSet.series = mySeries;
    }
    Highcharts.chart(this.$el, {
      chart: {
        type: this.type,
        width: this.$el.offsetWidth - 1
      },
      title: {
        text: this.title,
      },
      plotOptions: {
        pie: {
          dataLabels: {
            distance: -50,
            formatter: function() {
              return this.y + '%';
            }
          },
          showInLegend: true
        }
      },
      xAxis: {
        categories: this.dataSet.categories
      },
      series: this.dataSet.series
    });
  }
});