var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var _ = require('lodash');
var $ = require('jquery');


// tells us which id we last checked
var quoteIdCounter = 0;

/* amount = amount of fetched quotes and created quoteDivs */
function getQuotes(amount){
    for (var i = 0; i < amount; i++) {
        setTimeout(function(){ // setTimeout to fix spamming down, I guess. Just worried about lag in node/db
            //gets a single quote with given id (autoincremented) from db
            $.get(("/quotes/" + quoteIdCounter), function(data) {
                if(data != null){ //if we found a quote with id

                    // gotta do something about this mess of a code. 
                    // should probably move it to another function too.
                    var lineString = $('<div class="line"></div>');
                    var quoteString = $('<div class="quoteDiv">' 
                                            + '<p class="time">' + data.time + '</p>' + '<br>'
                                            + 'Sender: <p class="quoteSender">' + data.sender + '</p>' + '<br>'
                                            + '@ <p class="quotePlace">' + data.place + '</p>' + '<br>' + '<br>'
                                            + '<p class="quoteQuote">' + data.quote + '</p>' + '<br>'
                                        + '</div>')
                    $("#quotes").append(lineString);
                    $("#quotes").append(quoteString);
                }
            }, "json" );
            // increments no matter if we found quote or not
            quoteIdCounter++;
        }, 500);
    };
};


/* when page loads, make sure to load some quotes
   I'm fairly sure that theres a better/faster way of doing this, but this seems safe and it works so meh.*/
$(function(){
    var hContent = $("body").height();
    var hWindow = $(window).height();

    // loads single quotes until we have a scroll bar
    while(hContent<=hWindow){
        _.throttle(getQuotes(1), 1000);
    }
});

/* gets quotes when scrolling page down */
window.onscroll = function() {
    // when scrolling page checks if you've hit the bottom
    if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
        _.throttle(getQuotes(5), 1000);
    }
};