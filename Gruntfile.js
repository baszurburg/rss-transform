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
        rss: {
          src: ['readRSS.js']
        },
        retrieveAppSite: {
          src: ['readAppSite.js']
        },
        upload: {
          src: ['upload.js']
        },
        uploadFirebase: {
          src: ['uploadFirebase.js']
        },
        populateAgenda: {
          src: ['agenda/populateAgenda.js']
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

    // retrieve the content (posts)
    grunt.registerTask('rss', ['execute:rss']);
    grunt.registerTask('default', ['clean', 'mkdir', 'execute:retrieve']);
    grunt.registerTask('upload', ['execute:upload']);
    grunt.registerTask('retrieveAppSite', ['execute:retrieveAppSite']);
    grunt.registerTask('uploadFirebase', ['execute:uploadFirebase']);
    grunt.registerTask('populate', ['clean', 'mkdir', 'execute:retrieve', 'upload', 'populateAgenda']);
    grunt.registerTask('processFirebase', ['execute:retrieveAppSite', 'execute:uploadFirebase']);

    // populate agenda
    grunt.registerTask('populateAgenda', ['execute:populateAgenda']);

  };
})();