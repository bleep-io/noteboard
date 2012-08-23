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
        reset_board();
        var panels_persist = JSON.parse(localStorage.getItem('panels_persist'));
        for(var i in panels_persist)
        {
            var panel = panel_from_state(panels_persist[i]);
            add_note(panel);
        }
        document.getElementById('save_btn').style.visibility = 'visible';
        document.getElementById('load_btn').style.visibility = 'visible';
        document.getElementById('clear_btn').style.visibility = 'visible';
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
    
    document.getElementById('load_btn').style.visibility = 'visible';
    document.getElementById('clear_btn').style.visibility = 'visible';
}

function clear_board_state()
{
    reset_board();
    localStorage.clear();
    document.getElementById('save_btn').style.visibility = 'collapse';
    document.getElementById('load_btn').style.visibility = 'collapse';
    document.getElementById('clear_btn').style.visibility = 'collapse';
}

