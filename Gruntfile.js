// 'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    

    
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        bowercopy: {
          options: {
            // clean: true,
            runBower: true,
            report: true
          },
          lib_scripts: {
            options: {
              destPrefix: 'app/js'
            },
            files: {
              "jquery.js": "jquery/dist/jquery.js",
              "bootstrap.js": "bootstrap/dist/js/bootstrap.min.js",
              "medium-editor.js": "medium-editor/dist/js/medium-editor.min.js",
              "bootstrap-slider.js": "seiyria-bootstrap-slider/dist/bootstrap-slider.min.js",
              "html2canvas.js": "html2canvas/build/html2canvas.min.js"
            }
          },
          lib_style: {
            options: {
              destPrefix: 'app/css'
            },
            files: {
              "bootstrap.css": "bootstrap/dist/css/bootstrap.min.css",
              "bootstrap-theme.css": "bootstrap/dist/css/bootstrap-theme.min.css",
              "medium-editor.css": "medium-editor/dist/css/medium-editor.min.css",
              "medium-theme.css": "medium-editor/dist/css/themes/bootstrap.min.css",
              "bootstrap-slider.css": "seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css"
            }
          }
        },

        watch: {
            options: {
                nospawn: true
            },
            less: {
                files: ['app/css/*.less'],
                tasks: ['less:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/*.html',
                    'app/css/{,*/}*.css',
                    'app/js/{,*/}*.js',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 8000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'app'),
                            lrSnippet
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        less: {
            server: {
                options: {
                    paths: ['app/bower/bootstrap/less', 'app/css']
                },
                files: {
                    'app/bower/boostrap/less': 'app/styles/boostrap.css'
                }
            }
        },

        aws: grunt.file.readJSON("config/aws.json"),
        s3: {
          options: {
            accessKeyId: "<%= aws.key %>",
            secretAccessKey: "<%= aws.secret %>",
            bucket:"<%= aws.bucket %>"
          },
          build: {
            cwd: "app/",
            src: "**",
            dest: "quoteit/"
          }
        }


    });

    grunt.loadNpmTasks('grunt-bowercopy');

    grunt.registerTask('server', function (target) {

        grunt.task.run([
            'less:server',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('deploy', ['s3']);

};