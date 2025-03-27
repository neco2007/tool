// content.js
const server = 'https://hmc-tool.net/';

$(function() {
	let url = $(location).attr('href');
	let site = null;
	if (url.startsWith("https://page.auctions.yahoo.co.jp/jp/auction/")) {
		setResearchToolButtonYahoo();
	}
	else if (url.startsWith("https://auctions.yahoo.co.jp/search/search")) {
		setResearchToolButtonYahooList();
	}
	else if (url.startsWith("https://jp.mercari.com/item/")) {
		setResearchToolButtonMerucari();
	}
	else if (url.startsWith("https://jp.mercari.com/search")) {
		setResearchToolButtonMerucariList();
	}
	else if (url.startsWith("https://item.fril.jp/")) {
		setResearchToolButtonRakuten();
	}
	else if (url.startsWith("https://fril.jp/s\?query") ||
		url.startsWith("https://fril.jp/s\?order") ||
		url.startsWith("https://fril.jp/s\?category_id") ||
		url.startsWith("https://fril.jp/s\?brand_id") ||
		url.startsWith("https://fril.jp/s\?min") ||
		url.startsWith("https://fril.jp/s\?max") ||
		url.startsWith("https://fril.jp/s\?size_group_id") ||
		url.startsWith("https://fril.jp/s\?status") ||
		url.startsWith("https://fril.jp/s\?official_item_type") ||
		url.startsWith("https://fril.jp/s\?status") ||
		url.startsWith("https://fril.jp/s\?anonymous_shipping") ||
		url.startsWith("https://fril.jp/s\?carriage") ||
		url.startsWith("https://fril.jp/s\?transaction")
	) {
		setResearchToolButtonRakutenList();
	}
	else if (url.startsWith("https://fril.jp/shop/")) {
		setResearchToolButtonRakutenShop();
	}
	else if (url.startsWith("https://fril.jp/category/")) {
		setResearchToolButtonRakutenCategory();
	}
	else if (url.startsWith("https://paypayfleamarket.yahoo.co.jp/item/")) {
		setResearchToolButtonPaypay();
	}
	else if (url.startsWith("https://paypayfleamarket.yahoo.co.jp/search/")) {
		setResearchToolButtonPaypayList();
	}
	else if (url.startsWith("https://paypayfleamarket.yahoo.co.jp/category/")) {
		setResearchToolButtonPaypayList();
	}
	else if (url.startsWith("https://www.ebay.com/itm/")) {
		setResearchToolButtonEbay();
	}
	else if (url.startsWith("https://www.ebay.com/sch/")) {
		setResearchToolButtonEbayList();
	}
});

/**
 * Yahoo
 */
