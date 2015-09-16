<div class="tabbed-box {{theme}}">
	<ul class="tabbed-box-tab-group">
	{{#tabs_each}}
		<li class="tabbed-box-tab" rel="tab-{{tabs_index}}">
			{header_{{tabs_index}}:text default="Headline {{tabs_index}}"}
		</li>
	{{/tabs_each}}
	</ul>

	<div class="tabbed-box-content-group">
	{{#tabs_each}}
		<div class="tabbed-box-content tab-{{tabs_index}}">
			{content_{{tabs_index}}:text default="Puris vel pulvinar ipsum nam, est et quas est morbi consectetuer, justo erat dictumst venenatis pede sit nam, quisquam sit sit venenatis potenti, viverra convallis in sit tellus. Dui pede in auctor, eu dui ut. Tincidunt vivamus vitae est molestie, sed primis erat. Vestibulum urna cursus metus cras magna ut urna pede consectetuer consectetuer et placerat."}
		</div>
	{{/tabs_each}}
	</div>

</div>