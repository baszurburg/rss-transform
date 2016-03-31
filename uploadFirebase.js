/**
 * Created by Zurburg on 1/22/2016.
 */
var config = require('./.env'),
    jsonfile = require('jsonfile'),
    request = require('request-json'),
    Firebase = require("firebase"),
    sanitizeHtml = require('sanitize-html'),
    util = require('util'),
    _ = require('lodash'),
    uploadPosts = [];

var client = request.createClient(config.host),
    postsUrl = config.urls.posts;

var firebaseRef = new Firebase("https://intense-heat-7311.firebaseio.com/");

var postsRef = firebaseRef.child("posts")

// read datafiles

var publishedPostsFile = jsonfile.readFileSync('tmp/posts.json'),
    publishedPosts = publishedPostsFile.posts,
    publishedPostsLength = publishedPosts.length,
    j;

/**************************************************
 *              START PROCESSING
 **************************************************/
console.log("- - - Start Upload Firebase - - - ");
console.log(" ");
console.log("Number posts read: " + publishedPostsLength);

for (j=0; j < publishedPostsLength; j++) {
    var publishedPost = publishedPosts[j];

    if (typeof publishedPost.state !== 'undefined') {
        if (publishedPost.state === 'published') {

            // Sanitize the data before uploading to Firebase

            publishedPost.content.brief = sanitizeHtml(publishedPost.content.brief,
                { allowedTags: [],
                    allowedAttributes: []
                });
            publishedPost.content.extended = sanitizeHtml(publishedPost.content.extended,
                { allowedTags:
                    ['p', 'strong', 'a'],
                    allowedAttributes: {
                        'a': [ 'href' ]
                    },
                    nonTextTags: [ 'table' ]
                });

            publishedPost.content.extended = publishedPost.content.extended.replace(/<br \/><br \/>/g, "<br \/>");

            uploadPosts.push(publishedPost);
        }
    }
}

console.log("Number published posts: " +  uploadPosts.length);

var onComplete = function(error) {
    if (error) {
        console.log('Synchronization failed');
    } else {
        console.log('Synchronization succeeded');
    }
    process.exit();
};

postsRef.set(uploadPosts, onComplete);
