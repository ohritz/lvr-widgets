const data = require('./lvr-data-v2.json');

module.exports = function (id) {

    return Object.assign({
        id: id
    }, {data: data.overviewKOL[id]});
}