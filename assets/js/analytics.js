// Custom event tracking
// =====================

// Download button
var downloadLinks = document.querySelectorAll('[data-anal-downloaded]');

function addDownloadToDatalayer() {
	var downloadType = this.getAttribute('data-anal-downloaded');
	
	dataLayer.push({
		'event': 'downloaded-neutron',
		'downloaded-neutron-type': downloadType
	});
}

for (var i = 0; i < downloadLinks.length; ++i) {
	var link = downloadLinks[i];

	link.addEventListener('click', addDownloadToDatalayer, false);
}	
