/**
 * Created by Zurburg on 1/22/2016.
 *
 * Post article(s) into the CMS
 *
 */
var config = require('./.env'),
    request = require('request-json');

var client = request.createClient(config.host),
    postsUrl = config.urls.posts;

// this should be coming from a file

var data = {

    "name": "Test CREATE",
    "publishedDate": "2016-01-11T23:00:00.000Z",
    "categories": [
        "5694ca66ddb93cc41bc20459"
    ],
    "content": {
        "brief": "Brief content",
        "extended": "<div>\r\n<p>Heee, op 7 en 8 juni 2014 hebben we voor het laatst een jeugdweekend gehouden. Het lijkt alweer heel ver weg na een jaartje 'niets doen'.</p>\r\n<p>Des te meer mogen we ons verheugen, dat het er dit jaar weer in zit. Er wordt al een tijdje aan de voorbereidingen gewerkt. Tenslotte moet je altijd ruim van te voren iets reserveren wil je er gebruik van maken. <br /><br />Jarenlang was Liesbeth Eindhoven de sterke motor achter het Jeugdweekend, waarin we vele prachtige momenten hebben mogen beleven en vaak met mooi weer. In 2014 nam ze niet alleen afscheid van het Jeugdtoernooi, maar ook bij RCH. Wat wil je als haar vier mannen bij HFC aan de gang zijn/gaan. <br /><br />Tja, wie gaat de organisatie overnemen? Het is geen klusje voor een avondje of wat. Meer dan een half jaar ben je er wel mee zoet. Gezien ook het drukke toernooiprogramma van vorig seizoen en, inderdaad, er geen organisatieopvolger was, hebben we helaas een seizoen voor gezien moeten houden.</p>\r\n<p><br />Dat nam niet weg, dat er toch wel vraag naar was, zeker door de vele leden, die al diverse Jeugdweekenden hadden meegemaakt. Het werd toch gemist. <br /><br />Vanuit de Jeugdcommissie kwam dan ook het verzoek/wens op de draad dit seizoen weer op te pakken. Maurice Keizer wilde wel de motor zijn, maar er moest natuurlijk ook voldoende brandstof (lees medewerkers) zijn om de boel aan de praat te houden. <br /><br />Liesbeth had voor Maurice voldoende tips en documentatie om aan de gang te gaan. In grote lijnen is er al een aardig programma samengesteld voor het Jeugdweekend, maar nu nog de deelnemers en die kans krijgen jullie nu. <br /><br />Onderaan deze pagina vindt u de uitnodiging en het inschrijfformulier voor het Jeugdweekend.</p>\r\n<strong>Print uit, Schrijf snel in, Lever snel in. </strong>\r\n<p>RCH EN DE ORGANISATIE hopen op een grote opkomst. Minimaal 100 deelnemers. Het wordt geweldig.</p>\r\n</div>"
    },
    "image": {
        "public_id": "qpue8feuecugyikpug1w",
        "version": 1452593024,
        "signature": "178f7540a38cd42d24889cf6718fc6e87827ebb7",
        "width": 360,
        "height": 240,
        "format": "jpg",
        "resource_type": "image",
        "url": "http://res.cloudinary.com/keystone-demo/image/upload/v1452593024/qpue8feuecugyikpug1w.jpg",
        "secure_url": "https://res.cloudinary.com/keystone-demo/image/upload/v1452593024/qpue8feuecugyikpug1w.jpg"
    },
    "state": "published"
};

// Read a file and loop th


client.post(postsUrl, data, function(err, res, body) {
    return console.log(res.statusCode);
});



