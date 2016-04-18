/**
 * Created by Zurburg on 1/17/2016.
 *
 * This file reads the RCH schedule and populate Firebase
 *
 */
var config = require('./../.env'),
    Firebase = require("firebase"),
    tabletojson = require('tabletojson');

// FIREBASE CONFIG
var firebaseRef = new Firebase(config.firebase);
var programmaTRef = firebaseRef.child("programmaT");
var programmaURef = firebaseRef.child("programmaU");

// POPULATE FIREBASE
var T = false,
    U = false;

var onCompleteU = function(error) {
    if (error) {
        console.log('Synchronization failed');
    } else {
        console.log('Synchronization succeeded');
    }
    T = true;
    if (U) {
        process.exit();
    }

};

var onCompleteT = function(error) {
    if (error) {
        console.log('Synchronization failed');
    } else {
        console.log('Synchronization succeeded');
    }
    U = true;
    if (T) {
        process.exit();
    }
};

// GET DATA
tabletojson.convertUrl(config.programmaUrl)
    .then(function(tablesAsJson) {
        var programmaT = tablesAsJson[1];
        var programmaU = tablesAsJson[2];

        console.log('Processing Programma thuis');

        programmaTRef.set(programmaT, onCompleteT);

        console.log('Processing Programma uit');

        programmaURef.set(programmaU, onCompleteU);

    });

