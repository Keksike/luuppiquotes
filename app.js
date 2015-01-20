/*
 * LuuppiQuotes server
 *
 *
 * @Author: Cihan Bebek
 *
*/

var express         = require('express'),
    app             = express(),
    path            = require('path'),
    http            = require('http'),
    morgan          = require('morgan'),
    mongoose        = require('mongoose'),
    autoIncrement   = require('mongoose-auto-increment'),
    bodyParser      = require('body-parser'),             //for form post
    moment          = require('moment'),                  //getting and handling dates

    passport        = require('passport'),
    _               = require('underscore');

/*Create connection to db*/
var connection = mongoose.connect('mongodb://localhost/quotesdb');
/*Mongoose-auto-increment init*/
autoIncrement.initialize(connection);

/*conf*/
app.use(morgan('dev')); // log every request to the console
app.set('port', process.env.PORT || 3000); //port 3000
app.use(bodyParser.json());    // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({  // to support URL-encoded bodies
    extended: true
})); 
app.use(express.static(path.join(__dirname, '/')));

/*Functionality starts here*/
var quoteSchema = new mongoose.Schema({
    quoteId: {
        type: Number,
        required: true
    },
    sender: {
        type: String,
    },
    place: {
        type: String,
        required: true
    },
    quote: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        default: Date.now()
    },
    votes: {
        type: Number,
        default: 0
    }
}, {
    toJSON: { //mongoids or mongoversion doesnt need to be shown
        transform: function(doc, ret, options) {
            return _.omit(ret, ['_id', '__v']);
        }
    }
});

var Quote = mongoose.model('Quote', quoteSchema);
quoteSchema.plugin(autoIncrement.plugin, {model: 'Quote', field: 'quoteId'});

/*Posts new quote to db*/
/*Requires a "place"-string and "quote"-string*/
app.post('/postQuote', function(req, res) {
    //Create new instance of Quote-model, with the sent data (req.body)
    var quote = new Quote(req.body);

    //replaces \r and \n to <br> so it can be used in <p>
    quote.quote = quote.quote.replace(/\r?\n/g,"<br>");
    quote.time = Date.now();
    console.log(quote); //for testing

    //Save it
    quote.save(function(err, quote) {
        /*res.send(404, 'error.');*/
    });
});


/*Not sure if I should make an own functions for upvote & downvote, went with this*/
/*query-params required: quoteId (number) & upvote (boolean)*/
app.post('/vote/', function(req, res) {

    if(req.query.quoteId == null || req.query.upvote == null){
        return res.status(400).send("Id:tä ei tullut!");
    }

    var voteCommand;

    if(req.query.upvote == true){ //if upvote true, increment by 1
        voteCommand = {$inc: {votes: 1}};
    }else{ //if upvote false increment by -1
        voteCommand = {$inc: {votes: -1}};
    }

    //issue update to quote of given id
    Quote.update({quoteId: req.query.quoteId}, voteCommand, {}, callback);
});

/*Gets a single quote, which is the next newest one of "timeNow"*/
/*app.get('/quotes/:timeNow', function(req, res) {

    var aika = parseInt(req.params.timeNow);
    console.log(aika);

    Quote.find().sort({time: -1}).findOne({time: {$lt: aika}}, function(err, quote){
        if(err){
            console.log(err);
            return res.status(500).send("jotain meni pieleen");
        }
        if(!quote){
            return res.status(404).send("quotea ei löytynyt");
        }

        res.send(quote);
    });
});*/

/*Gets n (where n = amount) quotes, starting from next newest of timeNow*/
app.get('/quotes/', function(req, res) {
    var time;
    //default amount 1, if only time is given
    var amount = 1;

    if(req.query.time != null){
        time = parseInt(req.query.time);
        console.log(time);
    }else{
        /*Returns all quotes*/
        Quote.find({}, 'quoteId sender place quote time', function(err, quotes) {
            res.send(quotes);
        });
        return;
    }

    if(req.query.amount){
        amount = parseInt(req.query.amount);
        console.log(amount);
    }else{
        console.log("Määrää ei annettu!");
    }

    //first sorts quotes newest to oldest
    //then finds the top n (where n = req.params.amount) quotes, where time < req.params.timeNow
    /*Quote.find().sort({time: -1}).find({time: {$lt: time}}).limit(amount, function(err, quotes){*/
    Quote.find().sort({time: -1}).find({time: {$lt: time}}).limit(amount).exec(function(err, quotes){
        console.log("asd");
        if(err){
            console.log(err);
            return res.status(500).send("Jotain meni pieleen!");
        }
        if(!quotes){
            return res.status(404).send("quoteja ei löytynyt!");
        }
        console.log(quotes);

        res.send(quotes);
    });
});


/*    Quote.find({}).sort({ _id: -1}).limit(1).toArray(function(err, docs){
        if(docs != null){
            console.log(err);
            res.send(docs);
        }
    });*/
    //sorts the quotes into newest -> oldest, and gets 1 quote
/*    Quote.find({}, {}, {sort: {'quoteId' : -1}}, function(err, quote) {
        if(quote == null) {
            gotta make errorhandling better
            return res.send(404, 'Quotea ei löytynyt!');
        }
        res.send(quote);
    });*/

/*Shows all quotes in db, used for testing*/
app.get('/quotes', function(req, res) {
    Quote.find({}, 'quoteId sender place quote time', function(err, quotes) {
        res.send(quotes);
    });
});

http.createServer(app).listen(app.get('port'), function (req, res) {
    console.log("Listening on port " + app.get('port'));
})
