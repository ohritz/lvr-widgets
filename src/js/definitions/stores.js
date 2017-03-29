(function() {
    Ext.define('RatioGaugeModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'value', type: 'number', mapping: 'Value'},
            {name: 'limit', type: 'number', mapping: 'malvarde'},
            {name: 'description', type: 'string'},
            {name: 'descName', type: 'string', allowNull: true, mapping: 'valuelabel'},
            {name: 'indicator', type: 'string', mapping: 'valueid'},
            {name: 'invert', type: 'boolean', defaultValue: false, mapping: 'inverted'},
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
            url: 'https://stratum.registercentrum.se/api/statistics/lvr/snabboversikt/',
            reader: {type: 'json', rootProperty: 'data.indikatorer'},
            extraParams: {
                rinvoke: 1,
                apikey: 'bK3H9bwaG4o=',
                unitid: '21',
                diagnos: '1',
                panels: '1',
            },
            noCache: false,
            withCredentials: true,
            pageParam: '',
            startParam: '',
            limitParam: ''
        }
    });
})();
