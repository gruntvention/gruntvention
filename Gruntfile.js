module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'blanket'
        },
        src: ['test/**/*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'build/coverage.html'
        },
        src: ['test/**/*.js']
      }
    },
    jslint: {
      main: {
        src: ['lib/**/*.js'],
        directives: {
          node: true,
          todo: true
        }
      }
    }
  });

  grunt.registerTask('test', ['jslint:main', 'mochaTest']);
};