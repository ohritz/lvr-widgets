const data = require('./lvr-data.json');

function round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

function getRandom() {
    return round(Math.random() * 100, 2);
}

function getDummyData(id) {
    return {
        id: typeof id !== 'undefined' ? id : null,
        value: getRandom(),
        description: 'Somethings wrong with the world today. And I don\'t know what it is',
        limit: getRandom(),
        invert: (Math.random() * 10) > 7 ? true : false
    }
}

function getDummyDataMulti(amount) {
    var ret = [];
    var len = amount || 6;
    for (var index = 0; index < len; index++) {
        ret.push(getDummyData(index +204));
    }
    return ret;
}

function getDataFromJson() {
    var indicators = data.overviewKOL;
    var ids = Object.keys(indicators);
    return ids.map(id => {
        var indicator = Object.assign({},indicators[id]);
        indicator.id = id;
        return indicator;
    })
    .map(indicator => {
        with(indicator) {
            delete indicator;
            delete sums;
        }
        delete indicator['ClinicALL=0']
        delete indicator['ClinicALL=1']
        return indicator;
    });
}

module.exports = {
    getDataFromJson,
    getDummyDataMulti
};