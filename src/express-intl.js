/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jshint esnext: true */

import IntlMessageFormat from 'intl-messageformat';
import IntlRelativeFormat from 'intl-relativeformat';

import {registerHelpers} from './helpers.js';
import defaultLocale from './en.js';
import {extend} from './utils.js';

export {init, middleware};

var defaults = {
  defaultLocale: 'en',
  formats: {},
  messages: {},
  queryOverride: "lang",
};

function init(options) {
  // initialize the helpers
  return registerHelpers(extend({}, defaults, options));
}

var middleware = function (options) {
  var intl = extend({}, defaults, options);

  // the actual express middleware function
  return function (req, res, next) {
    // first calculate the correct currentLocale for the request from the list of available locales
    intl.currentLocale = req.acceptsLanguages(options.availableLocales) || defaults.defaultLocale;
    if(Array.isArray(intl.currentLocale)){
      intl.currentLocale = intl.currentLocale[0] || defaults.defaultLocale;
    }
    if (intl.queryOverride) {
      if (req.query && req.query[intl.queryOverride]) {
        intl.currentLocale = req.query[intl.queryOverride];
      }
    }

    res.locals.intl = registerHelpers(intl);
    next();
  };
};

export function __addLocaleData(data) {
    IntlMessageFormat.__addLocaleData(data);
    IntlRelativeFormat.__addLocaleData(data);
}

__addLocaleData(defaultLocale);
