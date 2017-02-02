(function () {
    function getRandom() {
        return Math.random() * 10;
    }

    function getDummyData(id) {
        return {
            id: id || null,
            value: getRandom(),
            description: 'Somethings wrong with the world today. And I don\'t know what it is',
            upperLimit: getRandom(),
            lowerLimit: getRandom(),
            invert: getRandom() < 50 ? true : false
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

    function showRelatedChart(id, chart, data) {
        return function () {
            // console.log(id, chart, data);
        }
    }

    function getRatioGuages(records, chart) {
        return getDummyDataMulti(records).map(function (data, id) {
            return Ext.create('RC.ui.RatioGuage', {
                store: data,
                onClick: showRelatedChart(id, chart, data)
            })
        });
    }


    function init() {
        var chart = {
            id: 0,
            dummy: 'this is a chart'
        }
        Ext.create('Ext.container.Container', {
            renderTo: 'newWidgetWorkBench',
            width: '1200px',
            layout: {
                type: 'column',
                align: 'center'
            },
            items: getRatioGuages(8, chart)
        })
    }
    init();
}());