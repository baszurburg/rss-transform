/**
 * Created by Zurburg on 1/17/2016.
 */
var request = require('request-json');
var client = request.createClient('http://localhost:3000/');

var urls = ['api/posts'];

// build a loop here when we have multiple files

client.get(urls[0], function(err, res, body) {
    return console.log(body);
});


client.saveFile(urls[0], 'tmp/posts.json', function(err, res, body) {
    if (err) {
        return console.log(err);
    }
});
