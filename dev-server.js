'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const guagedata = require('./guageData');
const port = process.env.DEV_PORT || 3005;
const baseUrl = '';


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/stratum/api/statistics/lvr/gaugeWidget', function(req,res) {
  console.log('stop hitting me');
  var data = guagedata(6);
  res.status(200).send(data);

});

app.get('stratum/api/statistics/lvr/gaugeWidget/:id/details', function(req, res) {
    var id = re.id;
    res.status(200).send({
      id: id,
      data: [
        {unit: 'one',
      value: 2056},
      {unit: 'two',
      value: 3053},
      {unit: 'three',
      value: 1045}
      ]
    })
});

app.listen(port, function () {
    console.log(`listening on ${port}, for api calls.`);
})