(function () {
    window.isTemplate = function (template) {
        return ['{{diagnosis}}'].indexOf(template) === -1;
    }
    window._devTemplateVariables = {
        diagnosis: 100
    }
    Ext.tip.QuickTipManager.init(true, {
        dismissDelay: 0
    });
    Ext.data.Store.override({
        load: function(val) {
            this.proxy.url = this.proxy.url && this.proxy.url.indexOf('/') === 0 ? ('https://stratum.registercentrum.se' + this.proxy.url) : this.proxy.url;
            this.callParent(arguments);
            return this;
        }
    });
}())