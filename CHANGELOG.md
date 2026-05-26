# Change Log（更新日志）

## [0.3.1]

### Fixed（修复）

- **Table view works after moving to new window**（移动到新窗口后表格视图正常显示）
  （修复了将标签页拖动到新窗口时表格视图变成黑屏的问题。新增 `requestInit` 消息处理，在 webview 重新创建时重新初始化数据，并使用 `getState`/`setState` 持久化数据以在 webview 重建时保留数据。）

## [0.3.0]

### Added（新增）

- **Column resizing**（列宽调整）：Drag the border between column headers to resize columns. A visual indicator appears on hover.
  （拖动标题行中的列边框来调整列宽，悬停时会显示视觉指示器。）
- **Toast notifications**（Toast 通知）：Save feedback now uses non-intrusive floating toasts instead of inline status messages.
  （保存反馈现在使用非侵入式的浮动 Toast 通知，而非内联状态消息。）
- **Real-time sync**（实时同步）：Editing a cell in table view immediately updates the underlying text document content (marked as dirty).
  （在表格视图中编辑单元格时会立即更新底层文本内容（标记为脏）。）
- **Plugin icon**（插件图标）：Added a custom extension icon.
  （添加了自定义扩展图标。）

### Changed（更改）

- **Streamlined table view**（精简表格视图）：Removed title, instructions, save button, back-to-text button, and file name display. The table now fills the entire view area. Use the editor title bar icon to toggle views and `Ctrl+S` to save.
  （移除了标题、操作说明、保存按钮、返回文本按钮和文件名显示。表格现在占满整个视图区域。使用编辑器标题栏图标切换视图，用 `Ctrl+S` 保存。）
- **Opaque row backgrounds**（不透明行背景）：All alternating row colors and header backgrounds now use fully opaque colors for consistent appearance.
  （所有交替行颜色和标题背景现在使用完全不透明的颜色，以保持一致的视觉效果。）
- **Improved highlight colors**（改进高亮颜色）：Row highlight and active cell colors are now more distinct and easier to see.
  （行高亮和活动单元格颜色现在更加鲜明，更容易辨认。）
- **Darker type row**（更深的类型行）：The data-type annotation row now has a darker background to visually separate it from the header.
  （数据类型标注行现在有更深的背景色，以与标题行视觉上区分开来。）

### Fixed（修复）

- **CSP compliance**（CSP 合规）：Replaced inline event handlers (`onfocus`, `onblur`) with event delegation (`addEventListener`) to comply with WebView Content Security Policy, fixing the issue where cell edits were not saved.
  （将内联事件处理器（`onfocus`、`onblur`）替换为事件委托（`addEventListener`），以符合 WebView 内容安全策略，解决了单元格编辑未被保存的问题。）
- **Sticky header scrolling**（粘性标题滚动）：Fixed type row not scrolling correctly with the header when scrolling vertically.
  （修复了垂直滚动时类型行未能与标题正确同步滚动的问题。）
- **Type row z-index**（类型行 z-index）：Fixed type row first column not overlaying other columns during horizontal scroll due to CSS specificity conflict.
  （修复了由于 CSS 特异性冲突导致类型行首列在水平滚动时未能正确覆盖其他列的问题。）

## [0.2.0]

### Added（新增）

- **Toggle button in editor title bar**（编辑器标题栏中的切换按钮）：A table icon button appears in the top-right corner when viewing `.csv` or `.txt` files. Click it to switch between text view and table view.
  （在查看 `.csv` 或 `.txt` 文件时，右上角会显示一个表格图标按钮。点击它可以在文本视图和表格视图之间切换。）
- **Seamless view switching**（无缝视图切换）：Toggling back to text view preserves the latest saved content.
  （切换回文本视图时会保留最新保存的内容。）

### Changed（更改）

- **Architecture refactor**（架构重构）：Migrated from Custom Editor Provider to command-driven WebView panel approach, allowing the default text editor to remain active alongside the table view.
  （从自定义编辑器提供程序迁移到命令驱动的 WebView 面板方案，允许默认文本编辑器与表格视图同时保持活动状态。）

## [0.1.0]

### Added（新增）

- Initial release with basic CSV/TXT table editing functionality.
  （首次发布，具备基本的 CSV/TXT 表格编辑功能。）
- Semicolon-separated CSV parsing and generation.
  （分号分隔的 CSV 解析和生成。）
- Chinese field name mapping for Survivalcraft block data.
  （生存战争方块数据的中文字段名映射。）
- Data type annotation row.
  （数据类型标注行。）
- Sticky headers and first column.
  （粘性标题和首列。）
- Row highlighting on cell focus.
  （单元格获得焦点时行高亮。）
- Tab key navigation between cells.
  （Tab 键在单元格间导航。）
- Save to original file via `Ctrl+S`.
  （通过 `Ctrl+S` 保存到原始文件。）
