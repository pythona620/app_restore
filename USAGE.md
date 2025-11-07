# Usage Guide

## Partial Backup

The Partial Backup page allows you to create backups of selected DocTypes.

### Steps to Create a Backup

1. **Navigate to the Page**
   - Go to **Modules** > **Data Tools** > **Partial Backup**

2. **Filter DocTypes (Optional)**
   - Use the **Filter by Module** dropdown to narrow down DocTypes by module
   - This helps when you have many DocTypes and want to focus on a specific module

3. **Select DocTypes**
   - Check the boxes next to the DocTypes you want to backup
   - Use **Select All** to select all visible DocTypes
   - Use **Deselect All** to clear all selections

4. **Generate Backup**
   - Click the **Generate Backup** button
   - The system will create a backup containing:
     - DocType schemas (structure)
     - All records for selected DocTypes
   - A progress indicator will show the operation status

5. **Download**
   - Once complete, a ZIP file will automatically download
   - The filename format: `partial_backup_YYYYMMDD_HHMMSS.zip`
   - The backup includes:
     - `backup.json` - Main backup data
     - `README.txt` - Backup metadata

### Backup Contents

The backup file contains:
- **DocType Schemas**: Complete structure definition
- **Records**: All data for each selected DocType
- **Metadata**: Site name, creation time, creator, DocType count

## Partial Restore

The Partial Restore page allows you to import backups created with the Partial Backup page.

### Steps to Restore a Backup

1. **Navigate to the Page**
   - Go to **Modules** > **Data Tools** > **Partial Restore**

2. **Upload Backup File**
   - Click **Choose File** or drag and drop your backup ZIP file
   - The file will be loaded and validated
   - File info will display (name and size)

3. **Choose Restore Options**
   - **Overwrite existing records**:
     - Checked: Existing records with same names will be deleted and replaced
     - Unchecked: Existing records will be skipped (default)

4. **Restore Backup**
   - Click the **Restore Backup** button
   - Confirm the operation in the dialog
   - A progress indicator will show during restoration

5. **Review Summary**
   - After completion, a detailed summary shows:
     - Total records imported
     - Total records skipped
     - DocTypes processed
   - A detailed table shows per-DocType statistics
   - Any errors encountered are displayed

### Restore Behavior

- **New DocTypes**: If a DocType doesn't exist, it will be created from the schema
- **Existing DocTypes**: Only records are imported
- **Overwrite Mode**:
  - Enabled: Deletes existing records before importing
  - Disabled: Skips records that already exist
- **Error Handling**: Errors are logged but don't stop the entire process

## Best Practices

### Before Backup

1. **Review DocTypes**: Make sure you select only the DocTypes you need
2. **Check Dependencies**: Some DocTypes depend on others (e.g., Child DocTypes)
3. **Consider Size**: Large DocTypes with many records may take time to backup

### Before Restore

1. **Full Backup**: Always create a full site backup before restoring
   ```bash
   bench --site your-site backup --with-files
   ```

2. **Test Environment**: Test the restore on a staging site first

3. **Check Conflicts**: Review if you want to overwrite existing records

4. **Dependencies**: Ensure dependent DocTypes are included in the backup

### During Operations

- **Don't Navigate Away**: Wait for operations to complete
- **Large Backups**: For large datasets, be patient - operations may take several minutes
- **Monitor Status**: Watch the progress indicators and status messages

### After Restore

1. **Review Summary**: Check the detailed import summary
2. **Verify Data**: Spot-check restored records for accuracy
3. **Check Error Log**: Review any errors in the Frappe Error Log
4. **Test Functionality**: Verify that restored DocTypes work as expected

## Common Use Cases

### 1. Migrating Custom DocTypes

Create a backup of custom DocTypes from one site and restore to another:
- Select only custom DocTypes
- Generate backup
- Upload to target site
- Restore with overwrite disabled

### 2. Development to Production

Move development data to production:
- Filter by your custom module
- Select relevant DocTypes
- Backup from dev site
- Restore to production with caution

### 3. Backup Before Changes

Before making major changes:
- Backup affected DocTypes
- Make changes
- If issues occur, restore from backup

### 4. Data Migration

Migrate specific data between sites:
- Select source DocTypes
- Generate backup
- Restore to target site
- Review and verify

## Troubleshooting

### Backup Issues

**Problem**: Backup takes too long
- **Solution**: Select fewer DocTypes or DocTypes with fewer records

**Problem**: Backup fails
- **Solution**: Check error log, ensure you have permissions, verify DocTypes exist

**Problem**: Downloaded file is empty
- **Solution**: Check browser console, ensure pop-ups are allowed

### Restore Issues

**Problem**: Restore fails with permission errors
- **Solution**: Ensure you have System Manager role or appropriate permissions

**Problem**: Records not imported
- **Solution**: Check if overwrite is disabled and records already exist

**Problem**: DocType creation fails
- **Solution**: Some system DocTypes cannot be created - only select custom DocTypes

**Problem**: Partial import
- **Solution**: Review the detailed error messages in the summary table

## Security Considerations

1. **Access Control**: Only grant access to trusted users
2. **Backup Storage**: Store backup files securely
3. **Sensitive Data**: Be aware of sensitive data in backups
4. **Audit Trail**: Backups include creator and timestamp information
5. **Production Caution**: Extra care when restoring to production sites

## API Usage

The app also provides Python APIs that can be used in scripts:

```python
import frappe
from app_backup_restore.api import generate_partial_backup, restore_partial_backup

# Generate backup
result = generate_partial_backup(['User', 'Role'])

# Restore backup
summary = restore_partial_backup(file_content, overwrite=False)
```

## Performance Tips

1. **Batch Operations**: For very large DocTypes, consider multiple smaller backups
2. **Off-Peak Hours**: Run large operations during low-traffic periods
3. **Network**: Ensure stable network connection for uploads/downloads
4. **Resources**: Ensure adequate server resources for large operations
