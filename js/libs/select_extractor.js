/*
 * Extract Drupal "Parent Link" dropdown into multiple cascading dropdowns
 * 
 *(c) Jim Keller 2018
 * Eastern Standard
 * https://www.easternstandard.com
 */

function SelectExtractor( settings ) {

	settings = settings || {};
	this.settings = settings;

	var select_box;
	var select_boxes = window.document.querySelectorAll( this.setting('selectors.select_input_original').toString() );
	var select_box_id = '';
	var select_box_extracted_hide = false;

	this.option_data = {}; 
	this.option_data_top = {};
	this.select_boxes = [];
	
	this.debug( '|' + this.setting('selectors.select_input_original') + '|' );
	this.debug(select_boxes);

	if ( select_boxes.length > 0 ) {

		for ( var i = 0; i < select_boxes.length; i++ ) {
			select_box_id = 'se_' + SelectExtractor.unique_index_get().toString();
			select_boxes[i].setAttribute('data-select-extractor-id', select_box_id );
			
			this.select_options_extract( select_boxes[i] );		
			
			if ( this.setting('select_input_original_hide') ) {
				this.select_box_original_hide( select_boxes[i] );
			}	

			if ( select_boxes[i].selectedIndex > 0 ) { //@TODO: this is very Drupal-specific - checking if something is selected by seeing if the first option is chosen
				
				this.select_box_change_link_initialize( select_boxes[i] );
				select_box_extracted_hide = true;

			}

			this.select_box_create( this.option_data_top, 0, select_box_id, { hide: select_box_extracted_hide } );

			
		}
	}
	else {
		this.debug('No matching selectors found for SelectExtractor');
	}



}

SelectExtractor.prototype.select_box_change_link_initialize = function( select_box ) {
	try {

				var me = this;
				var select_box_container = document.querySelector( this.setting( 'selectors.select_box_container') );
				var select_box_id = select_box.getAttribute('data-select-extractor-id');
				var selection_label = document.createElement('div');
				var choose_new_link = document.createElement('a');

				selection_label.innerHTML = select_box.options[ select_box.selectedIndex ].text;
				selection_label.classList.add('select-box-label-current');
				selection_label.setAttribute('data-select-original-id', select_box_id);

				choose_new_link.addEventListener('click',
					function() {
						me.select_box_display_extracted( select_box_id );
						me.select_box_change_link_hide( select_box_id );
					}
				);

				choose_new_link.setAttribute('data-select-original-id', select_box_id);
				choose_new_link.classList.add('select-box-change-link');
				choose_new_link.style.display = 'block';
				choose_new_link.style.cursor = 'pointer';
				choose_new_link.innerHTML = 'Change';
				
				select_box_container.appendChild( selection_label );
				select_box_container.appendChild( choose_new_link );

	}
	catch(e) {
		throw e;
	}
}

SelectExtractor.prototype.select_box_change_link_hide = function( select_box_id ) {	
	try {

		//
		// @TODO - finding stuff by extracted select ID should be a method...
		//
		var link = document.querySelector( '.select-box-change-link[data-select-original-id="' + select_box_id.toString() + '"]' );

		if ( link ) {
			link.style.display = 'none';
		}

		var label = document.querySelector( '.select-box-label-current[data-select-original-id="' + select_box_id.toString() + '"]' );

		if ( label ) {
			label.style.display = 'none';
		}

	}
	catch(e) {
		throw e;
	}

}

SelectExtractor.prototype.select_box_display_extracted = function( select_box_id_original ) {

	try {
		var select_boxes_extracted = document.querySelectorAll( 'select[data-select-original-id="' + select_box_id_original.toString() + '"]' );

		for( var i = 0; i < select_boxes_extracted.length; i++ ) {
			select_boxes_extracted[i].style.display='block';			
		}
	}
	catch( e ) {
		throw e;
	}

}

