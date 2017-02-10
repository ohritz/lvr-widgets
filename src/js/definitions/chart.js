(function(Ext) {
    var LVR_CHART_NAME = 'Rc.ui.LvrChart';
    var LVR_CHART_CONTAINER_NAME = 'Rc.ui.LvrChartContainer';

    function defineContainer() {
        Ext.define(LVR_CHART_CONTAINER_NAME, {
            extend: 'Ext.container.Container',
            hidden: true,
            align: 'center',
            height: 500,
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
            constructor: function(config) {
                var store = config.store;
                config.layout = {
                    type: 'vbox',
                    align: 'center'
                };
                var legend = Ext.create('Ext.chart.Legend', {
                    // floating: true
                });

                var chart = Ext.create(LVR_CHART_NAME, {
                    store: store,
                    legend: legend
                    // theme: 'LVRTheme',
                });


                //todo: make gauge for each series, and set data correctly..
                // todo: position the gauges in thier respective containers.
                var gauge1 = {
                    xtype: 'heatgauge',
                    valueField: 'value',
                    style: {
                        align: 'center'
                    },
                    margin: '8 0 0 0',
                    limitField: 'limit',
                    invertLimitField: 'invert',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'limit', 'invert'],
                        data: [store]
                    }),
                    width: '50%',
                    height: 30
                };

                var gauge2 = {
                    xtype: 'heatgauge',
                    valueField: 'value',
                    style: {},
                    margin: '8 0 0 0',
                    limitField: 'limit',
                    invertLimitField: 'invert',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'limit', 'invert'],
                        data: [store]
                    }),
                    width: 75,
                    height: 30
                };
                var gaugeContainer = {
                    xtype: 'container',
                    width: '100%',
                    layout: 'box',
                    items: [gauge1, gauge2]
                }
                config.items = [chart,gaugeContainer, legend];

                this.callParent([config]);
            }
        });
    }
    function defineChart() {
        Ext.define(LVR_CHART_NAME, {
            extend: 'Ext.chart.Chart',
            alias: 'widget.lvrchart',
            animate: true,
            shadow: false,
            height: 360,
            width: '100%',
            axes: [
                {
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
            ],
            constructor: function(config) {
                this.callParent([config]);
            }
        });
    }

    function init() {
        if (!Ext)
            throw new Error(
                'window.Ext not defined. WidgetScript must be loaded after Ext libs'
            );
        !Ext.ClassManager.isCreated(LVR_CHART_NAME) && defineChart();
        !Ext.ClassManager.isCreated(LVR_CHART_CONTAINER_NAME) &&
            defineContainer();
    }
    init();
})(window.Ext);
