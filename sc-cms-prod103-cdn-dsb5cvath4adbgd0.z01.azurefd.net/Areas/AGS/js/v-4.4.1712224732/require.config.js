window.require = window.require || {};
window.require.baseUrl = "Areas/AGS/js.html";
window.require.waitSeconds = 0;
window.require.urlArgs = "v=638478215309532881";


window.require.paths = window.require.paths || {};

window.require.paths.AGS = "/Areas/AGS/js";
window.require.paths.Ellipsis = "/Areas/AGS/js/vendor/jquery.ellipsis.min";
window.require.paths.SlickSlider = "/Areas/AGS/js/Vendor/slick.min";
window.require.paths.Debounce = "/Areas/AGS/js/vendor/jquery.ba-throttle-debounce.min";
window.require.shim = window.require.shim || {};
window.require.shim.bootstrap                 = { deps: ["jquery"] };
window.require.shim.matchHeight               = { deps: ["jquery"] };
window.require.shim.jqueryValidate            = { deps: ["jquery"] };
window.require.shim.jqueryUnobtrusiveAjax     = { deps: ["jquery", "jqueryValidate", "jqueryValidateUnobtrusive"] };
window.require.shim.jqueryValidateUnobtrusive = { deps: ["jqueryValidate"] };
window.require.shim.scorevalidation           = { deps: ["jqueryUnobtrusiveAjax", "jqueryValidateUnobtrusive"] };
window.require.shim.Ellipsis                  = { deps: ["jquery"] };
window.require.shim.SlickSlider               = { deps: ["jquery"] };
window.require.shim.Debounce                  = { deps: ["jquery"] };

//Minified overrides to large score 3rd party libraries
//Score sets these dependencies in their scorecff/require.config.js but they are not minified
//We've manually minified them and added copies in enterprise and we're overriding the references here so that they can be minified.
window.require.paths.underscore = "/Areas/Enterprise/js/vendor/underscore.min";
window.require.paths.typeahead = "/Areas/Enterprise/js/vendor/typeahead.jquery.min";
window.require.paths.jqueryTouchSwipe = "/Areas/Enterprise/js/vendor/jquery.touchSwipe.min";

