(function () {
    function getRandom() {
        return Math.random() * 10;
    }

    function getDummyData() {
        return {
            id: 0,
            value: getRandom(),
            description: 'Somethings wrong with the world today. And I don\'t know what it is',
            upperLimit: getRandom(),
            lowerLimit: getRandom(),
            invert: false
        }
    }

    function init() {
        Ext.create('Ext.container.Container', {
            renderTo: 'newWidgetWorkBench',
            width: '800px',
            layout: {
                type: 'column',
                align: 'center'
            },
            items: [
                Ext.create('RC.ui.RatioGuage', {
                    store: getDummyData()
                }),
                Ext.create('RC.ui.RatioGuage', {
                    store: getDummyData()
                }),
                Ext.create('RC.ui.RatioGuage', {
                    store: getDummyData()
                }),
                Ext.create('RC.ui.RatioGuage', {
                    store: getDummyData()
                })
            ]
        })
    }
    init();
}());