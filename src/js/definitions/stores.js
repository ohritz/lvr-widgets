(function() {
    var API_KEY = 'bK3H9bwaG4o=';
    var UNIT_ID = '21';
    var DIAGNOSIS = '1';

    Ext.define('RatioGaugeModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'value', type: 'number', mapping: 'Value'},
            {name: 'limit', type: 'number', mapping: 'malvarde', convert: function(v) {
                return v === 'NA' ? null : parseFloat(v);
            }},
            {name: 'description', type: 'string', mapping: 'big5namn'},
            {name: 'descName', type: 'string', allowNull: true, mapping: 'big5description'},
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
                apikey: API_KEY,
                unitid: UNIT_ID,
                diagnos: DIAGNOSIS,
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
