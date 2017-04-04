(function () {
    var widget = function () {
        function toast(msg) {
            Ext.toast(msg, '', 't');
        }

        function createChart() {
            var chart = Ext.create('Ext.chart.Chart', {
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
                colors: ['#206876', '#04859d', '#37b6ce', '#5fbdce', '#015666'],
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

            return chart;
        }

        function createRatioGaugesContainer(onClick) {
            var ratioGCont = Ext.create('RC.ui.RatioGaugeContainer', {
                columnWidth: 1,
                store: Ext.data.StoreManager.lookup('ratioGaugeStore'),
                onClick: onClick
            });
            return ratioGCont;
        }

        function onGaugeClickFactory(chart, callback) {
            var store = chart.getStore();
            return function loadChartAndShow() {
                chart.setLoading('Laddar data...');
                populateChartData(chart, this.report.indicator, this.report.big5description, callback);
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
        function getChartFields(store, fieldType) {
            var record = store.getAt(0);
            var fields = [];
            if(record) {
                Ext.each(Ext.Object.getKeys(record.data), function(field) {
                    if(field.indexOf(fieldType) === 0){
                        fields.push(field);
                    }
                })
            }
            return fields;
        }
        function getChartTitles(store) {
            titles = [];
            titleFields = getChartFields(store, 'title');
            Ext.each(titleFields, function(title){
               titles.push(store.getAt(0).get(title)); 
            });
            return titles;
        }
        function scrollToElement(element) {
            if (!element || !element.getY) {
                return;
            }
            (Ext.isChrome
                ? Ext.getBody()
                : Ext.get(
                    document.documentElement
                )).scrollTo('top', element.getY(), true);
        }
        function populateChartData(chart, indicator, description, callback) {
            var store = Ext.data.StoreManager.lookup('DetailChartStore');
            store.load({
                params: {
                    indicators: indicator
                },
                callback: function(records, operation, success) {
                    var graphFields = getChartFields(store, 'ratio');
                    try {
                        chart.getSeries().length > 0 &&
                        chart.getSeries()[0].getSurface().removeAll();
                        chart.setLoading(false);
                        chart.show();
                        scrollToElement(chart.getEl());
                        Ext.isFunction(callback) && callback();
                    } catch (e) {
                        Ext.log(e);
                    }
                    chart.setSeries({
                        type: 'bar',
                        // axis: 'left',
                        groupGutter: 0,
                        xField: 'unit',
                        yField: graphFields,
                        //must be set to avoid vml-bug in ie8
                        xPadding: 30,
                        stacked: false,
                        title: getChartTitles(store),
                        tooltip: {
                            // trackMouse: true,
                            renderer: function(record, item) {
                                var antal = 'total', field = item.field;
                                if (field.indexOf('ratio') === 0) {
                                    antal += field.substr(5);
                                    this.setHtml(
                                        Ext.String.format(
                                            '<b>{1}</b><br/>{0} observationer',
                                            record.get(antal),
                                            Ext.util.Format.number(
                                                record.get(item.field),
                                                '0.0%'
                                            )
                                        )
                                    );
                                }
                            }
                        },
                        // colors: Ext.Array.insert(
                        //     gaugeData.colors.slice(0),
                        //     nullPos,
                        //     ['#AAA38E']
                        // )
                    });
                    chart.setSprites({
                        type: 'text',
                        text: description,
                        textAlign: 'middle',
                        fontSize: 20,
                        width: chart.getWidth(),
                        height: 30,
                        x: chart.getWidth() / 2,
                        y: 30
                    });
                }
            });
            console.log(indicator);
        }
        function createTable () {
            return Ext.create('Ext.grid.Panel', {
                store: Ext.StoreManager.lookup('TableStore'),
                columnWidth: 1,
                width: '100%',
                // header: false,
                hideHeaders: true,
                disableSelection: true,
                columns: [
                    { text: 'Beskrivning', cellWrap: true, flex: 1, dataIndex: 'description' },
                    { text: 'Värde', dataIndex: 'value' }
                ],
            });
        }
        function createFrequenceGauge () {
            var chart = Ext.create({
                xtype: 'heatgauge',
                style: {},
                margin: '8 0 0 0',
                limitField: 'limit',
                invertLimitField: 'invert',
                store: Ext.StoreManager.lookup('DetailChartStore'),
                valueField: 'freq',
                hidden: true,
                background: '#fff',
                width: 400,
                height: 90,
                insetPadding: {
                    top: 25,
                    right: 25,
                    left: 25,
                    bottom: 25
                },
                sprites: [{ 
                    type: 'text',
                    text: 'Enhetens svarsfrekvens för indikatorn',
                    textAlign: 'middle',
                    fontSize: 20,
                    width: 400,
                    height: 30,
                    x: 400/2,
                    y: 18
                }]
            });
            return chart;
        }
        function init(container) {
            var chart, ratioGauges;
            table = createTable();
            chart = createChart();
            frequencyGauge = createFrequenceGauge();
            ratioGauges = createRatioGaugesContainer(
                onGaugeClickFactory(chart, function () {
                    frequencyGauge.show();
                })
            );
            Ext.tip.QuickTipManager.init(true, {
                dismissDelay: 0
            });

            Ext.create('Ext.container.Container', {
                renderTo: container,
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                items: [table, ratioGauges, chart, frequencyGauge]
            });

            populateRatioGaugeStore(function () {
                Ext.fly(container).unmask();
            });
        }
        return {
            init: init
        };
    }();

    var mainContainer = 'mainContainer';
    Ext.application({
        name: 'LVR-ratioGauges',
        launch: function () {
            Ext.fly('mainContainer').mask('Laddar data ...');
            widget.init(mainContainer);
        }
    });
})();