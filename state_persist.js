function PanelState(panel)
{
    this.id = panel.id;
    this.x = panel.element.offsetLeft;
    this.y = panel.element.offsetTop;
    this.width = panel.element.clientWidth + 'px';
    this.height = panel.element.clientHeight + 'px';
    this.body = panel.body.innerHTML;
}

function panel_from_state(state)
{
    var panel = new YAHOO.widget.Panel(state.id, {
        width: state.width,
        height: state.height,
        x: state.x,
        y: state.y,
        draggable: true,
        close: true,
        autofillheight: "body",
        constraintoviewport: true,
    });
    panel.setBody(state.body);
    return panel;
}

function load_board_state()
{
    if (localStorage.getItem('panels_persist'))
    {
        var panels_persist = JSON.parse(localStorage.getItem('panels_persist'));
        for(var i in panels_persist)
        {
            var panel = panel_from_state(panels_persist[i]);
            add_note(panel);
        }
    }
}

function save_board_state()
{
    var panels_persist = [];
    for(var i in note_panels)
    {
        panels_persist.push(new PanelState(note_panels[i]));
    }
    localStorage.setItem('panels_persist', JSON.stringify(panels_persist));
}

function clear_board_state()
{
    localStorage.clear();
}

