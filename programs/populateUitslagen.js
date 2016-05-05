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
var uitslagenTRef = firebaseRef.child("uitslagenT");
var uitslagenURef = firebaseRef.child("uitslagenU");

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
tabletojson.convertUrl(config.uitslagenUrl)
    .then(function(tablesAsJson) {
        var uitslagenT = tablesAsJson[0];
        var uitslagenU = tablesAsJson[1];

        console.log('Processing Programma thuis');

        //console.log(uitslagenT);

        uitslagenTRef.set(uitslagenT, onCompleteT);

        console.log('Processing Programma uit');

        // console.log(uitslagenU);

        uitslagenURef.set(uitslagenU, onCompleteU);

    });

