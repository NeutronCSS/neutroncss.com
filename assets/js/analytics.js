(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-9531677-15', 'auto');
ga('send', 'pageview');



// Custom event tracking

// Download button
var downloadLinks = document.querySelectorAll('download-link');

function download() {
  ga('send', 'event', 'button', 'click', 'download-link');
}

for (var i = 0; i < downloadLinks.length; ++i) {
  var link = downloadLinks[i];
  
  link.addListener('click', download, false);
}	