SelectExtractor.prototype.select_box_original_hide = function( select_box ) {

	try {

		select_box.style.height = '0';
		select_box.style.width = '0';
		select_box.style.lineHeight = '0';
		select_box.style.visibility = 'hidden';
		select_box.style.minHeight = 0;

	}
	catch( e ) {
		throw e;
	}
}

SelectExtractor.prototype.select_box_create = function( option_data, level, select_original_id, method_options ) {

	try {

		method_options = method_options || {};

		var new_select = document.createElement('select');
		var me = this;
		var option_count = 0;
		var wrapper;

		new_select.appendChild( new Option( this.setting('option_empty_label'), this.setting('option_empty_value') ) );

		for( var key in option_data ) {			
			new_select.appendChild( new Option(option_data[key].text, option_data[key].value) );
			option_count++;
		}

		new_select.setAttribute('data-select-level', level);
		new_select.setAttribute('data-select-original-id', select_original_id);
		new_select.setAttribute('id', select_original_id + '_' + level.toString() );

		if ( typeof(method_options.hide) != 'undefined' && method_options.hide == true ) {
			new_select.style.display='none';
		}

		new_select.addEventListener('change',
			function() {
				me.select_handle_change( new_select );
			}
		);

		this.select_boxes.push(new_select);

		var select_box_container = document.querySelector( this.setting( 'selectors.select_box_container') );

		if ( this.setting('select_box_wrapper.element') ) {
			var wrapper = document.createElement( this.setting('select_box_wrapper.element') );

			if ( this.setting('select_box_wrapper.class') ) {
				wrapper.classList.add( this.setting('select_box_wrapper.class') );
			}

			wrapper.appendChild(new_select);
		}
		else {
			wrapper = new_select;
		}

		select_box_container.appendChild(wrapper);


	}
	catch(e) {
		throw e;
	}

}

SelectExtractor.prototype.select_handle_change = function( source_element ) { 

	try {

		this.select_option_apply( source_element, source_element.options[source_element.selectedIndex].value );


	}
	catch(e) {
		throw e;
	}

}

SelectExtractor.prototype.select_option_apply = function( source_element, option_val ) { 

	try {

		this.select_visibility_refresh( source_element );

		if ( typeof(this.option_data[option_val]) != 'undefined' && typeof(this.option_data[option_val].children) != 'undefined' ) {
			this.select_box_create( this.option_data[option_val].children, parseInt(source_element.getAttribute('data-select-level')) + 1, source_element.getAttribute('data-select-original-id'));
		}

		this.select_original_sync( source_element );

	}
	catch(e) {
		throw e;
	}

}

SelectExtractor.prototype.select_original_sync = function( source_element ) {

	try {

		var select_boxes   = this.select_boxes_get_all_for_original_id( source_element.getAttribute('data-select-original-id') );
		var max_level 	   = -1;
		var deepest_index  = -1;
		var deepest_select = null;
		var selected_value = null;
		var original_select = null;

		//
		// Find the deepest select box that has a value
		//
		for( var i = 0; i < select_boxes.length; i++ ) {
			cur_level = select_boxes[i].getAttribute('data-select-level');

			selected_value = select_boxes[i].value;

			if ( cur_level > max_level && ( selected_value != this.setting('option_empty_value') ) ) {
				max_level = cur_level;
				deepest_index = i;
			}
		}

		//
		// Set the original select value to the value of the deepest child box that has a selection
		//
		if ( deepest_index > -1 ) {
			deepest_select = select_boxes[deepest_index];
			original_select = this.original_select_by_child_select( deepest_select );

			original_select.value = deepest_select.value;
		}


	}
	catch(e) {

		throw e;

	}

}

SelectExtractor.prototype.original_select_by_child_select = function( element ) {

	try {

		var original_id = element.getAttribute('data-select-original-id');

		return document.querySelector('select[data-select-extractor-id="' + original_id + '"]');
	}
	catch( e ) {
		throw e;
	}

}


