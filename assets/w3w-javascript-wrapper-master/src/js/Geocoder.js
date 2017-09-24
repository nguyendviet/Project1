W3W.Geocoder = function(options) {
    this.base_url = 'https://api.what3words.com/v2/' ;

    if (typeof options === 'undefined') {
        throw new Error('Missing what3words options');
    }
    else if (options && !options.hasOwnProperty('key')) {
        throw new Error('Missing what3words API key');
    }
    this.options = {
        lang: 'en',
        format: 'json'
    };
    this.options = W3W.Utils.mergeOptions(this.options, options);
    if (this.options.hasOwnProperty('base_url')) {
        this.base_url = this.options.base_url;
        delete this.options.base_url;
    }
    this.urls = {
        forward: this.base_url + 'forward',
        reverse: this.base_url + 'reverse',
        autosuggest: this.base_url + 'autosuggest',
        standardblend: this.base_url + 'standardblend',
        autosuggest_ml: this.base_url + 'autosuggest-ml',
        standardblend_ml: this.base_url + 'standardblend-ml',
        grid: this.base_url + 'grid',
        languages: this.base_url + 'languages'
    };
};

// var params = {
//      addr: '3-word-address',
//      lang: 'en',
//      format: 'json|geojson'
// };
W3W.Geocoder.prototype.forward = function(params, callback) {
    if (typeof params === 'undefined' || typeof params !== 'object') {
        throw new Error('Missing or invalid params object');
    }

    if (params) {
        if (!params.hasOwnProperty('addr')) {
            throw new Error('The params object is missing required addr property');
        }
        else if (typeof params.addr !== 'string') {
            throw new Error('params.addr must be a string');
        }

        if (params.hasOwnProperty('lang') && typeof params.lang !== 'string') {
            throw new Error('params.lang must be a string');
        }

        if (params.hasOwnProperty('format')) {
            if (typeof params.format !== 'string') {
                throw new Error('params.format must be a string');
            }
            else if (params.format !== 'json' && params.format !== 'geojson') {
                throw new Error('params.format must have a value of "json" or "geojson"');
            }
        }
    }

    if (typeof callback === 'undefined') {
        throw new Error('Missing callback parameter');
    }
    else if (typeof callback !== 'object') {
        throw new Error('Missing or invalid callback parameter');
    }

    params = W3W.Utils.mergeOptions(this.options, params);
    var url = this.urls.forward + '?' + W3W.Utils.assembleQuery(params);
    W3W.Xhr.handleRequest(url, callback);
};

// var params = {
//      coords: [lat, long],
//      coords: 'lat,long',
//      lang: 'en',
//      format: 'json|geojson'
// };
W3W.Geocoder.prototype.reverse = function(params, callback) {
    if (typeof params === 'undefined' || typeof params !== 'object') {
        throw new Error('Missing or invalid params object');
    }

    if (params) {
        if (!params.hasOwnProperty('coords')) {
            throw new Error('The params object is missing required coords property');
        }
        else {
            params.coords = this._formatCoords(params.coords);
            if (null === params.coords) {
                throw new Error('Invalid format coordinates for params.coords');
            }
        }

        if (params.hasOwnProperty('lang') && typeof params.lang !== 'string') {
            throw new Error('params.lang must be a string');
        }

        if (params.hasOwnProperty('format')) {
            if (typeof params.format !== 'string') {
                throw new Error('params.format must be a string');
            }
            else if (params.format !== 'json' && params.format !== 'geojson') {
                throw new Error('params.format must have a value of "json" or "geojson"');
            }
        }
    }

    if (typeof callback === 'undefined') {
        throw new Error('Missing callback parameter');
    }
    else if (typeof callback !== 'object') {
        throw new Error('Missing or invalid callback parameter');
    }

    params = W3W.Utils.mergeOptions(this.options, params);
    var url = this.urls.reverse + '?' + W3W.Utils.assembleQuery(params);
    W3W.Xhr.handleRequest(url, callback);
};

