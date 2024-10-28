/**
 * @summary ACTUS Motion animation.
 *
 * Executed in Front End.
 * Retrieves motion data for the current post or page,
 * calculates and renders the animation.
 *
 * @since 0.1.0
 *
 * @var   array    reveals       Items to animate in scroll reveal
 * @var   array    clicks        Items to animate on click
 * @var   array    hovers        Items to animate on hover
 * @var   array    AMIT          ACTUS motion items
 *
 * @global array   actusMotionParams        Parameters received from PHP call.
 * @global array   actus_motion_array       The array of motion items.
 *
*/


(function( $ ){
    
    // WINDOW LOAD
    $(window.load).ready(function(){
        
        actus_motion_array = actusMotionParams.actus_motion_array;
        actusMotion( actus_motion_array );
        
        $.each(clicks, function(i,itm){
            $( itm.id ).addClass( 'actus-mtn-click' ).data('idx',itm.idx);
        })

        $.each(hovers, function(i,itm){
            $( itm.id ).addClass( 'actus-mtn-hover' ).data('idx',itm.idx);
        })

        
        $('body').on('click','.actus-mtn-click',function(){
            idx = $(this).data('idx');
            anim_motion_anim( idx, actus_motion_array[idx].animation );
        })
        $('body').on('mouseenter','.actus-mtn-hover',function(){
            idx = $(this).data('idx');
            anim_motion_anim( idx, actus_motion_array[idx].animation );
        })
        
    })

    
    reveals   = [];
    clicks    = [];
    hovers    = [];
    AMIT      = [];
    
    
    
    // WINDOW SCROLL
    $( window ).scroll(function(e){
        winBottom = parseInt( $(window).scrollTop() ) + 
                    parseInt( $(window).height() );
        $.each(reveals, function(i,itm){
            if ( $( itm.id ).length == 0 ) return;
            objBottom = 
                parseInt( $( itm.id ).offset().top ) + 
                parseInt( $( itm.id ).height() ) ;
            if ( winBottom > (objBottom + offset) ) {
                anim_motion_anim( itm.idx, actus_motion_array[itm.idx].animation );
            } 
        })


    })

    
    /**
     * Read and Initialize motion items.
     *
     * @summary         Reads motion data, initializes items to be animated
     *                  and determines when to call the animation function
     *
     * @var   array    reveals       Items to animate in scroll reveal
     * @var   array    clicks        Items to animate on click
     * @var   array    hovers        Items to animate on hover
     * @var   array    AMIT          ACTUS motion items
     */
    function actusMotion( motionItems ){
        
        // GET SCROLLBARS WIDTH and OFFSET
        HscrollbarWidth = window.innerHeight - $(window).height();
        VscrollbarWidth = window.innerWidth  - $(window).width();
        if ( HscrollbarWidth == 0 ) {
            $('body').css('overflow-x','hidden');
        }
        if ( VscrollbarWidth == 0 ) {
            $('body').css('overflow-y','hidden');
        }
        
        // LABEL items that will be animated
        $.each(motionItems, function(i,item){
            if ( typeof(item.element ) === 'undefined' ) return;
            $( item.element ).addClass( 'animated-' + i );
        })
        // LOOP through items
        $.each(motionItems, function(i,item){

            if ( item.event == 'disabled' ) return;
            if ( typeof(item.element) === 'undefined' ) return;
            if ( $( '.animated-'+i ).length == 0 ) return;
            // Initialize item data
            AMIT[i] = {};
            AMIT[i].label  = 'animated-' + i;
            AMIT[i].item   = $('.animated-' + i);
            AMIT[i].status = 'start';
            AMIT[i].idx  = i;
            AMIT[i].name = item.element;
            AMIT[i].mode = item.mode;
            AMIT[i].W = AMIT[i].item.outerWidth(true) + 0.3;
            AMIT[i].H = AMIT[i].item.outerHeight(true) + 0.3;
            Voffset = 0 - parseInt( AMIT[i].item.css('margin-top') )
            if ( typeof( AMIT[i].item.children().first().css('margin-top') ) !== 'undefined' )
                Voffset -= parseInt( AMIT[i].item.children().first().css('margin-top') );
            Hoffset = 0 - parseInt( AMIT[i].item.css('margin-left') )
            if ( typeof( AMIT[i].item.children().first().css('margin-left') ) !== 'undefined' )
                Hoffset -= parseInt( AMIT[i].item.children().first().css('margin-left') );
            AMIT[i].L = AMIT[i].item.offset().left + Hoffset;
            AMIT[i].T = AMIT[i].item.offset().top + Voffset;
            AMIT[i].pos  = AMIT[i].item.css('position');
            AMIT[i].opac = AMIT[i].item.css('opacity');
            AMIT[i].tran = AMIT[i].item.css('transition');
            AMIT[i].filter = AMIT[i].item.css('filter');
            AMIT[i].transf = AMIT[i].item.css('transform');
            var transfValues = AMIT[i].transf.split('(')[1];
            if ( typeof(transfValues) !== 'undefined') {
                transfValues = transfValues.split(')')[0];
                transfValues = transfValues.split(',');
                var a = transfValues[0];
                var b = transfValues[1];            
                AMIT[i].SC  = Math.sqrt(a*a + b*b);
                AMIT[i].ROT = Math.round(Math.atan2(b, a) * (180/Math.PI));
            } else {
                AMIT[i].SC = 1;   
                AMIT[i].ROT = 0;   
            }

            animation_item_init( i, item.animation,function(){
                
                offset = 0;
                switch ( item.event.replace(/ /g,"_") ) {
                    // ON REVEAL
                    case 'on_reveal':
                        reveals.push( {idx: i, id:'.animated-'+i} );
                        break; 
                    // ON CLICK
                    case 'on_click':
                        AMIT[i].item.addClass( 'actus-mtn-click' );
                        clicks.push( {idx: i, id:'.animated-'+i} );
                        break; 
                    // ON HOVER
                    case 'on_hover':
                        AMIT[i].item.addClass( 'actus-mtn-hover' );
                        hovers.push( {idx: i, id:'.animated-'+i} );
                        break; 
                    // ON LOAD
                    case 'on_load':
                        anim_motion_anim( i, item.animation );
                        break;
                    default: 
                        // **
                }
                
            });
            
        }) 
    }
    
    
    
    // INITIALIZE ANIMATION ITEM
    function animation_item_init( i, animation, callback ) {
        callback = callback || function(){};
        // Create item clone for animation
        AMIT[i].item
            .css('opacity',0).clone()
            .attr('id', 'animated-'+ i )
            .appendTo( 'body' );
        stylesH = getStyles( document.querySelector( '.animated-'+i ), styles );
        index = 0;
        element_styles = loopChildrenGrab(document.querySelector( '.animated-'+i ), styles, stylesH);
        count = 0;
        loopChildrenPush( document.querySelector( '#animated-' + i ), styles, element_styles);
        
        $( '#animated-' + i ).wrap( "<div id='wrap-animated-"+i+"'></div>" );

        if ( AMIT[i].pos == 'absolute' || AMIT[i].pos == 'fixed' ) {
            $( '#'+'animated-'+ idx ).css({
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
            })
        }
        
        AMIT[i].startL      = AMIT[i].L;
        AMIT[i].startT      = AMIT[i].T;
        AMIT[i].startO      = AMIT[i].opac;
        AMIT[i].startSC     = AMIT[i].SC;
        AMIT[i].startROT    = AMIT[i].ROT;
        AMIT[i].startFilter = 'blur(0px)';
        
        AMIT[i].endL      = AMIT[i].startL;
        AMIT[i].endT      = AMIT[i].startT;
        AMIT[i].endO      = AMIT[i].startO;
        AMIT[i].endSC     = AMIT[i].startSC;
        AMIT[i].endROT    = AMIT[i].startROT;
        AMIT[i].endFilter = 'blur(0px)';
        AMIT[i].endTime     = 0;
        AMIT[i].delayOffset = 0;
        
        AMIT[i].transitionH   = '0.5s all ease-out';
        AMIT[i].transitionHSC = '0.5s all ease-out';
        
        
        // CREATE END VALUES
        $.each(animation, function(animIdx,anim){
            duration = anim.options.duration.value;
            delay    = AMIT[i].delayOffset + anim.options.delay.value;
            easeType = 'ease-out';
            if ( typeof(anim.options.ease) !== 'undefined' ) {
                easeType = anim.options.ease.value + ' ';
                if ( easeType != 'linear' && easeType != 'ease' ) easeType = 'ease-' + easeType;
            }
            if ( delay+duration > AMIT[i].endTime )
                AMIT[i].endTime  = delay + duration;
        
            // MOVE
            if ( anim.type == 'move' ) {
                distance = anim.options.distance.value + anim.options.distanceunits.value;
                switch ( anim.options.direction.value ) {
                    case 'left':
                        AMIT[i].startL = 'calc(' + AMIT[i].startL + 'px + ' + distance + ')';
                        break; 
                    case 'right':
                        AMIT[i].startL = 'calc(' + AMIT[i].startL + 'px - ' + distance + ')';
                        break; 
                    case 'top':
                        AMIT[i].startT = 'calc(' + AMIT[i].startT + 'px + ' + distance + ')';
                        break;
                    case 'bottom':
                        AMIT[i].startT = 'calc(' + AMIT[i].startT + 'px - ' + distance + ')';
                        break; 
                    default: 
                        // **
                }
                directionTrans = anim.options.direction.value;
                if ( directionTrans == 'right' )  directionTrans = 'left';
                if ( directionTrans == 'bottom' ) directionTrans = 'top';
                AMIT[i].transitionH += ','  + directionTrans + ' ' + duration + 'ms ' + easeType + ' ' + delay +'ms';
            }
            // SCALE
            if ( anim.type == 'zoom' ) {
                size = anim.options.size.value;
                switch ( anim.options.zoom.value ) {
                    case 'in':
                        AMIT[i].startSC = size;
                        break; 
                    case 'out':
                        AMIT[i].startSC = 1/size;
                        break; 
                    default: 
                        // **
                }
                AMIT[i].transitionHSC = 'transform ' + duration + 'ms ' + easeType + ' ' + delay +'ms';
            }
            // ROTATE
            if ( anim.type == 'rotate' ) {
                rotation = anim.options.degrees.value;
                switch ( anim.options.direction_r.value ) {
                    case 'clockwise':
                        AMIT[i].startROT = rotation;
                        break; 
                    case 'counter clockwise':
                        AMIT[i].startROT = -rotation;
                        break; 
                    default: 
                        // **
                }
                AMIT[i].transitionH += ', transform ' + duration + 'ms ' + easeType + ' ' + delay +'ms';
            }
            // FADE
            if ( anim.type == 'fade' ) {
                switch ( anim.options.fade.value ) {
                    case 'in':
                        AMIT[i].startO = 0;
                        AMIT[i].endO   = AMIT[i].opac;
                        break; 
                    case 'out':
                        AMIT[i].startO = AMIT[i].opac;
                        AMIT[i].endO   = 0;
                        break; 
                    default: 
                        // **
                }
                AMIT[i].transitionH += ',' + duration + 'ms opacity ' + delay +'ms';
            }
            // BLUR
            if ( anim.type == 'blur' ) {
                AMIT[i].startFilter = 'blur('+anim.options.size.value+'px)';
                AMIT[i].endFilter   = 'blur(0px)';
                AMIT[i].transitionH += ',' + duration + 'ms filter ' + delay +'ms';
            }
            
        })
        

        $( '#animated-' + i ).css({
            opacity: 1,
            transform: 'scale(' + AMIT[i].SC + ')',
        })        
        $( '#wrap-animated-' + i ).css({
            position: 'absolute',
            width: AMIT[i].W,
            height: AMIT[i].H,
            left: AMIT[i].L,
            top: AMIT[i].T,
            opacity: AMIT[i].O,
            transform: 'rotate(' + AMIT[i].ROT + 'deg)',
            filter: AMIT[i].filter,
        })   


        if ( $.trim(AMIT[i].mode) == 'animate OUT' ) {
            AMIT[i].startL       = [AMIT[i].endL, AMIT[i].endL=AMIT[i].startL][0];
            AMIT[i].startT       = [AMIT[i].endT, AMIT[i].endT=AMIT[i].startT][0];
            AMIT[i].startO       = [AMIT[i].endO, AMIT[i].endO=AMIT[i].startO][0];
            AMIT[i].startSC      = [AMIT[i].endSC, AMIT[i].endSC=AMIT[i].startSC][0];
            AMIT[i].startROT     = [AMIT[i].endROT, AMIT[i].endROT=AMIT[i].startROT][0];
            AMIT[i].startFilter  = [AMIT[i].endFilter, AMIT[i].endFilter=AMIT[i].startFilter][0];
        }

        

        $( '#animated-' + i ).css({
            opacity: 1,
            transform: 'scale(' + AMIT[i].startSC + ')',
            transition: AMIT[i].transitionHSC,
        })        
        $( '#wrap-animated-' + i ).css({
            position: 'absolute',
            width: AMIT[i].W,
            height: AMIT[i].H,
            left: AMIT[i].startL,
            top: AMIT[i].startT,
            opacity: AMIT[i].startO,
            transform: 'rotate(' + AMIT[i].startROT + 'deg)',
            transition: AMIT[i].transitionH,
            filter: AMIT[i].startFilter,
        })
        
        callback();
        
    }
    
    
    // ANIMATE ITEM
    function anim_motion_anim( i, animation ) {
        var currentAnimationID = 'animated-' + i;
        if ( AMIT[i].status != 'start' ) return;
        AMIT[i].status = 'playing';

        setTimeout(function(){
            $( '#animated-' + i ).css({
                transform: 'scale(' + AMIT[i].endSC + ')',
            })
            $( '#wrap-animated-' + i ).css({
                left: AMIT[i].endL,
                top: AMIT[i].endT,
                opacity: AMIT[i].endO,
                transform: 'rotate(' + AMIT[i].endROT + 'deg)',
                filter: AMIT[i].endFilter,
            })
        },1);
        setTimeout(function(){
            if ( AMIT[i].mode == 'animate IN' ) {
                //$('#wrap-animated-'+i).remove();
                $('.animated-'+i).css('opacity', AMIT[i].endO);
                $('.animated-'+i).css('transition',AMIT[i].tran);
            }
            $('.animated-'+i).removeClass( 'animated-'+i );

            AMIT[i].status = 'end';

        }, AMIT[i].endTime+1 );
        
        
    }
    

        
    
// ELEMENT REPLICATE FUNCTIONS
function getPropValue(ele, styleProp) {
    if (ele.currentStyle) {
        var y = ele.currentStyle[styleProp];
    } else if (window.getComputedStyle) {
        var y = document.defaultView.getComputedStyle(ele, null).getPropertyValue(styleProp);
    }
    return y;
}
var styles = ["opacity", "background", "color", "font-family", "font-size", "font-weight", "letter-spacing", "line-height", "white-space", "padding", "display", "float", "border", "border-top", "border-right", "border-bottom", "border-left", "border-color", "border-width", "border-style", "padding-top", "padding-right", "padding-bottom", "padding-left", "width", "height", "font-weight", "margin-top", "margin-left", "margin-bottom", "margin-right", "text-decoration", "text-align", "text-shadow", "box-shadow"];

function getStyles(ele, styles) {
    var values = new Array();
    for (var i=0; i < styles.length; i++) {
        values[i] = getPropValue(ele, styles[i]);
    }
    return values;
}
function loopChildrenGrab(this_ele, styles, element_styles) {
    element_styles[index] = getStyles(this_ele, styles);
    index++;

    if ( $(this_ele).children().length > 0 ) {
        $(this_ele).children().each(function(){
            loopChildrenGrab(this, styles, element_styles);
        });
    }
    return element_styles;
}
function pushStyles(ele, styles, values) {
    for (var i=0; i < styles.length; i++) {
        $(ele).css(styles[i], values[i]);
    }
}
function loopChildrenPush(this_ele, styles, element_styles) {
    pushStyles(this_ele, styles, element_styles[count]);
    count++;

    if ( $(this_ele).children().length > 0 ) {
        $(this_ele).children().each(function() {
            loopChildrenPush(this, styles, element_styles);
        });
    }
}
    
    
    
})(jQuery);
   
var $ = jQuery.noConflict();
    


