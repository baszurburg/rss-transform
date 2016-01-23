/**
 * Created by Zurburg on 1/17/2016.
 */
var config = require('./.env'),
    request = require('request-json');

var client = request.createClient(config.host);

var urls = [config.urls.posts];

// build a loop here when we have multiple files

client.get(urls[0], function(err, res, body) {
    return console.log(body);
});


client.saveFile(urls[0], 'tmp/posts.json', function(err, res, body) {
    if (err) {
        return console.log(err);
    }
});
