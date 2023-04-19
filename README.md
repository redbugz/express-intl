## Note: This project is no longer maintained

[Express Intl][]
===================

This library provides [Express][] middleware and helpers for internationalization. The helpers provide a declarative way to format dates, numbers, and string messages with pluralization support.

[![npm Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Dependency Status][david-badge]][david]

[![Sauce Test Status][sauce-badge]][sauce]


Overview
--------

**Express Intl is related to [FormatJS][], additional docs can be found on the website:**
**<http://formatjs.io/integrations/>**

### Features

- Display numbers with separators.
- Display dates and times correctly.
- Display dates relative to "now".
- Pluralize labels in strings.
- Support for 200+ languages.
- Runs in the browser and Node.js.
- Built on standards.

### Example

See the `example` directory for a running example.

Register the middleware in your Express app:

```javascript
var ExpressIntl = require('express-intl');
var app = require('express')();
var messages = {
"en-US": {
        "photos.summary": "{name} took {numPhotos, plural, =0 {no photos} =1 {one photo} other {# photos} } on {takenDate, date, long}."
    },
    "es-ES": {
        "photos.summary": "El {takenDate, date, long}, {name} {numPhotos, plural, =0 {no} other {} } sacó {numPhotos, plural, =0 {ninguna foto.} =1 {una foto.} other {# fotos.} }"
    },
    "ja-JP": {
        "photos.summary": "{name}は{takenDate, date, long}に{numPhotos, plural, =0 {1枚も写真を撮りませんでした。} =1 {1枚写真を撮りました。} other {#枚写真を撮りました。} }"
    },
};    
app.use(ExpressIntl.middleware());

```

Now in your app or template, use the `res.locals.intl` object to internationalize your application


Template (this example is EJS, but any template should work, see example app):
```ejs
<%= intl.formatNumber(9876543.21, "currency", {currency: "USD"}) %>
<%= intl.get("photos.summary", { name:"Annie", numPhotos:1000, takenDate:Date.now() }) %>

```

This example would render: **"$9,876,543.21"** and **"Annie took 1,000 photos on September 7, 2015."**. The `photos.summary` message is written in the industry standard [ICU Message syntax][], which you can also learn about on the [FormatJS website][FormatJS].


Contribute
----------

Let's make Express Intl and FormatJS better! If you're interested in helping, all contributions are welcome and appreciated. Express Intl is just one of many packages that make up the [FormatJS suite of packages][FormatJS GitHub], and you can contribute to any/all of them, including the [Format JS website][FormatJS] itself.

Check out the [Contributing document][CONTRIBUTING] for the details. Thanks!


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][LICENSE] for license text and copyright information.


[Express Intl]: http://github.com/redbugz/express-intl/
[Express]: http://expressjs.com/
[npm]: https://www.npmjs.org/package/express-intl
[npm-badge]: https://img.shields.io/npm/v/express-intl.svg?style=flat-square
[travis]: https://travis-ci.org/redbugz/express-intl
[travis-badge]: http://img.shields.io/travis/redbugz/express-intl.svg?style=flat-square
[david]: https://david-dm.org/redbugz/express-intl
[david-badge]: https://img.shields.io/david/redbugz/express-intl.svg?style=flat-square
[sauce]: https://saucelabs.com/u/express-intl
[sauce-badge]: https://saucelabs.com/browser-matrix/express-intl.svg
[FormatJS]: http://formatjs.io/
[FormatJS GitHub]: http://formatjs.io/github/
[ICU Message syntax]: http://formatjs.io/guide/#messageformat-syntax
[CONTRIBUTING]: https://github.com/yahoo/express-intl/blob/master/CONTRIBUTING.md
[LICENSE]: https://github.com/yahoo/express-intl/blob/master/LICENSE
