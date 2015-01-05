var h = require('virtual-dom/h'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch'),
    createElement = require('virtual-dom/create-element'),
    _ = require('lodash'),
    $ = require('jquery'),
    moment = require('moment'); 


// tells us which id we last checked
var prevTime = moment();
var lol = 0;

/* amount = amount of fetched quotes and created quoteDivs */
function getNextQuotes(prevTime, amount){
    $.get("/quotes", {limit: amount, time: prevTime}).done(function(data){
        if(data !=  null){
            for(var key in data){
                constructQuoteElement(data[key]);
            }
        }
    }, "json" );
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
function constructQuoteElement(data){
    if(data != null){ //if we found a quote with time
        // gotta do something about this mess of a code. 
        // should probably move it to another function too.
        var lineString = $('<div class="line"></div>');
        var quoteString = $('<div class="quoteDiv">' 
                                + '<p class="time">' + data.time + '</p>' + '<br>'
                                + 'Lähettäjä: <p class="quoteSender">' + data.sender + '</p>' + '<br>'
                                + '@ <p class="quotePlace">' + data.place + '</p>' + '<br>' + '<br>'
                                + '<p class="quoteQuote">' + data.quote + '</p>' + '<br>'
                            + '</div>');
        $("#quotes").append(lineString);
        $("#quotes").append(quoteString);
        return data.time;
    }else{
        console.log("Element could not be created, data not found!");
    }
}

/* when page loads, make sure to load some quotes
   I'm fairly sure that theres a better/faster way of doing this, but this seems safe and it works so meh.*/
$(function(){
    var hContent = $("body").height();
    var hWindow = $(window).height();

    // loads single quotes until we have a scroll bar
    while(hContent<=hWindow){
        // Throttle means that it will call the function max every 1000ms
        // aka you can't "spam" quotes
        _.throttle(getQuotes(5), 0);
    }
});

/* gets quotes when scrolling page down */
window.onscroll = function() {
    // when scrolling page checks if you've hit the bottom
    if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
        // Throttle means that it will call the function max every 1000ms
        // aka you can't "spam" quotes
        _.throttle(getQuotes(5), 1000);
    }
};