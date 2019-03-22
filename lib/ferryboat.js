/*
 *
 * ferryboat
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

'use strict';

var ferryboat = ferryboat || (function() {

    // ---------------------------------------------------------------------
    // Private static variables

    const __EOF__ = "--EOF--";

    let beaconInstance;
    let grokCollection;
    let regEx;

    // ---------------------------------------------------------------------
    // Variable that will hold information

    // ---------------------------------------------------------------------
    // Private static methods

    const forwardAsBeacon = async (line, messageType) => {
        //console.log("(%d) Sending '%s'", line.length, line);
        if ((typeof line === "string") && (__EOF__.localeCompare(line) === 0)) {
            console.log("Sending %s beacon", messageType);
            return await me.beaconInstance.transmit({ beaconMessageType: messageType, data: {closed: true}});
            //console.log("Send EOF complete");
        } else {
            console.log("Sending %s beacon", messageType);
            return await me.beaconInstance.transmit({ beaconMessageType: messageType, data: line});
        }
    };

    const processLineGrok = async function(line, messageType) {
        //var opts = {line: line, messageType: messageType};
        console.log("Processing line via Grok\r\n\t%s", line);

        const result = me.grokCollection.parseSync(line);
        let data = {original: line};
        if (result) {
            Object.assign(data, result);
        }
        //console.log(data);
        return await forwardAsBeacon(data, messageType);
    };

    const processLineRegEx = async function(line, messageType) {
        //var opts = {line: line, messageType: messageType};
        //console.log("Doing processLineRegEx");
        console.log("Processing line via RegEx\r\n\t%s", line);

        const result = me.regEx.exec(line);
        let data = {original: line};
        if (result && (result.length > 0)) {
            const fields = {};
            fields.matches = result.length;
            fields.items = {};
            for (var i = 0; i < result.length; i++) {
                //console.log('Have a match on %d %s!', i, result[i]);
                fields.items["field_"+(i+1)] = result[i];
            }
            Object.assign(data, fields);
        }
        //console.log(data);
        return await forwardAsBeacon(data, messageType);
    };



    // -------------------------------------------------------------------------
    // Public methods

    /*
        A short-cut for the ferryboat.text method
        Parameters:
        - txt (string): The text to make into ASCII Art
        - options (object/string - optional): Options that will override the current font's default options.
          If a string is provided instead of an object, it is assumed to be the font name.
            * font
            * horizontalLayout
            * verticalLayout
            * showHardBlanks - Wont remove hardblank characters
        - next (function): A callback function, it will contained the outputted ASCII Art.
    */
    var me = function(txt, options) {
        me.text(txt, options);
    };
    me.text = function(txt, options) {
        /*
            The callback will recieve a fontsOpts object, which contains the default
            options of the font (its fitting rules, etc etc).
        */
        //me.loadFontSync(fontName);
    };

    /*
        Create a regex.
    */
    me.initializeRegEx = function (beaconOpts, pattern) {
        me.initializeBeacon(beaconOpts);


        if (pattern) {
            console.log("Initializing RegEx");
            const regEx = new RegExp(pattern, 'g');
            me.setRegEx(regEx);
        } else {
            me.setRegEx(null);
        }
    };

    /**
     * Check on the beacon state
     * @returns {*}
     */
    me.requestsPendingCount = function() {
        return me.beaconInstance.pendingTxCount;
    };

    me.requestsPending = function() {
        return me.requestsPendingCount() > 0;
    };

    /**
     * Process a line of text and send it as a beacon.
     * Parameters:
     * - line (string): Line of text.
     * - messageType (string): Beacon message type.
     **/
    me.processLine = async function(line, messageType) {

        if (me.grokCollection) return await processLineGrok(line, messageType);
        else if (me.regEx) return await processLineRegEx(line, messageType);
    };

    /**
     * Send a beacon when the file closes.
     * Parameters:
     * - messageType (string): Beacon message type.
     **/
    me.processEOF = async function(messageType) {
        return await forwardAsBeacon(__EOF__, messageType);
    }

    /**
     * Public setters.
     **/

    me.setBeacon = async function(beacon) {
        me.beaconInstance = beacon;
    };

    me.setGrok = async function(collection) {
        me.grokCollection = collection;
    };

    me.setRegEx = async function(regEx) {
        me.regEx = regEx;
    };

    /**
     * Load add'l patterns.
     **/

    me.loadPatterns = async function(filePath) {
        if (me.grokCollection) return await me.grokCollection.loadSync(filePath);
        else return 0;
    };

    return me;
})();

// for node.js
if (typeof module !== 'undefined') {
    if (typeof module.exports !== 'undefined') {
        module.exports = ferryboat;
    }
}
