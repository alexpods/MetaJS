"use strict";

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            dev: {
                dest: "dist/<%= pkg.title %>.js",
                src: [
                    "src/.prefix",

                    "src/Meta.js",
                    "src/Manager.js",
                    "src/Processor.js",

                    "src/.build",

                    "src/Processors/*.js",

                    "src/.suffix"
                ]
            }
        },
        uglify: {
            min: {
                options: {
                    mangle: true,
                    compress: {
                        unused: false
                    },
                    report: 'gzip',
                    sourceMap: 'dist/<%= pkg.title %>.min.map',
                    preserveComments: false
                },
                dest: "dist/<%= pkg.title %>.min.js",
                src:  "<%= concat.dev.dest %>"
            }
        }
    })

    grunt.registerTask('default', ['concat', 'uglify']);
};