ig.module("impact.feature.carnellio-database").requires("impact.base.loader", "game.config").defines(function() {
        ig.CarnellioDatabase = ig.SingleLoadable.extend({
            cacheType: "carnellio-database",
            data: null,
            entries: {},
            register: function(b, a, d, c) {
                this.entries[b] = {
                    editor: a,
                    displayName: d || b
                };
                if(c) this.entries[b].external = {
                    path: c.path || null,
                    data: c.data
                }
            },
            get: function(b) {
                return this.data[b]
            },
            loadInternal: function() {
                $.ajax({
                    dataType: "json",
                    url: ig.root + "data/carnellio-database.json" + ig.getCacheSuffix(),
                    context: this,
                    success: this.onload.bind(this),
                    error: this.onerror.bind(this)
                })
            },
            onerror: function(b) {
                this.data = {
                    error: b
                };
                this.loadingFinished(true)
            },
            onload: function(b) {
                this.data = b;
                this.loadingFinished(true);
                ig.JSON_LOG && ig.log("%cLOADABLE: %cLoaded carnellio Database: \n%O", "color:#149AEB", "", b)
            }
        });
        ig.carnellioDatabase = new ig.CarnellioDatabase
});