// var params = {
//      lang: 'en',
//      addr: '3-word-address'
//     focus: [lat, lng],
//     focus: 'lat,lng',
//     clip: {
//         type: 'none'
//     }
//     clip: {
//         type: 'radius',
//         focus: [lat, lng],
//         focus: 'lat,lng',
//         distance: km
//     },
//     clip: {
//         type: 'focus'
//         distance: km
//     },
//     clip: {
//         type: 'bbox',
//         bbox: [lat,lng,lat,lng],
//         bbox: 'lat,lng,lat,lng'
//     }
// };
W3W.Geocoder.prototype.autosuggest = function(params, callback) {
    if (typeof params === 'undefined' || typeof params !== 'object') {
        throw new Error('Missing or invalid params object');
    }

    var clip = {};

    if (params) {
        if (!params.hasOwnProperty('addr')) {
            throw new Error('The params object is missing required addr property');
        }
        else if (typeof params.addr !== 'string') {
            throw new Error('params.addr must be a string');
        }

        if (params.hasOwnProperty('focus')) {
            params.focus = this._formatCoords(params.focus);
            if (null === params.focus) {
                throw new Error('Invalid format coordinates for params.focus');
            }
        }

        if (!params.hasOwnProperty('lang')) {
            throw new Error('The params object is missing required lang property');
        }
        else if (typeof params.lang !== 'string') {
            throw new Error('params.lang must be a string');
        }

        if (params.hasOwnProperty('format')) {
            if (typeof params.format !== 'string') {
                throw new Error('params.format must be a string');
            }
            else if (params.format !== 'json') {
                throw new Error('params.format must have a value of "json"');
            }
        }

        if (params.hasOwnProperty('clip')) {
            if (!params.clip.hasOwnProperty('type')) {
                throw new Error('Invalid clipping policy type for params.clip');
            }

            switch (params.clip.type) {
                case 'none':
                    clip = {
                        clip: 'none'
                    };
                    break;

                case 'radius':
                    if (!params.clip.hasOwnProperty('distance')) {
                        throw new Error('Invalid clipping policy for type radius; missing distance property');
                    }

                    else if (!params.clip.hasOwnProperty('focus')) {
                        throw new Error('Invalid clipping policy for type radius; missing focus property');

                    }

                    else {
                        params.clip.focus = this._formatCoords(params.clip.focus);
                        if (null === params.focus) {
                            throw new Error('Invalid format coordinates for params.clip.focus');
                        }
                    }

                    clip = {
                        clip: 'radius(' + params.clip.focus + ',' + params.clip.distance + ')'
                    };
                    break;

                case 'focus':
                    if (!params.clip.hasOwnProperty('distance')) {
                        throw new Error('Invalid clipping policy for type focus; missing distance property');
                    }
                    else if (!params.hasOwnProperty('focus') || params.focus === null) {
                        throw new Error('Invalid clipping policy for type focus; missing or invalid focus property');
                    }

                    clip = {
                        clip: 'focus(' + params.clip.distance + ')'
                    };
                    break;

                case 'bbox':
                    if (!params.clip.hasOwnProperty('bbox')) {
                        throw new Error('Invalid clipping policy for type bbox; missing bbox property');
                    }
                    params.clip.bbox = this._formatBoundingBox(params.clip.bbox);
                    if (null === params.clip.bbox) {
                        throw new Error('Invalid format coordinates for params.clip.bbox');
                    }

                    clip = {
                        clip: 'bbox(' + params.clip.bbox + ')'
                    };
                    break;

                default:
                    throw new Error('Invalid or unrecognised clipping policy type');
            }
        }
    }

    if (typeof callback === 'undefined') {
        throw new Error('Missing callback parameter');
    }
    else if (typeof callback !== 'object') {
        throw new Error('Missing or invalid callback parameter');
    }

    params = W3W.Utils.mergeOptions(this.options, params, clip);
    var url = this.urls.autosuggest + '?' + W3W.Utils.assembleQuery(params);
    W3W.Xhr.handleRequest(url, callback);
};

