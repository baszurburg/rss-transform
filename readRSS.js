/**
 * Created by Zurburg on 1/15/2016.
 */
var FeedParser = require('feedparser'),
    fs = require('fs'),
    request = require('request'),
    options = {"addmeta": false},
    sanitizeHtml = require('sanitize-html'),
    resultFile = [];


// todo get from environment

var req = request('http://www.rch-voetbal.nl/?format=feed&type=rss')
    , feedParser = new FeedParser(options);

req.on('error', function (error) {
    // handle any request errors
});
req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

    stream.pipe(feedParser);
});


feedParser
    .on('error', function(error) {
    // always handle errors
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
        // This is where the action is!
        var stream = this
            , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedParser instance
            , item;

        while (item = stream.read()) {
            var result = {},
                images = [],
                brief = '',
                sanitizedBrief = sanitizeHtml(item.description,
                    { allowedTags:
                        [ 'hr'],
                        allowedAttributes: {
                            'hr': [ 'class' ]
                        },
                        nonTextTags: [ 'table' ]
                    }),
                sanitized = sanitizeHtml(item.description,
                    { allowedTags:
                        [ 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol',
                            'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'br', 'div'
                        ],
                        nonTextTags: [ 'table' ]
                    });

            console.log('Got article: %s', item.title || item.description);

            // ToDo: check brief for <hr class="readmore"> then take all chars before
            // otherwise take just ~160 chars

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