(function() {
    var widget = (function() {
        function toast(msg) {
            Ext.toast(msg, '', 't');
        }

        function createChartContainer() {
            return Ext.create('Rc.ui.LvrChartContainer', {
                store: Ext.data.StoreManager.lookup('DetailChartStore')
                // theme: 'LVRTheme',                
            });
        }

        function createRatioGaugesContainer(onClick) {
            return Ext.create('RC.ui.RatioGaugeContainer', {
                columnWidth: 1,
                store: Ext.data.StoreManager.lookup('ratioGaugeStore'),
                onClick: onClick
            });
        }

        function onGaugeClickFactory(chart, container) {
            var store = chart.getStore();
            return function loadChartAndShow() {
                // this function is called from within the ratioGauge listener::click.
                // so 'this' is the ratioGauge
                var id = this.report.id;
                if (typeof id !== 'undefined') {
                    Repository.Local.Methods.getChartData(
                        this.report.id,
                        function(err, payload) {
                            if (err) {
                                toast(
                                    'Kunde inte hämta data, var god försök igen senare.'
                                );
                                return Ext.log(err);
                            }
                            Repository.Local.Methods.loadMainChart(
                                payload.d.id,
                                chart,
                                payload.d.data
                            );
                            // debugger;
                            // container.show();
                            // container.doLayout();
                        }
                    );
                }
            };
        }

        function populateRatioGaugeStore(cb) {
            var store = Ext.data.StoreManager.lookup('ratioGaugeStore');
            if (!store.isLoaded() && !store.isLoading()) {
                store.load({
                    params: {},
                    callback: function(records, operation, success) {
                        if (success) {
                            return cb();
                        } else {
                            toast(
                                'Kunde inte hämta data, var god försök igen.'
                            );
                        }
                    }
                });
            }
        }

        function init() {
            var chart,chartContainer, ratioGauges;

            chartContainer = createChartContainer();
            chart = chartContainer.getComponent(0);
            ratioGauges = createRatioGaugesContainer(
                onGaugeClickFactory(chart, chartContainer)
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
                items: [ratioGauges, chartContainer]
            });

            populateRatioGaugeStore(function() {
                Ext.fly('mainContainer').unmask();
            });
        }
        return {
            init: init
        };
    })();

    Ext.application({
        name: 'LVR-ratioGauges',
        launch: function() {
            Ext.fly('mainContainer').mask('Laddar data ...');
            widget.init();
        }
    });
})();
