/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jshint esnext: true */

import {init, middleware, __addLocaleData} from './express-intl.js';

// Re-export as default for
export default {
    init           : init,
    middleware     : middleware,
    __addLocaleData: __addLocaleData
};
