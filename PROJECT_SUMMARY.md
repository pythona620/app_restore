# App Backup - Project Summary

## Overview

This is a complete Frappe application that provides partial backup and restore functionality. The app allows users to selectively backup specific DocTypes and restore them on the same or different Frappe sites.

## Project Structure

```
app_backup_restore/
├── __init__.py                           # App version
├── hooks.py                              # Frappe app hooks
├── pyproject.toml                        # Python project configuration
├── LICENSE                               # MIT License
├── README.md                             # Main documentation
├── INSTALLATION.md                       # Installation instructions
├── USAGE.md                             # Usage guide
├── .gitignore                           # Git ignore rules
│
└── app_backup_restore/                          # Main app directory
    ├── __init__.py
    ├── api.py                           # Backend API methods
    │
    └── data_tools/                      # Data Tools module
        ├── __init__.py
        └── page/                        # Custom pages
            ├── __init__.py
            ├── partial_backup/          # Partial Backup page
            │   ├── __init__.py
            │   ├── partial_backup.json  # Page definition
            │   └── partial_backup.js    # Frontend logic
            │
            └── partial_restore/         # Partial Restore page
                ├── __init__.py
                ├── partial_restore.json # Page definition
                └── partial_restore.js   # Frontend logic
```

## Components

### 1. Backend API (`app_backup_restore/api.py`)

Four main API methods:

1. **`get_doctypes_with_modules()`**
   - Returns all DocTypes grouped by module
   - Used to populate the DocType selector

2. **`get_modules()`**
   - Returns all unique modules
   - Used for module filtering

3. **`generate_partial_backup(selected_doctypes)`**
   - Creates a backup of selected DocTypes
   - Includes both schema and records
   - Returns base64-encoded ZIP file

4. **`restore_partial_backup(file_content, overwrite)`**
   - Restores DocTypes from backup file
   - Can create missing DocTypes
   - Returns detailed restoration summary

### 2. Partial Backup Page

**Location**: `app_backup_restore/data_tools/page/partial_backup/`

**Features**:
- DocType selection with checkboxes
- Module-wise filtering dropdown
- Select All / Deselect All buttons
- Real-time backup generation
- Automatic file download
- Progress indicators

**Workflow**:
1. Load all DocTypes from server
2. Display grouped by module
3. Allow filtering by module
4. Generate backup on button click
5. Download ZIP file automatically

### 3. Partial Restore Page

**Location**: `app_backup_restore/data_tools/page/partial_restore/`

**Features**:
- File upload interface
- Overwrite option checkbox
- Detailed restoration summary
- Per-DocType statistics
- Error reporting
- Progress indicators

**Workflow**:
1. Upload backup ZIP file
2. Read and encode file to base64
3. Send to server for processing
4. Display detailed summary with statistics
5. Show any errors encountered

## Key Features

### Backup Features
- Selective DocType backup
- Module-based filtering
- Complete schema export
- All records included
- ZIP compression
- Metadata tracking

### Restore Features
- Auto DocType creation
- Overwrite control
- Error handling
- Detailed logging
- Progress tracking
- Summary statistics

## Installation Steps

1. **Get the app**:
   ```bash
   cd ~/frappe-bench
   bench get-app /path/to/app_backup_restore
   ```

2. **Install on site**:
   ```bash
   bench --site your-site install-app app_backup_restore
   ```

3. **Build and restart**:
   ```bash
   bench build
   bench restart
   ```

## Usage Flow

### Creating a Backup

```
User Interface Flow:
┌─────────────────────────────────────┐
│  1. Navigate to Partial Backup      │
│  2. Filter by module (optional)     │
│  3. Select DocTypes                 │
│  4. Click Generate Backup           │
│  5. Download ZIP file               │
└─────────────────────────────────────┘

Backend Processing:
┌─────────────────────────────────────┐
│  1. Receive selected DocTypes       │
│  2. Fetch DocType schemas           │
│  3. Fetch all records               │
│  4. Create JSON backup data         │
│  5. Compress to ZIP                 │
│  6. Encode to base64                │
│  7. Return to frontend              │
└─────────────────────────────────────┘
```

### Restoring a Backup

