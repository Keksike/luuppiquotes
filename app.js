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
    bodyParser      = require('body-parser'), //for form post
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

    //Save it
    quote.save(function(err, quote) {
        res.send(201, _.pick(quote, 'quoteId'));
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Listening on port " + app.get('port'));
})
