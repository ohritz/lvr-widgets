(function (Repository) {
    (function (Local) {
        Local.Methods = {
            noOp: function(){},
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
                    failure: function(err) {
                        callback(err);
                    }
                })
            },
            scrollToElement: function (element) {
                if (!element || !element.getY) {
                    return;
                }
                (Ext.isChrome ? Ext.getBody() : Ext.get(document.documentElement)).scrollTo('top', element.getY(), true);
            }
        }
    })(Repository.Local = Repository.Local || {});
}(window.Repository = window.Repository || {}));