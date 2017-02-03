(function () {

    var widget = (function () {

        function createChart() {
            var chart = Ext.create('Ext.chart.Chart', {
                store: Ext.data.StoreManager.lookup('DetailChartStore'),
                // theme: 'LVRTheme',
                hidden: true,
                animate: true,
                shadow: false,
                columnWidth: 1,
                height: 400,
                insetPadding: {
                    top: 55,
                    right: 25,
                    left: 25,
                    bottom: 25
                },
                margin: 2,
                style: {
                    border: '1px solid #ddd',
                    borderRadius: '3px'
                },
                legend: {
                    // boxStrokeWidth: 0
                    dock: 'bottom'
                },
                axes: [{
                        type: 'numeric',
                        position: 'left',
                        minimum: 0,
                        grid: true,
                        dashSize: 0,
                        renderer: Ext.util.Format.numberRenderer('0%')
                    },
                    {
                        type: 'category',
                        position: 'bottom',
                        fields: ['unit']
                    }
                ]
            });
            return chart
        }

        function createRatioGaugesContainer() {
            var ratioGCont = Ext.create('RC.ui.RatioGuageContainer', {
                store: Ext.data.StoreManager.lookup('ratioGaugeStore'),
                onClick: function() {
                    console.log(this.value); // temp
                }
            })
        }

        function populateRatioGaugeStore(cb) {
            var store = Ext.data.StoreManager.lookup('ratioGaugeStore');
            store.load({
                params: {},
                callback: function (records, operation, success) {
                    if (success)
                        cb();
                }
            });
        }

        function init() {
            var chart, ratioGauges;

            Ext.fly('mainContainer').mask('Laddar data ...');

            //todo check if store is populated before calling populate..
            populateRatioGaugeStore(function () {
                Ext.tip.QuickTipManager.init(true, {
                    dismissDelay: 0
                });
                Ext.fly('mainContainer').unmask();
            });
            chart = createChart();
            ratioGauges = createRatioGaugesContainer();

            Ext.create('Ext.container.Container', {
                renderTo: 'mainContainer',
                layout: {
                    type: 'column',
                    align: 'center'
                },
                items: [ratioGauges, chart]
            });

        }
        return {
            init: init
        }


    }());

    Ext.application({
        name: 'LVR-ratioGauges',
        launch: function () {
            widget.init();
        }
    })
}());