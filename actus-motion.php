<?php
/**
 * 
 * @package     Actus_Motion
 *
 * Plugin Name: ACTUS Motion
 * Plugin URI:  http://wp.actus.works/actus-motion/
 * Description: Add motion to your elements.
 * Version:     1.0.1
 * Author:      Stelios Ignatiadis
 * Author URI:  http://wp.actus.works/
 * Text Domain: actus-motion
 * License: GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}


/**
 * Define Path Constants
 *
 * @since 0.1.0
 * @constant string ACTUS_THEME_DIR   Directory of the current Theme.
 * @constant string ACTUS_MTN_NAME    Plugin Basename.
 * @constant string ACTUS_MTN_DIR     Directory of the Plugin.
 * @constant string ACTUS_MTN_DIR     URL of the Plugin.
 * @constant string ACTUS_MTN_VERSION Plugin Version.
 */
function actus_mtn_define_constants() {
    if ( ! defined( 'ACTUS_MTN_NAME' ) ) {
        define( 'ACTUS_MTN_NAME', trim( dirname( plugin_basename(__FILE__) ), '/') );
    }
    if ( ! defined( 'ACTUS_MTN_DIR' ) ) {
        define( 'ACTUS_MTN_DIR', plugin_dir_path( __FILE__ ) );
    }
    if ( ! defined( 'ACTUS_MTN_URL' ) ) {
        define( 'ACTUS_MTN_URL', plugin_dir_url( __FILE__ ) );
    }
    if ( ! defined( 'ACTUS_MTN_VERSION' ) ) {
        define( 'ACTUS_MTN_VERSION', '1.0.1' );
    }
}
actus_mtn_define_constants();







// INITIALIZE
add_action( 'wp_enqueue_scripts', 'actus_mtn_depedencies' );
add_action( 'init', 'actus_mtn_init' );




/*
 * Loads the necessary JS & CSS files
 *
 * @variable  array  $actus_motion_array        The array of motion items.
 * @variable  string $actus_motion_array_str    The array of motion items stringified.
 * @variable  array  $actus_mtn_params          Parameters for the script.
 *
 */
function actus_mtn_depedencies( ) {
    global $post, $wp_query;
    

    $post_id = $post->ID;
    $page_id = $wp_query->get_queried_object_id();
    // Read saved Motion Array
    $actus_motion_array = array();
    $actus_motion_array_str = get_post_meta( $post_id, 'actus_motion_array' );
    if ( $actus_motion_array_str == null ) {
        if ( $post_id != $page_id )
            $actus_motion_array_str = get_post_meta( $page_id, 'actus_motion_array' );
    }
    if ( $actus_motion_array_str != null ) {
        $actus_motion_array = json_decode( $actus_motion_array_str[ 0 ], true );
    }
    


    wp_enqueue_script(
        'actus_motion_animation_script',
        ACTUS_MTN_URL . '/js/actus-mtn-scripts.js',
        array('jquery'), '1.0.3', true);
    
    $actus_nonce = wp_create_nonce( 'actus_nonce' );
    $actus_mtn_params = array(
        'ajax_url'    => admin_url( 'admin-ajax.php' ),
        'nonce'       => $actus_nonce,
        'page_id'     => $page_id,
        'post_id'     => $post_id,
        'plugin_dir'  => ACTUS_MTN_DIR,
        'actus_motion_array' => $actus_motion_array,
    );
    wp_localize_script(
        'actus_motion_animation_script',
        'actusMotionParams', $actus_mtn_params );
}




/**
 * Plugin Initialization.
 *
 */
function actus_mtn_init() {

    // INCLUDE THE FILE THAT DEFINES VARIABLES AND DEFAULTS
    require_once ACTUS_MTN_DIR . '/includes/actus-mtn-variables.php';


    // The Administration Options.
    if ( is_admin() ) {
        require_once ACTUS_MTN_DIR . '/includes/actus-mtn-admin.php';
        require_once ACTUS_MTN_DIR . '/includes/actus-mtn-edit.php';
    }

}






/**
 * Actions that run during plugin activation.
 */
function activate_actus_mtn() {
	require_once ACTUS_MTN_DIR . '/includes/actus-mtn-activator.php';
}
register_activation_hook( __FILE__, 'activate_actus_mtn' );




?>