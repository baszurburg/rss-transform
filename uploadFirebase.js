/**
 * Created by Zurburg on 1/22/2016.
 */
var config = require('./.env'),
    jsonfile = require('jsonfile'),
    request = require('request-json'),
    Firebase = require("firebase"),
    sanitizeHtml = require('sanitize-html'),
    htmlparser = require("htmlparser2"),
    util = require('util'),
    _ = require('lodash'),
    uploadPosts = [];

var client = request.createClient(config.host),
    postsUrl = config.urls.posts;

var firebaseRef = new Firebase("https://intense-heat-7311.firebaseio.com/");

var postsRef = firebaseRef.child("posts");

// read datafiles

var publishedPostsFile = jsonfile.readFileSync('tmp/posts.json'),
    publishedPosts = publishedPostsFile.posts,
    publishedPostsLength = publishedPosts.length,
    j;

var extendedContent = '';


/**************************************************
 *              START PROCESSING
 **************************************************/
console.log("- - - Start Upload Firebase - - - ");
console.log(" ");
console.log("Number posts read: " + publishedPostsLength);

for (j=0; j < publishedPostsLength; j++) {
    var publishedPost = publishedPosts[j],
        jsonContent = {};

    if (typeof publishedPost.state !== 'undefined') {
        if (publishedPost.state === 'published') {

            // Sanitize the data before uploading to Firebase

            publishedPost.content.brief = sanitizeHtml(publishedPost.content.brief,
                { allowedTags: [],
                    allowedAttributes: []
                });
            extendedContent = sanitizeHtml(publishedPost.content.extended,
                { allowedTags:
                    ['p', 'strong', 'a', 'b', 'br'],
                    allowedAttributes: {
                        'a': [ 'href' ]
                    },
                    selfClosing: ['br'],
                    exclusiveFilter: function(frame) {
                        return (frame.tag === 'a' || frame.tag === 'strong' || frame.tag === 'b' || frame.tag === 'p' )  && !frame.text.trim()
                    }
                });

            extendedContent = extendedContent.replace(/<br \/><br \/>/g, "<br \/>");
            extendedContent = extendedContent.replace(/<br \/><br \/>/g, "<br \/>");
            extendedContent = extendedContent.replace(/&amp;/g, "&");
            extendedContent = extendedContent.replace(/&quote;/g, "'");

            // Create a json of the content

            jsonContent = parseContent(extendedContent);

            //console.log('jsonContent: ' + JSON.stringify(jsonContent) );
            publishedPost.content.extended = jsonContent;

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

// WATCH IT
postsRef.set(uploadPosts, onComplete);

function parseContent(input) {
    var output = [],
        lastItem = '',
        text = '',
        href = '';

    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs){
            var tagObj = {};
//            console.log('open: ' +  name);

            if(name === "a"){
//                console.log('attribs: ' + JSON.stringify(attribs) );
                if (attribs.href) {
                    href = attribs.href;
                }
            } else if ((name === 'p' || name === 'br') && !(lastItem === 'p' || lastItem === 'br')) {
                tagObj.break = true;
                output.push(tagObj);
            }

            lastItem = name;
        },
        ontext: function(text){
            var textObj = {},
                linkObj = {},
                linkText = {};
            text = text.trim();
            if (text && text.toLowerCase() !== 'stand') {
//                console.log("-->", text.trim());

                if (lastItem === 'b' || lastItem === 'strong') {
                    textObj[lastItem] = text;
                } else if (lastItem === 'p' || lastItem === 'br') {
                    textObj.text = text;
                } else if (lastItem === 'a' && href) {
                    textObj.a = [];
                    linkObj.href = href;
                    linkText.text = text;
                    textObj.a.push(linkObj);
                    textObj.a.push(linkText);
                    href = '';
                } else {
                    textObj.text = text;
                }

                output.push(textObj);

                lastItem = "text";
            }

        },
        onclosetag: function(tagname){
        }
    }, {
        lowerCaseTags: true,
        lowerCaseAttributeNames: true,
        recognizeSelfClosing: true
    });

    parser.write(input);
    parser.end();

    return output;
}
