# CSV Block Editor For Survivalcraft

A VS Code extension for editing Survivalcraft mod block data files in a spreadsheet-like table view.

## Features

- **Table View Toggle**: Click the table icon in the editor title bar to switch between text view and table view
- **Spreadsheet Editing**: Edit cells directly, navigate with `Tab`, navigate rows with `Enter`
- **Chinese Field Mapping**: Column headers display Chinese names while the underlying data uses English field names
- **Data Type Annotations**: A dedicated type row displays the data type of each column
- **Column Resizing**: Drag column borders in the header row to resize columns
- **Real-time Sync**: Edits in table view immediately update the underlying text content
- **Seamless Save**: Press `Ctrl+S` to save — the original `.csv` or `.txt` file is overwritten directly
- **Dark Theme Optimized**: All colors use opaque values for consistent appearance in VS Code dark themes

## Usage

1. Open a `.csv` or `.txt` block data file in VS Code
2. Click the **table icon** in the editor title bar (top-right)
3. Edit cells in the table view
4. Press `Ctrl+S` to save changes back to the original file
5. Click the table icon again to switch back to text view

## Supported File Format

- Semicolon-separated values (`;`)
- Fields containing `;`, `"`, or newlines are quoted with doubled double-quotes
- First row: column headers (field names)
- Second row: data type annotations
- Subsequent rows: data

## Requirements

- VS Code 1.85.0 or higher

## Extension Settings

No configuration required. The extension activates automatically when VS Code starts.

## Known Issues

None.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

## License

MIT
