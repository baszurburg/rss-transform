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
        retrieveTest: {
          src: ['test/fileSystem.js', 'readAppSite.js']
        },
        retrieve: {
          src: ['readRSS.js', 'readAppSite.js']
        },
        createPosts: {
          src: ['createPosts.js']
        },
        upload: {
          src: ['upload.js']
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

    // retrieve the content
    grunt.registerTask('default', ['clean', 'mkdir', 'execute:retrieve']);

    grunt.registerTask('upload', ['execute:upload']);
    grunt.registerTask('populate', ['clean', 'mkdir', 'execute:retrieve', 'upload']);


  };
})();