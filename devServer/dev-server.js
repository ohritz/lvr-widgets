'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const guageData = require('./guageData');
const chartData = require('./chartData');
const port = process.env.DEV_PORT || 3005;
const baseUrl = '';


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/stratum/api/statistics/lvr/gaugeWidget', function (req, res) {
  console.log('stop hitting me');
  var id = req.query.id,
    data;

  if (typeof id === 'undefined') {
    data = guageData.getDataFromJson();
  } else {
    data = chartData(id);
    console.log('id is: ', id);
    // res.status(500).send('nope');
  }
  res.status(200).send(data);  

});


app.listen(port, function () {
  console.log(`listening on ${port}, for api calls.`);
})