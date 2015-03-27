var _ = require('lodash');

var STRING_CAMELIZE_REGEXP = (/(\-|_|\.|\s)+(.)?/g);

var camelize = (key) => {
  return key.replace(STRING_CAMELIZE_REGEXP, function(match, separator, chr) {
    return chr ? chr.toUpperCase() : '';
  }).replace(/^([A-Z])/, function(match, separator, chr) {
    return match.toLowerCase();
  });
}

class Adapter {
  constructor(options) {
    var options     = options || {};
    this.namespace  = options.namespace;
    this.host       = options.host;
    this.beforeSend = options.beforeSend || function(){};
  }

  request(url, type, options) {
    var hash = this.requestOptions(type, options);
    var beforeSend = (options && options.beforeSend) || this.beforeSend;

    // allow the consumer to modify the params to be added to fetch
    beforeSend(hash);

    return fetch(url, hash).then((res) => res.json());
  }

  urlPrefix(path, parentURL) {
    var host = this.host;
    var namespace = this.namespace;
    var url = [];

    if (path) {
      // Absolute path
      if (path.charAt(0) === '/') {
        if (host) {
          path = path.slice(1);
          url.push(host);
        }
      // Relative path
      } else if (!/^http(s)?:\/\//.test(path)) {
        url.push(parentURL);
      }
    } else {
      if (host) { url.push(host); }
      if (namespace) { url.push(namespace); }
    }

    if (path) {
      url.push(path);
    }

    return url.join('/');
  }

  buildURL(type, id, record) {
    var url = [],
        host = this.host,
        prefix = this.urlPrefix();

    if (type) { url.push(this.pathForType(type)); }
    if (id && !Array.isArray(id)) { url.push(encodeURIComponent(id)); }
    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url) { url = '/' + url; }

    return url;
  }

  requestOptions(method, options) {
    var hash = options || {};
    hash.method = method;
    hash.headers = {
      'Accept': 'application/json'
    };

    return hash;
  }

  find(typeKey, params) {
    // find one if a number or string id is provided
    if (typeof params === 'number' || typeof params === 'string') {
      return this.findOne(typeKey, params);
    }

    // find by query if an object is provided
    if ( _.isPlainObject(params) ) {
      return this.findQuery(typeKey, params);
    }

    throw new Error('Invalid input for find', typeKey, params);
  }

  pathForType(type) {
    return camelize(type);
  }

  findOne(typeKey, id) {
    return this.request(this.buildURL(typeKey, id), 'get');
  }

  findAll(typeKey) {
    return this.request(this.buildURL(typeKey), 'get');
  }

  findQuery(typeKey, query) {
    return this.request(this.buildURL(typeKey), 'get', { data: query });
  }

  create(typeKey, params) {
    return this.request(this.buildURL(typeKey), 'post', { data: params });
  }

  update(typeKey, id, params) {
    return this.request(this.buildURL(typeKey, id), 'put', { data: params });
  }

  destroy(typeKey, id) {
    return this.request(this.buildURL(typeKey, id), 'delete');
  }
}

module.exports = Adapter;
