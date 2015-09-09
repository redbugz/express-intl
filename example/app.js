var express     = require('express'),
    consolidate = require('consolidate'),
    app         = express(),
    ExpressIntl;

var translations = {
    "en-US": {
        "FROM": "from English request: {num, number, usd}"
    },
    "de-DE": {
        "FROM": "from German request: {num, number, eur}"
    },
};

// These are our polyfills.
var areIntlLocalesSupported = require('intl-locales-supported');

var localesMyAppSupports = [
    'en',
    'de',
    'jp'
];

if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(localesMyAppSupports)) {
        // `Intl` exists, but it doesn't have the data we need, so load the
        // polyfill and replace the constructors with need with the polyfill's.
        require('intl');
        Intl.NumberFormat   = IntlPolyfill.NumberFormat;
        Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
} else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require('intl');
    Intl.NumberFormat   = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
}

ExpressIntl = require('../index.js'); // require('express-intl');
var intlOptions = {
    defaultLocale: "de-DE",
    formats: {
        number: {
            EUR: {style: 'currency', currency: 'EUR'},
            USD: {style: 'currency', currency: 'USD'}
        }
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

app.engine('ejs', consolidate.ejs);
app.engine('hogan', consolidate.hogan);
app.engine('dot', consolidate.dot);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

app.use(ExpressIntl.middleware(intlOptions));

app.get('/hogan', function (req, res) {
    res.render('hogansample.hogan', {NUM: 60000});
});

app.get('/dot', function (req, res) {
    res.render('dotsample.dot', {NUM: 50000});
});

app.get('/', function(req, res) {
    res.render('index', {NUM: 40000});
});


app.listen(app.get('port'), function() {
    console.log('- listening on http://localhost:' +  app.get('port') + '/');
});
