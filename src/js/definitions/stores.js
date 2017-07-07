(function() {
    // var API_KEY = 'bK3H9bwaG4o=';
    // var UNIT_ID = '21';
    // var DIAGNOSIS = '1';

    Ext.define('RatioGaugeModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'value', type: 'number', mapping: 'Value'},
            {name: 'limit', type: 'number', mapping: 'malvarde', convert: function(v) {
                return v === 'NA' ? null : parseFloat(v);
            }},
            {name: 'description', type: 'string', mapping: 'big5namn'},
            {name: 'descName', type: 'string', allowNull: true, mapping: 'big5description'},
            {name: 'tooltip', type: 'string', mapping: 'big5mouseover'},
            {name: 'indicator', type: 'string', mapping: 'valueid'},
            {name: 'invert', type: 'boolean', defaultValue: false, mapping: 'inverted'},
            {name: 'frequency', type: 'number', mapping: 'Svarsfrekvens'},
            {name: 'colors'}
        ]
    });
    Ext.define('TableModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'value', type: 'string', allowNull: true, mapping: 'V1'},
            {name: 'description', mapping: 'V2'}
        ]
    });
    Ext.define('DetailChartModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'unit', type: 'string', allowNull: true, mapping: 'Enhet'},
            {name: 'value', type: 'number', allowNull: true, mapping: 'Andel'}
        ]
    });
    Ext.create('Ext.data.Store', {
        storeId: 'TableStore',
        model: 'TableModel',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '/stratum/api/statistics/lvr/snabboversikt',
            reader: {
                type: 'json',
                rootProperty: 'data.tabell', 
            },
            extraParams: {
                // apikey: API_KEY,
                // unitid: UNIT_ID,
                // diagnos: DIAGNOSIS,
                panels: '1'
            },
            withCredentials: true,
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    });
    Ext.create('Ext.data.Store', {
        storeId: 'DetailChartStore',
        model: 'DetailChartModel',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '/stratum/api/statistics/lvr/snabboversikt',
            reader: {
                type: 'json',
                rootProperty: 'data', 
                transform: function (data) {
                    var newData = [];
                    var unitData = {};
                    Ext.each(data.data, function(x) {
                        unitData[x.Enhet] = unitData[x.Enhet] || [];
                        unitData[x.Enhet].push(x);
                    });
                    Ext.Object.eachValue(unitData, function(unit) {
                        var tVal = {};
                        var i = 1;
                        Ext.Object.eachValue(unit, function(val) {
                            tVal['total' + (i)] = val.Antal;
                            tVal['ratio' + (i)] = val.Andel;
                            tVal['title' + (i)] = val.Utfall;
                            tVal['freq'] = parseFloat(val.Svarsfrekvens);
                            tVal['unit'] = val.Enhet;
                            i++;
                        });
                        newData.push(tVal);
                    });
                    return newData;
                }
            },
            extraParams: {
                // apikey: API_KEY,
                // unitid: UNIT_ID,
                // diagnos: DIAGNOSIS,
                panels: '0',
                indicators: '1002'
            },
            withCredentials: true,
            pageParam: false,
            startParam: false,
            limitParam: false
        },
        sorters: function(record) {
            return record.unit === 'Riket' ? -1 : 1;
        }
    });
    Ext.create('Ext.data.Store', {
        storeId: 'ratioGaugeStore',
        model: 'RatioGaugeModel',
        proxy: {
            type: 'ajax',
            url: '/stratum/api/statistics/lvr/snabboversikt/',
            reader: {type: 'json', rootProperty: 'data.indikatorer'},
            extraParams: {
                rinvoke: 1,
                // apikey: API_KEY,
                // unitid: UNIT_ID,
                // diagnos: DIAGNOSIS,
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
