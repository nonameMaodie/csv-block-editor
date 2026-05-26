# Change Log

## [0.3.1]

### Fixed

- **Table view works after moving to new window**: Fixed the issue where the table view became a black screen when the tab was dragged to a new window. Added `requestInit` message handling to re-initialize the webview with data when it gets recreated, and implemented `getState`/`setState` persistence to preserve data across webview reconstruction.

## [0.3.0]

### Added

- **Column resizing**: Drag the border between column headers to resize columns. A visual indicator appears on hover.
- **Toast notifications**: Save feedback now uses non-intrusive floating toasts instead of inline status messages.
- **Real-time sync**: Editing a cell in table view immediately updates the underlying text document content (marked as dirty).
- **Plugin icon**: Added a custom extension icon.

### Changed

- **Streamlined table view**: Removed title, instructions, save button, back-to-text button, and file name display. The table now fills the entire view area. Use the editor title bar icon to toggle views and `Ctrl+S` to save.
- **Opaque row backgrounds**: All alternating row colors and header backgrounds now use fully opaque colors for consistent appearance.
- **Improved highlight colors**: Row highlight and active cell colors are now more distinct and easier to see.
- **Darker type row**: The data-type annotation row now has a darker background to visually separate it from the header.

### Fixed

- **CSP compliance**: Replaced inline event handlers (`onfocus`, `onblur`) with event delegation (`addEventListener`) to comply with WebView Content Security Policy, fixing the issue where cell edits were not saved.
- **Sticky header scrolling**: Fixed type row not scrolling correctly with the header when scrolling vertically.
- **Type row z-index**: Fixed type row first column not overlaying other columns during horizontal scroll due to CSS specificity conflict.

## [0.2.0]

### Added

- **Toggle button in editor title bar**: A table icon button appears in the top-right corner when viewing `.csv` or `.txt` files. Click it to switch between text view and table view.
- **Seamless view switching**: Toggling back to text view preserves the latest saved content.

### Changed

- **Architecture refactor**: Migrated from Custom Editor Provider to command-driven WebView panel approach, allowing the default text editor to remain active alongside the table view.

## [0.1.0]

### Added

- Initial release with basic CSV/TXT table editing functionality.
- Semicolon-separated CSV parsing and generation.
- Chinese field name mapping for Survivalcraft block data.
- Data type annotation row.
- Sticky headers and first column.
- Row highlighting on cell focus.
- Tab key navigation between cells.
- Save to original file via `Ctrl+S`.
