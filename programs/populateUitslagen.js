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

        console.log(uitslagenT);

        console.log('Processing Programma uit');

        console.log(uitslagenU);

        uitslagenURef.set(uitslagenU, onCompleteU);

    });

// TEST DATA

/*
var uitslagenT = [ { Datum: '23 apr',
    Thuis: 'RCH 35+1',
    Uit: 'United/DAVO 35+1',
    Uitslag: '3-4' },
    { Datum: '23 apr',
        Thuis: 'RCH C1',
        Uit: 'Hoofddorp s.v. C5',
        Uitslag: '4-1' },
    { Datum: '23 apr',
        Thuis: 'RCH D3',
        Uit: 'DSS D8',
        Uitslag: '1-6' },
    { Datum: '23 apr',
        Thuis: 'RCH E1',
        Uit: 'Assendelft E1',
        Uitslag: '6-1' },
    { Datum: '23 apr',
        Thuis: 'RCH E2',
        Uit: 'Hillegom sv E3',
        Uitslag: '6-1' },
    { Datum: '23 apr',
        Thuis: 'RCH F3',
        Uit: 'Hoofddorp s.v. F9',
        Uitslag: '7-2' },
    { Datum: '23 apr',
        Thuis: 'RCH F4',
        Uit: 'Kennemers F4',
        Uitslag: '9-3' },
    { Datum: '23 apr',
        Thuis: 'RCH F5',
        Uit: 'RODA 23 F12',
        Uitslag: '8-2' },
    { Datum: '29 mei', Thuis: 'RCH 2', Uit: 'Velsen 6', Uitslag: '-' } ];

var uitslagenU = [ { Datum: '23 apr',
    Thuis: 'DSS C6',
    Uit: 'RCH C2',
    Uitslag: '3-3' },
{ Datum: '23 apr',
    Thuis: 'Geel Wit B1',
    Uit: 'RCH B1',
    Uitslag: '5-1' },
{ Datum: '23 apr', Thuis: 'HBC 1', Uit: 'RCH 1', Uitslag: '4-1' },
{ Datum: '23 apr',
    Thuis: 'Hillegom sv F1',
    Uit: 'RCH F1',
    Uitslag: '3-2' },
{ Datum: '23 apr',
    Thuis: 'Sporting Martinus 45+1',
    Uit: 'RCH 45+1',
    Uitslag: '2-0' },
{ Datum: '23 apr',
    Thuis: 'Zwanenburg D2',
    Uit: 'RCH D2',
    Uitslag: '3-2' },
{ Datum: '24 apr',
    Thuis: 'Alliance 22 A2',
    Uit: 'RCH A1',
    Uitslag: '5-1' },
{ Datum: '24 apr', Thuis: 'DIO 2', Uit: 'RCH 2', Uitslag: '2-3' },
{ Datum: '24 apr',
    Thuis: 'Onze Gezellen 1',
    Uit: 'RCH 1',
    Uitslag: '0-4' },
{ Datum: '30 apr', Thuis: 'BSM D2', Uit: 'RCH D2', Uitslag: '-' },
{ Datum: '30 apr',
    Thuis: 'Overbos E10',
    Uit: 'RCH E4',
    Uitslag: '-' },
{ Datum: '30 apr',
    Thuis: 'UNO vv F3',
    Uit: 'RCH F2',
    Uitslag: '-' },
{ Datum: '09 mei', Thuis: 'AMVJ D1', Uit: 'RCH D1', Uitslag: '-' },
{ Datum: '11 mei', Thuis: 'SVIJ E1', Uit: 'RCH E1', Uitslag: '-' },
{ Datum: '12 mei', Thuis: 'Velsen 6', Uit: 'RCH 2', Uitslag: '-' },
{ Datum: '14 mei',
    Thuis: 'Haarlem-Kennemerland D4',
    Uit: 'RCH D3',
    Uitslag: '-' },
{ Datum: '14 mei',
    Thuis: 'RODA 23 F6',
    Uit: 'RCH F3',
    Uitslag: '-' } ];
*/