/**
 * Created by Zurburg on 5/04/2016.
 */
var config = require('../.env'),
    jsonfile = require('jsonfile'),
    util = require('util'),
    _ = require('lodash'),
    mergedClubs = [];

// read datafiles

var newClubs = jsonfile.readFileSync('data/voetbalclubs-nl.json'),
    newClubsLength = newClubs.length,
    i,
    tenues = jsonfile.readFileSync('data/tenueclubs.json'),
    newClubsLength = newClubs.length;


console.log('length clubs: ' + newClubsLength);

/**************************************************
 *              START PROCESSING
 **************************************************/

for (i=0; i < newClubsLength; i++) {

    var club = newClubs[i],
        tenue;

    tenue = getTenue(club.code);

    club.tenue = tenue;

    mergedClubs.push(club);

}

var file = 'data/voetbalclubs-tenues-nl.json';

jsonfile.writeFile(file, mergedClubs, function (err) {
    console.error(err)
});

function getTenue(code) {

    var tenue = _.find(tenues, function(o) { return o.Id === code; });

    if (typeof tenue !== "undefined") {
        return "t_" + tenue.Icoonnummer + ".png";
    } else {
        return "";
    }

}