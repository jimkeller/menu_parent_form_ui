[menu_parent_form_ui_screenshot]: https://jimkeller.github.io/menu_parent_form_ui/images/drupal-menu-parent-form-ui.png

# Menu Parent Form UI

A module for Drupal 8

![Drupal better menu selector for big menus screenshot][menu_parent_form_ui_screenshot]

A better user interface for choosing parent menu items in Drupal. This is a client-side solution that applies a hierarchical select feature to the choosing of parent menu items in Drupal 8. 

When a menu in Drupal gets too big, the select dropdown for choosing a parent menu item becomes unusable. This module changes the single dropdown into multiple cascading dropdowns on both the node edit form and the menu add link form.

# Instructions

Just enable the module, and you should see cascading/hierarchical menus for choosing parent menu items on the node edit form and when adding menus from structure > menus

# Notes/Future Support

This is a client-side module that uses javascript to extract the menu levels by looking at the number of dashes at the beginning of the option text (e.g. "--About" vs "----Our History"). Drupal includes the dashes by default when printing this option list, but this approach relies on that always being the case. It will break if Drupal changes the structure of that options list in the future and removes the dashes. (I'm not sure why this would happen, but just noting it here).

This module should be a temporary solution for the problem; something better is needed. Probably this should be merged with [Client Side Hierarchical Select](https://www.drupal.org/project/cshs). They accomplish nearly the same thing, though [cshs is only for taxonomy terms as of this writing](https://www.drupal.org/project/cshs/issues/2657876).


