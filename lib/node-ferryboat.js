/*
	Node plugin for ferryboat.js
*/

const ferryboat = require('./ferryboat.js');

ferryboat.initializeBeacon = function(options) {

    console.log("called initializeBeacon");
    const Beacon = require('beacon-es6-driver');
    //return Beacon;
    Beacon.initialize(options);
    ferryboat.setBeacon(Beacon);
};

ferryboat.initializeGrok = function (beaconOpts, pattern) {
    console.log("called initializeGrok");
    ferryboat.initializeBeacon(beaconOpts);

    if (pattern) {
        const patterns = require('node-grok').loadDefaultSync();
        const grokCollection = patterns.createPattern(pattern);
        ferryboat.setGrok(grokCollection);
    } else {
        ferryboat.setGrok(null);
    }
};

module.exports = ferryboat;