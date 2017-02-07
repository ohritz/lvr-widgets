(function () {
    var widget = function () {
        function toast(msg) {
            Ext.toast(msg, '', 't');
        }

        function createChart() {
            return Ext.create('Ext.chart.Chart', {
                store: Ext.data.StoreManager.lookup('DetailChartStore'),
                // theme: 'LVRTheme',
                hidden: true,
                animate: true,
                shadow: false,
                height: 400,
                columnWidth: 1,
                width: '100%',
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
        }

        function createRatioGaugesContainer(onClick) {
            return Ext.create('RC.ui.RatioGaugeContainer', {
                columnWidth: 1,
                store: Ext.data.StoreManager.lookup('ratioGaugeStore'),
                onClick: onClick
            });
        }

        function onGaugeClickFactory(chart) {
            var store = chart.getStore();
            return function loadChartAndShow() {
                // this function is called from within the ratioGauge listener::click.
                // so this is the ratioGauge
                var id = this.report.id;
                if (typeof id !== 'undefined') {
                    Repository.Local.Methods.getChartData(this.report.id, function (
                        err,
                        payload
                    ) {
                        if (err) {
                            toast("Kunde inte hämta data, var god försök igen senare.");
                            return Ext.log(err);
                        }
                        Repository.Local.Methods.loadMainChart(
                            payload.d.id,
                            chart,
                            payload.d.data
                        );
                    });
                }
            };
        }

        function populateRatioGaugeStore(cb) {
            var store = Ext.data.StoreManager.lookup('ratioGaugeStore');
            if (!store.isLoaded() && !store.isLoading()) {
                store.load({
                    params: {},
                    callback: function (records, operation, success) {
                        if (success) {
                            return cb();
                        } else {
                            toast('Kunde inte hämta data, var god försök igen.');
                        }

                    }
                });
            }
        }

        function init() {
            var chart, ratioGauges;

            chart = createChart();
            ratioGauges = createRatioGaugesContainer(
                onGaugeClickFactory(chart)
            );

            Ext.tip.QuickTipManager.init(true, {
                dismissDelay: 0
            });

            Ext.create('Ext.container.Container', {
                renderTo: 'mainContainer',
                layout: {
                    type: 'column',
                    align: 'center'
                },
                items: [ratioGauges, chart]
            });

            populateRatioGaugeStore(function () {
                Ext.fly('mainContainer').unmask();
            });
        }
        return {
            init: init
        };
    }();

    Ext.application({
        name: 'LVR-ratioGauges',
        launch: function () {
            Ext.fly('mainContainer').mask('Laddar data ...');
            widget.init();
        }
    });
})();