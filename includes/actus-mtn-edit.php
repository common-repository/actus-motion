<?php
/**
 * Motion administration displayed in the edit screen.
 *
 * @package    Actus_Motion
 */

/**
 * Create Metaboxes
 *
 * Initialize and display the ACTUS motion administration metaboxes.
 *
 * @variable string  $actus_white              The logo url.
 * @variable string  $metabox_title            The metabox title.
 * @variable string  $pg_type                  The page type.
 *
 * @global   int     $post                      The current post.
 *
 * @constant string ACTUS_MTN_URL             URL of the Plugin.
 */
function actus_mtn_meta_boxes() {
    
    $actus_white = ACTUS_MTN_URL . 'img/actus_white_20.png';
    $metabox_title = "<img src='$actus_white' class='actus-metabox-logo'>";
    $metabox_title .= esc_html__( 'ACTUS MOTION', 'actus-motion' );
    
    $pg_type = 'post';
    if ( get_current_screen()->id == "page" ) {
        $pg_type = 'page';
    }
    
    add_meta_box(
        'actus-mtn-box',
        $metabox_title,
        'actus_mtn_box_content', 
        $pg_type,
        'normal',         // Context
        'default'         // Priority
    ); 
    
}



/**
 * Metaboxes Content
 *
 * Initialize and display the ACTUS motion metaboxes.
 *
 * @global    array  $actus_mtn_admin_options   The array of motion options.
 *
 * @constant string ACTUS_MTN_URL                URL of the Plugin.
 */
function actus_mtn_box_content( $post ) {
    global  $actus_mtn_admin_options;
    
    $events_str = '';
    foreach ($actus_mtn_admin_options['motion-events'] as $key => $event) {
        $events_str .= $key . ',';
    }
    $events_str = rtrim($events_str, ',');
    ?>



    <!-- MOTION ITEM TEMPLATE -->
    <div class='actus-motion-item actus-motion-item-template clearfix'>
        
        <div class='actus-motion-item-main'>
            
            <div class="clear"></div>
            <div class='actus-add-animation col-4-1 actus-button-A dark'>ADD MOTION</div>
            <div class="actus-dropdown-box dark col-4-1" name="group">
                <div class="actus-dropdown-list" data-values="<?php echo implode(",",$actus_mtn_admin_options['motion-groups']); ?>"></div>
                <p class="label"></p>
                <p class="value">move</p>
            </div>
            <div class="clear"></div>
            
            <!-- ELEMENT -->
            <div class='actus-mtn-option-box small dark col-2-1  actus-motion-element' name='element'>
                <input type="text"
                       value="">
                <p class="label">element</p>
            </div>

            <!-- EVENT --> 
            <div class='actus-mtn-option-box small col-4-1 actus-dropdown-box dark actus-motion-event' name='event'>
                <div class="actus-dropdown-list"
                     data-values="<?php echo $events_str; ?>">
                </div>
                <p class="label"></p>
                <p class="value">on load</p>
            </div>
            <!-- MODE --> 
            <div class='actus-mtn-option-box small col-4-1 actus-dropdown-box dark actus-motion-mode' name='mode'>
                <div class="actus-dropdown-list"
                     data-values="animate IN,animate OUT">
                </div>
                <p class="label"></p>
                <p class="value">animate IN</p>
            </div>
            


            <div class="clear"></div>

        </div>

        <div class='actus-motion-item-side'>
            <div class="actus-remove-motion-item">
                <?php $Xicon = ACTUS_MTN_URL . 'img/x.png'; ?>
                <img src="<?php echo $Xicon; ?>">
            </div>
        </div>
        
    </div>

    <!-- MOTION PANEL -->
    <div class='actus-motion-panel'>
        
        <div class='actus-add-motion-item actus-button-A dark'>ADD ITEM</div>
    

        <div style="clear:both"></div>

        
        <!-- CUSTOM FIELDS -->
        <input type="hidden" 
               id="actus_motion_array"
               name="actus_motion_array"
               value="{}"/>
        
    </div>




    <!-- FOOTER -->
    <div class="actus-admin-footer">
        <div class="actus">created by <a href="http://wp.actus.works" target="_blank">ACTUS anima</a></div>
        <div class="actus-sic">code &amp; design:  <a href="mailto:sic@actus.works" target="_blank">Stelios Ignatiadis</a></div>
    </div>


    <?php
}




/**
 * Create Save nonce
 */
add_action( 'post_submitbox_start', 'actus_mtn_save_nonce_create' );
function actus_mtn_save_nonce_create() {
    wp_nonce_field( 'actus_mtn_save_nonce', 'actus_mtn_save_nonce' );
}


/**
 * Save
 *
 * Save motion options during post or page save.
 *
 * @variable string  $post_id   The id of the current post or page.
 *
 * @global   obj     $post      The current post.
 */
add_action( 'save_post', 'actus_mtn_save' );
function actus_mtn_save() {
    global $post;
    $post_id = $post->ID;
    
    // Check if our nonce is set.
    if ( isset( $_POST['actus_mtn_save_nonce'] ) ) {
        // Verify that the nonce is valid.
        if ( wp_verify_nonce( $_POST['actus_mtn_save_nonce'], 'actus_mtn_save_nonce' ) ) {
            
            // SAVE motion array
            if ( isset( $_POST['actus_motion_array'] ) ) {
                $data = sanitize_text_field( $_POST['actus_motion_array'] );
                update_post_meta( $post_id, 'actus_motion_array', $data );
            }
            
        }
    }
    
    
}

