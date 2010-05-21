function PanelState(panel)
{
    this.id = panel.id;
    //this.x = panel.cfg.getProperty('x');
    //this.y = panel.cfg.config.y;
    this.width = panel.element.clientWidth + 'px';
    this.height = panel.element.clientHeight + 'px';
    this.body = '<div class="bd" style="' + panel.body.style + '"';
    this.body += panel.body.innerHTML;
}

function panel_from_state(state)
{
    var panel = new YAHOO.widget.Panel(state.id, {
        width: state.width,
        height: state.height,
        //x: state.x,
        //y: state.y,
        draggable: true,
        close: true,
        autofillheight: "body",
        constraintoviewport: true,
    });
    panel.setBody(state.body);
    return panel;
}