```
User Interface Flow:
┌─────────────────────────────────────┐
│  1. Navigate to Partial Restore     │
│  2. Upload backup ZIP file          │
│  3. Choose overwrite option         │
│  4. Click Restore Backup            │
│  5. Review summary                  │
└─────────────────────────────────────┘

Backend Processing:
┌─────────────────────────────────────┐
│  1. Decode base64 file              │
│  2. Extract ZIP contents            │
│  3. Parse backup JSON               │
│  4. For each DocType:               │
│     a. Check if exists              │
│     b. Create if missing            │
│     c. Import records               │
│     d. Handle duplicates            │
│  5. Generate summary                │
│  6. Return to frontend              │
└─────────────────────────────────────┘
```

## Data Format

### Backup ZIP Structure

```
partial_backup_YYYYMMDD_HHMMSS.zip
├── backup.json                 # Main backup data
└── README.txt                  # Backup metadata
```

### backup.json Structure

```json
{
  "metadata": {
    "site": "example.site",
    "created_on": "2025-01-07 18:00:00",
    "created_by": "user@example.com",
    "doctype_count": 5
  },
  "doctypes": {
    "DocType Name": {
      "schema": { /* DocType definition */ },
      "records": [ /* Array of records */ ],
      "record_count": 10
    }
  }
}
```

## Security Considerations

1. **Access Control**: Only System Manager role by default
2. **API Whitelisting**: All APIs use `@frappe.whitelist()`
3. **Input Validation**: File content and DocType names validated
4. **Error Handling**: Graceful error handling with logging
5. **Base64 Encoding**: Safe file transfer over HTTP

## Technical Specifications

### Dependencies
- Frappe Framework (v14+)
- Python 3.10+
- Standard library: `json`, `zipfile`, `io`, `base64`

### Browser Compatibility
- Modern browsers with FileReader API support
- JavaScript ES6+ features used

### Performance Considerations
- Large DocTypes may take time to backup/restore
- File size limited by browser memory for download
- Server memory usage scales with data volume

## Testing Checklist

- [ ] Install app on test site
- [ ] Verify pages appear in Data Tools module
- [ ] Test DocType selection interface
- [ ] Test module filtering
- [ ] Generate backup with single DocType
- [ ] Generate backup with multiple DocTypes
- [ ] Verify ZIP file download
- [ ] Test restore without overwrite
- [ ] Test restore with overwrite
- [ ] Verify error handling
- [ ] Check restoration summary
- [ ] Test with large data sets
- [ ] Test with custom DocTypes
- [ ] Test permissions

## Future Enhancements

Potential improvements:
1. Scheduled backups
2. Backup history/versioning
3. Incremental backups
4. Cloud storage integration
5. Backup encryption
6. Email notifications
7. Backup verification
8. Selective field backup
9. Batch processing for large data
10. Progress bars for long operations

## Troubleshooting

### Common Issues

1. **Pages not visible**
   - Run: `bench clear-cache && bench migrate && bench build`

2. **Permission errors**
   - Ensure user has System Manager role

3. **Large file issues**
   - Increase server timeout settings
   - Split into multiple backups

4. **Import failures**
   - Check error log for details
   - Verify DocType compatibility

## API Examples

### Python

```python
import frappe

# Generate backup
result = frappe.call(
    'app_backup_restore.api.generate_partial_backup',
    selected_doctypes=['User', 'Role']
)

# Restore backup
summary = frappe.call(
    'app_backup_restore.api.restore_partial_backup',
    file_content=base64_content,
    overwrite=False
)
```

### JavaScript

```javascript
// Generate backup
frappe.call({
    method: 'app_backup_restore.api.generate_partial_backup',
    args: {
        selected_doctypes: ['User', 'Role']
    },
    callback: function(r) {
        console.log(r.message);
    }
});

// Restore backup
frappe.call({
    method: 'app_backup_restore.api.restore_partial_backup',
    args: {
        file_content: base64Content,
        overwrite: false
    },
    callback: function(r) {
        console.log(r.message);
    }
});
```

## Credits

- Built with Frappe Framework
- Uses standard Python and JavaScript libraries
- MIT License

## Version History

### v0.0.1 (Initial Release)
- Partial Backup page
- Partial Restore page
- Module-wise filtering
- Complete documentation
- Error handling
- Detailed summaries

---

**Note**: This app is production-ready but should be thoroughly tested in your environment before use in production systems. Always maintain proper backups of your data.
