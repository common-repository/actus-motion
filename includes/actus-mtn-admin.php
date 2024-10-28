<?php
/**
 * The administration options.
 *
 * @package    Actus_Motion
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

$plugin = plugin_basename(__FILE__);


update_option( 'ACTUS_MTN_VERSION',    ACTUS_MTN_VERSION );
add_action( 'admin_enqueue_scripts', 'actus_mtn_depedencies_admin' );
add_action( 'current_screen', 'actus_mtn_edit' );
add_filter( "plugin_action_links_$plugin", 'actus_mtn_settings_link' );







/*
 * Loads the necessary JS & CSS files
 *
 * @variable  array  $actus_motion_array        The array of motion items.
 * @variable  string $actus_motion_array_str    The array of motion items stringified.
 * @variable  array  $actus_mtn_params_admin    Parameters for the script.
 * @variable  int    $post_id                   The id of the current post or page.
 *
 * @see       includes/actus-mtn-variables.php
 * @global    array  $actus_mtn_admin_options   The array of motion options.
 *
 */
function actus_mtn_depedencies_admin() {
    global $actus_mtn_admin_options;
    $post_id = 0;
    if ( isset($_GET['post']) ) $post_id = $_GET['post'];
    if ( isset($_POST['post_ID']) ) $post_id = $_POST['post_ID'];
    // Read saved Motion Array
    $actus_motion_array = array();
    $actus_motion_array_str = get_post_meta( $post_id, 'actus_motion_array' );
    if ( $actus_motion_array_str != null ) {
        $actus_motion_array = json_decode( $actus_motion_array_str[ 0 ], true );
    }

    wp_enqueue_style( 
        'actus-admin-styles', 
        ACTUS_MTN_URL . '/css/actus-admin.css',
        false, '1.0.0', 'all' );
    
    wp_enqueue_style( 
        'actus-motion-admin-styles', 
        ACTUS_MTN_URL . '/css/actus-motion-admin.css',
        false, '1.0.0', 'all' );
    
    wp_enqueue_script(
        'actus_motion_admin_script',
        ACTUS_MTN_URL . '/js/actus-mtn-scripts-admin.js',
        array('jquery'), '1.0.0', true);
    
    $actus_nonce = wp_create_nonce( 'actus_nonce' );
    $actus_mtn_params_admin = array(
        'ajax_url'   => admin_url( 'admin-ajax.php' ),
        'nonce'      => $actus_nonce,
        'plugin_dir' => ACTUS_MTN_DIR,
        'plugin_url' => ACTUS_MTN_URL,
        'options'    => $actus_mtn_admin_options,
        'actus_motion_array' => $actus_motion_array,
    );
    wp_localize_script(
        'actus_motion_admin_script',
        'actusMotionParamsAdmin', $actus_mtn_params_admin );
    
}


/*
 * Adds ACTUS menu on admin panel
 */
if ( !function_exists( 'actus_menu' ) ) {
    function actus_menu(){
        add_menu_page( 
            'ACTUS Plugins',
            'ACTUS',
            'manage_options',
            'actus-plugins',
            'actus_plugins_page',
            ACTUS_MTN_URL . 'img/actus_white_20.png',
            66
        );
    }
    if ( is_admin() ) {
        add_action( 'admin_menu', 'actus_menu' );
    }
}
/*
 * Adds submenu on ACTUS menu
 */

if ( !function_exists( 'actus_mtn_submenu' ) ) {
    function actus_mtn_submenu() {
        add_submenu_page(
            'actus-plugins', 
            'ACTUS Motion Options', 
            'ACTUS Motion', 
            'manage_options', 
            'actus-motion', 
            'actus_motion_admin_page'
        );
    }
    if ( is_admin() ) {
        add_action( 'admin_menu', 'actus_mtn_submenu' );
    }
}

/*
 * Add settings link on plugin page
 *
 */
function actus_mtn_settings_link( $links ) { 
  $settings_link = '<a href="themes.php?page=actus-motion.php">Settings</a>'; 
  array_unshift( $links, $settings_link ); 
  return $links; 
}




/*
 * The ACTUS plugins page content
 */
if ( !function_exists( 'actus_plugins_page' ) ) {
    function actus_plugins_page() {
        
        // Enque styles
        wp_enqueue_style( 
            'actus-admin-styles',
            ACTUS_MTN_URL . 'css/actus-admin.css' ,
            false, '1.0.0', 'all' );

        $actus_plugins_url = ACTUS_MTN_DIR . '/includes/actus-plugins.php';
        include $actus_plugins_url;
        $actus_w = ACTUS_MTN_URL . 'img/actus_white.png'; 
        ?>

        <?php
    }
}