async function setResearchToolButtonYahoo() {
	let div = $('<div>').addClass('research-tool');

	let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索');
	btn1.on('click', findAmazonForYahoo);
	div.append(btn1);

	const ngSellerNameJson = await getNgSellerNameJson();
	const ngSellerNameArray = ngSellerNameJson['ヤフオク!'];
	if (ngSellerNameArray && 0 < ngSellerNameArray.length) {
		// const sellerName = $('.Seller__name a').text();
		const sellerNameHref = $('.Seller__name a').attr('href');
		if (sellerNameHref) {
			console.log(sellerNameHref);
			const sellerNameHrefSplit = sellerNameHref.split('/');
			if (null != sellerNameHrefSplit && 0 < sellerNameHrefSplit.length) {
				console.log(sellerNameHrefSplit);
				const sellerName = sellerNameHrefSplit[sellerNameHrefSplit.length-1];
				if (sellerName) {
					console.log(sellerName);
					if (!ngSellerNameArray.includes(sellerName)) {
						let btn2 = $('<button>').addClass('send-btn').text('出品ツールに登録');
						btn2.on('click', sendResearchToolParam);
						div.append(btn2);
					} else {
						console.log('NG Seller')
					}
				}
			}
		}
	}

	let itemElement = $('.ProductInformation__items');
	// モバイル
	if (0 == itemElement.length) {
		$('.modSlider').after(div);
	}
	// PC
	else {
		$('.ProductInformation__items').prepend(div);
	}

}
async function findAmazonForYahoo() {
	let title = $('.ProductTitle__text').text();
	if (!title) {
		title = $('.ItemTitle__text h1').text();
	}
	title = await titleConvert(title.trim());
	// await sendAmazonSearchWord('yahoo', title);
	const url = 'https://www.amazon.co.jp/s?k=' + title;
	window.open(url, 'amazon_research');
}
async function setResearchToolButtonYahooList() {

	// SP
	if (0 == $('.Product__detail').length) {
		$('.Item--grid').each(async function (index, element) {
			let div = $('<div>').addClass('research-tool');

			let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索');
			btn1.data('title', $(element).find('.Item__title').text());
			btn1.data('site', 'yahoo');
			btn1.on('click', findAmazonForList);
			div.append(btn1);

			let ngSeller = false;
			const ngSellerNameJson = await getNgSellerNameJson();
			const ngSellerNameArray = ngSellerNameJson['ヤフオク!'];
			if (ngSellerNameArray && 0 < ngSellerNameArray.length) {
				const sellerName = $(element).find('.Item__couponArea').attr('data-auction-sellerid');
				if (sellerName) {
					if (ngSellerNameArray.includes(sellerName.trim())) {
						console.log('ngSeller:' + sellerName);
						ngSeller = true;
					}
				}
			}
			if (!ngSeller) {
				let btn2 = $('<button>').addClass('send-btn').text('出品ツールに登録');
				let href = $(element).find('.Item__summary a').attr('href');
				btn2.data('url', href);
				btn2.on('click', sendResearchToolData);
				div.append(btn2);
			}
			$(element).append(div);
		});
	}
	// PC
	else {
		$('.Product__detail').each(async function (index, element) {
			let div = $('<div>').addClass('research-tool');

			let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索');
			btn1.data('title', $(element).find('.Product__title').text());
			btn1.data('site', 'yahoo');
			btn1.on('click', findAmazonForList);
			div.append(btn1);

			let ngSeller = false;
			const ngSellerNameJson = await getNgSellerNameJson();
			const ngSellerNameArray = ngSellerNameJson['ヤフオク!'];
			if (ngSellerNameArray && 0 < ngSellerNameArray.length) {
				const sellerName = $(element).find('.Product__bonus').attr('data-auction-sellerid');
				if (sellerName) {
					if (ngSellerNameArray.includes(sellerName)) {
						console.log('ngSeller:' + sellerName);
						ngSeller = true;
					}
				}
			}
			if (!ngSeller) {
				let btn2 = $('<button>').addClass('send-btn').text('出品ツールに登録');
				let href = $(element).find('.Product__title a').attr('href');
				btn2.data('url', href);
				btn2.on('click', sendResearchToolData);
				div.append(btn2);
			}

			$(element).append(div);
		});
	}
}

/**
 * Rakuten
 */
