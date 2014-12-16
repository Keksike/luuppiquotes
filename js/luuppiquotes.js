require('knockout');
require('knockout-js-infinite-scroll');
require('jquery');

// knockout-js-infinite-scroll (common usage)
ViewModel = function () {
    var self = this;

    self.items = ko.observableArray();
    self.items.extend({
        infinitescroll: {}
    });

    // detect resize
    $(window).resize(function() {
        updateViewportDimensions();
    });

    // tell infinte-scroll about the current scroll position
    // (debounce is important for ie11 smooth scroll problems! and also generally nicer in all browsers)
    $('#itemsUL').scroll(_.debounce(function() {        
       self.items.infinitescroll.scrollY($('#itemsUL').scrollTop());
        
        // add more items if scroll reaches the last 100 items
        if (self.items.peek().length - self.items.infinitescroll.lastVisibleIndex.peek() <= 100) {
            populateItems(100);
        }
    }, 250));

    // update dimensions of infinite-scroll viewport and item
    function updateViewportDimensions() {
        var itemsRef = $('#itemsUL'),
            itemRef = $('.item').first(),
            itemsWidth = 400,
            itemsHeight = 300,
            itemWidth = 220,
            itemHeight = 20;

        self.items.infinitescroll.viewportWidth(itemsWidth);
        self.items.infinitescroll.viewportHeight(itemsHeight);
        self.items.infinitescroll.itemWidth(itemWidth);
        self.items.infinitescroll.itemHeight(itemHeight);

    }
    updateViewportDimensions();

    // init items
    function populateItems(numTotal) {
        var existingItems = self.items(),
            item = '',
            alphabet = 'abcdefghijklmnopqrstuvwxyz',
            numTotal = numTotal || 500;

        for (var i = 0; i < numTotal; i++) {
            item = '';
            for( var j = 0; j < Math.floor(Math.random() * 20) + 1; j++ ) {
                item += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            }
            existingItems.push(item);
        }
        self.items(existingItems);
    }
    populateItems();
}

ko.applyBindings(new ViewModel());