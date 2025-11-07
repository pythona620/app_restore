frappe.pages['partial-restore'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Partial Restore',
		single_column: true
	});

	page.main.html(`
		<div class="partial-restore-container">
			<div class="card" style="margin-bottom: 20px;">
				<div class="card-body">
					<h5 class="card-title">Restore Partial Backup</h5>
					<p class="text-muted">Upload a backup file created using the Partial Backup page to restore DocTypes and their records.</p>

					<div class="alert alert-warning" style="margin-top: 20px;">
						<i class="fa fa-exclamation-triangle"></i>
						<strong>Warning:</strong> This operation will import DocTypes and records into your system.
						Make sure you have a full backup before proceeding.
					</div>

					<div class="form-group" style="margin-top: 20px;">
						<label>Upload Backup File</label>
						<div class="help-block">Select a .zip backup file</div>
						<input type="file" class="form-control-file" id="backup-file-input" accept=".zip" style="margin-top: 10px;">
					</div>

					<div class="form-group" style="margin-top: 20px;">
						<label>
							<input type="checkbox" id="overwrite-checkbox">
							Overwrite existing records
						</label>
						<div class="help-block">If checked, existing records with the same name will be deleted and replaced</div>
					</div>

					<div style="margin-top: 20px;">
						<button class="btn btn-primary" id="restore-backup-btn" disabled>
							<i class="fa fa-upload"></i> Restore Backup
						</button>
					</div>

					<div id="restore-status" style="margin-top: 20px;"></div>
				</div>
			</div>
		</div>
	`);

	let backup_file_content = null;

	// File input change event
	page.main.on('change', '#backup-file-input', function(e) {
		let file = e.target.files[0];
		if (file) {
			// Read file as base64
			let reader = new FileReader();
			reader.onload = function(event) {
				// Extract base64 content (remove data:application/zip;base64, prefix)
				let base64 = event.target.result.split(',')[1];
				backup_file_content = base64;
				page.main.find('#restore-backup-btn').prop('disabled', false);

				page.main.find('#restore-status').html(`
					<div class="alert alert-info">
						<i class="fa fa-file"></i>
						File loaded: ${file.name} (${(file.size / 1024).toFixed(2)} KB)
					</div>
				`);
			};
			reader.readAsDataURL(file);
		}
	});

	// Restore backup button
	page.main.on('click', '#restore-backup-btn', function() {
		if (!backup_file_content) {
			frappe.msgprint(__('Please select a backup file'));
			return;
		}

		let overwrite = page.main.find('#overwrite-checkbox').is(':checked');

		frappe.confirm(
			__('Are you sure you want to restore this backup? This will import DocTypes and records into your system.'),
			function() {
				let status_div = page.main.find('#restore-status');
				status_div.html(`
					<div class="alert alert-info">
						<i class="fa fa-spinner fa-spin"></i>
						Restoring backup... This may take a few minutes.
					</div>
				`);

				// Disable button during restore
				page.main.find('#restore-backup-btn').prop('disabled', true);

				frappe.call({
					method: 'app_backup_restore.api.restore_partial_backup',
					args: {
						file_content: backup_file_content,
						overwrite: overwrite
					},
					callback: function(r) {
						// Re-enable button
						page.main.find('#restore-backup-btn').prop('disabled', false);

						if (r.message && r.message.success) {
							display_restore_summary(r.message);
						} else {
							status_div.html(`
								<div class="alert alert-danger">
									<i class="fa fa-times"></i>
									<strong>Error:</strong> ${r.message.error || 'Unknown error occurred'}
								</div>
							`);
						}
					},
					error: function(r) {
						page.main.find('#restore-backup-btn').prop('disabled', false);
						status_div.html(`
							<div class="alert alert-danger">
								<i class="fa fa-times"></i>
								<strong>Error:</strong> ${r.message || 'Unknown error'}
							</div>
						`);
					}
				});
			}
		);
	});

	// Display restore summary
	function display_restore_summary(summary) {
		let html = `
			<div class="card" style="margin-top: 20px; border: 2px solid #28a745;">
				<div class="card-body">
					<h5 class="card-title" style="color: #28a745;">
						<i class="fa fa-check-circle"></i> Restore Completed Successfully
					</h5>

					<div style="margin-top: 15px;">
						<strong>Summary:</strong>
						<ul style="margin-top: 10px;">
							<li>Records Imported: <span class="badge badge-success">${summary.records_imported}</span></li>
							<li>Records Skipped: <span class="badge badge-warning">${summary.records_skipped}</span></li>
							<li>DocTypes Processed: <span class="badge badge-info">${summary.doctypes_processed.length}</span></li>
						</ul>
					</div>

					<div style="margin-top: 20px;">
						<strong>DocType Details:</strong>
						<div style="margin-top: 10px; max-height: 300px; overflow-y: auto;">
							<table class="table table-bordered table-sm">
								<thead>
									<tr>
										<th>DocType</th>
										<th>Imported</th>
										<th>Skipped</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
		`;

		summary.doctypes_processed.forEach(function(dt) {
			let status_badge = dt.errors.length > 0 ?
				'<span class="badge badge-warning">With Errors</span>' :
				'<span class="badge badge-success">OK</span>';

			html += `
				<tr>
					<td>${dt.doctype}</td>
					<td>${dt.imported}</td>
					<td>${dt.skipped}</td>
					<td>${status_badge}</td>
				</tr>
			`;

			if (dt.errors.length > 0) {
				html += `
					<tr>
						<td colspan="4" class="text-muted" style="font-size: 0.9em;">
							<strong>Errors:</strong>
							<ul style="margin-bottom: 0;">
								${dt.errors.map(err => '<li>' + err + '</li>').join('')}
							</ul>
						</td>
					</tr>
				`;
			}
		});

		html += `
								</tbody>
							</table>
						</div>
					</div>
		`;

		if (summary.errors && summary.errors.length > 0) {
			html += `
					<div class="alert alert-warning" style="margin-top: 15px;">
						<strong>General Errors:</strong>
						<ul style="margin-bottom: 0; margin-top: 5px;">
							${summary.errors.map(err => '<li>' + err + '</li>').join('')}
						</ul>
					</div>
			`;
		}

		html += `
				</div>
			</div>
		`;

		page.main.find('#restore-status').html(html);
	}
};