async function setResearchToolButtonRakuten() {
	let div = $('<div>').addClass('research-tool');

	let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索');
	btn1.on('click', findAmazonForRakuten);
	div.append(btn1);

	let ngSeller = false;
	const ngSellerNameJson = await getNgSellerNameJson();
	const ngSellerNameArray = ngSellerNameJson['ラクマ'];
	if (ngSellerNameArray && 0 < ngSellerNameArray.length) {
		const sellerName = $('.header-shopinfo__user-name').text();
		// console.log('sellerName:' + sellerName);
		if (ngSellerNameArray.includes(sellerName)) {
			ngSeller = true;
		}
	}

	const ngSellerCodeJson = await getNgSellerCodeJson();
	const ngSellerCodeArray = ngSellerCodeJson['ラクマ'];
	if (ngSellerCodeArray && 0 < ngSellerCodeArray.length) {
		const sellerHref = $('.shopinfo-area .shopinfo-wrap').attr('href');
		let sellerHrefArray = sellerHref.split('/');
		let sellerCode = sellerHrefArray[sellerHrefArray.length-1];
		// console.log(sellerCode);
		if (ngSellerCodeArray.includes(sellerCode)) {
			ngSeller = true;
		}
	}

	if (!ngSeller) {
		let btn2 = $('<button>').addClass('send-btn').text('出品ツールに登録');
		btn2.on('click', sendResearchToolParamForRakuten);
		div.append(btn2);
	}

	$('.item-info__header').append(div);

}
function sendResearchToolParamForRakuten() {
	let href = $(location).attr('href');
	let url = href.split('?')[0];
	sendResearchToolExec(url.trim());
}
async function findAmazonForRakuten() {
	let title = $('.item__name').text().trim();
	title = await titleConvert(title);
	// await sendAmazonSearchWord('rakuten', title);
	const url = 'https://www.amazon.co.jp/s?k=' + title;
	window.open(url, 'amazon_research')
}
function setResearchToolButtonRakutenList() {
	$('.item-box').each(async function (index, element) {
		let div = $('<div>').addClass('research-tool');

		let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索');
		let title = $(element).find('.link_search_title span').text();
		btn1.data('title', title);
		btn1.data('site', 'rakuten');
		btn1.on('click', findAmazonForList);
		div.append(btn1);

		let btn2 = $('<button>').addClass('send-btn').text('出品ツールに登録');
		let href = $(element).find('.link_search_image').attr('href');
		var url = href.substring(href.indexOf('https://item.fril.jp/'));
		btn2.data('url', url);
		btn2.on('click', sendResearchToolData);
		div.append(btn2);

		$(element).find('.item-box__text-wrapper').after(div);

		let link = $(this).find('a');
		link.attr('target', '_blank');
	});
}
function setResearchToolButtonRakutenShop() {
	$('.item-box').each(function (index, element) {
		let div = $('<div>').addClass('research-tool');

		let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索');
		let title = $(element).find('.link_shop_title span').text();
		btn1.data('title', title);
		btn1.data('site', 'rakuten');
		btn1.on('click', findAmazonForList);
		div.append(btn1);

		let btn2 = $('<button>').addClass('send-btn').text('出品ツールに登録');
		let href = $(element).find('.link_shop_image').attr('href');
		btn2.data('url', href);
		btn2.on('click', sendResearchToolData);
		div.append(btn2);

		$(element).find('.item-box__text-wrapper').after(div);

		let link = $(this).find('a');
		link.attr('target', '_blank');
	});
}
function setResearchToolButtonRakutenCategory() {
	$('.item-box').each(function (index, element) {
		let div = $('<div>').addClass('research-tool');

		let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索');
		let title = $(element).find('.link_category_title span').text();
		btn1.data('title', title);
		btn1.data('site', 'rakuten');
		btn1.on('click', findAmazonForList);
		div.append(btn1);

		let btn2 = $('<button>').addClass('send-btn').text('出品ツールに登録');
		let href = $(element).find('.link_category_image').attr('href');
		btn2.data('url', href);
		btn2.on('click', sendResearchToolData);
		div.append(btn2);

		$(element).find('.item-box__text-wrapper').after(div);

		let link = $(this).find('a');
		link.attr('target', '_blank');
	});
}
/**
 * PayPayフリマ
 */
