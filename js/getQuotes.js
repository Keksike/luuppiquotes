var h = require('virtual-dom/h'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch'),
    createElement = require('virtual-dom/create-element'),
    _ = require('lodash'),
    $ = require('jquery'),
    moment = require('moment'); 


// tells us which id we last checked
var lol = 0;
var timestamp = Date.now();

/* amount = amount of fetched quotes and created quoteDivs */
function getNextQuotes(lastTime, amount, callback){
    $.get("/quotes/", {time: lastTime, amount: amount}).done(function(data){
        if(data !=  null){
            callback(null, data);
        }
    }, "json" ).fail(callback);
};

function getQuotes(){

}

/* Gets the next quote in line
 * Parameter is the time of the previous quote which has been gotten
*/
function getNextQuote(time, callback){
    $.get('/quotes' + time, function(data) {
        callback(null, data);
    }).fail(callback);
}

/* Appends html-elements with new quote info into #quotes-section
 * gets the data of a quote in json form
*/
function constructQuoteElements(data){
    if(data != null){ //if we found a quote with time
        // gotta do something about this mess of a code. 
        // should probably move it to another function too.
        console.log(data.length);
        console.log(data);

        var newTime;

        console.log(data[0].time);

        //iterate through data
        for(var i = 0; i < data.length; ++i){
            //Format time to something useful*/
            var date = moment(data[i].time).format('DD/MM/YYYY HH:mm');

            //idString includes quoteId of quote and then a separating line
            var idString = $('<div class="idDiv"><div class ="id">' +/*+ data[i].quoteId +*/ '</div><div class="line"></div></div>');
            //generate the whole quote-div
            var quoteString = $('<div class="quoteDiv">' 
                                    + '<p class="time">' + date + '</p>' + '<br>'
                                    + 'Lähettäjä: <p class="quoteSender">' + data[i].sender + '</p>' + '<br>'
                                    + '@ <p class="quotePlace">' + data[i].place + '</p>' + '<br>' + '<br>'
                                    + '<p class="quoteQuote">' + data[i].quote + '</p>' + '<br>'
                                + '</div>');
            $("#quotes").append(idString);
            $("#quotes").append(quoteString);

            //if last quote in data, return data.time for later use
            if(i == data.length-1){
                console.log("palauttaa " + data[i].time);
                return data[i].time;
            }
        }
    }else{
        console.log("Elements could not be created, data not found!");
    }
}

/*When page loads load quotes, gotta get rid of this*/
$(function(){
    getNextQuotes(timestamp, 5, function(err, quotes){
        if(err){
            console.log(err);
            return;
        }
        timestamp = constructQuoteElements(quotes);
    });
});

/* gets quotes when scrolling page down */
window.onscroll = function() {
    // when scrolling page checks if you've hit the bottom
    if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
        // Throttle means that it will call the function max every 1000ms
        // aka you can't "spam" quotes
        getNextQuotes(timestamp, 5, function(err, quotes){
            if(err){
                console.log(err);
                return;
            }

            timestamp = constructQuoteElements(quotes);
        });
    }
};