SelectExtractor.prototype.select_boxes_get_all_for_original_id = function( original_id ) {

	try {
		return document.querySelectorAll('select[data-select-original-id="' + original_id + '"]');
	}
	catch( e ) {
		throw e;
	}

}

SelectExtractor.prototype.select_visibility_refresh = function( source_element ) {

	try {

		var cur_level					 = null;
		var source_level 			 = source_element.getAttribute('data-select-level');
		var select_original_id = source_element.getAttribute('data-select-original-id');

		var select_boxes = this.select_boxes_get_all_for_original_id( select_original_id );

		for( var i = 0; i < select_boxes.length; i++ ) {
			cur_level = select_boxes[i].getAttribute('data-select-level');

			//
			// Remove any select boxes that are dependent on the value of this one
			//
			if ( cur_level > source_level ) {
				select_boxes[i].parentNode.removeChild(select_boxes[i]);
			}

		}

	}
	catch (e) {
		throw e;
	}

}


SelectExtractor.prototype.select_options_extract = function( element ) {

	try {

		var parents = [];
		var cur_parent_option = null;
		var cur_level = 0;
		var option_level = null;
		var cur_obj = null;
		var next_parent_option = null;
		var this_option_data = {};
		var level_difference = 0;

		if ( typeof(element.options) == 'undefined' ) {
			throw 'Invalid element passed to options_extract in SelectExtractor';
		}

		for( var i = 0; i < element.options.length; i++ ) {
			
			option_level = this.select_option_determine_level_by_text( element.options[i].text );

			this.debug( 'CHECKING: ' + element.options[i].text + ' at cur_level ' + cur_level);

			if ( option_level == 0 ) { // top level option

				this.debug('option level zero');

				this_option_data = {
					'text': element.options[i].text,
					'value': element.options[i].value,
					'children': []
				}	;

				//this.option_data[element.options[i].value] = this_option_data;

				//
				// Store the top level data so we can seed the first dropdown
				//
				this.option_data_top[element.options[i].value] = this_option_data;

				next_parent_option = element.options[i];

				this.debug( 'setting cur level to zero' );
				cur_level = 0;

			}
			else {

				//
				// Hit a new level
				//
				if ( cur_level != option_level ) {
					
					if ( option_level > cur_level ) {
						//
						// We found a new level of depth
						//
						this.debug( 'option level of ' + option_level.toString() + ' > cur level of ' + cur_level.toString() + ' for ' + element.options[i].text ) ;
						if ( cur_parent_option ) {
							this.debug( ' cur parent is ' + cur_parent_option.text );
						}
						if ( next_parent_option ) {
							this.debug( ' next parent is ' + next_parent_option.text );
						}
						
						if ( next_parent_option ) {

							//
							// An item only officially becomes a parent if we found something beneath it.
							// We stored 'next parent option' on the previous iteration of the loop. If we found
							// a child beneath it, then it officially becomes a parent.
							//
							if ( typeof(this.option_data[next_parent_option.value]) == 'undefined' ) {
								this.debug( "  adding " + element.options[i].text + ' to option data array' );
								this.option_data[next_parent_option.value] = {
									'text': next_parent_option.text,
									'value': next_parent_option.value,
									'children': []
								}		

								cur_parent_option = next_parent_option;
								this.debug( "  pushing to parents array: " + cur_parent_option.text );
								parents.push(cur_parent_option);
							}							

						}

						//
						// This item is now "on deck" to become a parent if we find a child beneath it next time
						//
						next_parent_option = element.options[i];				
						
						cur_level ++;					

					}
					else {

						//
						// Lower level
						//
						this.debug( 
							' option level of ' + option_level.toString() + ' < cur level of ' + cur_level.toString() + ' for ' + element.options[i].text
						);					

						//
						// Retreat back to the last parent we had at this level
						//
						while( cur_level > option_level ) {
							cur_parent_option = parents.pop();
							cur_level--;
						}

						this.debug( 
							'new cur level is ' + cur_level,							
						 );

						//
						// Set this item up as the next potential parent,
						// and also set cur_parent to the deepest item in the parents array
						//
						next_parent_option = element.options[i];
						cur_parent_option = parents[parents.length-1]; 
												
						if ( cur_parent_option ) {							
							this.debug( ' popped parent is ' + cur_parent_option.text );												
						}

					}
				}
				else {

					this.debug( ' option level of ' + option_level + ' is the same as cur_level of ' + cur_level );

					next_parent_option = element.options[i];
				}

				if ( cur_parent_option ) {
					
					this.debug( 'adding ' + element.options[i].text + ' as child of ' + cur_parent_option.text );

					this.option_data[cur_parent_option.value].children.push( {
						'text': element.options[i].text,
						'value': element.options[i].value,					
					});
				}
			}

		}

	}
	catch(e) {
		throw e;
	}

}

