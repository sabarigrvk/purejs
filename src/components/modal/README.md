# Test cases for accessible modal dialog
- Check that role=dialog is an attribute of the container (such as a div) that is used as the custom dialog
- Check that the container is inserted (or made visible) via JavaScript following a user interaction or some other event
- When the dialog is activated, check that focus is set to an element in the container.
- When the dialog is active, check that focus is never set to an element that is not in the container.
- When the dialog is deactivated, check that focus is set to the control that originally activated the dialog.