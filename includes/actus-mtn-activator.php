<?php
/**
 * Actions that run during plugin activation
 *
 * Sets the default options
 *
 * @package    Actus_Motion
 */
 
// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

update_option( 'ACTUS_MTN_VERSION', ACTUS_MTN_VERSION );
/*
add_option( 'ACTUS_MTN_test',        250);
*/