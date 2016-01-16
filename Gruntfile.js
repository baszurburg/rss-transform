(function () {
  "use strict";

  module.exports = function (grunt) {

    grunt.initConfig ({
      mkdir: {
        all: {
          options: {
            create: ['tmp']
          }
        }
      },
      execute: {
        target: {
          src: ['test/fileSystem.js']
        }
      },
      clean: {
        all: ['tmp']
      }
    });


    // load tasks from modules
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.task.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-execute');

    grunt.registerTask('default', ['clean', 'mkdir', 'execute']);

  };
})();