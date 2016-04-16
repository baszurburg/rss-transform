/**
 * Created by Zurburg on 1/22/2016.
 */
var config = require('../.env'),
    jsonfile = require('jsonfile'),
    request = require('request-json'),
    Firebase = require("firebase"),
    sanitizeHtml = require('sanitize-html'),
    htmlparser = require("htmlparser2"),
    util = require('util'),
    _ = require('lodash'),
    uploadTeams = [];

var client = request.createClient(config.host),
    teamsUrl = config.urls.teams,
    trainersUrl = config.urls.trainers;

var firebaseRef = new Firebase(config.firebase);

var teamsRef = firebaseRef.child("teams");

// read datafiles

var teamsFile = jsonfile.readFileSync('tmp/teams.json'),
    teams = teamsFile.teams,
    teamsLength = teams.length,
    trainersFile = jsonfile.readFileSync('tmp/trainers.json'),
    trainers = trainersFile.users,
    trainersLength = trainers.length,
    j;

var extendedContent = '',
    spelers = '',
    sponsers = '';


/**************************************************
 *              START PROCESSING
 **************************************************/
console.log("- - - Start Upload TEAMS Firebase - - - ");
console.log(" ");
console.log("Number teams read: " + teamsLength);

var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - 25);

for (j=0; j < teamsLength; j++) {
    var team = teams[j],
        jsonContent = {};

    // Sanitize the data before uploading to Firebase

    team.content.brief = sanitizeHtml(team.content.brief,
        { allowedTags: [],
            allowedAttributes: []
        });

    //Not needed if we render this in the app with HTMLVIEW
    //extendedContent = sanitizeHtml(team.content.extended,
    //    { allowedTags:
    //        ['p', 'strong', 'a', 'b', 'br', 'img', 'ul', 'li'],
    //        allowedAttributes: {
    //            'a': [ 'href' ],
    //            'img': ['src']
    //        },
    //        selfClosing: ['br'],
    //        exclusiveFilter: function(frame) {
    //            return (frame.tag === 'a' || frame.tag === 'strong' || frame.tag === 'b' || frame.tag === 'p' )  && !frame.text.trim()
    //        }
    //    });
    //spelers = sanitizeHtml(team.spelers,
    //    { allowedTags:
    //        ['p', 'strong', 'a', 'b', 'br', 'img', 'ul', 'li'],
    //        allowedAttributes: {
    //            'a': [ 'href' ],
    //            'img': ['src']
    //        },
    //        selfClosing: ['br'],
    //        exclusiveFilter: function(frame) {
    //            return (frame.tag === 'a' || frame.tag === 'strong' || frame.tag === 'b' || frame.tag === 'p' )  && !frame.text.trim()
    //        }
    //    });
    //sponsers = sanitizeHtml(team.sponsors,
    //    { allowedTags:
    //        ['p', 'strong', 'a', 'b', 'br', 'img', 'ul', 'li'],
    //        allowedAttributes: {
    //            'a': [ 'href' ],
    //            'img': ['src']
    //        },
    //        selfClosing: ['br'],
    //        exclusiveFilter: function(frame) {
    //            return (frame.tag === 'a' || frame.tag === 'strong' || frame.tag === 'b' || frame.tag === 'p' )  && !frame.text.trim()
    //        }
    //    });



    //Not needed if we render this in the app with HTMLVIEW
    //extendedContent = extendedContent.replace(/<br \/><br \/>/g, "<br \/>");
    //extendedContent = extendedContent.replace(/<br \/><br \/>/g, "<br \/>");
    //extendedContent = extendedContent.replace(/&amp;/g, "&");
    //extendedContent = extendedContent.replace(/&quot;/g, "'");
    //
    //spelers = spelers.replace(/<br \/><br \/>/g, "<br \/>");
    //spelers = spelers.replace(/<br \/><br \/>/g, "<br \/>");
    //spelers = spelers.replace(/&amp;/g, "&");
    //spelers = spelers.replace(/&quot;/g, "'");
    //
    //sponsers = sponsers.replace(/<br \/><br \/>/g, "<br \/>");
    //sponsers = sponsers.replace(/<br \/><br \/>/g, "<br \/>");
    //sponsers = sponsers.replace(/&amp;/g, "&");
    //sponsers = sponsers.replace(/&quot;/g, "'");


    // Create a json of the content

    //jsonContent = parseContent(extendedContent);

    //console.log('jsonContent: ' + JSON.stringify(jsonContent) );
    //team.content.extended = jsonContent;


    // add image thumbnail
    if (typeof  team.image === 'object') {
        team.image.imageThumb = team.image.secure_url.replace(/upload/g, 'upload/g_faces,c_thumb,h_90,ar_5:3,z_0.8');
    }

    // replace the trainers and leiders with details

    team.trainers = getDetails(team.trainers);
    team.leiders = getDetails(team.leiders);

    uploadTeams.push(team);

}

console.log("Number published teams: " +  uploadTeams.length);

var onComplete = function(error) {
    if (error) {
        console.log('Synchronization failed');
    } else {
        console.log('Synchronization succeeded');
    }
    process.exit();
};

// WATCH IT - Do the UPLOAD
teamsRef.set(uploadTeams, onComplete);


// Get details from leiders / trainers
function getDetails(staff) {
    var persons = [],
        i;

    var staffLenght = staff.length;

    for (i=0; i < staffLenght; i++) {
        var staffMember = staff[i];

        persons[i] = _.find(trainers, function(o) { return o._id.toString() === staffMember.toString(); });

    }

    return persons;
}


//function parseContent(input) {
//    var output = [],
//        lastItem = '',
//        text = '',
//        href = '';
//
//    var parser = new htmlparser.Parser({
//        onopentag: function(name, attribs){
//            var tagObj = {};
////            console.log('open: ' +  name);
//
//            if(name === "a"){
////                console.log('attribs: ' + JSON.stringify(attribs) );
//                if (attribs.href) {
//                    href = attribs.href;
//                }
//            } else if ((name === 'p' || name === 'br') && !(lastItem === 'p' || lastItem === 'br')) {
//                tagObj.break = true;
//                output.push(tagObj);
//            }
//
//            lastItem = name;
//        },
//        ontext: function(text){
//            var textObj = {},
//                linkObj = {},
//                linkText = {};
//            text = text.trim();
//            if (text && text.toLowerCase() !== 'stand') {
////                console.log("-->", text.trim());
//
//                if (lastItem === 'b' || lastItem === 'strong') {
//                    textObj[lastItem] = text;
//                } else if (lastItem === 'p' || lastItem === 'br') {
//                    textObj.text = text;
//                } else if (lastItem === 'a' && href) {
//                    textObj.a = [];
//                    linkObj.href = href;
//                    linkText.text = text;
//                    textObj.a.push(linkObj);
//                    textObj.a.push(linkText);
//                    href = '';
//                } else {
//                    textObj.text = text;
//                }
//
//                output.push(textObj);
//
//                lastItem = "text";
//            }
//
//        },
//        onclosetag: function(tagname){
//        }
//    }, {
//        lowerCaseTags: true,
//        lowerCaseAttributeNames: true,
//        recognizeSelfClosing: true
//    });
//
//    parser.write(input);
//    parser.end();
//
//    return output;
//}
