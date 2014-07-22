//3dCart specific additions and client settings

//Namespace for all 4-Tell code
(function (_4TellBoost, $, undefined) {

    //Client settings
    _4TellBoost.SiteInfo = new _4TellBoost.Site({
        baseURL: 'shop.homemadegourmet.com',
        alias: 'HomeGour',
        GA_UA: 'UA-15437023-1', //supplying UA number here will override the tracking type
        GATrackingType: '_gaq', //valid types are 'none', 'pageTracker', '_gaq'
        GATrackID: '4TellRecs',
        rotateTopSellers: true,
        showLogo: false, //true if intro tier
        addCartMethod: '3dCartQuickCart', //valid methods: '3dCartQuickCart', '3dCartMoreDetails'
        addCartBtnAtts: "input type='button' value='Add to Cart' class='btn' onmouseout=this.className='btn' onmouseover=this.className='btn_over'",
        //addCartBtnAtts: "img alt='Add to Cart'",
        addCartImage: '', //'assets/images/add-cart.png', //'assets/images/buy.gif', //use '' if type=button
        priceClass: 'price2',
        strikePriceClass: 'price-info',
        salePriceClass: 'price',
        pricePrefix: '',
        salePricePrefix: 'On Sale: ',
        includeBase: false,
        SiteEnable: true
    });


    // Page Settings
    // Defaults	
    var tout1 = {
        orientation: 'vertical',
        newDivID: 'main4TellContainer',
        divSelect: '#main4TellContainer', // if class use '.' -- if id use '#'
        divPosition: 'append', //valid settings are 'append', 'replace', 'above', or 'below'
        showCaption: true,
        carousel: false,
        numVis: 1,
        scrollStyle: 'scrollable',
        captionStyle: 'menu-headers product4TCaption',
        productStyle: 'product4T',
        productImageStyle: 'productImage',
        productTitleStyle: 'productTitle',
        imageSize: "&maxx=120&maxy=120",
        showRatings: false,
        showBuyButton: true,
        wrapper: ''
    };
    var tout2 = {
        orientation: 'horizontal',
        newDivID: 'second4TellContainer',
        divSelect: '#second4TellContainer', // if class use '.' -- if id use '#'
        divPosition: 'append', //valid settings are 'append', 'replace', 'above', or 'below'
        showCaption: true,
        carousel: false,
        numVis: 1,
        scrollStyle: 'scrollable',
        captionStyle: 'titles product4TCaption2',
        productStyle: 'product4T product4T2',
        productImageStyle: 'productImage',
        productTitleStyle: 'productTitle',
        imageSize: "&maxx=120&maxy=120",
        showRatings: false,
        showBuyButton: true,
        wrapper: ''
    };


    _4TellBoost.getPageSettings = function (pageType) {
        var inCart = false;
        if (pageType === 'Auto')
            pageType = autoDetectPage();

        // These are the tout settings for different pages of the site. 
        // You may add or remove page types here to match your site architecture.
        // Any settings not specified here will use the default values listed above
        switch (pageType) {
            case 'Home': //home page
                tout1.enable = true;
                tout1.divSelect = "table:contains('Featured Selections')";
                tout1.divPosition = "replace";
                tout1.resultType = 4; //Top-sellers
                tout1.numItems = 4;
                if (_4TellBoost.SiteInfo.rotateTopSellers) {
                    var d = new Date();
                    tout1.startPos = d.getDay() + 1; //rotate start position by day of week
                }
                tout1.caption = 'Top Sellers';
                tout1.captionStyle = 'menu-headers product4TCaption';
                tout1.productStyle = 'product4T product4THome';
                tout2.enable = false;
                break;
            case 'ProductDetail': //product detail page (PDP)
                tout1.enable = true;
                tout1.resultType = 0; //Cross-sell
                tout1.numItems = 3;
                tout1.caption = 'Customers also bought';
                tout1.captionStyle = 'checkout-headers product4TCaption';
                tout1.productStyle = 'product4T product4TPD1';
                tout1.showBuyButton = true;

                tout2.enable = true;
                tout2.divSelect = "table:contains('Related Items')";
                tout2.divPosition = "replace";
                tout2.resultType = 3;
                tout2.numItems = 6;
                tout2.caption = 'Similar items';
                tout2.captionStyle = 'checkout-headers product4TCaption';
                tout2.productStyle = 'product4T product4TPD1';
                tout2.imageSize = "&maxx=125&maxy=150";
                tout2.showBuyButton = true;
                break;
            case 'Category': //category landing page 
                tout1.enable = true;
                tout1.numItems = 4;
                tout1.resultType = 4; //Category Top Seller (requires setCatId on page)
                if (_4TellBoost.getProductCount() > 4) tout1.caption = 'Category top sellers...';
                else tout1.caption = 'Featured Items'; //not enough items
                tout1.productStyle = 'product4T product4TCat';
                tout1.showBuyButton = false;
                tout2.enable = false;
                break;
            case 'Search': //search results page 
                tout1.enable = true;
                tout1.resultType = 0; //Cross-sell
                tout1.numItems = 5;
                tout1.caption = 'More Ideas...';
                tout1.productStyle = 'product4T product4TSearch';
                tout1.imageSize = '&maxx=130&maxy=130';
                tout1.showBuyButton = false;
                tout2.enable = false;
                break;
            case 'ViewCart': //full add to cart page
                tout1.enable = false;
                tout2.enable = true;
                tout2.resultType = 0; //Cross-sell
                tout2.numItems = 3;
                tout2.caption = 'You may also like...';
                tout2.captionStyle = 'checkout-headers product4TCaption2';
                tout2.productStyle = 'product4T product4TVC';
                tout2.imageSize = '&maxx=120&maxy=130';
                inCart = true;
                break;
            case 'ViewCartQuick': //pop-up add to cart page
                tout1.enable = false;
                tout2.enable = true;
                tout2.resultType = 1; //Cross-sell
                tout2.numItems = 5;
                tout2.showCaption = true;
                tout2.caption = 'You may also like..';
                tout2.captionStyle = 'titles product4TCaption2 product4TCaptionQC';
                tout2.productStyle = 'product4T product4TQC';
                tout2.imageSize = "&maxx=100&maxy=100";
                tout2.showRatings = false;
                tout2.showBuyButton = false;
                tout2.inFrame = true;
                inCart = true;
                break;
            case 'QuickView': //product view pop-up
                tout1.enable = false;
                tout2.enable = true;
                tout2.resultType = 0; //Cross-sell
                tout2.numItems = 4;
                tout2.showCaption = false;
                tout2.productStyle = 'product4T product4TQV';
                tout2.imageSize = "&maxx=100&maxy=100";
                tout2.showRatings = false;
                tout2.showBuyButton = false;
                tout2.inFrame = true;
                _4TellBoost.DelayHandler.toutDiv = '#second4TellContainer';
                delayToGetItems('#tablist');
                break;
            case 'OrderShipping': //intermediate add to cart page
            case 'Checkout':  //singlepage checkout
                tout1.enable = false;
                tout2.enable = true;
                tout2.resultType = 0; //Cross-sell
                tout2.numItems = 4;
                tout2.startPos = 5; //second block
                tout2.productStyle = 'product4T product4TCheck';
                tout2.caption = 'You may also like...';
                tout2.captionStyle = 'page_headers product4TCaption2';
                tout2.showBuyButton = false;
                inCart = true;
                break;
            case 'OrderPayment': //payment options page
                tout1.enable = false;
                tout2.enable = false;
                tout2.resultType = 2; //Blended
                tout2.numItems = 4;
                tout2.caption = 'You may also like...';
                tout2.captionStyle = 'checkout-headers product4TCaption2';
                inCart = true;
                break;
            case 'OrderConfirm': //order confirmation page
                tout1.enable = false;
                tout2.enable = false;
                tout2.resultType = 2; //Blended
                tout2.numItems = 4;
                tout2.startPos = 5; //second block
                tout2.caption = 'You may also like...';
                tout2.captionStyle = 'checkout-headers product4TCaption2';
                inCart = true;
                break;
            case 'OrderComplete': //checkout complete page
                tout1.enable = false;
                tout2.enable = false;
                tout2.resultType = 2; //Blended
                tout2.numItems = 4;
                tout2.startPos = 9; //second block
                tout2.caption = 'You may also like...';
                tout2.captionStyle = 'checkout-headers product4TCaption2';
                break;
            default: //any page not listed
                tout1.enable = false;
                tout1.resultType = 2; //Blended
                tout1.numItems = 3;
                tout1.caption = 'You may also like...';
                tout2.enable = false;
                break;
        }
        //update public variables with the new settings
        $.extend(_4TellBoost.FirstTout, tout1);
        $.extend(_4TellBoost.SecondTout, tout2);

        //setup toutType for GA tracking
        _4TellBoost.FirstTout.setToutType(pageType);
        _4TellBoost.SecondTout.setToutType(pageType);

        return inCart;
    };

    _4TellBoost.getRatingImage = function (rating) {
        var rateVal = parseFloat(rating);
        if (isNaN(rateVal)) return ''; //not a number
        if (rateVal < 0) rateVal = 0;
        else if (rateVal > 5) rateVal = 5;

        var star = String(Math.floor(rateVal));
        var imagePath = 'assets/templates/common/images/star' + star + '.png';
        return imagePath;
    };


    function delayToGetItems(delayDiv) { //use in page settings above to delay for third-party results to load

        var delayContainer = $(delayDiv);
        if (!delayContainer) return;

        //ananomous call-back funtion is called after delayed container changes
        _4TellBoost.DelayHandler.callback = function () {
            var toutDiv = $(_4TellBoost.DelayHandler.toutDiv);
            if (!toutDiv || !(toutDiv.length)) //see if the toutDiv is visible
                _4TellBoost.DelayHandler.ended = false;
        };
        _4TellBoost.SiteInfo.delay = true;
        _4TellBoost.delayUntilLoaded(delayContainer);
    };

    function autoDetectPage() {
        var searchSort = $('#nsrt');
        if (searchSort && searchSort.length) {
            //search page found
            getFusionBotItems();
            return 'Search';
        }
        return 'Auto';
    }

    function getFusionBotItems() {
        var resultTable = $("td:contains('Search Results')").closest("table");

        //set the call-back funtion to be called after search results are loaded
        _4TellBoost.DelayHandler.callback = function () {
            var items = _4TellBoost.DelayHandler.element.find('.btn[name|="Add"]'); //get all add-to-cart buttons
            if (items && items.length) {
                $.each(items, function () {
                    var link = String($(this).attr('onclick'));
                    if (link) {
                        var begin = link.indexOf('item_id='); //end of onclick action has item id
                        if (begin > -1) {
                            var end = link.indexOf("'", begin); //end of onClick action has item id
                            if (end > begin + 8) {
                                var id = link.substring(begin + 8, end);
                                _4TellBoost.addProductID(id);
                            }
                        }
                    }
                });
            }
            else {
                _4TellBoost.DelayHandler.ended = false;
            }
        };
        _4TellBoost.SiteInfo.delay = true;
        _4TellBoost.delayUntilLoaded(resultTable);
    };


} (window._4TellBoost = window._4TellBoost || {}, jQuery)); 
//self-invoked namespace that protects $ and undefined internally