<div class="tabbed-box {{theme}}">
    <div class="tabbed-box-bar">
        <ul class="tabbed-box-tab-group">
        {{#tabs_each}}
            <li class="tabbed-box-tab" rel="tab-{{tabs_index}}">
                {header_{{tabs_index}}:text default="Headline {{tabs_index}}"}
            </li>
        {{/tabs_each}}
        </ul>

        <div class="scrollArrow scrollArrow-left">
            <span class="scrollArrow-text">&lt;</span>
        </div>
        <div class="scrollArrow scrollArrow-right">
            <span class="scrollArrow-text">&gt;</span>
        </div>
    </div>

    <div class="tabbed-box-content-group">
    {{#tabs_each}}
        <div class="tabbed-box-content tab-{{tabs_index}}">
            {content_{{tabs_index}}:content}
        </div>
    {{/tabs_each}}
    </div>

</div>