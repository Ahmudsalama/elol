; (function (global) {
    global.requireConfig = {}, global.require = global.requireConfig;

    global.require.paths = global.require.paths || {};
    global.require.paths.score_ccf = "/Areas/ScoreCCF/js";
    global.require.paths.loglevel = global.require.paths.score_ccf + "/Vendor/loglevel.min";
    global.require.paths.jqueryNoConflict = global.require.paths.score_ccf + "/jquery.noconflict";
    global.require.paths.jquery = global.require.paths.score_ccf + "/Vendor/jquery-3.5.1";
    global.require.paths.jqueryTouchSwipe = global.require.paths.score_ccf + "/Vendor/jquery.touchSwipe";
    global.require.paths.underscore = global.require.paths.score_ccf + "/Vendor/underscore";
    global.require.paths.eventManager = global.require.paths.score_ccf + "/Events/EventManager";
    global.require.paths.moduleLoader = global.require.paths.score_ccf + "/ModuleLoader";
    global.require.paths.jqueryMigrate = global.require.paths.score_ccf + "/Vendor/jquery.migrate";
    global.require.paths['promise-polyfill'] = global.require.paths.score_ccf + "/polyfills/promise.min";
    global.require.paths['object-assign'] = global.require.paths.score_ccf + "/polyfills/object-assign.min";

    global.require.paths['score_ccf/XPerience/Actions/CompleteGoalAction'] = global.require.paths.score_ccf + "/XPerience/Actions/CompleteGoalAction";
    global.require.paths['score_ccf/XPerience/Actions/ContactVisitWithTheProfileCard'] = global.require.paths.score_ccf + "/XPerience/Actions/ContactVisitWithTheProfileCard";
    global.require.paths['score_ccf/XPerience/Actions/ShowAlertMessage'] = global.require.paths.score_ccf + "/XPerience/Actions/ShowAlertMessage";
    global.require.paths['score_ccf/XPerience/Actions/TrackClientEventAction'] = global.require.paths.score_ccf + "/XPerience/Actions/TrackClientEventAction";
    global.require.paths['score_ccf/XPerience/Conditions/ClickedCondition'] = global.require.paths.score_ccf + "/XPerience/Conditions/ClickedCondition";
    global.require.paths['score_ccf/XPerience/Conditions/GetsFocusCondition'] = global.require.paths.score_ccf + "/XPerience/Conditions/GetsFocusCondition";
    global.require.paths['score_ccf/XPerience/Conditions/LosesFocusCondition'] = global.require.paths.score_ccf + "/XPerience/Conditions/LosesFocusCondition";
    global.require.paths['score_ccf/XPerience/Conditions/OncePerPageViewCondition'] = global.require.paths.score_ccf + "/XPerience/Conditions/OncePerPageViewCondition";
    global.require.paths['score_ccf/XPerience/Conditions/SlideChangedCondition'] = global.require.paths.score_ccf + "/XPerience/Conditions/SlideChangedCondition";
    global.require.paths['score_ccf/XPerience/Conditions/SlideChangingCondition'] = global.require.paths.score_ccf + "/XPerience/Conditions/SlideChangingCondition";
    global.require.paths['score_ccf/XPerience/Conditions/VideoHasPlayedExactNSecondsCondition'] = global.require.paths.score_ccf + "/XPerience/Conditions/VideoHasPlayedExactNSecondsCondition";
    global.require.paths['score_ccf/XPerience/Conditions/VideoHasPlayedNSecondsOrMoreCondition'] = global.require.paths.score_ccf + "/XPerience/Conditions/VideoHasPlayedNSecondsOrMoreCondition";
    global.require.paths['score_ccf/XPerience/Conditions/VideoIsFinishedCondition'] = global.require.paths.score_ccf + "/XPerience/Conditions/VideoIsFinishedCondition";
    global.require.paths['score_ccf/XPerience/Conditions/VideoIsPausedCondition'] = global.require.paths.score_ccf + "/XPerience/Conditions/VideoIsPausedCondition";
    global.require.paths['score_ccf/XPerience/Conditions/VideoStartsToPlayCondition'] = global.require.paths.score_ccf + "/XPerience/Conditions/VideoStartsToPlayCondition";
    global.require.paths['score_ccf/XPerience/Contracts/UXModuleLike'] = global.require.paths.score_ccf + "/XPerience/Contracts/UXModuleLike";
    global.require.paths['score_ccf/XPerience/Contracts/XPContracts'] = global.require.paths.score_ccf + "/XPerience/Contracts/XPContracts";
    global.require.paths['score_ccf/XPerience/Elements'] = global.require.paths.score_ccf + "/XPerience/Elements";
    global.require.paths['score_ccf/XPerience/Enums/XPEnums'] = global.require.paths.score_ccf + "/XPerience/Enums/XPEnums";
    global.require.paths['score_ccf/XPerience/Utils/XPConditionJunction'] = global.require.paths.score_ccf + "/XPerience/Utils/XPConditionJunction";
    global.require.paths['score_ccf/XPerience/XPActionBase'] = global.require.paths.score_ccf + "/XPerience/XPActionBase";
    global.require.paths['score_ccf/XPerience/XPActionLoader'] = global.require.paths.score_ccf + "/XPerience/XPActionLoader";
    global.require.paths['score_ccf/XPerience/XPConditionBase'] = global.require.paths.score_ccf + "/XPerience/XPConditionBase";
    global.require.paths['score_ccf/XPerience/XPConditionLoader'] = global.require.paths.score_ccf + "/XPerience/XPConditionLoader";
    global.require.paths['score_ccf/XPerience/XPElementBase'] = global.require.paths.score_ccf + "/XPerience/XPElementBase";
    global.require.paths['score_ccf/XPerience/XPRuleLoader'] = global.require.paths.score_ccf + "/XPerience/XPRuleLoader";


    global.require.paths.async = global.require.paths.score_ccf + "/Vendor/require.async";
    global.require.paths.depend = global.require.paths.score_ccf + "/Vendor/require.depend";
    global.require.paths.font = global.require.paths.score_ccf + "/Vendor/require.font";
    global.require.paths.goog = global.require.paths.score_ccf + "/Vendor/require.goog";
    global.require.paths.image = global.require.paths.score_ccf + "/Vendor/require.image";
    global.require.paths.json = global.require.paths.score_ccf + "/Vendor/require.json";
    global.require.paths.mdown = global.require.paths.score_ccf + "/Vendor/require.mdown";
    global.require.paths.markdownConverter = global.require.paths.score_ccf + "/Vendor/Markdown.Converter";
    global.require.paths.noext = global.require.paths.score_ccf + "/Vendor/require.noext";
    global.require.paths.propertyParser = global.require.paths.score_ccf + "/Vendor/require.propertyParser";
    global.require.paths.text = global.require.paths.score_ccf + "/Vendor/require.text";

    global.require.shim = global.require.shim || {};
    global.require.shim.underscore = { exports: "_" };
    global.require.shim.jqueryTouchSwipe = { deps: ["jquery"] };
    global.require.shim.jqueryMigrate = { deps: ["jquery"] };

    global.require.map = global.require.map || {};
    global.require.map["*"] = global.require.map["*"] || {};
    global.require.map["*"].jquery = "jqueryNoConflict";
    global.require.map.jqueryNoConflict = { "jquery": "jquery" };
})(this /* global */);