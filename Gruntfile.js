'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            dist: 'dist/',
            lib : 'lib/',
            tmp : 'tmp/'
        },

        copy: {
            tmp: {
                expand: true,
                cwd   : 'tmp/src/',
                src   : '**/*.js',
                dest  : 'lib/'
            }
        },

        concat: {
            dist_with_locales: {
                src: ['dist/express-intl.js', 'dist/locale-data/*.js'],
                dest: 'dist/express-intl-with-locales.js',

                options: {
                    sourceMap: true
                }
            }
        },

        jshint: {
            all: ['index.js', 'src/*.js', '!src/en.js', 'tests/*.js']
        },

        benchmark: {
            all: {
                src: ['tests/benchmark/*.js']
            }
        },

        extract_cldr_data: {
            options: {
                pluralRules   : true,
                relativeFields: true
            },

            src_en: {
                dest: 'src/en.js',

                options: {
                    locales: ['en'],
                    prelude: '// GENERATED FILE\n',

                    wrapEntry: function (entry) {
                        return 'export default ' + entry + ';';
                    }
                }
            },

            lib_all: {
                dest: 'lib/locales.js',

                options: {
                    prelude: [
                        '// GENERATED FILE',
                        'var ExpressIntl = require("./express-intl");\n\n'
                    ].join('\n'),

                    wrapEntry: function (entry) {
                        return 'ExpressIntl.__addLocaleData(' + entry + ');';
                    }
                }
            },

            dist_all: {
                dest: 'dist/locale-data/',

                options: {
                    wrapEntry: function (entry) {
                        return 'ExpressIntl.__addLocaleData(' + entry + ');';
                    }
                }
            }
        },

        bundle_jsnext: {
            dest: 'dist/express-intl.js',

            options: {
                namespace : 'ExpressIntl',
                sourceRoot: 'express-intl/'
            }
        },

        cjs_jsnext: {
            dest: 'tmp/'
        },

        uglify: {
            options: {
                preserveComments       : 'some',
                sourceMap              : true,
                sourceMapRoot          : 'express-intl/',
                sourceMapIncludeSources: true
            },

            dist: {
                options: {
                    sourceMapIn: 'dist/express-intl.js.map'
                },

                files: {
                    'dist/express-intl.min.js': [
                        'dist/express-intl.js'
                    ]
                }
            },

            dist_with_locales: {
                options: {
                    sourceMapIn: 'dist/express-intl-with-locales.js.map'
                },

                files: {
                    'dist/express-intl-with-locales.min.js': [
                        'dist/express-intl-with-locales.js'
                    ]
                }
            }
        },

        json_remove_fields: {
            min_source_maps: {
                options: {
                    fields: ['sourceRoot']
                },

                src: 'dist/*.min.js.map'
            }
        },

        browserify: {
            test: {
                src : 'tests/browserify/app.js',
                dest: 'tmp/browserify/app.js'
            }
        },

        connect: {
            server: {
                options: {
                    base: '.',
                    port: 9999
                }
            }
        },

        'saucelabs-mocha': {
            all: {
                options: {
                    urls: [
                        'http://127.0.0.1:9999/tests/index.html',
                        'http://127.0.0.1:9999/tests/browserify/index.html'
                    ],

                    build: process.env.TRAVIS_BUILD_NUMBER,
                    sauceConfig: {
                        'record-video': false,
                        'capture-html': false,
                        'record-screenshots': false,
                        'command-timeout': 60
                    },
                    throttled: 3,
                    browsers: [
                        {
                            browserName: 'internet explorer',
                            platform: 'Windows 7',
                            version: '9'
                        },
                        {
                            browserName: 'internet explorer',
                            platform: 'Windows 8',
                            version: '10'
                        },
                        {
                            browserName: 'internet explorer',
                            platform: 'Windows 8.1',
                            version: '11'
                        },
                        {
                            platform: "Windows 10",
                            browserName: "microsoftedge",
                            version: ''
                        },
                        {
                            browserName: 'chrome',
                            platform: 'Windows 7',
                            version: '37'
                        },
                        {
                            browserName: 'chrome',
                            platform: 'Windows 7',
                            version: ''
                        },
                        {
                            browserName: 'firefox',
                            platform: 'Windows 7',
                            version: '32'
                        },
                        {
                            browserName: 'firefox',
                            platform: 'Windows 7',
                            version: ''
                        },
                        {
                            browserName: 'iphone',
                            platform: 'OS X 10.9',
                            version: '7.1'
                        },
                        {
                            browserName: 'android',
                            platform: 'Linux',
                            version: '4.4'
                        },
                        {
                            browserName: 'safari',
                            platform: 'OS X 10.9',
                            version: '7'
                        }
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-benchmark');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-bundle-jsnext-lib');
    grunt.loadNpmTasks('grunt-extract-cldr-data');
    grunt.loadNpmTasks('grunt-json-remove-fields');
    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('sauce', [
        'browserify',
        'connect',
        'saucelabs-mocha'
    ]);

    grunt.registerTask('cldr', ['extract_cldr_data']);

    grunt.registerTask('compile', [
        'jshint',
        'bundle_jsnext',
        'concat:dist_with_locales',
        'uglify',
        'json_remove_fields',
        'cjs_jsnext',
        'copy:tmp'
    ]);

    grunt.registerTask('default', [
        'clean',
        'cldr',
        'compile'
    ]);
};
