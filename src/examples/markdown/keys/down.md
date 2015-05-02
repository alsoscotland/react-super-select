
#### (Closed Control State)
- **open the option dropdown**

When the control's main element is focused.  Pressing the down arrow key will open the dropdown. (It can also be pressed with the alt-key with the same result)

#### (Opened Control State)
- **navigation of options**

Pressing the down-arrow key when the drop is open will move focus down to the next selectable option.  If the **searchable** prop is true, The first press will focus the search input field.

#### Multiselect Specific Behaviors

#### (With shift-key held down)
- **select focused option and move focus down**

If the down arrow is pressed with the shift-key in a **multiselect** or **tags** control, the focused option will be selected (or deselected if alreadySelected), and the focus will move down to the next available option.

