# App Backup Restore

A powerful Frappe application that provides partial backup and restore functionality for selective data migration and backup operations.

## Features

### Partial Backup
- 📦 **Selective DocType Backup**: Choose specific DocTypes to backup
- 🔍 **Module-wise Filtering**: Filter DocTypes by module for easier selection
- 📊 **Complete Data Export**: Includes both schema and records
- 💾 **ZIP Format**: Compressed backup files for easy storage and transfer
- 📝 **Metadata Included**: Tracks backup creation time, creator, and contents

### Partial Restore
- 📤 **Easy Upload**: Simple file upload interface
- ⚙️ **Flexible Import**: Choose to overwrite or skip existing records
- 📊 **Detailed Summary**: Comprehensive import statistics and error reporting
- 🔄 **Auto DocType Creation**: Creates DocTypes if they don't exist
- 🛡️ **Error Handling**: Graceful error handling with detailed logs

## Use Cases

- **Data Migration**: Move specific data between development, staging, and production
- **Custom DocType Deployment**: Deploy custom DocTypes with sample data
- **Selective Backup**: Backup only critical DocTypes instead of entire site
- **Testing**: Create test data backups for development purposes
- **Module Migration**: Export and import entire custom modules

## Installation

### From Repository

```bash
cd ~/frappe-bench
bench get-app https://github.com/yourusername/app_backup_restore
bench --site your-site-name install-app app_backup_restore
bench restart
```

### From Local Directory

```bash
cd ~/frappe-bench
bench get-app /path/to/app_backup_restore
bench --site your-site-name install-app app_backup_restore
bench restart
```

For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md).

## Quick Start

### Creating a Backup

1. Navigate to **Modules** → **Data Tools** → **Partial Backup**
2. (Optional) Filter by module to narrow down DocTypes
3. Select the DocTypes you want to backup
4. Click **Generate Backup**
5. Download the generated ZIP file

### Restoring a Backup

1. Navigate to **Modules** → **Data Tools** → **Partial Restore**
2. Upload your backup ZIP file
3. Choose whether to overwrite existing records
4. Click **Restore Backup**
5. Review the detailed import summary

For detailed usage instructions, see [USAGE.md](USAGE.md).

## Screenshots

### Partial Backup Page
- Multi-select DocType selection
- Module-wise filtering
- Real-time backup generation

### Partial Restore Page
- File upload interface
- Overwrite options
- Detailed restoration summary

## Technical Details

### Backup Format

Backups are stored as ZIP files containing:
- `backup.json`: Main backup data (DocType schemas + records)
- `README.txt`: Backup metadata and information

### API Methods

The app provides whitelisted API methods:

```python
# Get all DocTypes with modules
app_backup_restore.api.get_doctypes_with_modules()

# Generate partial backup
app_backup_restore.api.generate_partial_backup(selected_doctypes)

# Restore backup
app_backup_restore.api.restore_partial_backup(file_content, overwrite)

# Get available modules
app_backup_restore.api.get_modules()
```

### File Structure

```
app_backup_restore/
├── app_backup_restore/
│   ├── __init__.py
│   ├── api.py                 # Backend API methods
│   └── data_tools/            # Module directory
│       └── page/
│           ├── partial_backup/
│           │   ├── partial_backup.json
│           │   ├── partial_backup.js
│           │   └── __init__.py
│           └── partial_restore/
│               ├── partial_restore.json
│               ├── partial_restore.js
│               └── __init__.py
├── hooks.py                   # App hooks
├── pyproject.toml            # Project configuration
├── README.md                 # This file
├── INSTALLATION.md           # Installation guide
└── USAGE.md                  # Usage guide
```

## Requirements

- Frappe Framework (v14 or higher recommended)
- Python 3.10+
- System Manager role for accessing the pages

## Permissions

By default, both pages are accessible only to users with the **System Manager** role. You can modify permissions through the Role Permission Manager if needed.

## Security

- All API methods use `@frappe.whitelist()` decorator
- File uploads are validated and processed securely
- Base64 encoding for safe file transfer
- Proper error handling and logging

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues:

1. Check the [INSTALLATION.md](INSTALLATION.md) guide
2. Review the [USAGE.md](USAGE.md) documentation
3. Check Frappe Error Log for detailed error messages
4. Open an issue on GitHub

## License

MIT License - see LICENSE file for details

## Credits

Developed for the Frappe Framework ecosystem.

## Changelog

### Version 0.0.1
- Initial release
- Partial Backup page with DocType selection
- Partial Restore page with file upload
- Module-wise filtering
- Comprehensive error handling and reporting
