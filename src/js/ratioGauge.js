(function (Ext) {
    var WIDGET_NAME = 'RC.ui.RatioGuage'
    var HEATGUAGE_NAME = 'RC.ui.HeateGuage'

    function defineHeatGauge() {
        Ext.define(HEATGUAGE_NAME, {
            extend: 'Ext.chart.PolarChart',
            alias: 'widget.heatgauge',
            constructor: function (config) {
                if (config && config.valueField) {
                    var renderer;
                    if (config.upperLimitField) {
                        renderer = {
                            renderer: function (sprite, record, attribute, index) {
                                if (index !== 0 || !record.get(config.upperLimitField)) {
                                    return attribute;
                                }
                                return attribute; //TEST
                            }
                        };
                    }
                    // config.series = [Ext.apply({
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
                        background: config.background || 'rgb(247, 247, 247)'
                        // background: {fill: '#fff', fillOpacity: 0, globalAlpha: 0}
                    };
                    // }, renderer)];
                }
                this.callParent([config]);
            },
            animate: true,
            insetPadding: 0,
            // axes: [{
            //     type: 'gauge',
            //     position: 'gauge',
            //     label: {
            //         renderer: function() {
            //             return '';
            //         }
            //     }
            // }]
        });
    }

    function getChoiceFromState(state, danger, success, standard) {
        switch (state) {
            case 'danger':
                return danger;
            case 'success':
                return success;
            default:
                return standard
        }
    }

    function itemsFactory(report, state, clickHandler) {
        return [{
            xtype: 'heatgauge',
            valueField: 'value',
            style: {
                // paddingTop: '5px'
            },
            margin: '8 0 0 0',
            lowerLimitField: 'lowerLimit',
            upperLimitField: 'upperLimit',
            invertLimitField: 'invert',
            store: Ext.create('Ext.data.Store', {
                fields: ['value', 'upperLimit', 'lowerLimit', 'invert'],
                data: [report]
            }),
            width: 75,
            height: 30
        }, {
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
            cls: 'gauge-btn gauge-btn' + getChoiceFromState(state, '-danger', '-success', ''),
            style: {
                background: state === 'danger' ? '#f2dede' : state === 'success' ? '#dff0d8' : '#d9edf7',
                borderLeft: '1px solid #ccc',
                color: getChoiceFromState(state, '#a94442', '#3c763d', '#31708f'),
                width: '100%'
            },
            // shrinkWrap: false,
            frame: false,
            data: {
                text: report.description,
                value: Ext.util.Format.number(report.value || 0, '0%')
            },
            textAlign: 'left',
            tooltip: '<p>' + getChoiceFromState(state, 'Registrets mål på <b>' + report.upperLimit + '%</b> är inte uppnått ännu', 'Registrets mål på <b>' + report.upperLimit + '%</b> är uppnått!', 'Beskrivande indikator som saknar målvärde') + '</p><i>Klicka för komplett fördelning</i>',
            // height: 40,
            tpl:'<div style="position:relative;">' +
                '<div class="value-text pull-left">{value}</div>' +
                '<div class="gauge-desc pull-left">{text}</div>' +
                '<div class="gauge-icon pull-right">' + getChoiceFromState(state, '&#xf071;', '&#xf00c;', '') + '</div>' +
                '</div>',
            listeners: {
                beforerender: function (bt) {
                    var tpl = new Ext.XTemplate(bt.tpl);
                    bt.setText(tpl.apply(bt.data));
                },
                click: clickHandler
            }
        }];
    }

    function defineRatioGauge() {
        Ext.define(WIDGET_NAME, function (data) {
            var store
            return {
                extend: 'Ext.container.Container',
                cls: 'gauge-button',
                margin: '2px',
                columnWidth: 0.5,
                layout: 'hbox',
                style: {
                    border: '1px solid',
                    background: '#f7f7f7',
                    borderRadius: '3px'
                },
                minHeight: 50,

                constructor: function (config) {
                    var report = config.store;
                    var clickHandler = typeof config.onClick === 'function' ? config.onClick : function(){};
                    var state = Ext.isDefined(report.upperLimit) ? ((report.value > report.upperLimit ? !report.invert : report.invert) ? 'success' : 'danger') : '';
                    this.style.borderColor = getChoiceFromState(state, '#ebccd1', '#d6e9c6', '#bce8f1');
                    config.items = itemsFactory(report, state, clickHandler);
                    this.callParent(arguments);
                }
            }

        });
    }

    function init() {
        if(!Ext)
        return;
        // Ext.util.CSS.createStyleSheet('');
        !Ext.ClassManager.isCreated(HEATGUAGE_NAME) && defineHeatGauge();
        !Ext.ClassManager.isCreated(WIDGET_NAME) && defineRatioGauge();
    }

    init();
}(window.Ext));