/*
 * Settings Page
 *
 * @global array    $actus_mtn_admin_options  Array of plugin options.
 */
function actus_motion_admin_page() {
    global $actus_mtn_admin_options;
    
	if ( ! current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
    
        $actus_w   = ACTUS_MTN_URL . 'img/actus_white.png';
        $actus_b   = ACTUS_MTN_URL . 'img/actus_black.png';
        $actus_2   = ACTUS_MTN_URL . 'img/actus_2.png';
        $actus_t   = ACTUS_MTN_URL . 'img/title.png';
        $actus_i   = ACTUS_MTN_URL . 'img/info.png';
        $actus_h   = ACTUS_MTN_URL . 'img/help.png';
        $amtn_logo = ACTUS_MTN_URL . 'img/actus_motion_logo_100.png';
        $actus_ss1 = ACTUS_MTN_URL . 'img/ss01.jpg';
    
    ?>
    <div class="wrap actus-settings">
        
        <!-- HEADER -->
        <div class="actus-admin-header actus-mtn-admin-header">
            <img class="actus-admin-header-logo" src="<?php echo $actus_w; ?>">
            <img class="actus-admin-header-title" src="<?php echo $actus_t; ?>">
        </div>

            <!-- INFORMATION -->
            <div class="actus-admin-info actus-admin-info-1">
                <div class="actus-admin-info-icon">
                    <img src="<?php echo $actus_i; ?>">
                </div>
                <div class="actus-admin-info-text">
                    <p><b>ACTUS Motion</b> is a unique plugin that lets you give life to your webpages. A professional timeline lets you refine your motion timing and parameters. Animation can begin playing on page load, when the element is revealed on screen after scrolling or when the element clicked or hovered.</p>
                </div>
                <div style="clear:both"></div>
            </div>
            
            <!-- MAIN -->
            <div class="actus-admin-main">
                <div class="actus-admin-screenshot large">
                    <img src="<?php echo $actus_ss1; ?>">
                </div>
            </div>

            <!-- HELP -->
            <div class="actus-admin-info actus-admin-help">
                <div class="actus-admin-info-icon">
                    <img src="<?php echo $actus_h; ?>">
                </div>
                <div class="actus-admin-info-text">
                    <h3>Usage</h3>

                    <p>In the bottom of the edit post/page screen, you can see the <b>ACTUS Motion</b> Metabox.</p>
                    <ul>
                        <li>Click on the <b>ADD ITEM</b> button to add a motion item.</li>
                        <li>Enter an element id or class name in the <b>ELEMENT</b> field (eg: ‘#example’ or ‘.example’).</li>
                        <li>Select the <b>starting event</b> (on page load, on reveal after scroll, on click, on hover).</li>
                        <li>Select <b>animate OUT</b> if you want to animate the element away of its original position.</li>
                        <li>Select a <b>motion track</b> (move,zoom,rotate,fade,blur).</li>
                        <li>Click the <b>ADD MOTION</b> button to add the motion track to the timeline.</li>
                        <li>Drag the motion track to adjust its <b>starting time</b>.</li>
                        <li>Drag the motion track right edge to adjust its <b>duration</b>.</li>
                        <li>Click on the icon on the left of the motion track, to open the parameters.</li>
                        <li>Add as many motion tracks as you want.</li>
                        <li>Update the post or page to <b>save</b> the changes.</li>
                    </ul>
                    <p>Now you can preview your post/page and watch the motion you have applied.</p>
                </div>
                <div style="clear:both"></div>
            </div>
        
        
        <!-- FOOTER -->
        <div class="actus-admin-footer">
            <div class="actus">created by <a href="http://wp.actus.works" target="_blank">ACTUS anima</a></div>
            <div class="actus-sic">code &amp; design:  <a href="mailto:sic@actus.works" target="_blank">Stelios Ignatiadis</a></div>
        </div>
        
        
    </div>
    <?php
}




/*
 * ACTUS Motion metaboxes on edit screens
 *
 */
function actus_mtn_edit(){
    // Initialize and display the administration metaboxes
    // This action is documented in includes/actus-mtn-edit.php
    add_action( 'add_meta_boxes', 'actus_mtn_meta_boxes' );
}


?>