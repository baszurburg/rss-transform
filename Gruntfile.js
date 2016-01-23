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
        retrieve: {
          src: ['test/fileSystem.js', 'readAppSite.js']
        },
        createPosts: {
          src: ['createPosts.js']
        },
        prepareUpload: {
          src: ['prepareUpload.js']
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

    grunt.registerTask('default', ['clean', 'mkdir', 'execute:retrieve']);

    grunt.registerTask('prepareUpload', ['execute:prepareUpload']);
    grunt.registerTask('createPost', ['execute:createPosts']);

  };
})();