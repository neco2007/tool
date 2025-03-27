/**
 * Merucari
 */
async function setResearchToolButtonMerucari() {
    setTimeout(async function(){
        let div = $('<div>').addClass('research-tool');

        let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索').css('font-size', '0.75rem');
        btn1.on('click', findAmazonForMerucari);
        div.append(btn1);

        let checkout = $('#main div[data-testid=checkout-button] button').text();
        // console.log('checkout:' + checkout);
        if ('売り切れました' !== checkout) {

            let ngSeller = false;
            const ngSellerNameJson = await getNgSellerNameJson();
            const ngSellerNameArray = ngSellerNameJson['メルカリ'];
            if (ngSellerNameArray && 0 < ngSellerNameArray.length) {
                const sellerName = $('#main mer-user-object').attr('name');
                // console.log(sellerName);
                if (ngSellerNameArray.includes(sellerName)) {
                    ngSeller = true;
                }
            }

            const ngSellerCodeJson = await getNgSellerCodeJson();
            const ngSellerCodeArray = ngSellerCodeJson['メルカリ'];
            if (ngSellerCodeArray && 0 < ngSellerCodeArray.length) {
                let sellerHref = $('#main a[data-location="item_details:seller_info"]').attr('href');
                if (sellerHref) {
                    let sellerHrefArray = sellerHref.split('/');
                    let sellerCode = sellerHrefArray[sellerHrefArray.length-1];
                    // console.log(sellerCode)
                    if (ngSellerCodeArray.includes(sellerCode)) {
                        ngSeller = true;
                    }
                }
            }

            if (!ngSeller) {
                let btn2 = $('<button>').addClass('send-btn').text('出品ツールに登録').css('font-size', '0.75rem');
                btn2.on('click', sendMerucariParam);
                div.append(btn2);
            }
        }

        // $('#main').prepend(div);
        $('#item-info').prepend(div);

        $('#main .gxpCvn').css('margin-top', '0');
        // $('body').prepend(div);
    },1000);
}
function sendMerucariParam() {
    const title = $('#main .merHeading h1').text();
    const seller = $('#main .merUserObject p').text();
    let price = $('#main div[data-testid="price"]').text();
    if (price) {
        price = price.replace('¥', '').replace(/,/g, "");
    }
    const images = [];
    $('#main .slick-list .slick-slide img').each(function () {
        const image = $(this).attr('src');
        images.push(image);
    });

    const productInfo = $('#main #item-info span[data-testid="商品の状態"]').text();
    const description = $('#main pre[data-testid="description"]').text();
    const checkout = $('#main div[data-testid="checkout-button"] button').text();
    const sellerHref = $('#main a[data-location="item_details:seller_info').attr('href');
    const sellerHrefArray = sellerHref.split('/');
    const sellerCode = sellerHrefArray[sellerHrefArray.length-1];

    const ajaxData = {
        url: $(location).attr('href'),
        title: title,
        seller: seller,
        price: price,
        images: JSON.stringify(images),
        productInfo: productInfo,
        description: description,
        checkout: checkout,
        sellerCode: sellerCode,
    };

    sendMerucariParamExec(ajaxData, $(this));
}
function sendMerucariParamExec(ajaxData, button) {
    this.getResource('data/access_token.txt').then(r => {
        const token = r;
        ajaxData.token = token;
        console.log(JSON.stringify(ajaxData));
        $(button).text('送信しました。').css('color', 'red');

        $.ajax({
            type: 'POST',
            url: server + 'research-tool/merucari',
            data: ajaxData,
            xhrFields: {
                withCredentials: true
            },
        }).then(function (data, textStatus, jqXHR) {
        }, function (jqXHR, textStatus, errorThrown) {
        });
    });
}
async function findAmazonForMerucari() {
    let title = document.title;
    title = title.replace(' by メルカリ', '').trim();
    title = title.replace(' - メルカリ', '').trim();
    title = await titleConvert(title);
    // await sendAmazonSearchWord('mercari', title);
    const url = 'https://www.amazon.co.jp/s?k=' + title;
    window.open(url, 'amazon_research')
}
function setResearchToolButtonMerucariList() {
    setTimeout(function(){
        let div = $('<div>').addClass('research-tool');

        let btn1 = $('<button>').addClass('amazon-btn').text('リサーチボタン表示');
        btn1.on('click', setResearchToolButtonMerucariListDetail);
        div.append(btn1);
        // $('body').prepend(div);
        $('#main').prepend(div);
    },2000);
}
function setResearchToolButtonMerucariListDetail() {
    $('.research-tool-list').each(function (index, element) {
        element.remove();
    });

    $('[data-testid="item-cell"]').each(function (index, element) {
        let div = $('<div>').addClass('research-tool-list');

        let btn1 = $('<button>').addClass('amazon-btn').text('Amazon');
        btn1.data('site', 'mercari');
        btn1.on('click', findAmazonForMerucariList);
        btn1.css('margin', '0.25rem');
        div.append(btn1);

        let btn2 = $('<button>').addClass('send-btn').text('出品登録');
        btn2.on('click', sendResearchToolDataMerucari);
        btn2.css('margin', '0.25rem');
        div.append(btn2);

        $(element).prepend(div);
        $(element).css('border', '1px solid #000');
    });
}
async function findAmazonForMerucariList() {
    const itemCell = $(this).closest('[data-testid="item-cell"]');
    let title = itemCell.find('[data-testid="thumbnail-item-name"]').text().trim();
    title = await titleConvert(title);

    // mobile
    if (!title) {
        let alt = itemCell.find('picture img').attr('alt');
        if (alt) {
            title = alt.replace('のサムネイル', '');
        }
    }

    const url = 'https://www.amazon.co.jp/s?k=' + title;
    window.open(url, 'amazon_research');
}
function sendResearchToolDataMerucari() {
    const itemCell = $(this).closest('[data-testid="item-cell"]');
    let href = itemCell.find('a').attr('href');
    let url = 'https://jp.mercari.com' + href;
    if (confirm('出品ツールに登録します')) {
        sendResearchToolExec(url, $(this));
    }
}