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
            'mousedown .scrollArrow-left': 'scrollLeft',
            'mousedown .scrollArrow-right': 'scrollRight'
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
            }.bind(this)).mouseup(function() {
                this.stopScrolling();
            }.bind(this));

            // since scroll events don't propagate up, we have to bind it here as opposed to in the events object
            this.$('.tabbed-box-tab-group').scroll(function() {
                this.determineHandlers();
            }.bind(this));

            // determine whether or not we should show the scroll handlers
            this.determineScrollability();

            // hack to figure out if we're in the editor or on a published site.
            this.settings.save().done(function() {
                // we're in the editor.
                // if we have a marked internal index that we're on, load that one.
                if (view.settings.get('activeTabIndexInternal') >= view.scrollTabsBar.children().length) {
                    view.scrollTabsBar.children().last().click();
                } else {
                    $(view.scrollTabsBar.children()[view.settings.get('activeTabIndexInternal')]).click();
                }
            }).fail(function() {
                // we're on a published site.
                // go to the first page.
                $(view.scrollTabsBar.children()[0]).click();
            });
        },

        /*
            Handle click event on a tab.
            Uses 'rel' attribute of each tab as an index to access
            the class of the corresponding content area.
        */
        clickTab: function(e) {
            var active = $(e.currentTarget); // Clicked tab
            var content_wrapper = this.$('.tabbed-box-content-group'); // wrapper for all content divs

            // Set new active tab
            active.siblings().removeClass('active');
            active.addClass('active');

            // mark the new active tab
            this.settings.set('activeTabIndexInternal', this.scrollTabsBar.children().index(active));
            this.settings.save();

            // Set new active content
            content_wrapper.children().hide();
            content_wrapper.find('.' + active.attr('rel')).fadeIn();

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
            if (target.scrollLeft != 0) {
                this.scrollArrowLeft.addClass('active');
            } else {
                this.scrollArrowLeft.removeClass('active');
            }

            // right handler
            if (target.scrollLeft + target.clientWidth != target.scrollWidth) {
                this.scrollArrowRight.addClass('active');
            } else {
                this.scrollArrowRight.removeClass('active');
            }
        },

        // scrolls the tabs bar to the left.
        scrollLeft: function() {
            // grab dom node
            var scrollEl = this.scrollTabsBar[0];
            var view = this;
            var factor = 2;
            this.scrollArrowRight.addClass('active');
            this.scrollInterval = setInterval(function() {
                scrollEl.scrollLeft -= Math.floor(factor);
                factor *= 1.05;
                if (scrollEl.scrollLeft == 0) {
                    view.stopScrolling();
                }
            }, 10);
        },

        // scrolls the tabs bar to the right.
        scrollRight: function() {
            // grab dom node
            var scrollEl = this.scrollTabsBar[0];
            var view = this;
            var factor = 2;
            this.scrollArrowLeft.addClass('active');
            this.scrollInterval = setInterval(function() {
                scrollEl.scrollLeft += Math.floor(factor);
                factor *= 1.05;
                // forcefully stop the interval if it's not doing anything anymore
                if (scrollEl.scrollLeft + scrollEl.clientWidth == scrollEl.scrollWidth) {
                    view.stopScrolling();
                }
            }, 10);
        },

        // stops scrolling.
        stopScrolling: function() {
            clearInterval(this.scrollInterval); 
            this.determineHandlers();
        }
    });

    return TabbedBox;
})()