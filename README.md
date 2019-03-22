# hrbr-ferryboat

Parses lines from log files, converts each line to a beacon message, and then sends the beacon messages to (https://hrbr.io).

If you are looking for a working example then you should check out
the [ferryboat-cli](https://github.com/HrbrIO/ferryboat-cli#README.md) which is a command
line interface for sending output from log files to hrbr.io using this module.

## Sample Implementation
Here is a sample javascript implementation:
```javascript
const ferryboat = require('hrbr-ferryboat');

const grokPattern = "%{COMMONAPACHELOG}";
const beaconOpts = {
    apiKey: "8675309",
    appVersionId: "com.myco.syslog:1.0.0",
    beaconVersionId: "com.myco.groklog:1.0.0",
    bufferOptions: {
        lengthLimit: 100000
    },
    interMessageDelayMs: 1
};
const messageType = "MYAPACHE_LOG";

const processLines = async () => {

    const lines = [
        '218.30.103.62 - - [04/Jan/2019:05:28:43 +0000] "GET /blog/geekery/xvfb-firefox.html HTTP/1.1" 200 10975 "-" "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)"',
        '218.30.103.62 - - [04/Jan/2019:05:29:06 +0000] "GET /blog/geekery/puppet-facts-into-mcollective.html HTTP/1.1" 200 9872 "-" "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)"',
        '198.46.149.143 - - [04/Jan/2019:05:29:13 +0000] "GET /blog/geekery/disabling-battery-in-ubuntu-vms.html?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+semicomplete%2Fmain+%28semicomplete.com+-+Jordan+Sissel%29 HTTP/1.1" 200 9316 "-" "Tiny Tiny RSS/1.11 (http://tt-rss.org/)"',
        '198.46.149.143 - - [04/Jan/2019:05:29:13 +0000] "GET /blog/geekery/solving-good-or-bad-problems.html?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+semicomplete%2Fmain+%28semicomplete.com+-+Jordan+Sissel%29 HTTP/1.1" 200 10756 "-" "Tiny Tiny RSS/1.11 (http://tt-rss.org/)"',
        '218.30.103.62 - - [04/Jan/2019:05:29:26 +0000] "GET /blog/geekery/jquery-interface-puffer.html%20target= HTTP/1.1" 200 202 "-" "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)"',
        '218.30.103.62 - - [04/Jan/2019:05:29:48 +0000] "GET /blog/geekery/ec2-reserved-vs-ondemand.html HTTP/1.1" 200 11834 "-" "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)"',
        '66.249.73.135 - - [04/Jan/2019:05:30:06 +0000] "GET /blog/web/firefox-scrolling-fix.html HTTP/1.1" 200 8956 "-" "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"',
        '86.1.76.62 - - [04/Jan/2019:05:30:37 +0000] "GET /projects/xdotool/ HTTP/1.1" 200 12292 "http://www.haskell.org/haskellwiki/Xmonad/Frequently_asked_questions" "Mozilla/5.0 (X11; Linux x86_64; rv:24.0) Gecko/20140205 Firefox/24.0 Iceweasel/24.3.0"',
        '86.1.76.62 - - [04/Jan/2019:05:30:37 +0000] "GET /reset.css HTTP/1.1" 200 1015 "http://www.semicomplete.com/projects/xdotool/" "Mozilla/5.0 (X11; Linux x86_64; rv:24.0) Gecko/20140205 Firefox/24.0 Iceweasel/24.3.0"',
        '86.1.76.62 - - [04/Jan/2019:05:30:37 +0000] "GET /style2.css HTTP/1.1" 200 4877 "http://www.semicomplete.com/projects/xdotool/" "Mozilla/5.0 (X11; Linux x86_64; rv:24.0) Gecko/20140205 Firefox/24.0 Iceweasel/24.3.0"'
    ];

    ferryboat.initializeGrok(beaconOpts, grokPattern, null, null);

    for await (const line of lines) {
        const res = await ferryboat.processLine(line, messageType);
    }

};

processLines();
```

To try the sample code do:
```bash
$ mkdir myfirstbeacon
$ cd myfirstbeacon
$ npm init -y
$ npm install -S hrbr-ferryboat
$ # Save the above code as index.js
$ # Be sure to replace apiKey, appVersionId, beaconVersionId in your code.
$ npm update
$ node index.js
```

## API Description

- `initializeGrok(beaconOpts, grokPattern, grokModuleDir2, grokModuleDir1)` : Initialize for grok with `grokPattern`. Optionally specify additional grok module directories.
- `initializeRegEx(beaconOpts, regEx)` - Initialize for regEx with RegExp `regEx`.
- `processLine(line, messageType)` -  - Send a beacon using the given line and attempting to match the initialized grok or regex pattern.
- `processEOF(messageType)` - Send a beacon to indicate a file has closed.
- `requestsPending()` - Returns `true|false` if beacon requests are currently in flight.
- `requestsPendingCount()` - Returns the `number` of beacon requests currently in flight.