async function setResearchToolButtonPaypay() {
	let div = $('<div>').addClass('research-tool');

	let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索');
	btn1.on('click', findAmazonForPaypay);
	div.append(btn1);

	let ngSeller = false;
	const ngSellerNameJson = await getNgSellerNameJson();
	const ngSellerNameArray = ngSellerNameJson['PayPayフリマ'];
	if (ngSellerNameArray && 0 < ngSellerNameArray.length) {
		const sellerName = $('.SellerInfo__Name span').text();
		// console.log('sellerName:' + sellerName);
		if (ngSellerNameArray.includes(sellerName)) {
			ngSeller = true;
		}
	}

	const ngSellerCodeJson = await getNgSellerCodeJson();
	const ngSellerCodeArray = ngSellerCodeJson['PayPayフリマ'];
	if (ngSellerCodeArray && 0 < ngSellerCodeArray.length) {
		const sellerHref = $('.ItemMain__Component a[href^="/user/"]').attr('href');
		let sellerHrefArray = sellerHref.split('/');
		let sellerCode = sellerHrefArray[sellerHrefArray.length-1];
		// console.log('sellerCode:' + sellerCode);
		if (ngSellerCodeArray.includes(sellerCode)) {
			ngSeller = true;
		}
	}

	if (!ngSeller) {
		let btn2 = $('<button>').addClass('send-btn').text('出品ツールに登録');
		btn2.on('click', sendResearchToolParamForPaypay);
		div.append(btn2);
	}

	$('.ItemTitle__Component').append(div);
}
async function findAmazonForPaypay() {
	let title = $('.ItemTitle__Component span').text().trim();
	title = await titleConvert(title);
	// await sendAmazonSearchWord('paypay', title);
	const url = 'https://www.amazon.co.jp/s?k=' + title;
	window.open(url, 'amazon_research')
}
function sendResearchToolParamForPaypay() {
	let href = $(location).attr('href');
	sendResearchToolExec(href.trim());
}
function setResearchToolButtonPaypayList() {
	// $('a[class^="ItemThumbnail__Component-"]').each(async function (index, element) {
	$('#itm a').each(async function (index, element) {
		let div = $('<div>').addClass('research-tool');

		let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索');
		let title = $(element).find('img').attr('alt')
		btn1.data('title', title);
		btn1.data('site', 'paypay');
		btn1.on('click', findAmazonForList);
		let div1 = $('<div>');
		div1.append(btn1);
		div.append(div1);

		let btn2 = $('<button>').addClass('send-btn').text('出 品 登 録');
		let href = $(element).attr('href');
		var url = 'https://paypayfleamarket.yahoo.co.jp' + href;
		btn2.data('url', url);
		btn2.on('click', sendResearchToolData);
		div.append(btn2);
		let div2 = $('<div>');
		div2.append(btn2);
		div.append(div2);

		$(element).after(div);

		let link = $(this).find('a');
		link.attr('target', '_blank');
	});
}

/**
 * eBay
 */
async function setResearchToolButtonEbay() {
	let div = $('<div>').addClass('research-tool');

	let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索');
	btn1.on('click', findAmazonForEbay);
	div.append(btn1);

	let ngSeller = false;
	const ngSellerCodeJson = await getNgSellerCodeJson();
	const ngSellerCodeArray = ngSellerCodeJson['eBay'];
	if (ngSellerCodeArray && 0 < ngSellerCodeArray.length) {
		const seller = $('#mainContent div[data-testid=x-sellercard-atf__profile-logo] a').attr('href');
		if (seller) {
			const sellerSplit = seller.split('?');
			if (sellerSplit && 0 < sellerSplit.length) {
				const sellerSplit2 = sellerSplit[1].split('&');
				if (sellerSplit2 && 0 < sellerSplit2.length) {
					const sellerSplit3 = sellerSplit2[0].split('=');
					if (sellerSplit3 && 0 < sellerSplit3.length) {
						const sellerCode = sellerSplit3[1];
						console.log(sellerCode);
						if (ngSellerCodeArray.includes(sellerCode)) {
							ngSeller = true;
						}
					}
				}
			}
		}
	}

	if (!ngSeller) {
		let btn2 = $('<button>').addClass('send-btn').text('出 品 登 録');
		btn2.on('click', sendResearchToolParam);
		div.append(btn2);
	}

	// $('#mainContent .x-buybox__price-section').prepend(div);
	// $('#mainContent div[data-testid=d-quantity]').after(div);
	$('#mainContent div[data-testid=x-price-section]').after(div);

}
async function findAmazonForEbay() {
	let title = $('#mainContent .x-item-title__mainTitle').text();
	title = title.replaceAll('#', '');
	title = title.replaceAll('&', '');
	const url = 'https://www.amazon.co.jp/s?k=' + title;
	window.open(url, 'amazon_research')
}
async function setResearchToolButtonEbayList() {
	console.log($('#srp-river-results ul .s-item .s-item__wrapper').length);

	$('#srp-river-results ul .s-item .s-item__wrapper').each(async function (index, element) {
		let div = $('<div>').addClass('research-tool');

		let btn1 = $('<button>').addClass('amazon-btn').text('Amazon検索');
		let title = $(element).find('img').attr('alt');
		title = title.replaceAll('#', '');
		title = title.replaceAll('&', '');
		btn1.data('title', title);
		btn1.data('site', 'eBay');
		btn1.on('click', findAmazonForList);
		div.append(btn1);
		let btn2 = $('<button>').addClass('send-btn').text('出 品 登 録');
		let url = $(element).find('.s-item__image-section .s-item__image a').attr('href');
		// console.log(url);
		btn2.data('url', url);
		btn2.on('click', sendResearchToolData);
		div.append(btn2);

		$(element).append(div);
	});
}

