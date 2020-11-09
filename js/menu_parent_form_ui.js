/**
 * @file
 * Behavior which initializes the select_extractor library for the menu node form
 */

(function (Drupal, DrupalSettings) {
  'use strict';

  Drupal.behaviors.menu_parent_form_ui = {
    attach: function (context, settings) {

      if ( context === document ) {
        var active_set = DrupalSettings.active_set;
        if ( document.querySelector('#edit-menu-parent') ) {
          var select_extract_menu_form = new SelectExtractor(
            {
              selectors: {
                select_input_original: '#edit-menu-parent',
                select_box_container: '.form-item-menu-parent',
                active_set: active_set,
             }
            }
          );
        }
        else {
          var select_extract_node_form = new SelectExtractor(
            {
              selectors: {
                select_input_original: '.menu-parent-select',
                select_box_container: '.form-item-menu-menu-parent',
                active_set: active_set,
              }
            }
          );
        }
      }

    }
  };
})(Drupal, drupalSettings);
