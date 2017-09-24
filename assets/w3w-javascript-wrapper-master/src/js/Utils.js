W3W.Utils = {
    mergeOptions: function(dest) {
        var i;
        var j;
        var len;
        var src;

        var options = JSON.parse(JSON.stringify(dest));

        for (i=1, len = arguments.length; i<len; i++) {
            src = arguments[i];
            for (j in src) {
                options[j] = src[j];
            }
        }
        return options;
    },

    assembleQuery: function(params) {
        var query = [];
        for (var key in params) {
            query.push(key + '=' + encodeURIComponent(params[key]));
        }
        return query.join('&');
    }
};