SelectExtractor.prototype.select_option_determine_level_by_text = function ( option_text ) {
  try {

  	var level  = 0;
  	var prefix = this.setting('option_level_prefix');
  	var substr_start = 0;

  	if ( option_text == '' ) {
  		throw 'Blank option text found; could not determine level';
  	}

  	while ( option_text.substr(substr_start, prefix.length) == prefix ) {
   		level++;
   		substr_start += prefix.length;
   	}

   	return level;

  }
  catch(e) {
    throw e;
  }

}


/**
 * Gets a setting by name, or sets if val parameter is present. Checks local settings and falls back to global settings
 * @param {string} key
 * @param {mixed} val (optional)
 * @return none
 */
SelectExtractor.prototype.setting = function ( key, val ) {
  try {

    var ret;

    if ( typeof(val) === 'undefined' ) {
      ret = SelectExtractor.Get_if_set( this.settings, key);

      if ( typeof(ret) == 'undefined' ) {
        ret = SelectExtractor.Get_if_set( SelectExtractor.settings_default(), key );
      }

      return ret;
    }
    else {
      this.settings[key] = val;
    }
  }
  catch(e) {
    throw e;
  }

}

SelectExtractor.prototype.debug = function() {

	if ( this.setting('debug') ) {
		 if ( arguments.length > 0 ) {
    	for ( var i = 0; i < arguments.length; i++ ) {
    		if ( typeof(console) != 'undefined' && typeof(console.log) != 'undefined') {
      		console.log( arguments[i] );
      	}
    	}
  	}
	}

}

SelectExtractor.log = function () {

  if ( arguments.length > 0 ) {
    for ( var i = 0; i < arguments.length; i++ ) {
    	if ( typeof(console) != 'undefined' && typeof(console.log) != 'undefined') {
      	console.log( arguments[i] );
      }
    }
  }
}



/**
 * Utility function to check whether nested object keys are set, without getting a TypeError
 * @param {Object} obj the object whose keys you wish to check
 * @param {String} keys the keys you wish to look for, e,g. ['level1', 'level2']
 * @return {Boolean} true if the key exists, false otherwise
 */
SelectExtractor.Get_if_set = function( obj, keys ) {
  try {
    var ret = undefined;
    eval ('ret = obj' + '.' + keys);
    return ret;
  }
  catch(e) {
    return undefined;
  }
}

SelectExtractor.settings_default = function() {
  return {
  	selectors: {
  		select_input_original: '.menu-parent-select',
  		select_box_container: '.form-type-select'
  	},
  	'select_input_original_hide': true,
  	'option_level_prefix': '--',
  	'option_empty_label': '-Choose-',
  	'option_empty_value': '_none',
  	'debug': false,
  	'select_box_wrapper': {
  		'element': 'div',
  		'classs': 'select-box-extracted__wrapper'
  	}
  	
  }
 }

//
// Set up unique indexes so this script can be called on multiple select boxes
// without getting confused
//
SelectExtractor.unique_index = 0;
SelectExtractor.unique_index_get = function() {

	return SelectExtractor.unique_index++;

}

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = SelectExtractor;
}



