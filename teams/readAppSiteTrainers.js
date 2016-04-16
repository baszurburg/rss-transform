/**
 * Created by Zurburg on 4/16/2016.
 *
 * This file reads the trainers the App CMS file
 *
 */
var config = require('../.env'),
    request = require('request-json');

var client = request.createClient(config.host);

var urls = [config.urls.trainers];

// build a loop here when we have multiple files

client.get(urls[0], function(err, res, body) {

    // Read the posts and process

    //return console.log(body);
});


client.saveFile(urls[0], 'tmp/trainers.json', function(err, res, body) {

    // writes the file with posts to the filesystem

    if (err) {
        return console.log(err);
    }
});
