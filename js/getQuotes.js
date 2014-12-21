var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var _ = require('lodash');
var $ = require('jquery');


//used for storing id's
var quoteIdCounter = 7;

/*function increaseHeight(){
    var heightNow = $('body').height();
    heightNow = heightNow + 500;
    $('body').height(heightNow);
};

var throttledIncreaseHeight = _.throttle(increaseHeight, 1000);*/

/*amount = amount of fetched quotes and created quoteDivs*/
function getQuotes(amount){
    for (var i = 0; i < amount; i++) {
        setTimeout(function(){
            $.get(("/quotes/" + quoteIdCounter), function(data) {
                if(data != null){
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
            quoteIdCounter++;
        }, 500);
    };
};

function checkScrollBar() {
    var hContent = $("body").height(); // get the height of your content
    var hWindow = $(window).height();  // get the height of the visitor's browser window

    // if the height of your content is bigger than the height of the 
    // browser window, we have a scroll bar
    if(hContent>hWindow) { 
        return true;    
    }

    return false;
}

/*when page loads, make sure to load some quotes*/
$(function(){
    var hContent = $("body").height();
    var hWindow = $(window).height();

    if(hContent<=hWindow){
        _.throttle(getQuotes(5), 1000);
    }
});

/*gets quotes when scrolling page down*/
window.onscroll = function() {
    //when scrolling page checks if you've hit the bottom
    if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
        _.throttle(getQuotes(5), 1000);
    }
};