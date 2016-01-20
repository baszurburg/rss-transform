/*!
* node-feedparser
* Copyright(c) 2013 Dan MacTough <danmactough@gmail.com>
* MIT Licensed
*/

var FeedParser = require('feedparser'),
    fs = require('fs'),
    sanitizeHtml = require('sanitize-html'),
    feed = 'test/thuis.xml',
    options = {"addmeta": false},
    resultFile = [];

fs.createReadStream(feed)
    .on('error', function (error) {
        console.error(error);
    })
    .pipe(new FeedParser(options))
    .on('error', function (error) {
        console.error(error);
    })
    .on('meta', function (meta) {
        console.log('===== %s =====', meta.title);
    })
    .on('end', function() {

        var jsonfile = require('jsonfile');

        var file = 'tmp/rss1-filtered.json';

        jsonfile.writeFile(file, resultFile, function (err) {
            console.error(err)
        });

    })
    .on('readable', function() {
        var stream = this, item;
        while (item = stream.read()) {
            var result = {};

            console.log('Got article: %s', item.title || item.description);

            //console.log(item);

            //populate result File
            result.content = {};

            result.name = item.title;
            result.link = item.link;
            result.pubDate = item.pubDate;

            result.content.extended = sanitizeHtml(item.description);

            resultFile.push(result);
        }

    });