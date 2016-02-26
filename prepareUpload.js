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
        preparedPost;

    console.log('Processing post # ' + i + ' - ' + newPost.name);

    postAction = determineAction(newPost);

    console.log(postAction);

    if (postAction) {
        preparedPost = preparePost(newPost);
    }

    if (postAction === 'CREATE') {

        if (newPost.images.length > 0) {
            console.log('newPost.images.length ' + newPost.images.length);
            //cloudinary.uploader.upload(newPost.images[0],
            //    function(result) {
            //    console.log(result)
            //});
        }

        // GO GO CREATE

        //client.post(postsUrl, preparedPost, function(err, res, body) {
        //    return console.log(res.statusCode);
        //});

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
                    result = false;
                } else if (publishedPost.locked === 'archived') {
                    result = false;
                }

            }
        }
    }

    return result;
}

function preparePost(newPost) {
    post = {};


    post.name = newPost.name;
    post.publishedDate = newPost.pubDate;
    post.categories = [];

    post.content = {};
    post.content.brief = "to do";
    post.content.extended = newPost.content.extended;
    post.image = {};
    post.externalName = "newPost.name";
    post.externalLink = newPost.link;
    post.state = "published";

    return post;

}


// If it does not exist put it in posts_to_create

/*************************************************************************
    Images
**************************************************************************/

// Create a cloudinary image object


/*
    Read datafile(s) (prepare the file first with the items we want to create)
    write loop through array
        - select best ratio image
        - upload image (set size while doing so)
        - get image data back and insert in create json

 cloudinary.uploader.upload("http://www.example.com/image.jpg", function(result) {
 console.log(result)
 });


 cloudinary.uploader.upload(
 req.files.myImage.path,
 function(result) { console.log(result); },
 {
 public_id: 'sample_id',
 crop: 'limit',
 width: 2000,
 height: 2000,
 eager: [
 { width: 200, height: 200, crop: 'thumb', gravity: 'face',
 radius: 20, effect: 'sepia' },
 { width: 100, height: 150, crop: 'fit', format: 'png' }
 ],
 tags: ['special', 'for_homepage']
 }
 )

*/


var data = {
    name: "Metamorfose speelplek",
    externalLink: "http://www.rch-voetbal.nl/nieuws-en-verslagen/jeugd-nieuws/1940-metamorfose-speelplek",
    externalName: "1940-metamorfose-speelplek",
    locked: false,
    publishedDate: "2016-01-22T23:00:00.000Z",
    categories: [
        "56a2b647d8b52f140119aaf5"
    ],
    content: {
        brief: "<p>Hoewel de glijbaan al een fraai beeld vormt op ons sportcomplex en (kleine) kinderen hier dankbaar gebruik van maken als grotere broer of zus aan dat &lsquo;oninteressante geschop tegen een bal&rsquo; aan het doen zijn, maar het grasveldje en de landplaats na het glijden zagen er nu niet echt fraai uit.</p>",
        extended: "<p>Hoewel de glijbaan al een fraai beeld vormt op ons sportcomplex en (kleine) kinderen hier dankbaar gebruik van maken als grotere broer of zus aan dat &lsquo;oninteressante geschop tegen een bal&rsquo; aan het doen zijn, maar het grasveldje en de landplaats na het glijden zagen er nu niet echt fraai uit.</p> <p>Zeker als het en keer geregend heeft is de natte landing niet echt plezierig. Hoe fantastisch ziet het er na deze week uit. Nu lijkt het er op dat de kinderen nu een harde stuiter maken op stenen, maar niets is minder waar, want er liggen nu rubberen tegels.</p> <p>De palen moeten de speelplek autovrij houden. Het liefst ook fiets- en scootervrij, maar dat is aan u als bezoeker van ons sportcomplex om die discipline op te kunnen brengen om niet op die plek te parkeren/stallen ten veiligheid van onze jongste bezoekers.</p>"
    },
    image: {
        public_id: "xlmzljsrrannw7bemndz",
        version: 1453504263,
        signature: "facaa95e3c1d81bc4999d1e6c154a10a334aad7a",
        width: 800,
        height: 534,
        format: "jpg",
        resource_type: "image",
        url: "http://res.cloudinary.com/icws/image/upload/v1453504263/xlmzljsrrannw7bemndz.jpg",
        secure_url: "https://res.cloudinary.com/icws/image/upload/v1453504263/xlmzljsrrannw7bemndz.jpg"
    },
    state: "published"
};

