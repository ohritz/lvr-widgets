const data = require('./lvr-data.json');

module.exports = function (id) {

    return Object.assign({
        id: id
    }, {data: data.overviewKOL[id]});
}