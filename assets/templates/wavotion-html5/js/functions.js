jQuery(function () {
    /* IE Fix for the use of attribute ='placeholder' */
    if (!jQuery.support.placeholder) {
        var active = document.activeElement;

        jQuery(':text').focus(function () {
            if (jQuery(this).attr('placeholder') != '' && jQuery(this).val() == jQuery(this).attr('placeholder')) {
                jQuery(this).val('').removeClass('hasPlaceholder');
            }
        }).blur(function () {
            if (jQuery(this).attr('placeholder') != '' && (jQuery(this).val() == '' || jQuery(this).val() == jQuery(this).attr('placeholder'))) {
                jQuery(this).val(jQuery(this).attr('placeholder')).addClass('hasPlaceholder');
            }
        });
        jQuery(':text').blur();

        jQuery(active).focus();
    }

    resizeMainContent();

    /* On the window resize event. */
    jQuery(window).resize(function () {

        if (jQuery(window).width() <= 980)
            resizeMainContent();
        else
            jQuery('nav ul.mobile').appendTo('#modCategory');
        resizeMainContent();

        if (jQuery(window).width() <= 767)
            jQuery('#modCategory ul.mobile').appendTo('nav');
    });

    /* On the device orientation change event. */
    jQuery(window).bind('orientationchange', function (event) {
        var lbElem = jQuery('#leftBar');
        var rbElem = jQuery('#rightBar');

        /* Portrait Orientation */
        if (orientation == 0 || orientation == 180) {
            jQuery('#mainContent').css('width', '100%');
        }
        else {
            /* Landscape Orientation */
            resizeMainContent();
        }
    });

    /* Initiates toggle for mobile drop down menu */
    jQuery('a#mobileMenu').on('click', function () {
        jQuery('ul.mobile').slideToggle();
    });

    /* Initiates <select> for Sub-Category & Blog menus at a specified width. */
    if (jQuery(window).width() <= 767) {

        jQuery('#modCategory ul.mobile').appendTo('nav');

        jQuery('#blog .blogNav ul, #subcategoriesBlock ul').each(function () {
            var list = jQuery(this),
            select = jQuery(document.createElement('select')).insertBefore(jQuery(this).hide());

            jQuery('>li a', this).each(function () {
                var target = jQuery(this).attr('target'),
                option = jQuery(document.createElement('option'))
                 .appendTo(select)
                 .val(this.href)
                 .html(jQuery(this).html())
                 .click(function () {
                 });
            });
            list.remove();
        });

        jQuery('#blog .blogNav select:eq(0)').prepend('<option> --- Select Category ---</option>');
        jQuery('#blog .blogNav select:eq(1)').prepend('<option> --- Select Recent Posts ---</option>');
        jQuery('#blog .blogNav select:eq(2)').prepend('<option> --- Select Archives ---</option>');

        jQuery('#subcategoriesBlock select').prepend('<option> --- Select Sub-Category ---</option>');

        jQuery('#blog .blogNav select, #subcategoriesBlock select').change(function () {
            window.location.href = jQuery(this).val();
        });
    }
    else {
        return;
    }
});

/* Site content section resizing depending on Left Bar or Right Bar is enabled. */
function resizeMainContent() {
    var sw = jQuery('#mainContainer .wrapper').width();
    var mcElem = jQuery('#mainContent');
    var lbElem = jQuery('#leftBar');
    var rbElem = jQuery('#rightBar');
    var lb = (lbElem.length > 0 && lbElem.css("display") != 'none' && lbElem.height() > 15) ? lbElem.outerWidth(true) : 0;
    var rb = (rbElem.length > 0 && rbElem.css("display") != 'none' && rbElem.height() > 15) ? rbElem.outerWidth(true) : 0;
    var mw = sw - (lb + rb);

    var hsWidth = jQuery('.product-container').width();
    jQuery('.hs-item .img').css('width', hsWidth + 'px');

    if (lbElem.length == 0 || rbElem.length == 0) {
        if (lbElem.length == 0 && rbElem.length == 0) {
            jQuery('#mainContent').css('width', '100%');
        }
        else {
            jQuery('#mainContent').css('width', mw + 'px');
        }
    }
    else {
        jQuery('#mainContent').css('width', '100%');
    }

    if ((lbElem.css('display') == 'none' && rbElem.css('display') == 'none')) {
        jQuery('#mainContent').css('width', '100%');
    }
    else {
        if ((lbElem.css('display') == 'block' || rbElem.css('display') == 'block')) {
            jQuery('#mainContent').css('width', mw + 'px');
        }
    }
}

/* Initiates sticky navigation */
jQuery(document).ready(function() {
	
	var stickyNavTop = jQuery('header').offset().top;  
	  
	var stickyNav = function() {  
		var scrollTop = jQuery(window).scrollTop();  
		   
		if (scrollTop > stickyNavTop) {   
			jQuery('header').addClass('sticky-nav');  
		}
		else {
			jQuery('header').removeClass('sticky-nav');
		}  
	};
	stickyNav();  
	  
	jQuery(window).scroll(function() {  
		stickyNav();  
	});
	
});