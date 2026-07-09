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

var inputs = document.querySelectorAll('.uploadFile');

Array.prototype.forEach.call(inputs, function (input) {
	var label = input.nextElementSibling;
	var labelText = label.querySelector('span').innerText;

	input.addEventListener('change', function (e) {
		var fileName = '';

		if (this.files && this.files.length > 1) {
			fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
		} else {
			fileName = e.target.value.split('\\').pop();
		}

		label.querySelector('span').innerText = fileName || labelText;
		label.classList.toggle('has-file', Boolean(fileName));
	});
});
