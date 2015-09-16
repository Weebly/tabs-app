/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 */
(function(){
	var TabbedBox = PlatformElement.extend({
		events: {
			'click .tabbed-box-tab': 'clickTab'
		},

		initialize: function() {
			var tabs = this.$el.find('.tabbed-box-tab');
			var content = this.$el.find('.tabbed-box-content');

			// Default to first tab
			tabs.first().addClass('active');
			content.first().show();
		},

		/*
			Handle click event on a tab.
			Uses 'rel' attribute of each tab as an index to access
			the class of the corresponding content area.
		*/
		clickTab: function(e) {
			var active = $(e.currentTarget); // Clicked tab
			var content_wrapper = this.$el.find('.tabbed-box-content-group'); // wrapper for all content divs

			// Set new active tab
			active.siblings().removeClass('active');
			active.addClass('active');

			// Set new active content
			content_wrapper.children().hide();
			content_wrapper.find('.' + active.attr('rel')).fadeIn();
		}
	});
	return TabbedBox;
})();
