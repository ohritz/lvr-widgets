'use strict';

const express = require('express');
const app = express();
const fs = require('fs');

const port = process.env.DEV_PORT || 3005;
const baseUrl = '';


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(port, function () {
    console.log(`listening on ${port}, for api calls.`);
})