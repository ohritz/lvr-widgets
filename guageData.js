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
        ret.push(getDummyData(index));
    }
    return ret;
}

module.exports = getDummyDataMulti;