// var params = {
//      lang: 'en',
//      addr: '3-word-address'
//     focus: [lat, lng],
//     focus: 'lat,lng',
//     clip: {
//         type: 'none'
//     }
//     clip: {
//         type: 'radius',
//         focus: [lat, lng],
//         focus: 'lat,lng',
//         distance: km
//     },
//     clip: {
//         type: 'focus'
//         distance: km
//     },
//     clip: {
//         type: 'bbox',
//         bbox: [lat,lng,lat,lng],
//         bbox: 'lat,lng,lat,lng'
//     }
// };
W3W.Geocoder.prototype.autosuggest_ml = function(params, callback) {
    if (typeof params === 'undefined' || typeof params !== 'object') {
        throw new Error('Missing or invalid params object');
    }

    var clip = {};

    if (params) {
        if (!params.hasOwnProperty('addr')) {
            throw new Error('The params object is missing required addr property');
        }
        else if (typeof params.addr !== 'string') {
            throw new Error('params.addr must be a string');
        }

        if (params.hasOwnProperty('focus')) {
            params.focus = this._formatCoords(params.focus);
            if (null === params.focus) {
                throw new Error('Invalid format coordinates for params.focus');
            }
        }

        if (!params.hasOwnProperty('lang')) {
            throw new Error('The params object is missing required lang property');
        }
        else if (typeof params.lang !== 'string') {
            throw new Error('params.lang must be a string');
        }

        if (params.hasOwnProperty('format')) {
            if (typeof params.format !== 'string') {
                throw new Error('params.format must be a string');
            }
            else if (params.format !== 'json') {
                throw new Error('params.format must have a value of "json"');
            }
        }

        if (params.hasOwnProperty('clip')) {
            if (!params.clip.hasOwnProperty('type')) {
                throw new Error('Invalid clipping policy type for params.clip');
            }

            switch (params.clip.type) {
                case 'none':
                    clip = {
                        clip: 'none'
                    };
                    break;

                case 'radius':
                    if (!params.clip.hasOwnProperty('distance')) {
                        throw new Error('Invalid clipping policy for type radius; missing distance property');
                    }

                    else if (!params.clip.hasOwnProperty('focus')) {
                        throw new Error('Invalid clipping policy for type radius; missing focus property');

                    }

                    else {
                        params.clip.focus = this._formatCoords(params.clip.focus);
                        if (null === params.focus) {
                            throw new Error('Invalid format coordinates for params.clip.focus');
                        }
                    }

                    clip = {
                        clip: 'radius(' + params.clip.focus + ',' + params.clip.distance + ')'
                    };
                    break;

                case 'focus':
                    if (!params.clip.hasOwnProperty('distance')) {
                        throw new Error('Invalid clipping policy for type focus; missing distance property');
                    }
                    else if (!params.hasOwnProperty('focus') || params.focus === null) {
                        throw new Error('Invalid clipping policy for type focus; missing or invalid focus property');
                    }

                    clip = {
                        clip: 'focus(' + params.clip.distance + ')'
                    };
                    break;

                case 'bbox':
                    if (!params.clip.hasOwnProperty('bbox')) {
                        throw new Error('Invalid clipping policy for type bbox; missing bbox property');
                    }
                    params.clip.bbox = this._formatBoundingBox(params.clip.bbox);
                    if (null === params.clip.bbox) {
                        throw new Error('Invalid format coordinates for params.clip.bbox');
                    }

                    clip = {
                        clip: 'bbox(' + params.clip.bbox + ')'
                    };
                    break;

                default:
                    throw new Error('Invalid or unrecognised clipping policy type');
            }
        }
    }

    if (typeof callback === 'undefined') {
        throw new Error('Missing callback parameter');
    }
    else if (typeof callback !== 'object') {
        throw new Error('Missing or invalid callback parameter');
    }

    params = W3W.Utils.mergeOptions(this.options, params, clip);
    var url = this.urls.autosuggest_ml + '?' + W3W.Utils.assembleQuery(params);
    W3W.Xhr.handleRequest(url, callback);
};

// var params = {
//      addr: '3-word-address',
//      lang: 'en',
//      focus: '[lat, lng]
// };
W3W.Geocoder.prototype.standardblend = function(params, callback) {
    if (typeof params === 'undefined' || typeof params !== 'object') {
        throw new Error('Missing or invalid params object');
    }

    if (params) {
        if (!params.hasOwnProperty('addr')) {
            throw new Error('The params object is missing required addr property');
        }
        else if (typeof params.addr !== 'string') {
            throw new Error('params.addr must be a string');
        }

        if (params.hasOwnProperty('focus')) {
            params.focus = this._formatCoords(params.focus);
            if (null === params.focus) {
                throw new Error('Invalid format coordinates for params.focus');
            }
        }

        if (!params.hasOwnProperty('lang')) {
            throw new Error('The params object is missing required lang property');
        }
        else if (typeof params.lang !== 'string') {
            throw new Error('params.lang must be a string');
        }

        if (params.hasOwnProperty('format')) {
            if (typeof params.format !== 'string') {
                throw new Error('params.format must be a string');
            }
            else if (params.format !== 'json') {
                throw new Error('params.format must have a value of "json"');
            }
        }
    }

    if (typeof callback === 'undefined') {
        throw new Error('Missing callback parameter');
    }
    else if (typeof callback !== 'object') {
        throw new Error('Missing or invalid callback parameter');
    }

    params = W3W.Utils.mergeOptions(this.options, params);
    var url = this.urls.standardblend + '?' + W3W.Utils.assembleQuery(params);
    W3W.Xhr.handleRequest(url, callback);
};

