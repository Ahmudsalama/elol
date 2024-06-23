(function() {
    window.initData = {
        'widgetCode': "o4jxnX3Q",
        'CDN': "https://d1hgczpbubj217.cloudfront.net/",
        'google_analytics_code': "G-GT08RFMYEB"
    };
    var analytics_import = document.createElement('script');
    analytics_import.type = "text/javascript";
    analytics_import.async = false;
    analytics_import.src = "https://d1hgczpbubj217.cloudfront.net/video-widget/assets/js/analytics.prod.js";
    document.head.appendChild(analytics_import);
    var imported = document.createElement('script');
    imported.type = "text/javascript";
    imported.async = false;
    imported.src = "https://d1hgczpbubj217.cloudfront.net/video-widget/assets/js/main.js";
    if (imported.readyState) {
        imported.onreadystatechange = function () {
            if (imported.readyState == "loaded" || imported.readyState == "complete") {
                imported.onreadystatechange = null;
                W.initWidget(initData);
            }
        }
    } else {
        imported.onload = function () {
            W.initWidget(initData);            
        }
    }
    document.head.appendChild(imported);
})();