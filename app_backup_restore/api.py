import frappe
import json
from frappe import _
from frappe.model.meta import get_meta
import zipfile
import io
import base64


@frappe.whitelist()
def get_doctypes_with_modules():
    """
    Get all DocTypes grouped by module
    Returns a list of doctypes with their modules
    """
    doctypes = frappe.get_all(
        "DocType",
        fields=["name", "module", "istable", "issingle"],
        filters={"istable": 0, "issingle": 0, "name": ["not in", ["DocType"]]},
        order_by="module, name"
    )

    # Group by module
    modules = {}
    for doctype in doctypes:
        module = doctype.module
        if module not in modules:
            modules[module] = []
        modules[module].append({
            "name": doctype.name,
            "module": module
        })

    return {
        "doctypes": doctypes,
        "modules": modules
    }


@frappe.whitelist()
def generate_partial_backup(selected_doctypes):
    """
    Generate a partial backup for selected DocTypes
    Args:
        selected_doctypes: JSON string of list of doctype names
    Returns:
        Base64 encoded zip file
    """
    if isinstance(selected_doctypes, str):
        selected_doctypes = json.loads(selected_doctypes)

    if not selected_doctypes:
        frappe.throw(_("Please select at least one DocType"))

    backup_data = {
        "doctypes": {},
        "metadata": {
            "site": frappe.local.site,
            "created_on": frappe.utils.now(),
            "created_by": frappe.session.user,
            "doctype_count": len(selected_doctypes)
        }
    }

    # Collect data for each doctype
    for doctype_name in selected_doctypes:
        try:
            # Get doctype metadata (schema)
            meta = get_meta(doctype_name)
            doctype_def = frappe.get_doc("DocType", doctype_name)

            # Get all records
            records = frappe.get_all(
                doctype_name,
                fields=["*"],
                limit_page_length=0
            )

            # Get full document details for each record
            full_records = []
            for record in records:
                try:
                    doc = frappe.get_doc(doctype_name, record.name)
                    full_records.append(doc.as_dict())
                except Exception as e:
                    frappe.log_error(f"Error fetching record {record.name}: {str(e)}")
                    continue

            backup_data["doctypes"][doctype_name] = {
                "schema": doctype_def.as_dict(),
                "records": full_records,
                "record_count": len(full_records)
            }

        except Exception as e:
            frappe.log_error(f"Error backing up {doctype_name}: {str(e)}")
            frappe.throw(_("Error backing up DocType {0}: {1}").format(doctype_name, str(e)))

    # Create a zip file in memory
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Add the main backup JSON
        backup_json = json.dumps(backup_data, indent=2, default=str)
        zip_file.writestr("backup.json", backup_json)

        # Add a readme
        readme_content = f"""Partial Backup
================
Site: {backup_data['metadata']['site']}
Created: {backup_data['metadata']['created_on']}
Created By: {backup_data['metadata']['created_by']}
DocTypes: {backup_data['metadata']['doctype_count']}

DocTypes included:
{chr(10).join(['- ' + dt for dt in selected_doctypes])}
"""
        zip_file.writestr("README.txt", readme_content)

    # Get the zip file content
    zip_buffer.seek(0)
    zip_content = zip_buffer.read()

    # Encode to base64 for transfer
    encoded_content = base64.b64encode(zip_content).decode('utf-8')

    return {
        "success": True,
        "filename": f"partial_backup_{frappe.utils.now_datetime().strftime('%Y%m%d_%H%M%S')}.zip",
        "content": encoded_content,
        "size": len(zip_content),
        "doctype_count": len(selected_doctypes)
    }


@frappe.whitelist()
def restore_partial_backup(file_content, overwrite=False):
    """
    Restore a partial backup from uploaded file
    Args:
        file_content: Base64 encoded zip file content
        overwrite: Whether to overwrite existing records
    Returns:
        Summary of restoration
    """
    if isinstance(overwrite, str):
        overwrite = overwrite.lower() == "true"

    try:
        # Decode the base64 content
        zip_content = base64.b64decode(file_content)

        # Extract the zip file
        zip_buffer = io.BytesIO(zip_content)
        with zipfile.ZipFile(zip_buffer, 'r') as zip_file:
            # Read the backup JSON
            backup_json = zip_file.read("backup.json").decode('utf-8')
            backup_data = json.loads(backup_json)

        restoration_summary = {
            "success": True,
            "doctypes_processed": [],
            "records_imported": 0,
            "records_skipped": 0,
            "errors": []
        }

        # Process each doctype
        for doctype_name, doctype_data in backup_data["doctypes"].items():
            try:
                doctype_summary = {
                    "doctype": doctype_name,
                    "imported": 0,
                    "skipped": 0,
                    "errors": []
                }

                # Check if doctype exists, if not, create it
                if not frappe.db.exists("DocType", doctype_name):
                    # Create the doctype from schema
                    schema = doctype_data["schema"]
                    doctype_doc = frappe.get_doc(schema)
                    doctype_doc.insert(ignore_permissions=True)
                    frappe.db.commit()

                # Import records
                for record_data in doctype_data["records"]:
                    try:
                        record_name = record_data.get("name")

                        # Check if record exists
                        if frappe.db.exists(doctype_name, record_name):
                            if overwrite:
                                # Delete and recreate
                                frappe.delete_doc(doctype_name, record_name, force=True, ignore_permissions=True)
                            else:
                                doctype_summary["skipped"] += 1
                                restoration_summary["records_skipped"] += 1
                                continue

                        # Create new document
                        doc = frappe.get_doc(record_data)
                        doc.insert(ignore_permissions=True)
                        doctype_summary["imported"] += 1
                        restoration_summary["records_imported"] += 1

                    except Exception as e:
                        error_msg = f"Error importing record {record_name}: {str(e)}"
                        doctype_summary["errors"].append(error_msg)
                        frappe.log_error(error_msg)

                restoration_summary["doctypes_processed"].append(doctype_summary)

            except Exception as e:
                error_msg = f"Error processing DocType {doctype_name}: {str(e)}"
                restoration_summary["errors"].append(error_msg)
                frappe.log_error(error_msg)

        frappe.db.commit()

        return restoration_summary

    except Exception as e:
        frappe.log_error(f"Error restoring backup: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }


@frappe.whitelist()
def get_modules():
    """Get all unique modules"""
    modules = frappe.get_all(
        "DocType",
        fields=["module"],
        distinct=True,
        order_by="module"
    )
    return [m.module for m in modules]
