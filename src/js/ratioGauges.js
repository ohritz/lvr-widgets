(function (Ext) {
    var WIDGET_NAME = 'RC.ui.RatioGaugeContainer';

    function itemsFactory(storeItems, container, clickHandler) {        
        Ext.Array.each(storeItems, function (storeItem) {
            container.add(Ext.create('RC.ui.RatioGauge', {
                columnWidth: 0.5,
                report: storeItem.getData(),
                onClick: clickHandler
            }));
        });
    }

    function defineRatioGauges() {
        Ext.define(WIDGET_NAME, function () {
            var store
            return {
                extend: 'Ext.container.Container',

                constructor: function (config) {
                    var self = this;
                    var store = config.store;
                    var onGaugeClick = typeof config.onClick === 'function' ? config.onClick : Repository.Local.Methods.noOp;
                    
                    store.on('load', function (record, operation) {
                        itemsFactory(operation, self, onGaugeClick);
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