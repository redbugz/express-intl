'use strict';

global.Intl || require('intl');

var ExpressIntl = require('../../');

var intl = ExpressIntl.init();

module.exports = function () {
    intl.formatNumber(4000, {
        data: {},
        hash: {}
    });
};
