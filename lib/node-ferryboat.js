/*
 *
 * 	Node plugin for ferryboat
 *
 * Copyright © 2019 HarborIO, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/*
*/

const fs = require('fs');
const path = require('path');
const ferryboat = require('./ferryboat.js');

ferryboat.initializeBeacon = function(options) {

    console.log("called initializeBeacon");
    const Beacon = require('beacon-es6-driver');
    //return Beacon;
    Beacon.initialize(options);
    ferryboat.setBeacon(Beacon);
};

ferryboat.initializeGrok = function (beaconOpts, pattern, custom, extra) {
    console.log("called initializeGrok");
    ferryboat.initializeBeacon(beaconOpts);

    if (pattern) {

        const patterns = require('node-grok').loadDefaultSync();
        //const patterns = require('node-grok');
        if (extra) {
            let files = fs.readdirSync(extra);

            if (files && files.length) {
                files.forEach(function (file) {
                    console.log(path.join(extra, file));
                    //result.loadSync(program.definitions + file);
                    patterns.loadSync(path.join(extra, file));
                })
            }
        } else {
            //patterns.loadDefaultSync();
        }

        //if (custom) patterns.loadSync(custom);
        if (custom) {
            let files = fs.readdirSync(custom);

            if (files && files.length) {
                files.forEach(function (file) {
                    console.log(path.join(custom, file));
                    //result.loadSync(program.definitions + file);
                    patterns.loadSync(path.join(custom, file));
                })
            }
        }

        const grokCollection = patterns.createPattern(pattern);
        ferryboat.setGrok(grokCollection);
    } else {
        ferryboat.setGrok(null);
    }
};

module.exports = ferryboat;