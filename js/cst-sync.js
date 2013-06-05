jQuery(document).ready(function($) {

	var data = {
		action: 'cst_get_queue',
		cst_check: syncAjax.cst_check
	};

function sync() {
	var queue = readCookie('cstQueue');
	queue = JSON.parse(queue);
	if(!queue || queue.length <= 0) {
		return;
	}
	var passedFile = queue.shift(); // eventually this will be populated by pulling element from cookie-based queue
	var syncFileData = {
		action: 'cst_sync_file',
		cst_check: syncAjax.cst_check,
		file: passedFile,
		total: queue.length
	};
	$.ajax({
		type: "post",
		url: syncAjax.ajax_url,
		data: syncFileData,
		success: function(response) {
			var date = new Date();
			date.setTime(date.getTime()+(10*24*60*60*1000));
			var expires = date.toGMTString();
			var jsonString = JSON.stringify(queue);
			document.cookie = 'cstQueue='+jsonString+'; expires='+expires+'; path=/';


			$(".cst-progress").append(response);
			sync();
		}
	});
}

	// We can also pass the url value separately from ajaxurl for front end AJAX implementations
	$.ajax({
		type: "post",
		url: syncAjax.ajax_url,
		data: data,
		success: function(response) {
			var queue = response.slice(0,5);

			if (queue.length > 0) {
				var date = new Date();
				date.setTime(date.getTime()+(10*24*60*60*1000));
				var expires = date.toGMTString();
				var jsonString = JSON.stringify(queue);
				document.cookie = 'cstQueue='+jsonString+'; expires='+expires+'; path=/';

				sync();
			}

			// Upon completion, show the Return to Options Page button
			$(".cst-progress").ajaxStop(function() {
				$(this).append('<strong>All files synced.</strong>');
				$(".cst-progress-return").show();
			});
			
			// var doSyncFile = function() {
			// 	var syncFileData = {
			// 		action: 'cst_sync_file',
			// 		cst_check: syncAjax.cst_check
			// 	};
			// 	$.post({
			// 		url: syncAjax.ajax_url,
			// 		data: syncFileData,
			// 		success: function(response) {
			// 			i++;
			// 			console.log('The value of i is: ' + i);
			// 			//if (i > 3) {
			// 				return;
			// 			// }
			// 			// doSyncFile();
			// 		},
			// 		dataType: 'json'
			// 	});
			// };

			// doSyncFile();
		},
		dataType: 'json'
	});

});
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}