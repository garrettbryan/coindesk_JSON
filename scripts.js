$(document).ready(function(){


 var getBitcoinMonthHistory = function(){

  var canvasWidth = $('#bitcoinChart').prop('width')
  ,canvasHeight = $('#bitcoinChart').prop('height')
  ,c = document.getElementById('bitcoinChart')
  ,ctx = c.getContext('2d');


  $.getJSON("https://api.coindesk.com/v1/bpi/historical/close.json", function(json) {
   if (json != "Nothing found."){


    var total_days = 0
    , local_maxima = {"max" : 0}
    , local_minima = {"min" : null}
    , sum_daily_price = 0;


    for (date in json.bpi){
      local_minima = local_minima.min === null ? {date : date, min : json.bpi[date]} : local_minima;
      local_maxima = local_maxima.max > json.bpi[date] ? local_maxima : {date : date, max : json.bpi[date]};
      local_minima = local_minima.min < json.bpi[date] ? local_minima : {date : date, min : json.bpi[date]};
      sum_daily_price += json.bpi[date];
      total_days++;
      console.log(date + " and " + json.bpi[date]);
    }

      var distanceBetweenPoints = canvasWidth / (total_days+1) //subdivide canvas so that there is padding around the first and last points.
      var vertical_shift = - local_minima.min;
      var vertical_scale = (canvasHeight) / ( local_maxima.max - local_minima.min );

      console.log("Monthly average:" + sum_daily_price / total_days);
      console.log(local_maxima.date + " " + local_maxima.max);
      console.log(local_minima.date + " " + local_minima.min);
      console.log(canvasHeight);
      console.log(canvasWidth);
      console.log(vertical_scale);
      console.log(vertical_shift);


      var day = 1;

      ctx.beginPath();

      for (date in json.bpi){
        ctx.lineTo(day*distanceBetweenPoints, (json.bpi[date] + vertical_shift)*vertical_scale);
        day++;
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      ctx.stroke();

      var day = 1;

      for (date in json.bpi){
        ctx.beginPath();
        ctx.arc(day*distanceBetweenPoints, (json.bpi[date] + vertical_shift)*vertical_scale, 3, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.closePath();
        day++;
      }






      $('#monthlyHigh').append(" " + local_maxima.max + " on " + local_maxima.date);
      $('#monthlyLow').append(" " + local_minima.min + " on " + local_minima.date);
      $('#monthlyAve').append(" " + sum_daily_price/total_days);


    } else {
      console.log("Missing Bitcoin Data");
    }
  });

}();


});