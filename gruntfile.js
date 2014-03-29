/*global module:false*/

/**
 * Javascript Project Boilerplate
 * Version 0.1.0
 */
module.exports = function(grunt) {
  "use strict";
  var pkg, config;

  pkg = grunt.file.readJSON('package.json');

  config = {
    banner: [
      '/**\n',
      ' * <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n',
      ' * <%= pkg.description %>\n',
      ' *\n',
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n',
      ' * Licensed <%= pkg.license %>\n',
      ' */\n'
    ].join(''),

    sources: [
      'src/intro.js',
      'src/pubsub.js',
      'src/export.js',
      'src/outro.js'
    ],
    pkg: pkg,
    uglifyFiles: {}
  };

  // setup dynamic filenames
  config.versioned = [config.pkg.name, config.pkg.version].join('-');
  config.dist = ['dist/', '.js'].join(config.versioned);
  config.uglifyFiles[['dist/', '.min.js'].join(config.versioned)] = config.dist;

  // Project configuration.
  grunt.initConfig({
    pkg: config.pkg,
    lint: {
      files: ['gruntfile.js', 'test/*.js', 'src/*']
    },
    clean: {
      dist: ['dist/']
    },
    concat: {
      options: {
        stripBanners: true,
        banner: config.banner
      },
      dist: {
        src: config.sources,
        dest: config.dist
      }
    },
    uglify: {
      options: {
        mangle: true
      },
      dist: {
        files: config.uglifyFiles
      }
    },
    jasmine: {
      tests: {
        src: ['dist/', '.js'].join(config.versioned),
        options: {
          specs: 'test/*.js',
          vendor: 'lib/*.js'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: 'jshint.json'
      },
      source: config.dist
    },
    watch: {
      scripts: {
        files: ['src/*.js', 'test/*.js'],
        tasks: ['default']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['clean', 'concat', 'jshint', 'uglify']);
  grunt.registerTask('test', ['default', 'jasmine']);
};
