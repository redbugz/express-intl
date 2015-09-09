/* global describe, before, it, expect, locale, Intl, IntlPolyfill, middleware, ExpressIntl */
/* jshint node:true, expr:true */

'use strict';

var timeStamp = 1390518044403;
var locals, intl;

before(function (done) {
    var intlOptions = {
        locales: "en",
        formats: {
            "number": {
                "Euros": {style: 'currency', currency: 'EUR', currencyDisplay: "code"},
                "USD": {style: 'currency', currency: 'USD'}
            },
            "date": {
                "short": {
                    "day": "numeric",
                    "month": "long",
                    "year": "numeric"
                }
            },
            "time": {
                "hhmm": {
                    "hour": "numeric",
                    "minute": "numeric"
                }
            },
            "relative": {
                "hours": {
                    "units": "hour",
                    "style": "numeric"
                }
            },
        },
        messages: {
            "en-US": {
                "FROM": "from English request: {num, number, usd}"
            },
            "de-DE": {
                "FROM": "from German request: {num, number, eur}"
            },
        },
    };
    intl = ExpressIntl.init(intlOptions);

    var req = {query: {}, acceptedLanguages: ['en-US']};
    var res = {locals: {}};
    ExpressIntl.middleware(intlOptions)(req, res, function () {
        locals = res.locals;
        console.log('req', req);
        console.log('res', res);
        console.log('locals', locals);
        console.log(res.locals.intl.formatNumber(1234.5678));
        console.log(res.locals.intl.formatNumber(1234.5678, 'currency', {currency: 'EUR'}));
        console.log(res.locals.intl.formatNumber(1234.5678, 'currency', {currency: 'EUR', locales:'de-DE'}));
        done();
    });
});

describe('Helper `formatNumber`', function () {
    it('should be added to ExpressIntl.helpers', function () {
        expect(intl).to.have.keys('formatNumber');
    });

    it('should be a function', function () {
        expect(intl.formatNumber).to.be.a('function');
    });

    it('should throw if called with out a value', function () {
        expect(intl.formatNumber).to.throwException(function (e) {
            expect(e).to.be.a(TypeError);
        });
    });

    describe('used to format numbers', function () {
        it('should return a string', function () {
            expect(intl.formatNumber(4)).to.equal('4');
        });

        it('should return a decimal as a string', function () {
            expect(intl.formatNumber(4.004)).to.equal('4.004');
        });

        it('should return a formatted string with a thousand separator', function () {
            expect(intl.formatNumber(40000)).to.equal('40,000');
        });

        it('should return a formatted string with a thousand separator and decimal', function () {
            expect(intl.formatNumber(40000.004)).to.equal('40,000.004');
        });

        describe('in another locale', function () {
            it('should return a string', function () {
                expect(intl.formatNumber(4, {locales: 'de-DE'})).to.equal('4');
            });

            it('should return a decimal as a string', function () {
                expect(intl.formatNumber(4.004, {locales: 'de-DE'})).to.equal('4,004');
            });

            it('should return a formatted string with a thousand separator', function () {
                expect(intl.formatNumber(40000, {locales: 'de-DE'})).to.equal('40.000');
            });

            it('should return a formatted string with a thousand separator and decimal', function () {
                expect(intl.formatNumber(40000.004, {locales: 'de-DE'})).to.equal('40.000,004');
            });
        });
    });

    describe('used to format currency', function () {
        it('should return a string formatted to currency', function () {
            expect(intl.formatNumber(40000, 'currency', {currency: "USD"})).to.equal('$40,000.00');

            expect(intl.formatNumber(40000, 'currency', {currency: "EUR"})).to.equal('€40,000.00');

            expect(intl.formatNumber(40000, 'currency', {currency: "JPY"})).to.equal('¥40,000');
        });

        it('should return a string formatted to currency with code', function () {
            expect(intl.formatNumber(40000, 'currency', {currency: "USD", currencyDisplay: "code"})).to.equal('USD40,000.00');

            expect(intl.formatNumber(40000, 'currency', {currency: "EUR", currencyDisplay: "code"})).to.equal('EUR40,000.00');

            expect(intl.formatNumber(40000, 'currency', {currency: "JPY", currencyDisplay: "code"})).to.equal('JPY40,000');
        });

        it('should return a string formatted to currency with a named format', function () {
            expect(intl.formatNumber(40000, 'USD')).to.equal('$40,000.00');
            expect(intl.formatNumber(40000, 'Euros')).to.equal('EUR40,000.00');
        });

        it('should return a currency even when using a different locale', function (){
            var out = intl.formatNumber(40000, 'currency', {currency: "USD", locales: "de-DE"});
            expect(out, 'USD->de-DE').to.equal('40.000,00 $');

            out = intl.formatNumber(40000, 'currency', {currency: "EUR", locales: "de-DE"});
            expect(out, 'EUR->de-DE').to.equal('40.000,00 €');

            out = intl.formatNumber(40000, 'currency', {currency: "JPY", locales: "de-DE"});
            expect(out, 'JPY->de-DE').to.equal('40.000 ¥');
        });
    });

    describe('used to format percentages', function () {
        it('should return a string formatted to a percent', function () {
            expect(intl.formatNumber(400, 'percent')).to.equal('40,000%');
        });

        it('should return a percentage when using a different locale', function () {
            expect(intl.formatNumber(400, 'percent', {locales: 'de-DE'})).to.equal('40.000 %');
        });
    });
});

