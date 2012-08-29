var note_panels = [];
var DDRegion = null;
var help_panel = null;

(function(){
    var loader = new YAHOO.util.YUILoader({
        base: "",
        require: ["container", "containercore", "resize", "dragdrop"],
        loadOptional: true,
        combine: true,
        filter: "MIN",
        allowRollup: true,
        onSuccess: function(){
            init();
        }
    });
    loader.insert();
})();

function init()
{
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    DDRegion = function(id, sGroup, config) {
        this.cont = config.cont;
        DDRegion.superclass.constructor.apply(this, arguments);
    };

    YAHOO.extend(DDRegion, YAHOO.util.DD, {
        cont: null,
        init: function() {
            DDRegion.superclass.init.apply(this, arguments);
            this.initConstraints();
            this.scroll = false;

            Event.on(window, 'resize', function() {
                this.initConstraints();
            }, this, true);
        },
        initConstraints: function() {
            var region = Dom.getRegion(this.cont);
            var el = this.getEl();
            var xy = Dom.getXY(el);
            var width = parseInt(Dom.getStyle(el, 'width'), 10);
            var height = parseInt(Dom.getStyle(el, 'height'), 10);
            var left = xy[0] - region.left;
            var right = region.right - xy[0] - width;
            var top = xy[1] - region.top;
            var bottom = region.bottom - xy[1] - height;
            this.setXConstraint(left, right);
            this.setYConstraint(top, bottom);
        }
    });
    
    help_panel = new YAHOO.widget.Panel('help_panel', {
            width: '400px',
            height: '300px',
            fixedcenter:true,
            zindex: 4, 
            modal: true,
            draggable: false,
            close: true,
            autofillheight: "body",
            visible: false,
        });
    help_panel.setBody(help_text);
    help_panel.render(document.body);
    
    load_board_state();
}

function add_note(p){
    if (p) {
        var panel_id = p.id;
        var panel = p;
    }
    else {
        var panel_id = "panel" + note_panels.length;
        var panel = new YAHOO.widget.Panel(panel_id, {
            width: '250px',
            height: '200px',
            draggable: true,
            close: true,
            autofillheight: "body",
            constraintoviewport: true,
	    effect:{effect:YAHOO.widget.ContainerEffect.SLIDE, duration: 0.2}
        });
        panel.setBody('<div id="' + panel_id + '_note_body" style="height:100%;" contenteditable="true">new note</div>');
    }
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
    panel.render('container');
    
    var dd = new DDRegion(panel_id + '_c', '', { cont: 'container' });
    dd.setHandleElId(panel_id + '_h');
    
    var resize = new YAHOO.util.Resize(panel_id, {
        handles: ['br'],
        autoRatio: false,
        minWidth: 100,
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
    
    document.getElementById('save_btn').style.visibility = 'visible';
}

function reset_board()
{
    for (var i in note_panels)
    {
        note_panels[i].destroy();
    }
    note_panels = [];
}


function show_help()
{
    help_panel.show();
}

var help_text = '<h1>Noteboard - what is it?</h1>\
<p>This application runs in your browser and replicates post-it notes. It can be used, for example, instead of sticky notes on your monitor or programs that need to be installed.\
You can drag and resize them. To save the state of the table you press "Save". Saved notes will be displayed even when the browser is closed.</p>'