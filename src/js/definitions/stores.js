(function() {
    Ext.define('RatioGaugeModel', {
        extend: 'Ext.data.Model',
        fields: [
            {value: 'value', type: 'number'},
            {name: 'limit', type: 'number'},
            {name: 'description', type: 'string'},
            {name: 'descName', type: 'string', allowNull: true},
            {name: 'indicator', type: 'string'},
            {name: 'invert', type: 'boolean', defaultValue: false},
            {name: 'colors'}
        ]
    });
    Ext.define('DetailChartModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'unit', type: 'string', allowNull: true},
            {name: 'value', type: 'number', allowNull: true}
        ]
    });
    Ext.create('Ext.data.Store', {
        storeId: 'DetailChartStore',
        model: 'DetailChartModel'
    });
    Ext.create('Ext.data.Store', {
        storeId: 'ratioGaugeStore',
        model: 'RatioGaugeModel',
        proxy: {
            type: 'ajax',
            url: '/stratum/api/statistics/lvr/gaugeWidget',
            reader: {type: 'json', rootProperty: 'data'},
            noCache: false,
            pageParam: '',
            startParam: '',
            limitParam: ''
        }
    });
})();
