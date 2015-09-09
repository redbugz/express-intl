/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jshint esnext: true */

import IntlMessageFormat from 'intl-messageformat';
import IntlRelativeFormat from 'intl-relativeformat';
import createFormatCache from 'intl-format-cache';

import {extend} from './utils.js';

export {registerHelpers};

// -----------------------------------------------------------------------------

var getNumberFormat   = createFormatCache(Intl.NumberFormat);
var getDateTimeFormat = createFormatCache(Intl.DateTimeFormat);
var getMessageFormat  = createFormatCache(IntlMessageFormat);
var getRelativeFormat = createFormatCache(IntlRelativeFormat);


function registerHelpers(options) {
    var baseData = extend({}, options);

    var helpers = {
        get              : intlGet,
        formatDate       : formatDate,
        formatTime       : formatTime,
        formatRelative   : formatRelative,
        formatNumber     : formatNumber,
        formatMessage    : formatMessage,
    };
    return extend({}, baseData, helpers);

    // -- Helpers --------------------------------------------------------------

    function intlGet(path, options) {
        var intlData  = (options && options.intl) || baseData;

        // Use the path to walk the Intl data to find the object at the given
        // path, and throw a descriptive error if it's not found.
        var obj = getPropertyByPath(intlData.messages[intlData.currentLocale], path);
        if (obj === undefined) {
            console.error('Could not find Intl object:', path);
            return '[' + path + ']';
        }

        return formatMessage(obj, options);
    }

    function formatDate(date, format, options) {
        date = new Date(date);
        assertIsDate(date, 'A date or timestamp must be provided to {{formatDate}}');

        if (!options && typeof format === 'object') {
            options = format;
            format  = null;
        }

        var locales       = (options && options.locales) || baseData.locales;
        var formatOptions = getFormatOptions('date', format, options);

        return getDateTimeFormat(locales, formatOptions).format(date);
    }

    function formatTime(date, format, options) {
        date = new Date(date);
        assertIsDate(date, 'A date or timestamp must be provided to {{formatTime}}');

        if (!options && typeof format === 'object') {
            options = format;
            format  = null;
        }

        var locales       = (options && options.locales) || baseData.locales;
        var formatOptions = getFormatOptions('time', format, options);

        return getDateTimeFormat(locales, formatOptions).format(date);
    }

    function formatRelative(date, format, options) {
        date = new Date(date);
        assertIsDate(date, 'A date or timestamp must be provided to {{formatRelative}}');

        if (!options && typeof format === 'object') {
            options = format;
            format  = null;
        }

        var locales       = (options && options.locales) || baseData.locales;
        var formatOptions = getFormatOptions('relative', format, options);
        var now           = (options && options.now) || Date.now();

        // Remove `now` from the options passed to the `IntlRelativeFormat`
        // constructor, because it's only used when calling `format()`.
        formatOptions.now = undefined;

        return getRelativeFormat(locales, formatOptions).format(date, {
            now: now
        });
    }

    function formatNumber(num, format, options) {
        assertIsNumber(num, 'A number must be provided to {{formatNumber}}');

        if (!options && typeof format === 'object') {
            options = format;
            format  = null;
        }

        var locales       = (options && options.locales) || baseData.locales;
        var formatOptions = getFormatOptions('number', format, options);

        return getNumberFormat(locales, formatOptions).format(num);
    }

    function formatMessage(message, options) {
        if (!(message || typeof message === 'string')) {
            throw new ReferenceError('{{formatMessage}} must be provided a message');
        }

        var intlData = (options && options.intl) || baseData,
            locales  = intlData.locales,
            formats  = intlData.formats;

        // When `message` is a function, assume it's an IntlMessageFormat
        // instance's `format()` method passed by reference, and call it. This
        // is possible because its `this` will be pre-bound to the instance.
        if (typeof message === 'function') {
            return message(options);
        }

        if (typeof message === 'string') {
            message = getMessageFormat(message, locales, formats);
        }

        return message.format(options);
    }

    // -- Utilities ------------------------------------------------------------

    function assertIsDate(date, errMsg) {
        // Determine if the `date` is valid by checking if it is finite, which
        // is the same way that `Intl.DateTimeFormat#format()` checks.
        if (!isFinite(date)) {
            throw new TypeError(errMsg);
        }
    }

    function assertIsNumber(num, errMsg) {
        if (typeof num !== 'number') {
            throw new TypeError(errMsg);
        }
    }

    function getFormatOptions(type, format, options) {
        var formatOptions, path;

        if (format) {
            if (typeof format === 'string') {
                path = 'formats.' + type + '.' + format;
                formatOptions = getPropertyByPath(options, path) || getPropertyByPath(baseData, path);
                if (!formatOptions) {
                    formatOptions = {
                        style: format
                    };
                }
            }
        }
        formatOptions = extend({}, formatOptions, options);

        return formatOptions;
    }

    function getPropertyByPath(object, path) {
        if (!path || !object) return undefined;
        // Use the path to walk the object at the given
        // path, and return undefined if it's not found
        var result, i, len;
        var obj = object;
        var pathParts = path.split('.');
        try {
            for (i = 0, len = pathParts.length; i < len; i++) {
                result = obj = obj[pathParts[i]];
            }
        } catch (e) {
            // do nothing, just return undefined
        }
        return result;
    }

}
