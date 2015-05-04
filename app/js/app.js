$poster = $('#poster');
$preview = $('#preview');
$save = $('#make-img button');


var processText = function(){
	$text = $('#quote-text p').text();
	var t = $text.replace(/\s+/g, '_').toLowerCase().replace(/[^a-zA-Z0-9_]+/g, '').split('_', 4).join('_');
	
	return t;
};

var savePoster = function(){
	var filename = processText();
	html2canvas($poster, {
	  onrendered: function(canvas) {
	  	$poster.remove();
	    $preview.append(canvas);
	    var img = canvas.toDataURL();
        var a = $("<a>").attr("href", img).attr("download", "quote-" + filename + ".png").appendTo("body");
	  	a[0].click();
        a.remove();
	  }
	});

}


$save.on('click', savePoster);


$(function() {


	var elements = document.querySelectorAll('.editable'),
    editor = new MediumEditor(elements, {
    	disableToolbar: true,
    	disableReturn: true
    });

	var quoteSize = $("#quote-font-size").slider()
		.data('slider')
		.on('slide', function(){
			$('#quote-text p').css( 'font-size', quoteSize.getValue() +'px');
		});

	var attrSize = $("#attr-font-size").slider()
		.data('slider')
		.on('slide', function(){
			$('#attr-text p').css( 'font-size', attrSize.getValue() +'px');
		});

});






//  adjust size of preview viewport according to 16x9 ratio on resize and on pageload
$(window).on('resize',function(){
	var w = $poster.width();
	$poster.height(w*0.5625);
}).resize();