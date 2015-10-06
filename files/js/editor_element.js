/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 */
(function() {
    var TabbedBox = PlatformElement.extend({
        events: {
            'click .tabbed-box-tab': 'clickTab',
            // in case they type and that causes an overflow, we should determine scrollability here
            'keyup .tabbed-box-tab .paragraph': 'determineScrollability',
            'click .scrollArrow-left': 'moveLeft',
            'click .scrollArrow-right': 'moveRight'
        },

        initialize: function() {
            var view = this;
            var tabs = this.$('.tabbed-box-tab');
            var content = this.$('.tabbed-box-content');

            // optimization
            this.scrollArrowLeft = this.$('.scrollArrow-left');
            this.scrollArrowRight = this.$('.scrollArrow-right');
            this.scrollTabsBar = this.$('.tabbed-box-tab-group');

            // resize handler and mouseup handler
            // since we want to be able to handle mouseup wherever the user releases (not just over the element)
            // we set it here as a property of the window.
            $(window).resize(function() {
                this.determineScrollability();
            }.bind(this));

            // since scroll events don't propagate up, we have to bind it here as opposed to in the events object
            this.$('.tabbed-box-tab-group').scroll(function() {
                this.determineHandlers();
            }.bind(this));

            // determine whether or not we should show the scroll handlers
            this.determineScrollability();

            // load whichever tab was open
            $(document).ready(function() {
                if (this.settings.get('activeTabIndexInternal') >= this.scrollTabsBar.children().length) {
                    this.scrollTabsBar.children().last().click();
                } else {
                    $(this.scrollTabsBar.children()[this.settings.get('activeTabIndexInternal')]).click();
                }
            }.bind(this));
        },

        /*
            Handle click event on a tab.
            Uses 'rel' attribute of each tab as an index to access
            the class of the corresponding content area.
        */
        clickTab: function(e) {
            var active = $(e.currentTarget); // Clicked tab
            var content_wrapper = this.$('.tabbed-box-content-group'); // wrapper for all content divs
 
            this.determineScroll(active);

            // Set new active tab
            active.siblings().removeClass('active');
            active.addClass('active');

            // mark the new active tab
            this.settings.set('activeTabIndexInternal', this.scrollTabsBar.children().index(active));
            this.settings.save();

            // Set new active content
            content_wrapper.children().hide();
            content_wrapper.find('.' + active.attr('rel')).fadeIn();
            this.determineHandlers();

            // Stop propagation in case this is a nested tab app
            e.stopPropagation();
        },

        // determines whether or not the two arrows (left and right scroll handlers) should be visible or not.
        determineScrollability: function() {
            var group = this.scrollTabsBar[0];
            if (group.scrollWidth > group.clientWidth) {
                this.$el.children().addClass('scrollable');
                this.determineHandlers();
            } else {
                this.$el.children().removeClass('scrollable');
            }
        },

        // determines whether or not the two arrows (left and right scroll handlers) should be active or not.
        determineHandlers: function() {
            var target = this.scrollTabsBar[0];

            // left handler
            if (this.settings.get('activeTabIndexInternal') != 0) {
                this.scrollArrowLeft.addClass('active');
            } else {
                this.scrollArrowLeft.removeClass('active');
            }

            // right handler
            if (this.settings.get('activeTabIndexInternal') != this.scrollTabsBar.children().length - 1) {
                this.scrollArrowRight.addClass('active');
            } else {
                this.scrollArrowRight.removeClass('active');
            }
        },

        // scrolls the tabs bar to the left.
        moveLeft: function(e) {
            e.stopPropagation();
            if (this.scrollArrowLeft.hasClass('active')) {
                $(this.scrollTabsBar.children()[this.settings.get('activeTabIndexInternal') - 1]).click();
            }
        },

        // scrolls the tabs bar to the right.
        moveRight: function(e) {
            e.stopPropagation();
            if (this.scrollArrowRight.hasClass('active')) {
                $(this.scrollTabsBar.children()[this.settings.get('activeTabIndexInternal') + 1]).click();
           }
        },

        determineScroll: function(active) {
            // figure out where the element is, and if we need to change our view to show it
            var scroll;

            // determine where the element we're going to is in respect to the tabs bar
            // 25px is the size of the scroll arrows
            var leftSidePosition = active.position().left - 25;
            var rightSidePosition = active.position().left + active.width() - 25;
            // the gap is how much space we want there to be between the selected element
            // when it's out of view, and we go to it.
            var gap = 100; 
            if (this.scrollTabsBar.children().index(active) == 0) {
                // this the first element, so define the scroll to be 0.
                scroll = 0;
            } else if (this.scrollTabsBar.children().index(active) == this.scrollTabsBar.children().length - 1) {
                // this the last element, so define the scroll to be all the way to the right.
                scroll = this.scrollTabsBar[0].scrollWidth - this.scrollTabsBar[0].clientWidth;
            } else if (leftSidePosition < 0) {
                // the left corner is out of view, which means it's beyond the left.
                scroll = this.scrollTabsBar[0].scrollLeft + leftSidePosition - gap;
            } else if (rightSidePosition > this.scrollTabsBar.width()) {
                // the right corner is out of view.
                scroll = this.scrollTabsBar[0].scrollLeft + (rightSidePosition - this.scrollTabsBar.width()) + gap;
            } else {
                scroll = this.scrollTabsBar[0].scrollLeft;
            }

            // start scrolling
            scroll = Math.floor(scroll);
            var delta = scroll - this.scrollTabsBar[0].scrollLeft;
            if (delta != 0) {
                clearInterval(this.scrollInterval);
                var distance = 0;
                var direction = (delta > 0 ? 1 : -1);
                var speed = 1;
                this.scrollInterval = setInterval(function() {
                    if (distance >= Math.abs(delta)) {
                        clearInterval(this.scrollInterval);
                        return;
                    }
                    this.scrollTabsBar[0].scrollLeft += (Math.max(1, speed) * direction);
                    distance += Math.max(1, speed);
                    if (distance * 2 < Math.abs(delta)) {
                        speed *= 1.25; // 5/4
                    } else {
                        speed *= 0.8; // 4/5
                    }
                }.bind(this), 20);
            }
        }
    });

    return TabbedBox;
})()