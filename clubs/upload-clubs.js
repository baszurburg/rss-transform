/**
 * Created by Zurburg on 5/04/2016.
 */
var config = require('../.env'),
    jsonfile = require('jsonfile'),
    request = require('request-json'),
    util = require('util'),
    _ = require('lodash'),
    uploadClubs = [];

var client = request.createClient(config.host),
    clubsUrl = config.urls.clubs;

// read datafiles

var newClubs = jsonfile.readFileSync('data/voetbalclubs-nl.json'),
    newClubsLength = newClubs.length,
    i;


    console.log('length: ' + newClubsLength);

/**************************************************
 *              START PROCESSING
 **************************************************/

for (i=0; i < newClubsLength; i++) {


    if (i < 10) {
        console.log(newClub);
    }

    doPost(newClubs[i]);

}

function doPost(newClub) {
    setTimeout(function(){
        client.post(clubsUrl, newClub, function(err, res, body) {
            return console.log(res.statusCode + err);
        });
    },500);

}