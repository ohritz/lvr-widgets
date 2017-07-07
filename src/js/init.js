(function () {

    /**
     * External widget configuration through stratum widget api params 
     */
    var isTemplate = window.isTemplate || function() {
        return true;
    }
    var templateVariables = window._devTemplateVariables || {
        diagnosis: '{{diagnosis}}',
        container: '{{ct}}'
    };
    var config = {
        unitId: typeof Profile !== 'undefined' ? Profile.Context.Unit.UnitCode : null,
        diagnosis: !isTemplate(templateVariables.diagnosis) ? templateVariables.diagnosis : 1,
        container: !isTemplate(templateVariables.container) ? templateVariables.container
            : (typeof Stratum !== 'undefined' && Stratum.containers && Stratum.containers['LVR/NewOverview'] || 'mainContainer')
    };
    
    var widget = function () {
        function toast(msg) {
            Ext.toast(msg, '', 't');
        }
        function createChart() {
            var chart = Ext.create('Ext.chart.Chart', {
                store: Ext.data.StoreManager.lookup('DetailChartStore'),
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

        function populateTableData(config) {
            var tableStore = Ext.StoreManager.lookup('TableStore');
            tableStore.load({
                params: {
                    diagnos: config.diagnosis
                }
            });
        }
        function populateRatioGaugeStore(config, cb) {
            var store = Ext.data.StoreManager.lookup('ratioGaugeStore');
            if (!store.isLoaded() && !store.isLoading()) {
                store.load({
                    params: {
                        diagnos: config.diagnosis
                    },
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
                        Ext.isFunction(callback) && callback(records);
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
                        }
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
        }
        function createTable () {
            return Ext.create('Ext.grid.Panel', {
                store: Ext.StoreManager.lookup('TableStore'),
                columnWidth: 1,
                width: '100%',
                margin: {
                    bottom: 20
                },
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
                height: 95,
                insetPadding: {
                    top: 30,
                    right: 25,
                    left: 25,
                    bottom: 25
                }
            });
            return chart;
        }
        function init(container, config) {
            var chart, ratioGauges;
            populateTableData(config);
            table = createTable();
            chart = createChart();
            frequencyGauge = createFrequenceGauge();
            ratioGauges = createRatioGaugesContainer(
                onGaugeClickFactory(chart, function (records) {
                    var frequency = records && records[1].get('freq');
                    frequencyGauge.setSprites([{ 
                        type: 'text',
                        text: 'Enhetens svarsfrekvens för indikatorn',
                        textAlign: 'middle',
                        fontSize: 20,
                        width: 400,
                        height: 30,
                        x: 400/2,
                        y: 18
                    },{ 
                        type: 'text',
                        text: Ext.util.Format.number(frequency, '0 %'),
                        textAlign: 'middle',
                        fontSize: 20,
                        width: 400,
                        height: 30,
                        x: 400/2 + 3,
                        y: frequencyGauge.height
                    }]);
                    
                    frequencyGauge.show();
                })
            );

            Ext.create('Ext.container.Container', {
                renderTo: container,
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                items: [table, ratioGauges, chart, frequencyGauge]
            });

            populateRatioGaugeStore(config, function () {
                Ext.fly(container).unmask();
            });
        }
        return {
            init: init
        };
    }();

    Ext.application({
        name: 'LVR-ratioGauges',
        launch: function () {
            var container = Ext.fly(config.container);
            if (container){
                container.mask('Laddar data ...');
                widget.init(container, config);
            }
        }
    });
})();