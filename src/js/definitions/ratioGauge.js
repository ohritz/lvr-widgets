(function(Ext) {
    var WIDGET_NAME = 'RC.ui.RatioGauge';
    var HEATGUAGE_NAME = 'RC.ui.HeateGuage';

    function defineHeatGauge() {
        Ext.define(HEATGUAGE_NAME, {
            extend: 'Ext.chart.PolarChart',
            alias: 'widget.heatgauge',
            constructor: function(config) {
                if (config && config.valueField) {
                    var renderer;
                    if (config.limitField) {
                        renderer = {
                            renderer: function(
                                sprite,
                                record,
                                attribute,
                                index
                            ) {
                                if (
                                    index !== 0 ||
                                        !record.get(config.limitField)
                                ) {
                                    return attribute;
                                }
                                return attribute; //TEST
                            }
                        };
                    }
                    config.series = {
                        type: 'gauge',
                        field: config.valueField,
                        donut: 50,
                        colors: ['#3CB6CE', '#ddd'],
                        minimum: 0,
                        maximum: 100,
                        steps: 1,
                        totalAngle: Math.PI,
                        needleLength: 100,
                        // background: {fill: '#fff', fillOpacity: 0, globalAlpha: 0}
                        background: config.background || 'rgb(247, 247, 247)'
                    };
                }
                this.callParent([config]);
            },
            animate: true,
            insetPadding: 0
        });
    }
    function getChoiceFromState(state, danger, success, standard) {
        switch (state) {
            case 'danger':
                return danger;
            case 'success':
                return success;
            default:
                return standard;
        }
    }

    function getState(report) {
        return report.limit !== null
            ? (report.value > report.limit ? !report.invert : report.invert)
                ? 'success'
                : 'danger'
            : '';
    }
    function itemsFactory(report, state, clickHandler) {
        return [
            {
                xtype: 'heatgauge',
                valueField: 'value',
                style: {},
                margin: '8 0 0 0',
                limitField: 'limit',
                invertLimitField: 'invert',
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'limit', 'invert'],
                    data: [report]
                }),
                width: 75,
                height: 30
            },
            {
                xtype: 'button',
                ui: 'none',
                flex: 1,
                height: '100%',
                width: '100%',
                padding: '4 7 7 2',
                enableToggle: true,
                allowDepress: false,
                toggleGroup: 'heatg',
                pressedCls: 'gauge-button-pressed',
                cls: 'gauge-btn gauge-btn' +
                    getChoiceFromState(state, '-danger', '-success', '-info'),
                style: {
                    borderLeft: '1px solid #ccc',
                    width: '100%'
                },
                // shrinkWrap: false,
                frame: false,
                data: {
                    text: report.description,
                    value: Ext.util.Format.number(report.value || 0, '0%')
                },
                textAlign: 'left',
                tooltip: '<div>' + report.tooltip + '</div>',
                // height: 40,
                tpl: '<div style="position:relative;">' +
                    '<div class="value-text pull-left">{value}</div>' +
                    '<div class="gauge-desc pull-left">{text}</div>' +
                    '<div class="gauge-icon pull-right">' +
                    getChoiceFromState(state, '&#xf071;', '&#xf00c;', '') +
                    '</div>' +
                    '</div>',
                listeners: {
                    beforerender: function(bt) {
                        var tpl = new Ext.XTemplate(bt.tpl);
                        bt.setText(tpl.apply(bt.data));
                    },
                    click: function() {
                        var ratioGuage = this.ownerCt;
                        clickHandler.apply(ratioGuage);
                    }
                }
            }
        ];
    }
    function defineRatioGauge() {
        Ext.define(WIDGET_NAME, function(data) {
            return {
                extend: 'Ext.container.Container',
                cls: 'gauge-button',
                margin: '2px',
                layout: 'hbox',
                style: {
                    border: '1px solid',
                    background: '#f7f7f7',
                    borderRadius: '3px'
                },
                minHeight: 50,
                constructor: function(config) {
                    var report = config.report;
                    var clickHandler = typeof config.onClick === 'function'
                        ? config.onClick
                        : Repository.Local.Methods.noOp;
                    var state = getState(report);
                    this.style.borderColor = getChoiceFromState(
                        state,
                        '#ebccd1',
                        '#d6e9c6',
                        '#bce8f1'
                    );
                    config.items = itemsFactory(report, state, clickHandler);
                    this.callParent(arguments);
                }
            };
        });
    }
    function init() {
        if (!Ext)
            throw new Error(
                'window.Ext not defined. WidgetScript must be loaded after Ext libs'
            );
        !Ext.ClassManager.isCreated(HEATGUAGE_NAME) && defineHeatGauge();
        !Ext.ClassManager.isCreated(WIDGET_NAME) && defineRatioGauge();
    }
    init();
})(window.Ext);
