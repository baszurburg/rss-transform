/**
 * Created by Zurburg on 1/15/2016.
 */
var FeedParser = require('feedparser')
    , request = require('request')
    , options = {
        "addmeta": false
    };

var req = request('http://icws.nl/rss?projection=1079')
    , feedParser = new FeedParser([options]);

req.on('error', function (error) {
    // handle any request errors
});
req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

    stream.pipe(feedParser);
});


feedParser.on('error', function(error) {
    // always handle errors
});
feedParser.on('readable', function() {
    // This is where the action is!
    var stream = this
        , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedParser instance
        , item;

    while (item = stream.read()) {
        console.log(item);
    }
});