describe('Helper `formatDate`', function () {
    it('should be added to ExpressIntl.helpers', function () {
        expect(intl).to.have.keys('formatDate');
    });

    it('should be a function', function () {
        expect(intl.formatDate).to.be.a('function');
    });

    it('should throw if called with out a value', function () {
        expect(intl.formatDate).to.throwException(function (e) {
            expect(e).to.be.a(TypeError);
        });
    });

    // Use a fixed known date
    var dateStr   = 'Thu Jan 23 2014 18:00:44 GMT-0500 (EST)',
        timeStamp = 1390518044403;

    it('should return a formatted string', function () {
        expect(intl.formatDate(dateStr)).to.equal('1/23/2014');

        // note timestamp is passed as a number
        expect(intl.formatDate(timeStamp)).to.equal('1/23/2014');
    });

    it('should return a formatted string of just the time', function () {
        expect(intl.formatDate(timeStamp, {hour: "numeric", minute: "numeric", timeZone: "UTC"})).to.equal('11:00 PM');
    });

    it('should format the epoch timestamp', function () {
        expect(intl.formatDate(0)).to.equal(new Intl.DateTimeFormat('en').format(0));
    });
});

describe('Helper `formatTime`', function () {
    it('should be added to ExpressIntl.helpers', function () {
        expect(intl).to.have.keys('formatTime');
    });

    it('should be a function', function () {
        expect(intl.formatTime).to.be.a('function');
    });

    it('should throw if called with out a value', function () {
        expect(intl.formatTime).to.throwException(function (e) {
            expect(e).to.be.a(TypeError);
        });
    });

    // Use a fixed known date
    var dateStr   = 'Thu Jan 23 2014 18:00:44 GMT-0500 (EST)',
        timeStamp = 1390518044403;

    it('should return a formatted string', function () {
        expect(intl.formatTime(dateStr)).to.equal('1/23/2014');

        // note timestamp is passed as a number
        expect(intl.formatTime(timeStamp)).to.equal('1/23/2014');
    });

    it('should return a formatted string of just the time', function () {
        expect(intl.formatTime(timeStamp, {hour: "numeric", minute: "numeric", timeZone: "UTC"})).to.equal('11:00 PM');
    });
});

describe('Helper `formatRelative`', function () {
    it('should be added to ExpressIntl.helpers', function () {
        expect(intl).to.have.keys('formatRelative');
    });

    it('should be a function', function () {
        expect(intl.formatRelative).to.be.a('function');
    });

    it('should throw if called with out a value', function () {
        expect(intl.formatRelative).to.throwException(function (e) {
            expect(e).to.be.a(TypeError);
        });
    });

    var tomorrow = new Date().getTime() + (24 * 60 * 60 * 1000);

    it('should return a formatted string', function () {
        expect(intl.formatRelative(tomorrow)).to.equal('tomorrow');
    });

    it('should accept formatting options', function () {
        expect(intl.formatRelative(tomorrow, 'numeric')).to.equal('in 1 day');
    });

    it('should accept a `now` option', function () {
        expect(intl.formatRelative(2000, {now: 1000})).to.equal('in 1 second');
    });

    it('should format the epoch timestamp', function () {
        expect(intl.formatRelative(0, {now: 1000})).to.equal('1 second ago');
    });
});

describe('Helper `formatMessage`', function () {
    it('should be added to ExpressIntl.helpers', function () {
        expect(intl).to.have.keys('formatMessage');
    });

    it('should be a function', function () {
        expect(intl.formatMessage).to.be.a('function');
    });

    it('should throw if called with out a value', function () {
        expect(intl.formatMessage).to.throwException(function (e) {
            expect(e).to.be.a(ReferenceError);
        });
    });

    it('should return a formatted string', function () {
        var msg = 'Hi, my name is {firstName} {lastName}.';
        var data = {firstName: 'Anthony', lastName: 'Pipkin'};
        expect(intl.formatMessage(msg, data)).to.equal('Hi, my name is Anthony Pipkin.');
    });

    it('should return a formatted string with formatted numbers and dates', function () {
        var msg = '{city} has a population of {population, number, integer} as of {census_date, date, long}.';
        var data = {
            city: 'Atlanta',
            population: 5475213,
            census_date: (new Date('1/1/2010')).getTime(),
            timeZone: 'UTC'
        };
        expect(intl.formatMessage(msg, data)).to.equal('Atlanta has a population of 5,475,213 as of January 1, 2010.');
    });

    it('should return a formatted string with formatted numbers and dates in a different locale', function () {
        var msg = '{city} hat eine Bevölkerung von {population, number, integer} zum {census_date, date, long}.';
        var data = {
            intl: {
                locales: "de-DE"
            },
            city: 'Atlanta',
            population: 5475213,
            census_date: (new Date('1/1/2010')).getTime(),
            timeZone: 'UTC'
        };
        expect(intl.formatMessage(msg, data)).to.equal('Atlanta hat eine Bevölkerung von 5.475.213 zum 1. Januar 2010.');
    });

    it('should return a formatted `selectedordinal` message', function () {
        var msg = 'This is my {year, selectordinal, one{#st} two{#nd} few{#rd} other{#th}} birthday.';
        var data = {
            year    : 3
        };
        expect(intl.formatMessage(msg, data)).to.equal('This is my 3rd birthday.');
    });
});
