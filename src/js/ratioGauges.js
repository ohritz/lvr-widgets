(function (Ext) {
    var WIDGET_NAME = 'RC.ui.RatioGaugeContainer';

    function itemsFactory(reports, clickhandler, container) {        
        Ext.Array.each(reports, function (report) {
            container.add(Ext.create('RC.ui.RatioGauge', {
                columnWidth: 0.5,
                store: report.getData(),
                onClick: clickhandler
            }));
        });
    }

    function defineRatioGauges() {
        Ext.define(WIDGET_NAME, function () {
            var store
            return {
                extend: 'Ext.container.Container',
                defaultListenerScope: true,

                constructor: function (config) {
                    var self = this;
                    var store = config.store;
                    var clickHandler = typeof config.onClick === 'function' ? config.onClick : function () { };
                    
                    store.on('load', function (record, operation) {
                        itemsFactory(operation, clickHandler, self);
                        self.doLayout();
                    });
                    config.layout = config.layout || {
                        type: 'column',
                        align: 'center'
                    };
                    config.width = config.width || '100%';
                    this.callParent(arguments);
                }
            }

        });
    }

    function init() {
        if (!Ext)
            throw new Error('window.Ext not defined. WidgetScript must be loaded after Ext libs'); // Ext.util.CSS.createStyleSheet('');
        !Ext.ClassManager.isCreated(WIDGET_NAME) && defineRatioGauges();
    }

    init();
})(window.Ext);