(function ($) { $(function () {
    
    $("input[data-type='email']").blur( function (e) {
        var res = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i ;
        if (!res.test($(this).val())) {
            var tx = $(this).data('error');
            //alert( (tx) ? tx : 'Invalid email');
            $(this).popover({
                placement: 'bottom',
                container: 'body',
                selector: '[data-type="email"]', //Sepcify the selector here
                content: 'hello'           
            });
        }
    });
    
	$('.confirm').click( function() {
		$msg = $(this).attr('data-confirm');		
	 	return confirm($msg);
	});
	
	$("a.submit").click( function() {
		var $dest = $(this).attr('data-form');
		var $msg = $(this).attr('data-confirm');
		var $href = $(this).attr('href');
		if ($msg != '')
			if (!confirm($msg))
				return false;
		$($dest).attr('action', $href);
		$($dest).submit();		
		return false;
	});
    
    
}) })(jQuery);