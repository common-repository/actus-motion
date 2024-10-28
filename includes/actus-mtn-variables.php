<?php
/**
 * Variables for ACTUS Motion.
 *
 * @package    Actus_Motion
 */


// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}



// DEFINE AND LOAD VARIABLES
global $actus_mtn_admin_options, $actus_mtn_options;




// DEFAULT OPTIONS FOR THE PLUGIN
$actus_mtn_options = array();




// DEFAULT OPTIONS FOR THE ADMINISTRATION
$actus_mtn_admin_options = array();




$actus_mtn_admin_options['motion-events'] = array (
    'on load'  => array(
        'options' => array(
            'delay' => array(
                'label' => 'delay (ms)',
                'type'  => 'number', 
                'value' => 0
            )
        )
    ),
    'on reveal' => array(
        'options' => array(
            'delay' => array(
                'label' => 'delay (ms)',
                'type'  => 'number', 
                'value' => 0
            ),
            'offset' => array(
                'label' => 'offset (px)',
                'type'  => 'number', 
                'value' => 0
            ),
        )
    ),
    'on click'  => array(
        'options' => array(
            'delay' => array(
                'label' => 'delay (ms)',
                'type'  => 'number', 
                'value' => 0
            )
        )
    ),
    'on hover'  => array(
        'options' => array(
            'delay' => array(
                'label' => 'delay (ms)',
                'type'  => 'number', 
                'value' => 0
            )
        )
    ),
    'disabled' => array(
        'options' => array()
    ),
);






$actus_mtn_admin_options['motion-groups'] = array (
    'move',
    'rotate',
    'zoom',
    'fade',
    'blur',
);
$default_mode = array(
    'label' => 'mode',
    'type'  => 'dropdown', 
    'value' => 'animate IN',
    'values' => array(
        'animate IN',
        'animate OUT',
    ),
    'class' => 'small mode',
);
$default_duration = array(
    'label' => 'duration',
    'type'  => 'number', 
    'value' => 1000,
    'class' => 'hidden',
);
$default_delay = array(
    'label' => 'delay',
    'type'  => 'number', 
    'value' => 0,
    'class' => 'hidden',
);
$default_ease = array(
        'label'  => 'ease',
        'type'   => 'dropdown', 
        'value'  => 'out',
        'values' => array('in-out','in','out','ease','linear'),
        'class'  => 'small spaceR',
    );


$actus_mtn_admin_options['defaults']['move'] = array(
    'duration' => $default_duration,
    'delay'    => $default_delay,
    'direction' => array(
        'label' => 'direction',
        'type'  => 'switch', 
        'value' => 'left',
        'values' => 'left,right,top,bottom',
        'class' => 'small spaceR',
    ),
    'distance' => array(
        'label' => 'distance',
        'type'  => 'number', 
        'value' => 100,
        'class' => 'small',
    ),
    'distanceunits' => array(
        'label' => '',
        'type'  => 'dropdown', 
        'value' => 'px',
        'values' => array('px','%','vw','vh'),
        'class' => 'small spaceR',
    ),
    /*
    'edge' => array(
        'label' => 'to edge',
        'type'  => 'checkbox', 
        'value' => 'false',
        'class' => 'small spaceR',
    ),
    */
    'ease' => $default_ease,
);
$actus_mtn_admin_options['defaults']['rotate'] = array(
    'duration' => $default_duration,
    'delay'    => $default_delay,
    'direction_r' => array(
        'label' => 'direction',
        'type'  => 'dropdown', 
        'value' => 'clockwise',
        'values' => array('clockwise','counter clockwise'),
        'class' => 'small spaceR',
    ),
    'degrees' => array(
        'label' => 'degrees',
        'type'  => 'number', 
        'value' => 90,
        'class' => 'small spaceR',
    ),
    'ease' => $default_ease,
);
$actus_mtn_admin_options['defaults']['zoom'] = array(
    'duration' => $default_duration,
    'delay'    => $default_delay,
    'zoom' => array(
        'label' => 'zoom',
        'type'  => 'switch', 
        'value' => 'in',
        'values' => 'in,out',
        'class' => 'small spaceR',
    ),
    'size' => array(
        'label' => 'size',
        'type'  => 'number', 
        'value' => 4,
        'class' => 'small spaceR',
    ),
    'ease' => $default_ease,
);

$actus_mtn_admin_options['defaults']['fade'] = array(
    'duration' => $default_duration,
    'delay'    => $default_delay,
    'fade' => array(
        'label' => 'fade',
        'type'  => 'switch', 
        'value' => 'in',
        'values' => 'in,out',
        'class' => 'small spaceR',
    ),
    'ease' => $default_ease,
);
$actus_mtn_admin_options['defaults']['blur'] = array(
    'mode'     => $default_mode,
    'duration' => $default_duration,
    'delay'    => $default_delay,
    'size' => array(
        'label' => 'size',
        'type'  => 'number', 
        'value' => 4,
        'class' => 'small',
    ),
    'label3' => array(
        'label' => 'px',
        'type'  => 'label', 
        'class' => 'small spaceR',
    ),
    'ease' => $default_ease,
);




