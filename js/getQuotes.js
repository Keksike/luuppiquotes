var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var _ = require('lodash');
var $ = require('jquery');

/*var getQuotes = _.throttle(function(){
    var heightNow = $('body').height();
    heightNow =+ 500;
    $('body').height(heightNow);
};, 1000);*/


function increaseHeight(){
    var heightNow = $('body').height();
    heightNow = heightNow + 500;
    $('body').height(heightNow);
}

var throttledIncreaseHeight = _.throttle(increaseHeight, 1000);

/*amount = amount of fetched quotes and created quoteDivs*/
function getQuotes(amount){
    
}


/*Getting the quotes*/
window.onscroll = function(ev) {
    //when scrolling page checks if you've hit the bottom
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // activated if bottom of page hit
        throttledIncreaseHeight();
    }
};