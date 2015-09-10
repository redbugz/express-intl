/* global Express */
'use strict';

global.ExpressIntl = require('../../');
require('../../lib/locales.js');

var intl = ExpressIntl.init();

require('../helpers.js');
