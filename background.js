(function() {
    var btcPrice = 0;
    var change24hours = 0;
    var messari_btc_url = "https://messari.io/asset/bitcoin";
    var messari_btc_api_url = "https://data.messari.io/api/v1/assets/btc/metrics/market-data";
    
    function openPage() {
        browser.tabs.create({ url: messari_btc_url });
    }
    
    function refreshBadgeText(btcPrice, change24hours) {
        var badgeText = Math.floor(btcPrice / 1000) + "K";
        var titleText = "1 Bitcoin = $" + Math.floor(btcPrice) + "\n24 Hr. Change = " + Math.floor(change24hours*100)/100 + "%";
        
        browser.browserAction.setBadgeText({ text: badgeText });
        browser.browserAction.setTitle({ title: titleText });
    }
    
    function refreshBadge() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", messari_btc_api_url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                btcPrice = response.data.market_data.price_usd;
                change24hours = response.data.market_data.percent_change_usd_last_24_hours;
                refreshBadgeText(btcPrice, change24hours);
            }
        };
        xhr.send();
    }
    
    function setTimer() {
	// Update every 120,000 milliseconds = 120 seconds = 2 minute. Messari.io AP allows
	// 1000 free requests per day. Every two minute check results in 720 requests per day.
        window.setInterval(function() {
            refreshBadge();
        }, 120000); 
    }
    
    // Tap to open messari bitcoin page.
    browser.browserAction.onClicked.addListener(openPage);
    
    // Set badge background color.
    browser.browserAction.setBadgeBackgroundColor({ color: "#F39F16" });
    
    // Update bagde during load.
    refreshBadge();
    
    // Set periodic refreshs.
    setTimer();
    
})();

