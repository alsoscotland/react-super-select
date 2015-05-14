#### (Closed Control State)
- **open the dropdown**

Pressing enter when the the control has focus will open the dropdown.

#### (Closed Control State - when tag removal button focused)
- **remove the focused tag** (only applicable to controls with the **tags** property set to true) 

Pressing enter when a tag removal button has focus will remove the tag from the selected values.  After the tag has been removed, focus is moved to the first-available tag removal button.

#### (Opened Control State)
- **Select the currently focused option**

Pressing the enter key selects the option that currently has focus.  In a non-multiselect control, the dropdown will close after the selection is made.

#### Multiselect Specific Behaviors

#### (With ctrl-key or meta-key held down)
- **toggle selection state of the currently focused option**

When the enter key is pressed along with the ctrl-key or meta-key. The currently focused option will be selected, or deselected if it was already selected when clicked


#### (With shift-key held down)
- **select a range of options from last selected to currently focused option**

When the enter key is pressed along with the shift-key while a option has focus, All values in the range from the last selected option to the currently focused option will be selected.  

If no option was previously selected, all options from the first option to the focused option will be selected.

- **deselect a range up to but not including the focused option**

If the focused option has already been selected when the user clicks enter along with the shift-key, any selected options in the range between the last selected option and the focused option will be deselected.  The focused option will remain selected in this case.



