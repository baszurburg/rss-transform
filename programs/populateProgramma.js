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


// FOR TESTING WHEN THERE IS NO PROGRAMMA
/*
 var programmaT = [ { Datum: '30 apr',
 Tijd: '12:00',
 Thuis: 'RCH A1',
 Uit: 'Zandvoort A1',
 Type: 'co',
 WedNr: '61991' },
 { Datum: '30 apr',
 Tijd: '14:30',
 Thuis: 'RCH 1 (zat)',
 Uit: 'VSV 1 (zat)',
 Type: 'co',
 WedNr: '3773' },
 { Datum: '30 apr',
 Tijd: '14:45',
 Thuis: 'RCH 35+1 (zat)',
 Uit: 'EDO hfc 35+1 (zat)',
 Type: 'co',
 WedNr: '66650' },
 { Datum: '30 apr',
 Tijd: '14:45',
 Thuis: 'RCH 45+1 (zat)',
 Uit: 'Kon. HFC 45+1 (zat)',
 Type: 'co',
 WedNr: '111278' },
 { Datum: '01 mei',
 Tijd: '11:30',
 Thuis: 'RCH 2 (zon)',
 Uit: 'HBC 3 (zon)',
 Type: 'co',
 WedNr: '159118' },
 { Datum: '01 mei',
 Tijd: '11:30',
 Thuis: 'RCH 3 (zon)',
 Uit: 'Hillegom sv 9 (zon)',
 Type: 'co',
 WedNr: '130770' },
 { Datum: '01 mei',
 Tijd: '14:00',
 Thuis: 'RCH 1 (zon)',
 Uit: 'Alliance 22 1 (zon)',
 Type: 'co',
 WedNr: '7565' },
 { Datum: '07 mei',
 Tijd: '14:30',
 Thuis: 'RCH 1 (zat)',
 Uit: 'DSS 1 (zat)',
 Type: 'co',
 WedNr: '3872' },
 { Datum: '07 mei',
 Tijd: '14:30',
 Thuis: 'RCH 45+1 (zat)',
 Uit: 'Wherevogels De 45+1 (zat)',
 Type: 'co',
 WedNr: '111276' },
 { Datum: '08 mei',
 Tijd: '11:30',
 Thuis: 'RCH 2 (zon)',
 Uit: 'Kon. HFC 3 (zon)',
 Type: 'co',
 WedNr: '159119' },
 { Datum: '08 mei',
 Tijd: '11:30',
 Thuis: 'RCH A1 (zon)',
 Uit: 'Zwanenburg A2 (zon)',
 Type: 'co',
 WedNr: '140300' },
 { Datum: '08 mei',
 Tijd: '14:00',
 Thuis: 'RCH 1 (zon)',
 Uit: 'DSS 1 (zon)',
 Type: 'co',
 WedNr: '7707' },
 { Datum: '11 mei',
 Tijd: '16:00',
 Thuis: 'RCH Racertjes',
 Uit: 'Toernooi',
 Type: 'oe',
 WedNr: 'Toer' },
 { Datum: '21 mei',
 Tijd: '11:00',
 Thuis: 'RCH E3',
 Uit: 'Sporting Martinus',
 Type: 'oe',
 WedNr: 'oef' },
 { Datum: '28 mei',
 Tijd: '09:00',
 Thuis: 'RCH Thymo Rovers Toernooi',
 Uit: 'Div. clubs/teams',
 Type: 'oe',
 WedNr: 'toer' },
 { Datum: '29 mei',
 Tijd: '09:00',
 Thuis: 'RCH Thymo Rovers Toernooi',
 Uit: 'Div. clubs/teams',
 Type: 'oe',
 WedNr: 'toer' },
 { Datum: '29 mei',
 Tijd: '11:30',
 Thuis: 'RCH 2 (zon)',
 Uit: 'Velsen 6 (zon)',
 Type: 'co',
 WedNr: '159047' } ];

 var programmaU = [ { Datum: '30 apr',
 Tijd: '08:30',
 Thuis: 'UNO vv F3',
 Uit: 'RCH F2',
 Type: 'co',
 WedNr: '171997' },
 { Datum: '30 apr',
 Tijd: '11:15',
 Thuis: 'BSM D2',
 Uit: 'RCH D2',
 Type: 'co',
 WedNr: '204043' },
 { Datum: '30 apr',
 Tijd: '12:00',
 Thuis: 'Overbos E10',
 Uit: 'RCH E4',
 Type: 'co',
 WedNr: '172484' },
 { Datum: '07 mei',
 Tijd: '12:00',
 Thuis: 'IJmuiden A1',
 Uit: 'RCH A1',
 Type: 'co',
 WedNr: '62047' },
 { Datum: '07 mei',
 Tijd: '14:30',
 Thuis: 'Eendracht\'82 35+1 (zat)',
 Uit: 'RCH 35+1 (zat)',
 Type: 'co',
 WedNr: '66681' },
 { Datum: '08 mei',
 Tijd: '11:00',
 Thuis: 'Olympia Haarlem 4 (zon)',
 Uit: 'RCH 3 (zon)',
 Type: 'co',
 WedNr: '130556' },
 { Datum: '09 mei',
 Tijd: '19:00',
 Thuis: 'AMVJ D1',
 Uit: 'RCH D1',
 Type: 'co',
 WedNr: '215150' },
 { Datum: '11 mei',
 Tijd: '18:30',
 Thuis: 'SVIJ E1',
 Uit: 'RCH E1',
 Type: 'co',
 WedNr: '217793' },
 { Datum: '12 mei',
 Tijd: '19:00',
 Thuis: 'Velsen 6 (zon)',
 Uit: 'RCH 2 (zon)',
 Type: 'co',
 WedNr: '159065' },
 { Datum: '14 mei',
 Tijd: '09:00',
 Thuis: 'RODA 23 F6',
 Uit: 'RCH F3',
 Type: 'co',
 WedNr: '169513' },
 { Datum: '14 mei',
 Tijd: '10:15',
 Thuis: 'Haarlem-Kennemerland D4',
 Uit: 'RCH D3',
 Type: 'co',
 WedNr: '197997' },
 { Datum: '14 mei',
 Tijd: '17:00',
 Thuis: 'Olympia Haarlem 1 (zat)',
 Uit: 'RCH 1 (zat)',
 Type: 'co',
 WedNr: '3964' },
 { Datum: '14 mei',
 Tijd: '17:00',
 Thuis: 'Olympia Haarlem 45+1 (zat)',
 Uit: 'RCH 45+1 (zat)',
 Type: 'co',
 WedNr: '111330' },
 { Datum: '16 mei',
 Tijd: '13:00',
 Thuis: 'Hillegom sv A1 (zon)',
 Uit: 'RCH A1 (zon)',
 Type: 'co',
 WedNr: '148655' },
 { Datum: '16 mei',
 Tijd: '14:00',
 Thuis: 'HBC 1 (zon)',
 Uit: 'RCH 1 (zon)',
 Type: 'co',
 WedNr: '7797' },
 { Datum: '19 mei',
 Tijd: '19:00',
 Thuis: 'Alliance 22 3 (zon)',
 Uit: 'RCH 2 (zon)',
 Type: 'co',
 WedNr: '159107' } ];

 */