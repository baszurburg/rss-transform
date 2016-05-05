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
          src: ['posts/readRSS.js', 'posts/readAppSite.js']
        },
        rss: {
          src: ['posts/readRSS.js']
        },
        retrieveAppSite: {
          src: ['posts/readAppSite.js']
        },
        upload: {
          src: ['posts/upload.js']
        },
        uploadFirebase: {
          src: ['posts/uploadFirebase.js']
        },
        uploadFirebaseTeams: {
          src: ['teams/uploadFirebaseTeams.js']
        },
        retrieveAppSiteTeams: {
          src: ['teams/readAppSiteTeams.js']
        },
        retrieveAppSiteTrainers: {
          src: ['teams/readAppSiteTrainers.js']
        },
        populateAgenda: {
          src: ['agenda/populateAgenda.js']
        },
        populateProgramma: {
          src: ['programs/populateProgramma.js']
        },
        populateUitslagen: {
          src: ['programs/populateUitslagen.js']
        },
        uploadClubs: {
          src: ['clubs/upload-clubs.js']
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

    // posts:  retrieve the rss content & upload to appsite
    grunt.registerTask('rss', ['execute:rss']);
    grunt.registerTask('default', ['clean', 'mkdir', 'execute:retrieve']);
    grunt.registerTask('upload', ['execute:upload']);
    grunt.registerTask('retrieveAppSite', ['execute:retrieveAppSite']);
    grunt.registerTask('populate', ['clean', 'mkdir', 'execute:retrieve', 'upload', 'populateAgenda']);
    grunt.registerTask('uploadFirebase', ['execute:uploadFirebase']);

    // teams:
    grunt.registerTask('retrieveTeams', ['execute:retrieveAppSiteTrainers', 'execute:retrieveAppSiteTeams']);
    grunt.registerTask('uploadFirebaseTeams', ['execute:uploadFirebaseTeams']);
    grunt.registerTask('populateFirebaseTeams', ['execute:retrieveAppSiteTrainers', 'execute:retrieveAppSiteTeams', 'execute:uploadFirebaseTeams']);

    // clubs:
    grunt.registerTask('uploadClubs', ['execute:uploadClubs']);


    // programma:
    grunt.registerTask('populateProgramma', ['execute:populateProgramma']);
    grunt.registerTask('populateUitslagen', ['execute:populateUitslagen']);

    // retrieves post from the app site and upload to Firebase
    grunt.registerTask('processFirebase', ['execute:retrieveAppSite', 'execute:uploadFirebase']);

    // populate agenda
    grunt.registerTask('populateAgenda', ['execute:populateAgenda']);

  };
})();