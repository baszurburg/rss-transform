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

        // Write file

        var jsonfile = require('jsonfile');
        var file = 'tmp/rss1-filtered.json';

        jsonfile.writeFile(file, resultFile, function (err) {
            if (err) {
                console.error(err);
            }
        });

    })
    .on('readable', function() {
        var stream = this, item;
        while (item = stream.read()) {
            var result = {},
                images = [],
                sanitized = sanitizeHtml(item.description,
                 { allowedTags:
                     [ 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol',
                         'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'br', 'div'
                     ],
                     nonTextTags: [ 'table' ]
                 });

            console.log('Got article: %s', item.title || item.description);

            images = getImages(sanitizeHtml(item.description, {
                allowedTags: [ 'img' ]
            }));

            //populate result file
            result.name = item.title;
            result.link = item.link;
            result.pubDate = item.pubDate;
            result.images = images;

            result.content = {};

            result.content.extended = sanitized;

            resultFile.push(result);
        }

    });

var getImages = function(htmlFragment) {

    var images = [];

    var htmlparser = require("htmlparser2");
    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs){
            if(name === "img" && attribs.src){
                console.log(attribs.src);
                images.push(attribs.src);
            }
        },
        onend: (function (){
            return images;
        })
    });
    parser.write(htmlFragment);
    parser.end();

    return images;

};