/**
 * 検索ワード送信
 */
async function sendAmazonSearchWord(site, word) {
	this.getResource('data/access_token.txt').then(r => {
		let token = r;
		// console.log('token:' + token);

		let item = {
			'site': site,
			'word': word,
			'token': token
		};

		$.ajax({
			type: 'POST',
			url: server + 'research-tool/amazon-search/',
			data: item,
			xhrFields: {
				withCredentials: true
			},
		}).then(function (data, textStatus, jqXHR) {
		}, function (jqXHR, textStatus, errorThrown) {
		});
	});
}
/**
 * 出品ツールに登録
 */
function sendResearchToolParam() {
	let url = $(location).attr('href');
	sendResearchToolExec(url, $(this));
}
function sendResearchToolData() {
	let url = $(this).data('url');
	sendResearchToolExec(url, $(this));
}
function sendResearchToolExec(url, button) {
	this.getResource('data/access_token.txt').then(r => {
		let token = r;

		let item = {
			'url': url,
			'token': token
		};
		$(button).text('送信しました。').css('color', 'red');

		$.ajax({
			type: 'POST',
			url: server + 'access-token/',
			data: item,
			xhrFields: {
				withCredentials: true
			},
		}).then(function (data, textStatus, jqXHR) {
		}, function (jqXHR, textStatus, errorThrown) {
		});
	});

}
async function findAmazonForList() {
	let title = $(this).data('title').trim();
	title = await titleConvert(title);
	let site = $(this).data('site');
	// await sendAmazonSearchWord(site, title);

	const url = 'https://www.amazon.co.jp/s?k=' + title;
	window.open(url, 'amazon_research')
}
async function getBlankList() {
	let blankResouce = await this.getResource('data/blank.txt').then(r => {
		return r;
	});

	let blankList = null;
	if (0 <= blankResouce.indexOf('\n\r')) {
		blankList = blankResouce.split('\n\r');
	} else if (0 <= blankResouce.indexOf('\n')) {
		blankList = blankResouce.split('\n');
	} else if (0 <= blankResouce.indexOf('\r')) {
		blankList = blankResouce.split('\r');
	} else {
		blankList = [];
		blankList.push(blankResouce);
	}

	let result = [];
	$.each(blankList, function (index, blank) {
		if (blank && 0 < blank.length) {
			result.push(blank.trim());
		}
	});
	return result;
}
async function getNgSellerNameJson() {
	let resouce = await this.getResource('data/ng-seller-name.txt').then(r => {
		return r;
	});
	return JSON.parse(resouce);
}
async function getNgSellerCodeJson() {
	let resouce = await this.getResource('data/ng-seller-code.txt').then(r => {
		return r;
	});
	return JSON.parse(resouce);
}
async function titleConvert(inTitle) {
	let blankList = await getBlankList();
	let outTitle = inTitle;
	$.each(blankList, function(index, blank) {
		outTitle = outTitle.replaceAll(blank.trim(), '');
	});
	return outTitle;
}
async function getResource(resource) {
	const res = await fetch(chrome.runtime.getURL(resource), { method: "GET" })
	const text = await res.text();
	// console.log('text:' + text);
	return text;
}