// var params = {
//      addr: '3-word-address',
//      lang: 'en',
//      focus: '[lat, lng]
// };
W3W.Geocoder.prototype.standardblend_ml = function(params, callback) {
    if (typeof params === 'undefined' || typeof params !== 'object') {
        throw new Error('Missing or invalid params object');
    }

    if (params) {
        if (!params.hasOwnProperty('addr')) {
            throw new Error('The params object is missing required addr property');
        }
        else if (typeof params.addr !== 'string') {
            throw new Error('params.addr must be a string');
        }

        if (params.hasOwnProperty('focus')) {
            params.focus = this._formatCoords(params.focus);
            if (null === params.focus) {
                throw new Error('Invalid format coordinates for params.focus');
            }
        }

        if (!params.hasOwnProperty('lang')) {
            throw new Error('The params object is missing required lang property');
        }
        else if (typeof params.lang !== 'string') {
            throw new Error('params.lang must be a string');
        }

        if (params.hasOwnProperty('format')) {
            if (typeof params.format !== 'string') {
                throw new Error('params.format must be a string');
            }
            else if (params.format !== 'json') {
                throw new Error('params.format must have a value of "json"');
            }
        }
    }

    if (typeof callback === 'undefined') {
        throw new Error('Missing callback parameter');
    }
    else if (typeof callback !== 'object') {
        throw new Error('Missing or invalid callback parameter');
    }

    params = W3W.Utils.mergeOptions(this.options, params);
    var url = this.urls.standardblend_ml + '?' + W3W.Utils.assembleQuery(params);
    W3W.Xhr.handleRequest(url, callback);
};

// var params = {
//      bbox: [nelat, nelng, swlat, swlng],
//      format: 'json|geojson'
// };
W3W.Geocoder.prototype.grid = function(params, callback) {
    if (typeof params === 'undefined' || typeof params !== 'object') {
        throw new Error('Missing or invalid params object');
    }

    if (params) {
        if (!params.hasOwnProperty('bbox')) {
            throw new Error('The params object is missing required bbox property');
        }

        params.bbox = this._formatBoundingBox(params.bbox);
        if (null === params.bbox) {
            throw new Error('Invalid format coordinates for params.bbox');
        }

        if (params.hasOwnProperty('format')) {
            if (typeof params.format !== 'string') {
                throw new Error('params.format must be a string');
            }
            else if (params.format !== 'json' && params.format !== 'geojson') {
                throw new Error('params.format must have a value of "json" or "geojson"');
            }
        }
    }

    if (typeof callback === 'undefined') {
        throw new Error('Missing callback parameter');
    }
    else if (typeof callback !== 'object') {
        throw new Error('Missing or invalid callback parameter');
    }

    params = W3W.Utils.mergeOptions(this.options, params);
    var url = this.urls.grid + '?' + W3W.Utils.assembleQuery(params);
    W3W.Xhr.handleRequest(url, callback);
};

W3W.Geocoder.prototype.languages = function(callback) {
    if (typeof callback === 'undefined') {
        throw new Error('Missing callback parameter');
    }
    else if (typeof callback !== 'object') {
        throw new Error('Missing or invalid callback parameter');
    }

    var params = {
        key: this.options.key
    };
    var url = this.urls.languages + '?' + W3W.Utils.assembleQuery(params);
    W3W.Xhr.handleRequest(url, callback);
};

W3W.Geocoder.prototype._formatCoords = function(coords) {
    if (typeof coords === 'object' && coords instanceof Array && coords.length === 2) {
        return coords.join(',');
    }
    else if (typeof coords !== 'string' && !coords.match(/^[-.0-9]{1,},[-.0-9]{1,}$/)) {
        return coords;
    }

    return null;
};

W3W.Geocoder.prototype._formatBoundingBox = function(coords) {
    if (typeof coords === 'object' && coords instanceof Array && coords.length === 4) {
        return coords.join(',');
    }
    else if (typeof coords !== 'string' && !coords.match(/^[-.0-9]{1,},[-.0-9]{1,},[-.0-9]{1,},[-.0-9]{1,}$/)) {
        return coords;
    }

    return null;
};
