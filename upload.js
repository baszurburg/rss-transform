/**
 * Created by Zurburg on 1/22/2016.
 */
var config = require('./.env'),
    cloudinary = require('cloudinary'),
    jsonfile = require('jsonfile'),
    request = require('request-json'),
    util = require('util'),
    _ = require('lodash'),
    uploadPosts = [];

var client = request.createClient(config.host),
    postsUrl = config.urls.posts;


cloudinary.config(config.cloudinary);


// read datafiles

var newPosts = jsonfile.readFileSync('tmp/rss1-filtered.json'),
    newPostsLength = newPosts.length,
    i;

var publishedPostsFile = jsonfile.readFileSync('tmp/posts.json'),
    publishedPosts = publishedPostsFile.posts,
    publishedPostsLength = publishedPosts.length,
    j;

/**************************************************
 *              START PROCESSING
 **************************************************/

console.log("Already published posts: " + publishedPostsLength);
console.log("Number of posts to process: " + newPostsLength);

for (i=0; i < newPostsLength; i++) {
    var newPost = newPosts[i],
        postAction = null,
        preparedNewPost;

    console.log('Processing post # ' + i + ' - ' + newPost.name);

    postAction = determineAction(newPost);

    if (postAction) {
        console.log(postAction);
    }

    if (postAction === 'CREATE') {
        preparedNewPost = prepareNewPost(newPost);
        createPost(newPost, _.clone(preparedNewPost));
    }

}

function determineAction(newPost) {
    var result = 'CREATE';

    for (j=0; j < publishedPostsLength; j++) {
        var publishedPost = publishedPosts[j];

        if (typeof publishedPost.externalLink !== 'undefined') {
            if (publishedPost.externalLink === newPost.link) {
                j = publishedPostsLength; // stop the loop
                result = 'UPDATE';

                if (publishedPost.locked) {
                    console.log('content is locked: ' + newPost.name);
                    result = false;
                } else if (publishedPost.state === 'archived') {
                    console.log('content is archived: ' + newPost.name);
                    result = false;
                } else if (newPost.content.brief === publishedPost.content.brief && newPost.content.extended === publishedPost.content.extended) {
                    console.log('content is equal: ' + newPost.name);
                    result = false;
                }

                // OK - UPDATE

                if (result === 'UPDATE') {
                    updatePost(publishedPost, newPost);
                }


            }
        }
    }

    return result;
}

function prepareNewPost(newPost) {
    post = {};

    post.name = newPost.name;
    post.publishedDate = newPost.pubDate;
    post.categories = [];

    post.content = {};
    post.content.brief = newPost.content.brief;
    post.content.extended = newPost.content.extended;
    post.image = {};
    post.externalName = newPost.name;
    post.externalLink = newPost.link;
    post.state = "published";

    return post;
}

function createPost(newPost, preparedNewPost) {
    if (newPost.images.length > 0) {
        cloudinary.uploader.upload(newPost.images[0],
            function(result) {
                console.log(result);

                var imageObj = {};
                imageObj.public_id = result.public_id;
                imageObj.version = result.version;
                imageObj.signature = result.signature;
                imageObj.width = result.width;
                imageObj.height= result.height;
                imageObj.format = result.format;
                imageObj.resource_type = result.resource_type;
                imageObj.url = result.url;
                imageObj.secure_url = result.secure_url;

                preparedNewPost.image = imageObj;

                client.post(postsUrl, preparedNewPost, function(err, res, body) {
                    return console.log(res.statusCode);
                });

            });
    } else {
        client.post(postsUrl, preparedNewPost, function(err, res, body) {
            return console.log(res.statusCode);
        });

    }
}

function updatePost(publishedPost, newPost) {
    var updateUrl = postsUrl + '/' + publishedPost._id;
    var post = {};

    console.log("WE ARE UPDATING: " + newPost.name);
    console.log("URL: " + updateUrl);

    post.name = newPost.name;
    post.content = {};
    post.content.brief = newPost.content.brief;
    post.content.extended = newPost.content.extended;

    client.patch(updateUrl, post, function(err, res, body) {
        return console.log(res.statusCode);
    });
}
