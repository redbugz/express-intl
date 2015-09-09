/* global Express, Intl, IntlPolyfill */
/* jshint node:true */
'use strict';

// Force use of Intl.js Polyfill to serve as a mock.
require('intl');
Intl.NumberFormat   = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

global.expect = require('expect.js');

global.ExpressIntl = require('../');

require('./helpers');
