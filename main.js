// Instantiate and configure YUI Loader: 
(function(){
    var loader = new YAHOO.util.YUILoader({
        base: "",
        require: ["container", "containercore", "resize"],
        loadOptional: true,
        combine: true,
        filter: "MIN",
        allowRollup: true,
        onSuccess: function(){
            YAHOO.util.Config.configChangedEvent.subscribe(function(){});
        }
    });
    loader.insert();
})();

var note_panels = [];
var overlay_manager = new YAHOO.widget.OverlayManager();

function add_note(){
    var panel_id = "panel" + note_panels.length;
    var panel = new YAHOO.widget.Panel(panel_id, {
        width: "320px",
        draggable: true,
        close: true,
        autofillheight: "body",
        constraintoviewport: true,
    });
    
    note_panels.push(panel);
    
    panel.hideEvent.subscribe(function(args){
        for(var i in note_panels)
        {
            if(note_panels[i] == panel)
                break;
        }
        note_panels.splice(i, 1);
        panel.destroy();
        }); 
    panel.setHeader("panel");
    panel.setBody('<section contenteditable="true">This is a dynamically generated Panel.<br/><br/><br/>Bleeee</section>');
    panel.render("container");
    overlay_manager.register(panel);
    
    var resize = new YAHOO.util.Resize(panel_id, {
        handles: ['br'],
        autoRatio: false,
        minWidth: 300,
        minHeight: 100,
        status: false
    });
    resize.on('resize', function(args){
        var panelHeight = args.height;
        this.cfg.setProperty("height", panelHeight + "px");
    }, panel, true);
    
    resize.on('startResize', function(args){
    
        if (this.cfg.getProperty("constraintoviewport")) {
            var D = YAHOO.util.Dom;
            
            var clientRegion = D.getClientRegion();
            var elRegion = D.getRegion(this.element);
            
            resize.set("maxWidth", clientRegion.right - elRegion.left - YAHOO.widget.Overlay.VIEWPORT_OFFSET);
            resize.set("maxHeight", clientRegion.bottom - elRegion.top - YAHOO.widget.Overlay.VIEWPORT_OFFSET);
        }
        else {
            resize.set("maxWidth", null);
            resize.set("maxHeight", null);
        }
    }, panel, true);
}
