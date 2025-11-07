frappe.pages['partial-backup'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Partial Backup',
		single_column: true
	});

	page.main.html(`
		<div class="partial-backup-container">
			<div class="card" style="margin-bottom: 20px;">
				<div class="card-body">
					<h5 class="card-title">Create Partial Backup</h5>
					<p class="text-muted">Select DocTypes to include in your backup. You can filter by module to narrow down your selection.</p>

					<div class="form-group" style="margin-top: 20px;">
						<label>Filter by Module</label>
						<select class="form-control" id="module-filter" style="max-width: 400px;">
							<option value="">All Modules</option>
						</select>
					</div>

					<div class="form-group" style="margin-top: 20px;">
						<label>Select DocTypes</label>
						<div class="help-block">Select the DocTypes you want to backup</div>
						<div id="doctype-selector" style="margin-top: 10px;">
							<div class="text-muted">Loading DocTypes...</div>
						</div>
					</div>

					<div style="margin-top: 20px;">
						<button class="btn btn-primary" id="generate-backup-btn">
							<i class="fa fa-download"></i> Generate Backup
						</button>
						<button class="btn btn-secondary" id="select-all-btn" style="margin-left: 10px;">
							Select All
						</button>
						<button class="btn btn-secondary" id="deselect-all-btn" style="margin-left: 10px;">
							Deselect All
						</button>
					</div>

					<div id="backup-status" style="margin-top: 20px;"></div>
				</div>
			</div>
		</div>
	`);

	let all_doctypes = [];
	let filtered_doctypes = [];

	// Load doctypes and modules
	function load_doctypes() {
		frappe.call({
			method: 'app_backup_restore.api.get_doctypes_with_modules',
			callback: function(r) {
				if (r.message) {
					all_doctypes = r.message.doctypes;

					// Populate module filter
					let modules = Object.keys(r.message.modules).sort();
					let module_select = page.main.find('#module-filter');
					modules.forEach(function(module) {
						module_select.append(`<option value="${module}">${module}</option>`);
					});

					// Display all doctypes initially
					display_doctypes(all_doctypes);
				}
			}
		});
	}

	// Display doctypes as checkboxes
	function display_doctypes(doctypes) {
		filtered_doctypes = doctypes;
		let html = '<div style="max-height: 400px; overflow-y: auto; border: 1px solid #d1d8dd; padding: 15px; border-radius: 4px; background: #f8f9fa;">';

		if (doctypes.length === 0) {
			html += '<div class="text-muted">No DocTypes found</div>';
		} else {
			let current_module = '';
			doctypes.forEach(function(dt) {
				if (current_module !== dt.module) {
					if (current_module !== '') {
						html += '</div>';
					}
					current_module = dt.module;
					html += `<div style="margin-bottom: 15px;">
						<strong style="color: #5e64ff;">${dt.module}</strong>
						<div style="margin-left: 20px; margin-top: 5px;">`;
				}
				html += `
					<div class="checkbox" style="margin: 5px 0;">
						<label style="font-weight: normal;">
							<input type="checkbox" class="doctype-checkbox" value="${dt.name}">
							${dt.name}
						</label>
					</div>
				`;
			});
			if (current_module !== '') {
				html += '</div>';
			}
		}

		html += '</div>';
		page.main.find('#doctype-selector').html(html);
	}

	// Module filter change event
	page.main.on('change', '#module-filter', function() {
		let selected_module = $(this).val();
		if (selected_module === '') {
			display_doctypes(all_doctypes);
		} else {
			let filtered = all_doctypes.filter(dt => dt.module === selected_module);
			display_doctypes(filtered);
		}
	});

	// Select all button
	page.main.on('click', '#select-all-btn', function() {
		page.main.find('.doctype-checkbox').prop('checked', true);
	});

	// Deselect all button
	page.main.on('click', '#deselect-all-btn', function() {
		page.main.find('.doctype-checkbox').prop('checked', false);
	});

	// Generate backup button
	page.main.on('click', '#generate-backup-btn', function() {
		let selected_doctypes = [];
		page.main.find('.doctype-checkbox:checked').each(function() {
			selected_doctypes.push($(this).val());
		});

		if (selected_doctypes.length === 0) {
			frappe.msgprint(__('Please select at least one DocType'));
			return;
		}

		let status_div = page.main.find('#backup-status');
		status_div.html(`
			<div class="alert alert-info">
				<i class="fa fa-spinner fa-spin"></i>
				Generating backup for ${selected_doctypes.length} DocType(s)...
			</div>
		`);

		frappe.call({
			method: 'app_backup_restore.api.generate_partial_backup',
			args: {
				selected_doctypes: selected_doctypes
			},
			callback: function(r) {
				if (r.message && r.message.success) {
					status_div.html(`
						<div class="alert alert-success">
							<i class="fa fa-check"></i>
							Backup generated successfully!
							(${r.message.doctype_count} DocTypes, ${(r.message.size / 1024).toFixed(2)} KB)
						</div>
					`);

					// Download the file
					download_backup(r.message.filename, r.message.content);
				} else {
					status_div.html(`
						<div class="alert alert-danger">
							<i class="fa fa-times"></i>
							Error generating backup. Please check the error log.
						</div>
					`);
				}
			},
			error: function(r) {
				status_div.html(`
					<div class="alert alert-danger">
						<i class="fa fa-times"></i>
						Error: ${r.message || 'Unknown error'}
					</div>
				`);
			}
		});
	});

	// Download backup file
	function download_backup(filename, base64_content) {
		// Convert base64 to blob
		let binary = atob(base64_content);
		let array = [];
		for (let i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		let blob = new Blob([new Uint8Array(array)], {type: 'application/zip'});

		// Create download link
		let link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = filename;
		link.click();
	}

	// Initialize
	load_doctypes();
};
