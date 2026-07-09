$(document).ready(function () {
	var table = $('#tableData').DataTable({
		paging: false,
		language: {
			info: '_TOTAL_ items',
			search: '',
			searchPlaceholder: 'Search files and folders'
		},
		columnDefs: [
			{ targets: 0, orderable: false },
			{ targets: 4, orderable: false },
			{ orderSequence: ['desc', 'asc'], targets: [1] }
		],
		order: [[1, 'asc']]
	});

	$('.dataTables_filter input').attr('aria-label', 'Search files and folders');

	table.on('draw', function () {
		$('#tableData tbody tr').each(function () {
			$(this).toggleClass('is-empty-row', $(this).find('td').length === 1);
		});
	});
});

function formatUploadSize(bytes) {
	if (!bytes) {
		return '0 Bytes';
	}

	var units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	var unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
	var value = bytes / Math.pow(1024, unitIndex);
	return value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1) + ' ' + units[unitIndex];
}

function syncInputFiles(input, files) {
	var dataTransfer = new DataTransfer();

	files.forEach(function (file) {
		dataTransfer.items.add(file);
	});

	input.files = dataTransfer.files;
}

function getUploadFileKey(file) {
	return [file.name, file.size, file.lastModified].join(':');
}

Array.prototype.forEach.call(document.querySelectorAll('.upload-form'), function (form) {
	var input = form.querySelector('.uploadFile');
	var label = form.querySelector('.upload-dropzone label');
	var labelText = label.querySelector('span').innerText;
	var submitButton = form.querySelector('.upload-button');
	var queue = form.querySelector('.upload-queue');
	var fileList = form.querySelector('.upload-file-list');
	var clearButton = form.querySelector('.upload-clear-button');
	var progress = form.querySelector('.upload-progress');
	var progressLabel = form.querySelector('.upload-progress-label');
	var progressPercent = form.querySelector('.upload-progress-percent');
	var progressBar = form.querySelector('.upload-progress-bar');
	var selectedFiles = [];
	var isUploading = false;

	function addSelectedFiles(files) {
		var knownFiles = {};

		selectedFiles.forEach(function (file) {
			knownFiles[getUploadFileKey(file)] = true;
		});

		files.forEach(function (file) {
			var fileKey = getUploadFileKey(file);

			if (!knownFiles[fileKey]) {
				selectedFiles.push(file);
				knownFiles[fileKey] = true;
			}
		});
	}

	function setProgress(percent, labelTextValue) {
		var normalizedPercent = Math.max(0, Math.min(100, percent));

		progress.hidden = false;
		progressLabel.innerText = labelTextValue;
		progressPercent.innerText = Math.round(normalizedPercent) + '%';
		progressBar.style.width = normalizedPercent + '%';
	}

	function updateLabel() {
		if (selectedFiles.length === 0) {
			label.querySelector('span').innerText = labelText;
			label.classList.remove('has-file');
			return;
		}

		label.querySelector('span').innerText = selectedFiles.length === 1
			? selectedFiles[0].name
			: selectedFiles.length + ' files selected';
		label.classList.add('has-file');
	}

	function renderQueue() {
		fileList.innerHTML = '';
		queue.hidden = selectedFiles.length === 0;

		selectedFiles.forEach(function (file, index) {
			var item = document.createElement('li');
			item.className = 'upload-file-item';

			var details = document.createElement('span');
			details.className = 'upload-file-details';

			var name = document.createElement('span');
			name.className = 'upload-file-name';
			name.innerText = file.name;

			var size = document.createElement('span');
			size.className = 'upload-file-size';
			size.innerText = formatUploadSize(file.size);

			var removeButton = document.createElement('button');
			removeButton.type = 'button';
			removeButton.className = 'upload-file-remove';
			removeButton.setAttribute('aria-label', 'Remove ' + file.name);
			removeButton.innerHTML = '<i class="fas fa-times"></i>';
			removeButton.disabled = isUploading;
			removeButton.addEventListener('click', function () {
				selectedFiles.splice(index, 1);
				syncInputFiles(input, selectedFiles);
				updateUploadUi();
			});

			details.appendChild(name);
			details.appendChild(size);
			item.appendChild(details);
			item.appendChild(removeButton);
			fileList.appendChild(item);
		});
	}

	function updateUploadUi() {
		if (!isUploading && selectedFiles.length === 0) {
			progress.hidden = true;
			setProgress(0, 'Ready');
			progress.hidden = true;
		}

		updateLabel();
		renderQueue();
		submitButton.disabled = isUploading || selectedFiles.length === 0;
		clearButton.disabled = isUploading;
	}

	input.addEventListener('change', function () {
		addSelectedFiles(Array.prototype.slice.call(input.files || []));
		input.value = '';
		progress.hidden = true;
		setProgress(0, 'Ready');
		progress.hidden = selectedFiles.length === 0;
		updateUploadUi();
	});

	clearButton.addEventListener('click', function () {
		selectedFiles = [];
		input.value = '';
		syncInputFiles(input, selectedFiles);
		progress.hidden = true;
		updateUploadUi();
	});

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		if (isUploading || selectedFiles.length === 0) {
			return;
		}

		var formData = new FormData();
		var pathInput = form.querySelector('input[name="path"]');

		selectedFiles.forEach(function (file) {
			formData.append('file', file, file.name);
		});
		formData.append('path', pathInput.value);

		var request = new XMLHttpRequest();

		isUploading = true;
		updateUploadUi();
		setProgress(0, 'Uploading');

		request.upload.addEventListener('progress', function (event) {
			if (event.lengthComputable) {
				setProgress((event.loaded / event.total) * 100, 'Uploading');
			}
		});

		request.addEventListener('load', function () {
			if (request.status >= 200 && request.status < 400) {
				setProgress(100, 'Upload complete');
				window.location.reload();
				return;
			}

			isUploading = false;
			setProgress(100, 'Upload failed');
			updateUploadUi();
		});

		request.addEventListener('error', function () {
			isUploading = false;
			setProgress(100, 'Upload failed');
			updateUploadUi();
		});

		request.open('POST', form.action);
		request.send(formData);
	});

	updateUploadUi();
});
