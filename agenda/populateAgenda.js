/**
 * Created by Zurburg on 1/17/2016.
 *
 * This file reads the posts in the App CMS file
 *
 */
var config = require('./../.env'),
    request = require('request-json'),
    Firebase = require("firebase");

// FIREBASE CONFIG
var firebaseRef = new Firebase(config.firebase);
var agendaRef = firebaseRef.child("agenda");

var client = request.createClient(config.host);

// SET DATE RANGE
var tempStartDate = new Date();
tempStartDate.setDate(tempStartDate.getDate() - 1);
var startDate = Date.parse(tempStartDate).toString().substr(0,7) + "200";

var tempEndDate = new Date();
tempEndDate.setDate(tempEndDate.getDate() + 365);
var endDate = Date.parse(tempEndDate).toString().substr(0,7) + "200";


//var urls = [config.urls.posts];
var url = config.agendaUrl + 'date-start=' + startDate + '&date-end=' + endDate;

// build a loop here when we have multiple files

var agenda = [];

client.get(url, function(err, res, body) {

    agenda = body[0].data;

    var onComplete = function(error) {
        if (error) {
            console.log('Synchronization failed');
        } else {
            console.log('Synchronization succeeded');
        }
        process.exit();
    };

    // WATCH IT
    agendaRef.set(agenda, onComplete);

});
