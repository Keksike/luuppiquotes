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
    _               = require('underscore');

/*Create connection to db*/
var connection = mongoose.connect('mongodb://localhost/quotesdb');
/*Mongoose-auto-increment init*/
autoIncrement.initialize(connection);

/*conf*/
app.use(morgan('dev')); // log every request to the console
app.set('port', process.env.PORT || 3000); //port 3000
app.use( bodyParser.json() );    // to support JSON-encoded bodies
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
        type: String,
        required: true
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
    quote.time = moment(); //sets time of post
    console.log(quote); //for testing

    //Save it
    quote.save(function(err, quote) {
        /*res.send(201, _.pick(quote, 'quoteId'));*/
    });
});

/*Gets a single quote with its Id*/
app.get('/quotes/:id', function(req, res) {
    Quote.findOne({ quoteId: req.params.id }, function(err, quote) {
        if(quote == null) {
             return res.send(404, 'Quote not found!');
        }
        res.send(quote);
    });
});

/*Shows all quotes in db, used for testing*/
app.get('/quotes', function(req, res) {
    Quote.find({}, 'quoteId sender place quote time', function(err, quotes) {
        res.send(quotes);
    });
});

http.createServer(app).listen(app.get('port'), function (req, res) {
    console.log("Listening on port " + app.get('port'));
})
