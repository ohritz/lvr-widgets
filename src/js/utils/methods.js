(function(Repository) {
    (function(Local) {
        var me = Local.Methods = {
            noOp: function() {},
            getChartData: function getChartdata(identifier, callback) {
                var baseUrl = '/stratum/api/statistics/lvr/gaugeWidget?id=';

                // todo: this url and implementation will change after api is finalized.
                var url = baseUrl + identifier;
                Ext.Ajax.request({
                    method: 'get',
                    url: url,
                    success: function(res) {
                        var data = Ext.decode(res.responseText);
                        callback(null, data);
                    },
                    failure: function(res) {
                        var err = new Error(res.statusText + ": " + res.responseText);
                        err.status = res.status;
                        callback(err);
                    }
                });
            },
            scrollToElement: function(element) {
                if (!element || !element.getY) {
                    return;
                }
                (Ext.isChrome
                    ? Ext.getBody()
                    : Ext.get(
                        document.documentElement
                    )).scrollTo('top', element.getY(), true);
            },
            loadMainChart: function(id, chart, gaugeData) {
                if (!gaugeData) {
                    return;
                }
                var clinicProp = 'ClinicALL=0',
                    //TODO: Set through config parameter instead?
                    regProp = 'ClinicALL=1',
                    //TODO: Set through config parameter instead?
                    dataFields = [],
                    graphFields = [],
                    titles = [],
                    clinicData = {
                        unit: typeof Profile !== 'undefined' &&
                            Profile.Context &&
                            Profile.Context.Unit &&
                            Profile.Context.Unit.UnitName ||
                            'Kliniken'
                    },
                    regData = {
                        //TODO: config param
                        unit: 'Registret'
                    },
                    i = 0,
                    store = chart.getStore(),
                    me = this,
                    numericAxis,
                    topAxis,
                    series,
                    nullPos;
                chart.show();
                // chart.hidden = false;
                Ext.Object.each(gaugeData[regProp], function(key, value) {
                    dataFields.push('andel' + i);
                    dataFields.push('antal' + i);
                    graphFields.push('andel' + i);
                    regData['antal' + i] = value;
                    regData['andel' + i] = 100 * value /
                        gaugeData.sums[regProp];
                    if (
                        typeof gaugeData[clinicProp] !== 'undefined' &&
                            typeof gaugeData[clinicProp][key] !== 'undefined'
                    ) {
                        clinicData['antal' + i] = gaugeData[clinicProp][key];
                        clinicData['andel' + i] = 100 *
                            gaugeData[clinicProp][key] /
                            gaugeData.sums[clinicProp];
                    }
                    titles.push(key);
                    i++;
                });
                store.setFields(Ext.Array.merge('unit', dataFields));
                Ext.Array.each(chart.getAxes(), function(axis) {
                    if (axis.type === 'numeric') {
                        axis.fields = graphFields;
                    }
                    if (axis.position === 'top') {
                        axis.title = gaugeData.desc;
                    }
                });
                nullPos = Ext.Array.indexOf(titles, 'Okänt');
                //TODO: should be set dynamically...
                gaugeData.colors = gaugeData.colors ||
                    ['#206876', '#04859d', '#37b6ce', '#5fbdce', '#015666'];
                //Probably a bug with ExtJS 5. Series sprites should not have to be removed from surface when setting series.
                try {
                    chart.getSeries().length > 0 &&
                        chart.getSeries()[0].getSurface().removeAll();
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
                    title: titles,
                    tooltip: {
                        // trackMouse: true,
                        renderer: function(record, item) {
                            var antal = 'antal', field = item.field;
                            if (field.indexOf('andel') === 0) {
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
                    },
                    colors: Ext.Array.insert(
                        gaugeData.colors.slice(0),
                        nullPos,
                        ['#AAA38E']
                    )
                });
                chart.setSprites({
                    type: 'text',
                    text: gaugeData.desc,
                    textAlign: 'middle',
                    fontSize: 20,
                    width: chart.getWidth(),
                    height: 30,
                    x: chart.getWidth() / 2,
                    y: 30
                });
                store.loadData([clinicData, regData]);
                me.scrollToElement(chart.getEl());
            }
        };
    })(Repository.Local = Repository.Local || {});
})(window.Repository = window.Repository || {});
