;(function(global) {
    global.require = global.require || {};

    global.require.paths = global.require.paths || {};
    global.require.paths.score_bootstrap = "/Areas/ScoreBootstrapUI/js";
    global.require.paths.scorebootstrap = global.require.paths.score_bootstrap + "/BootstrapUI";
    global.require.paths.bootstrapAmdFix = global.require.paths.score_bootstrap + "/BootstrapUI.amdfix";
    global.require.paths.errorHandler = global.require.paths.score_bootstrap + "/Utils/ErrorHandler";
    global.require.paths.scoreunobtrusive = global.require.paths.score_bootstrap + "/score.jquery.validate.unobtrusive";

    // vendor
    global.require.paths.bootstrap = global.require.paths.score_bootstrap + "/Vendor/bootstrap.min";
    global.require.paths.matchHeight = global.require.paths.score_bootstrap + "/Vendor/jquery.matchHeight-min";
    global.require.paths.knockout = global.require.paths.score_bootstrap + "/Vendor/knockout.min";
    global.require.paths.ko_extended = global.require.paths.score_bootstrap + "/knockout.extended";
    global.require.paths.jqueryValidate = global.require.paths.score_bootstrap + "/Vendor/jquery.validate.1.12.0.min";
    global.require.paths.jqueryUnobtrusiveAjax = global.require.paths.score_bootstrap + "/Vendor/jquery.unobtrusive-ajax.min";
    global.require.paths.jqueryValidateUnobtrusive = global.require.paths.score_bootstrap + "/Vendor/jquery.validate.unobtrusive.min";
    global.require.paths.imagesLoaded = global.require.paths.score_bootstrap + "/Vendor/jquery.imagesLoaded.min";
    global.require.paths.typeahead = global.require.paths.score_bootstrap + "/Vendor/typeahead.jquery";
    global.require.paths.picturefill = global.require.paths.score_bootstrap + "/vendor/picturefill.min";
    global.require.paths.bootstrapslider = global.require.paths.score_bootstrap + "/vendor/bootstrap-slider.min";
    global.require.paths.cssEscape = global.require.paths.score_bootstrap + "/Vendor/css.escape";
    global.require.paths.slick = global.require.paths.score_bootstrap + "/Vendor/slick";

    // shim
    global.require.shim = global.require.shim || {};
    global.require.shim.bootstrap = { deps: ["jquery"] };
    global.require.shim.scorebootstrap = { deps: ["bootstrapAmdFix", "jqueryTouchSwipe"] };
    global.require.shim.bootstrapAmdFix = { deps: ["bootstrap"] }
    global.require.shim.matchHeight = { deps: ["jquery"] };
    global.require.shim.jqueryValidate = { deps: ["jquery"] };
    global.require.shim.jqueryUnobtrusiveAjax = { deps: ["jquery", "jqueryValidate", "jqueryValidateUnobtrusive"] };
    global.require.shim.jqueryunobtrusive = { deps: ["jquery", "jqueryValidate"] };
    global.require.shim.jqueryplaceholder = { deps: ["jquery"] };
    global.require.shim.scoreunobtrusive = { deps: ["jquery", "jqueryValidate", "jqueryValidateUnobtrusive", "jqueryUnobtrusiveAjax"] };
    global.require.shim.jqueryValidateUnobtrusive = { deps: ["jquery", "jqueryValidate"] };
    global.require.shim.knockout = { deps: ["jquery"], exports: "ko" };

    // map
    global.require.map = global.require.map || {};
    global.require.map["*"] = global.require.map["*"] || {};
    global.require.map["*"]["moduleLoader"] = "score_ccf/ModuleLoader";
    global.require.map['*'].knockout = "ko_extended";
    global.require.map.ko_extended = { "knockout": "knockout" };
    global.require.map.ko_mapping = { "knockout": "knockout" };

})(this);