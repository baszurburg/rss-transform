/**
 * Created by Zurburg on 1/22/2016.
 */
var config = require('../.env'),
    jsonfile = require('jsonfile'),
    request = require('request-json'),
    Firebase = require("firebase"),
    sanitizeHtml = require('sanitize-html'),
    htmlparser = require("htmlparser2"),
    util = require('util'),
    _ = require('lodash'),
    uploadTeams = [];

var client = request.createClient(config.host),
    teamsUrl = config.urls.teams,
    trainersUrl = config.urls.trainers;

var firebaseRef = new Firebase(config.firebase);

var teamsRef = firebaseRef.child("teams");

// read datafiles

var teamsFile = jsonfile.readFileSync('tmp/teams.json'),
    teams = teamsFile.teams,
    teamsLength = teams.length,
    trainersFile = jsonfile.readFileSync('tmp/trainers.json'),
    trainers = trainersFile.users,
    trainersLength = trainers.length,
    j;

var extendedContent = '',
    spelers = '',
    sponsers = '';


/**************************************************
 *              START PROCESSING
 **************************************************/
console.log("- - - Start Upload TEAMS Firebase - - - ");
console.log(" ");
console.log("Number teams read: " + teamsLength);

var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - 25);

for (j=0; j < teamsLength; j++) {
    var team = teams[j],
        jsonContent = {};

    // Sanitize the data before uploading to Firebase

    team.content.brief = sanitizeHtml(team.content.brief,
        { allowedTags: [],
            allowedAttributes: []
        });


    // add image thumbnail
    if (typeof  team.image === 'object') {
        team.image.imageThumb = team.image.secure_url.replace(/upload/g, 'upload/g_faces,c_thumb,h_90,ar_5:3,z_0.8');
    }

    // replace the trainers and leiders with details

    team.trainers = getDetails(team.trainers);
    team.leiders = getDetails(team.leiders);

    uploadTeams.push(team);

}

console.log("Number published teams: " +  uploadTeams.length);

var onComplete = function(error) {
    if (error) {
        console.log('Synchronization failed');
    } else {
        console.log('Synchronization succeeded');
    }
    process.exit();
};

// WATCH IT - Do the UPLOAD
teamsRef.set(uploadTeams, onComplete);


// Get details from leiders / trainers
function getDetails(staff) {
    var persons = [],
        i;

    var staffLenght = staff.length;

    for (i=0; i < staffLenght; i++) {
        var staffMember = staff[i];

        persons[i] = _.find(trainers, function(o) { return o._id.toString() === staffMember.toString(); });

    }

    return persons;
}

