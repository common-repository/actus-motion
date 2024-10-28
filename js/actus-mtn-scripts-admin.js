/**
 * @summary ACTUS Motion administration.
 *
 * Executed during post/page add or edit.
 * Create and edit motion items.
 *
 * @since 0.1.0
 *
 * @global array   actusMotionParams        Parameters received from PHP call.
 * @global array   actus_motion_array       The array of motion items.
 *
*/


//console.log( actusMotionParamsAdmin );

(function( $ ){
    
    $(document).ready(function(){
        
        actus_motion_array = actusMotionParamsAdmin.actus_motion_array;
        initMotionItems();

    })

    
/**
 * Initialize motion items.
 *
 * @summary         Reads the options from database
 *
 * @global array    actus_motion_array       The array of motion items.
 */
function initMotionItems(){
    $.each( actus_motion_array, function(i,item){

        // Create new motion item
        $('.actus-motion-item-template')
            .clone()
            .removeClass('actus-motion-item-template')
            .addClass('current-motion-item')
            .attr( 'data-idx', i )
            .insertBefore( '.actus-add-motion-item' ).show();
        
        // Create Timeline
        timelineLength = 5;
        amtn_timeline( i, timelineLength );
        
        
        // Initialize inputs
        if ( typeof( item.element ) !== 'undefined' ) {
            $('.current-motion-item .actus-motion-element input' ).val( item.element );
        }
        if ( typeof( item.event ) !== 'undefined' ) {
            $('.current-motion-item .actus-motion-event .value' ).html( item.event );
        }
        if ( typeof( item.mode ) !== 'undefined' ) {
            $('.current-motion-item .actus-motion-mode .value' ).html( item.mode );
        }
    
        $('.current-motion-item').removeClass('current-motion-item');
        
        // Update motion array
        actus_motion_array_str = JSON.stringify( actus_motion_array );
        $( '#actus_motion_array' ).val( actus_motion_array_str );
    
        
    })
}
    
    
    // ADD MOTION ITEM
    $('body').on('click','.actus-add-motion-item',function(e){
        $('.actus-motion-item-template')
            .clone()
            .removeClass('actus-motion-item-template')
            .attr( 'data-idx', actus_motion_array.length )
            .insertBefore( this ).show();
        currentItemIDX = actus_motion_array.length;
        actus_motion_array[ currentItemIDX ] = {};
        actus_motion_array[ currentItemIDX ].element    = '';
        actus_motion_array[ currentItemIDX ].event      = 'on load';
        actus_motion_array[ currentItemIDX ].mode       = 'animate IN';
        actus_motion_array[ currentItemIDX ].animation  = [];
        
        timelineLength = 5;
        amtn_timeline( (actus_motion_array.length - 1), timelineLength );
        
 
        actus_motion_array_str = JSON.stringify( actus_motion_array );
        $( '#actus_motion_array' ).val( actus_motion_array_str );
    })
    
    
    // REMOVE MOTION ITEM
    $('body').on('click','.actus-remove-motion-item',function(e){
        r = confirm("Are you sure you want to remove this item?");
        if (r == true) {
            motionItem = $(this).closest('.actus-motion-item');
            motionItemIdx = motionItem.data('idx');
            motionItem.remove();
            
            actus_motion_array = $.grep( actus_motion_array, function( n, i ) {
                return i == motionItemIdx;
            },true);
            actus_motion_array_str = JSON.stringify( actus_motion_array );
            $( '#actus_motion_array' ).val( actus_motion_array_str );

            setTimeout(function(){
            idx = -1;
            $('.actus-motion-item').each(function(i,v){
                $(this).attr('data-idx',idx);
                $(this).data('idx',idx);
                $(this).find('.actus-mtn-timeline').attr('id','actus-mtn-timeline-'+idx);
                idx++;
            })
            },10)
        }
    })
    
    
    // ADD ANIMATION
    $('body').on('click','.actus-add-animation',function(e){
        
        motionItem = $(this).closest('.actus-motion-item');
        motionItemIdx = motionItem.data('idx');
        animationIdx  = actus_motion_array[motionItemIdx].animation.length;
        animationID   = 'animation-' + motionItemIdx + '-' + animationIdx;
        animationType = motionItem.find('.actus-dropdown-box[name="group"] .value').text();
        
        // add animation to array
        actus_motion_array[motionItemIdx].animation[animationIdx] = {};
        actus_motion_array[motionItemIdx].animation[animationIdx].type = animationType;
        actus_motion_array[motionItemIdx].animation[animationIdx].options = {};
        $.extend(true, actus_motion_array[motionItemIdx].animation[animationIdx].options, actusMotionParamsAdmin.options['defaults'][ animationType ] );
                
        createAnimationItem( 
            motionItem, 
            actus_motion_array[motionItemIdx].animation[animationIdx], 
            animationID, 
            animationIdx 
        );
        
        actus_motion_array_str = JSON.stringify( actus_motion_array );
        $( '#actus_motion_array' ).val( actus_motion_array_str );
    })

    // DELETE ANIMATION
    $('body').on('click','.actus-delete-animation',function(e){
        animationID   = $(this).closest('.actus-mtn-animation-options').data('id');
        animationIdx  = $(this).closest('.actus-mtn-animation-options').data('idx');
    
        r = confirm("Are you sure you want to remove this item?");
        if (r == true) {
            motionItem = $(this).closest('.actus-motion-item');
            motionItemIdx = motionItem.data('idx');
            
            // Update motion array
            actus_motion_array[motionItemIdx].animation = $.grep( actus_motion_array[motionItemIdx].animation, function( n, i ) {
                return i == animationIdx;
            },true);
            actus_motion_array_str = JSON.stringify( actus_motion_array );
            $( '#actus_motion_array' ).val( actus_motion_array_str );
          
            // Update timeline
            //$(this).closest('.actus-mtn-timeline-line').remove();
            duration = 
                parseInt( $(this).closest('.actus-mtn-timeline').data('duration') );
            amtn_timeline( motionItemIdx, duration );
            
        }
    })
    
    
    // ANIMATION OPTIONS
    $('body').on('click', '.options-button', function(){
        item = $(this).parent();
        currentOpt = item.siblings('.actus-mtn-animation-options');
        item.closest('.actus-mtn-timeline-line').css('height','56px');
        if ( currentOpt.is(':visible') )
                item.closest('.actus-mtn-timeline-line').css('height','26px');
        currentOpt.slideToggle(200);
        
        XX = item.css( 'left' );
        TW = item.closest('.actus-mtn-timeline').width();
        if ( parseInt(item.css( 'left' )) + currentOpt.width() > TW )
            XX = ( TW - currentOpt.width() - 4 ) + 'px';
        currentOpt.css('left', XX );
    })
    
    
    
    
    // CHECKBOX
    $('body').on('click','.actus-checkbox',function(e){
        $(this).toggleClass( 'checked' );
        name          = $(this).closest('.actus-checkbox').attr('name');
        motionItemIdx = $(this).closest('.actus-motion-item').data('idx');
        animationIdx  = $(this).closest('.actus-mtn-animation-options').data('idx');
        val = 'false';
        if ( $(this).hasClass('checked') ) val = 'true';
        $('body').trigger('ACTUS-MOTION-OPTION-CHANGE',[motionItemIdx, animationIdx, name, val]);
    })
    // SWITCH
    $('body').on('click','.actus-switch .selection',function(e){
        $(this).siblings('.selection').removeClass( 'ON' );
        $(this).addClass( 'ON' );
        name          = $(this).closest('.actus-switch').attr('name');
        motionItemIdx = $(this).closest('.actus-motion-item').data('idx');
        animationID   = $(this).closest('.actus-mtn-animation-options').data('id');
        animationIdx  = $(this).closest('.actus-mtn-animation-options').data('idx');
        val = $(this).attr('alt');
        $('body').trigger('ACTUS-MOTION-OPTION-CHANGE',[motionItemIdx, animationIdx, name, val]);
        
        if ( $(this).has('.actus-arrow') ) {
            clss = $(this).find('.actus-arrow').attr('class');
            $('#'+animationID+' .label .actus-arrow').attr('class',clss);
        }
        if ( $(this).offset().top + $(this).height() > $(window).height() ) {
            $(this).css('top', '-'+($(this).height()-32)+'px');
        }
    })
    // DROPDOWN
    $('body').on('click',function(e){
        $('.actus-dropdown-list').slideUp(150);
    })
    $('body').on('click','.actus-dropdown-box',function(e){
        if ( $(this).hasClass('disabled') ) return;
        e.stopPropagation();
        curentDropdown = $(this);
        motionItem = $(this).closest('.actus-motion-item');
        motionItemIdx = motionItem.data('idx');
        $('.actus-dropdown-list').slideUp(200);
        values = $(this).find('.actus-dropdown-list').data('values');
        if (typeof(values) === 'undefined' ) values = '';
        values = values.split(',');
        listH = '';
        $.each(values,function(i,value){
            listH += '<p alt="'+value+'">'+value+'</p>';
        })
        listL = $(this).offset().left;
        listT = $(this).offset().top + $(this).height();
        listW = parseInt($(this).width()) - 16;
        $(this).find('.actus-dropdown-list').html( listH );
        if ( listT + $(this).find('.actus-dropdown-list').height() > 
             $(window).height() + $(window).scrollTop() ) {
            listT = $(this).offset().top - $(this).find('.actus-dropdown-list').height() - 16;
        }
        $(this).find('.actus-dropdown-list').clone()
            .appendTo( 'body' )
            .css({ left: listL+'px', top: listT+'px', width: listW+'px' })
            .slideToggle(150);
    })
    $('body').on('click','.actus-dropdown-list p',function(e){
        e.stopPropagation();
        animationBox = $(this).closest('.actus-mtn-animation');
        optionBox = curentDropdown;
        animationIdx  = curentDropdown.closest('.actus-mtn-animation-options').data('idx');
        if ( typeof( animationIdx ) === 'undefined' ) animationIdx = 0;
        name = curentDropdown.attr('name');
        val  = $(this).attr('alt');
        t    = $(this).text();
        $('.actus-dropdown-list').slideUp(200);
        curentDropdown.find('.value').text( t );
        
        if ( name=='group' ) {
            options = actusMotionParamsAdmin.options['defaults'][val];
            amtn_controls( options, animationBox.find('.actus-mtn-animation-options') );
        } else {
            $('body').trigger('ACTUS-MOTION-OPTION-CHANGE',[motionItemIdx, animationIdx, name, val]);
        }

        
        
        
    })
    
     
    
    
    
    

    
    // OPTIONS INPUT CHANGE
    // ********************
    $( 'body' ).on( 'change', '.actus-mtn-option-box input', function() {
        motionItem = $(this).closest('.actus-motion-item');
        motionItemIdx = motionItem.data('idx');
        optionBox = $(this).closest('.actus-mtn-option-box');
        animationIdx  = $(this).closest('.actus-mtn-animation-options').data('idx');
        name = optionBox.attr('name');
        val  = $( this ).val();
        $('body').trigger('ACTUS-MOTION-OPTION-CHANGE',[motionItemIdx, animationIdx, name, val]);
        animationID = $(this).closest('.actus-mtn-animation-options').data('id');
        $('#'+animationID+' .label .'+name).text(val);
    })
     
    
    // OPTIONS CHANGE TRIGGER
    // **********************
    $( 'body' ).on( 'ACTUS-MOTION-OPTION-CHANGE', function(event,idx,animidx,name,val) {
        if ( typeof(actus_motion_array[ idx ]) === 'undefined' )
            actus_motion_array[ idx ] = {};
        
        if ( name == 'type' ) {
            actus_motion_array[ idx ][name] = {};
            $.extend( true, actus_motion_array[ idx ][name], motionTypes[val] );
        } else if ( name == 'element' || name == 'event' || name == 'mode' ) {
            actus_motion_array[ idx ][ name ] = val;
        } else {
            actus_motion_array[ idx ]['animation'][ animidx ]['options'][ name ]['value'] = val;
        }
        
        actus_motion_array_str = JSON.stringify( actus_motion_array );
        $( '#actus_motion_array' ).val( actus_motion_array_str );
        
    })
    
    dragAnim = false;
    dragAnimEnd = false;
    newWidth = 0;
    
    
    
    // DRAG ANIMATION
    $('body').on('mousedown','.actus-mtn-animation', function(e){
        motionItem = $(this).closest('.actus-motion-item');
        motionItemIdx = motionItem.data('idx');
        animItem = $(this);
        animationIdx = animItem.data('idx');
        cellW = animItem.siblings('.cell').width();
        dragAnim = true;
        animItemX  = animItem.offset().left;
        animItemX  = parseInt( animItem.css('left') );
        animItemW  = animItem.width();
        newWidth = animItemW;
        newX = animItemX;
        mouseStartX = e.pageX;
    })
    // DRAG ANIMATION RIGHT
    $('body').on('mousedown','.actus-mtn-animation .handlers .right', function(e){
        e.stopPropagation();
        motionItem = $(this).closest('.actus-motion-item');
        motionItemIdx = motionItem.data('idx');
        animItem = $(this).closest('.actus-mtn-animation');
        animationIdx = animItem.data('idx');
        cellW = animItem.siblings('.cell').width();
        dragAnimEnd = true;
        animItemX  = animItem.offset().left;
        animItemX  = parseInt( animItem.css('left') );
        animItemW  = animItem.width();
        newWidth = animItemW;
        newX = animItemX;
        mouseStartX = e.pageX;
    })
    $('body').on('mouseup', function(e){
        if ( !dragAnim && !dragAnimEnd ) return;
        dragAnim    = false;
        dragAnimEnd = false;
        cellW = animItem.siblings('.cell').width();
        //animItem.width( newWidth ).css( 'left', newX+'px' );
        newDuration = Math.round( newWidth * (1000/cellW) );
        newDelay = Math.round( newX * (1000/cellW) );
        $('body').trigger('ACTUS-MOTION-OPTION-CHANGE',[motionItemIdx, animationIdx, 'duration', newDuration]);
        $('body').trigger('ACTUS-MOTION-OPTION-CHANGE',[motionItemIdx, animationIdx, 'delay', newDelay]);
    })
    
    $('body').mousemove(function( event ) {
        if ( dragAnimEnd ) {
            mouseX = event.pageX;
            newWidth = animItemW + ( mouseX - mouseStartX );
            if ( ((newX+newWidth) % cellW) > cellW-8 ) newWidth += cellW - ((newX+newWidth) % cellW);
            if ( ((newX+newWidth) % cellW) < 8 ) newWidth -= ((newX+newWidth) % cellW);
            animItem.width( newWidth );
        }
        if ( dragAnim ) {
            mouseX = event.pageX;
            newX = animItemX + ( mouseX - mouseStartX );
            if ( (newX % cellW) > cellW-8 ) newX += cellW - (newX % cellW);
            if ( (newX % cellW) < 8 ) newX -= (newX % cellW);
            animItem.css( 'left', newX+'px' );
        }
    })
    
        
        

    
    // TIMELINE ZOOM
    $('body').on('click','.actus-mtn-timeline-zoom-out',function(e){
        motionItem = $(this).closest('.actus-motion-item');
        motionItemIdx = motionItem.data('idx');
        duration = parseInt( $('#actus-mtn-timeline-'+motionItemIdx).data('duration') );
        if ( duration > 52 ) return;
        duration += 5;
        amtn_timeline( motionItemIdx, duration );
    })
    $('body').on('click','.actus-mtn-timeline-zoom-in',function(e){
        motionItem = $(this).closest('.actus-motion-item');
        motionItemIdx = motionItem.data('idx');
        duration = parseInt( $(this).closest('.actus-mtn-timeline').data('duration') );
        if ( duration < 10 ) return;
        duration -= 5;
        amtn_timeline( motionItemIdx, duration );
    })
    
    
    // CREATE ANIMATION ITEM
    function createAnimationItem( motionItem, animationItem, animationID, animationIdx ) {
        animationLabel = '<div class="name floL">'+animationItem.type+'</div>';
        if ( typeof(animationItem.options.direction) !== 'undefined' ) animationLabel += 
                '<div class="actus-arrow '+animationItem.options.direction.value+'"></div>';
        if ( typeof(animationItem.options.fade) !== 'undefined' ) animationLabel += 
                '<div class="fade">' + animationItem.options.fade.value + '</div>'; 
        if ( typeof(animationItem.options.degrees) !== 'undefined' ) animationLabel += 
                '<div class="degrees">  ' + animationItem.options.degrees.value + ' degrees</div>'; 
        if ( typeof(animationItem.options.zoom) !== 'undefined' ) animationLabel += 
                '<div class="zoom">' + animationItem.options.zoom.value + ' x</div>'; 
        if ( typeof(animationItem.options.size) !== 'undefined' ) animationLabel += 
                '<div></div>' +
                '<div class="size">' + animationItem.options.size.value + '</div>';
        if ( typeof(animationItem.options.distance) !== 'undefined' ) animationLabel += 
                '<div class="distance">' + animationItem.options.distance.value + '</div>';
        if ( typeof(animationItem.options.distanceunits) !== 'undefined' ) animationLabel += 
                '<div class="distanceunits">' + animationItem.options.distanceunits.value + '</div>';
        
        animH = '<div id="' + animationID + '" class="actus-mtn-animation" data-idx="'+animationIdx+'">' +
                    '<div class="options-button"></div>' +
                    '<div class="label">'+animationLabel+'</div>' +
                    '<div class="handlers">' +
                        '<div class="right"></div>' +
                    '</div>'+
                '</div>'+
                '<div class="actus-mtn-animation-options clearfix" data-id="' + animationID + '" data-idx="' + animationIdx + '">' +
                '</div>';
        motionItem.find('.actus-mtn-timeline-line').last().clone()
            .append( animH ).insertBefore( motionItem.find('.actus-mtn-timeline-line').last() );

        
        cellW = motionItem.find('.actus-mtn-timeline-line .cell').width() + 2;
        animLeft  = animationItem.options.delay.value * (cellW/1000);
        animWidth = ( animationItem.options.duration.value * (cellW/1000) ) + 4;
        $('#'+animationID).css( 'left', animLeft );
        $('#'+animationID).width( animWidth );
        
        element = $( '.actus-mtn-animation-options[data-id="'+animationID+'"]' );
        amtn_controls( animationItem.options, element );
    }
    
    
    
    // TIMELINE
    function amtn_timeline( idx, duration, target ){
        target = target || '';
        $( '#actus-mtn-timeline-' + idx ).remove();
        timelineH = 
            '<div id="actus-mtn-timeline-'+idx+'" class="actus-mtn-timeline" data-duration="'+duration+'">' +
                '<div class="actus-mtn-timeline-buttons">' +
                    '<div class="actus-button-A actus-mtn-timeline-zoom-out">-</div>' +
                    '<div class="actus-button-A actus-mtn-timeline-zoom-in">+</div>' +
                '</div>' +
                '<div class="actus-mtn-timeline-line actus-mtn-timeline-head">';
                step = 1;
                if ( duration > 11 ) step = 5;
                s = 0;
                for (n=0;n<duration;n++) {
                    if ( s == step ) s = 0;
                    if ( n<10 )
                        t = '00:0'+n;
                    else
                        t = '00:'+n;
                    cellClass = '';
                    if ( s > 0 ) { t = ''; cellClass = ' invisible'; }
                    timelineH += '<div class="cell'+cellClass+'"><p>'+t+'</p></div>';
                    s++;
                }
        timelineH +=
                '</div>' +
                '<div class="actus-mtn-timeline-line">';
                for (n=0;n<duration;n++) {
                    timelineH += '<div class="cell"><div class="line"></div><div class="lineV"></div></div>';
                }
        timelineH +=
                '</div>' +
            '</div>';
        
        //$('.actus-motion-item[data-idx="'+idx+'"] .before-timeline').after( timelineH );
        $('.actus-motion-item[data-idx="'+idx+'"] .actus-motion-item-main').prepend( timelineH );
        
        $( '#actus-mtn-timeline-' + idx + ' .actus-mtn-timeline-line' ).css({
            'display': 'grid',
            'grid-template-columns': 'repeat('+duration+', 1fr)'
        })
        
        

        if ( actus_motion_array[idx].animation.length > 0 ) {
            $.each( actus_motion_array[idx].animation, function(animIdx,anim){
                animationID   = 'animation-' + idx + '-' + animIdx;
                createAnimationItem( 
                    $('.actus-motion-item[data-idx="'+idx+'"]'),
                    anim, 
                    animationID,
                    animIdx 
                );
            })
        }


        return timelineH; 
    }
    
    
    
    // CONTROLS
    function amtn_controls( options, element ){
        optionsH = '<div class="actus-delete-animation"><img src="'+actusMotionParamsAdmin.plugin_url+'img/x.png"></div>';
        $.each(options,function(name,option){
            if ( option.class == 'hidden' )  return;
            if ( option.label == 'to edge' ) return;
            if ( typeof(option.class) === 'undefined' )  option.class = '';
            clss = ' '+option.class;
            
            
          
            if ( option.type == 'dropdown' ) {
                clss += ' actus-dropdown-box';
                optionsH +=
                    '<div class="actus-mtn-option-box' + clss + '" ' +
                        'name="'+name+'">' +
                        '<div class="actus-dropdown-list" data-values="'+option.values+'"></div>' +
                        '<p class="label">'+option.label+'</p>' +
                        '<p class="value">'+option.value+'</p>' +
                    '</div>';
            } else if ( option.type == 'label' ) {
                optionsH +=
                    '<div class="actus-mtn-option-box' + clss + '">' +
                        '<p class="label">'+option.label+'</p>' +
                    '</div>';
            } else if ( option.type == 'checkbox' ) {
                clss += ' actus-checkbox';
                if ( option.value == 'true' ) clss += ' checked';
                optionsH +=
                    '<div class="actus-mtn-option-box' + clss + '" ' +
                        'name="'+name+'">' +
                        '<p class="label">'+option.label+'</p>' +
                    '</div>';
            }  else if ( option.type == 'switch' ) {
                clss += ' actus-switch';
                if ( option.value == 'true' ) clss += ' checked';
                    optionsH +=
                        '<div class="actus-mtn-option-box' + clss + '" ' +
                            'name="'+name+'">' +
                            '<div class="label">'+option.label+' - </div>';
                    values = option.values.split(',');
                    $.each(values, function(i,val){
                        clss = "";
                        if ( val == option.value ) clss = ' ON';
                        label = val;
                        if ( name == 'direction' )
                            label = '<div class="actus-arrow '+val+'"></div>';
                        optionsH += '<div class="selection'+clss+'" alt="'+val+'">'+label+'</div>'
                    })
                    optionsH +=
                        '</div>';
            } else {
                optionsH +=
                    '<div class="actus-mtn-option-box' + clss + '" ' +
                        'name="'+name+'">' +
                        '<p class="label">'+option.label+'</p>' +
                        '<input  alt="'+name+'" ' +
                                'name="'+name+'" ' +
                                'step="any"' +
                                'type="'+option.type+'" ' +
                                'value="'+option.value+'">' +
                    '</div>';
            }
            
        })
        $( element ).html( optionsH );
        
    }
    
    
    
    
})(jQuery);
   
var $ = jQuery.noConflict();
    


