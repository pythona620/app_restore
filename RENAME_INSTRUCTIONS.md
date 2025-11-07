# Directory Rename Instructions

All the code and documentation have been successfully updated from `app_abckup` to `app_backup_restore`.

## Final Step: Rename Root Directory

The root directory name needs to be changed manually because the CLI is currently working within it.

### Windows Instructions

1. **Close this terminal/CLI session**
2. **Navigate to**: `C:\Users\CaratRED\Desktop\`
3. **Right-click** the `app_abckup` folder
4. **Select** "Rename"
5. **Change name to**: `app_backup_restore`

### Alternative (Command Line)

Open a **new** terminal/command prompt (not in the app directory):

```bash
cd C:\Users\CaratRED\Desktop
rename app_abckup app_backup_restore
```

Or in PowerShell:

```powershell
cd C:\Users\CaratRED\Desktop
Rename-Item app_abckup app_backup_restore
```

## Verification

After renaming, verify the structure:

```
app_backup_restore/              # Root directory (manually renamed)
├── app_backup_restore/          # Inner app directory (already renamed)
│   ├── api.py
│   └── data_tools/
│       └── page/
│           ├── partial_backup/
│           └── partial_restore/
├── hooks.py                     # Updated ✓
├── pyproject.toml              # Updated ✓
├── README.md                   # Updated ✓
└── [all other files]           # Updated ✓
```

## What Has Been Updated

✅ **App name in hooks.py**: `app_name = "app_backup_restore"`
✅ **Package name in pyproject.toml**: `name = "app_backup_restore"`
✅ **Inner directory**: `app_backup_restore/` (contains api.py and pages)
✅ **JavaScript API calls**: Updated to `app_backup_restore.api.*`
✅ **All documentation files**: Updated references throughout
✅ **All commented code paths**: Updated for consistency

## Installation After Rename

Once the root directory is renamed, you can install the app:

```bash
cd ~/frappe-bench
bench get-app /c/Users/CaratRED/Desktop/app_backup_restore
bench --site your-site install-app app_backup_restore
bench restart
```

The app will now be recognized as `app_backup_restore` throughout the Frappe system.
