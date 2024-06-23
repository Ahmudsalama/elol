/*
 * SmartRecruiters - https://www.smartrecruiters.com
 * Copyright (C) 2010 SmartRecruiters
 * Author: Dominik Malysa
 *
 * V 3.0 SmartRecruiters job list widget
 *
 * Example usage:
 <script type='text/javascript' src='https://www.smartrecruiters.com/img/script/smartWidget/smart_widget.js'></script>
 <script type='text/javascript'>
 widget({
 "company_code":"49306135",                 - code of your company to print your jobs
 "group_id":"test",							- code of group to print your jobs
 "bg_color_widget":"#ffffff",             	- job table background
 "bg_color_headers":"#969696",            	- table header background
 "txt_color_headers":"#292929",            	- table header text color
 "bg_color_even_row":"#e0e0e0",            	- table even row background color
 "bg_color_odd_row":"#f7f7f7",            	- table odd row background color
 "txt_color_job":"#3d3d3d",                	- table content text color
 "bg_color_links":"#99ccff",                - table row background color
 "custom_css_url":"https://www.smartrecruiters.com/img/style/smartWidget/smart_widget.css", - external custom css for widget styling
 "widget_width":"630",                    	- widget width in px
 "widget_height":"400",                    	- widget height in px
 "jobs_number":"10",                        - number of jobs shown in widget
 "job_title":"true",                        - job title column visibility
 "type_of_employment":"true",            	- type of employment column visibility
 "department":"true",                    	- department column visibility
 "location":"true",                        	- job location column visibility
 "occupational_area":"true",                - occupational area column visibility
 "published_since":"true",                	- job published since date column visibility
 "dateFormat":"us"/"eu",                    - date format of items in the published since date column, either M/D or D/M
 "remove_headers":"true",                	- table header visibility
 "display_headers":"true,"					- table header visibility
 "add_search":"false",						- search bar and pagination visibility
 "filter_departments":"Finance",            - company department filter (either name for version <= 1.3.10, or department ID for version 1.3.10+)
 "departments_field_id":"5b2a296486"        - ID of org field that keeps information about department
 "filter_locations":"San Francisco"         - job location filter
 "auth":"e54cc258-7cf8-43eb-afe4-c2ffe90d8e00" - optional parameter - token allowing accessing for Internal postings
 });
 </script>
 */
//This array is needed in jobWidgetColorPicker.js to create color pickers

window.JobWidget = window.JobWidget || {};

window.JobWidget.colorPickerArray = {
    bg_color_widget: '.srJobList',
    bg_color_headers: '.srJobListTitles th',
    txt_color_headers: '.srJobListTitles th nobr',
    bg_color_even_row: '.srJobList .srJobListJobEven *',
    bg_color_odd_row: '.srJobList .srJobListJobOdd *',
    txt_color_job: '.srJobListJobEven td, .srJobListJobOdd td',
    bg_color_links: '.srJobList .srJobListJobEven:hover *,.srJobList .srJobListJobOdd:hover *'
};

var load;
window.widgetList = window.widgetList || [];
window.widget =
    window.widget ||
    (function (window) {
        // load "spl-job-location" component from SPL library
        loadScriptFromUrl('https://static.smartrecruiters.com/job-widget/1.6.10/script/spl.bundle.min.js', 3);

        var jobNumber = 100;

        load = function () {
            load.getScript('https://static.smartrecruiters.com/job-widget/1.6.10/script/jquery.min.js');
            load.tryReady(0);
        };

        load.getScript = function (filename) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = filename;
            script.async = true;
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (this.readyState === 'loaded') {
                        jQuery.each(widgetStock, function (index, value) {
                            var widgetElement = value;
                            widget(
                                widgetElement.widget_json,
                                widgetElement.widget_element_id,
                                widgetElement.widget_refresh_data,
                                widgetElement.widget_callback
                            );
                        });
                    }
                };
            } else {
                script.onload = function () {
                    jQuery.each(widgetStock, function (index, value) {
                        var widgetElement = value;
                        if (widgetElement.widget_json !== undefined) {
                            widget(
                                widgetElement.widget_json,
                                widgetElement.widget_element_id,
                                widgetElement.widget_refresh_data,
                                widgetElement.widget_callback
                            );
                        }
                    });
                };
            }
            document.getElementsByTagName('head')[0].appendChild(script);
        };

        load.tryReady = function (time_elapsed) {
            if (typeof jQuery === 'undefined') {
                if (time_elapsed <= 5000) {
                    setTimeout('load.tryReady(' + (time_elapsed + 200) + ')', 200);
                } else {
                    alert('Timed out while loading jQuery.');
                }
            } else {
                jQuery.noConflict();
            }
        };

        if (typeof jQuery === 'undefined') {
            load();
        }

        function defaultContent() {
            return translate('filter_by');
        }
        var widgetLanguage = 'en';
        var widgetStock = [];
        var widgetJSON = {};
        var filerJSON = {};
        var numberOfWidgets = 0;

        function widget(json, element_id, refresh_data, callback) {
            var widgetElement;
            var localWidgetList;
            var widgetID;

            widgetLanguage = determineWidgetLanguage(json);

            if (typeof jQuery === 'undefined') {
                widgetStock.push({
                    widget_json: json,
                    widget_element_id: element_id,
                    widget_refresh_data: refresh_data,
                    widget_callback: callback
                });
            } else {
                localWidgetList = jQuery('.job_widget');
                if (localWidgetList.length == 0) {
                    localWidgetList = jQuery("[src$='/smart_widget.js']").next('script');
                }
                localWidgetList.each(function (index) {
                    jQuery(this).attr('id', 'job_widget_' + index);
                });
                if (window.widgetList == undefined) {
                    window.widgetList = new Array();
                }

                loadCSS(json.custom_css_url);

                if (element_id == undefined || jQuery('#' + element_id).length == 0) {
                    var div = document.createElement('div');
                    div.setAttribute('class', 'smartWidget');
                    div.id = 'smartWidget' + numberOfWidgets;
                    element_id = div.id;
                    jQuery(jQuery('#job_widget_' + numberOfWidgets)).after(jQuery(div));
                    numberOfWidgets++;
                    widgetElement = jQuery(div);
                } else {
                    widgetID = '#' + element_id;
                    widgetElement = jQuery(widgetID);
                }
                widgetElement.html('');
                widgetElement.addClass('loading');
                widgetJSON[element_id] = json;
                initFilterValues(json, element_id);
                setCurrentPage(element_id, 0);
                setOffset(element_id, 0);
                setLimit(element_id, json.jobs_number);
                if (refresh_data == undefined || refresh_data) {
                    if (
                        (json.company_code !== undefined && json.company_code.length > 0) ||
                        (json.group_id !== undefined && json.group_id.length > 0)
                    ) {
                        executeQuery(element_id, null, callback);
                        addEvents(element_id);
                    }
                } else {
                    data = window.widgetList[element_id];
                    createWidgetContent(json.company_code, data, element_id, json, widgetElement, callback, false);
                }
            }
        }

        function initFilterValues(json, widgetID) {
            filerJSON[widgetID] = {};
            if (json) {
                if (json.filter_departments_name) {
                    filerJSON[widgetID].filter_departments = json.filter_departments_name;
                }
                if (json.filter_locations) {
                    filerJSON[widgetID].filter_locations = json.filter_locations;
                }
                if (json.filter_languages) {
                    filerJSON[widgetID].filter_languages = json.filter_languages;
                }
                for (var key in json) {
                    if (isCustomField(key)) {
                        filerJSON[widgetID][key] = json[key];
                    }
                }
            }
        }

        function toList(obj) {
            if (typeof obj === 'string') {
                return [obj];
            } else {
                return obj || [];
            }
        }

        function filterValAllElements(array) {
            var hasValAll = false;
            for (var i = 0; i < array.length; i++) {
                if (array[i] && array[i].indexOf('val_all_') >= 0) {
                    hasValAll = true;
                    break;
                }
            }
            return hasValAll ? [] : array;
        }

        function executeQuery(widgetID, queryString, callback, offset, limit, remoteFilter) {
            var json = extendWithFilters(widgetJSON[widgetID], widgetID);
            var company_code = json.company_code;
            var group_code = json.group_id;
            var jobListURL;
            var domain;
            var locationType;

            offset = offset || 0;
            limit = limit || getLimit(widgetID) || jobNumber;
            locationType = remoteFilter ? 'REMOTE' : 'ANY';

            if (json.api_url && json.api_url.length > 0) {
                domain = json.api_url;
            } else {
                domain = 'https://api.smartrecruiters.com';
            }
            if (company_code) {
                jobListURL = domain + '/job-api/public/search/widgets/' + company_code + '/postings?dcr_ci=' + company_code;
            } else if (group_code) {
                jobListURL = domain + '/job-api/public/search/companyGroups/' + group_code + '/postings?';
            } else {
                return;
            }
            if (queryString && queryString !== defaultContent()) {
                jobListURL += '&q=' + queryString;
            }

            var keyFilterTranslation = {
                filter_locations: 'location',
                filter_companies: 'company_name',
                filter_departments_name: 'facet_department',
                filter_languages: 'languageCode'
            };

            if (offset !== undefined) {
                jobListURL += '&offset=' + offset;
            }

            if (limit !== undefined) {
                jobListURL += '&limit=' + limit;
            }

            var filterArray = [];
            var items;

            for (var key in json) {
                items = [];
                if (isFilterParam(key, keyFilterTranslation)) {
                    if (filerJSON && filerJSON[widgetID] && filerJSON[widgetID][key]) {
                        var filters = filerJSON[widgetID][key];
                        if (jQuery.isArray(filters)) {
                            items = filters;
                        } else {
                            items = [filters];
                        }
                    }
                    items = filterValAllElements(items);
                    if (items && items.length > 0) {
                        filterArray.push(
                            getParamNameForFilter(key, keyFilterTranslation) + ':(' + encodeURIComponent(items.join(';')) + ')'
                        );
                    }
                }
            }

            if (json.auth) {
                jobListURL += '&token=' + json.auth;
            }

            if (json.jobAdType) {
                jobListURL += '&jobAdType=' + json.jobAdType;
            }

            jobListURL += '&fq=' + filterArray.join(',');
            jobListURL += '&customFields=' + resolveDepartmentsFilter(json.departments_field_id, json.filter_departments);
            jobListURL += '&langCode=' + widgetLanguage;
            jobListURL += '&locationType=' + locationType;

            var widgetElement = jQuery('#' + widgetID);
            jQuery.ajax({
                url: jobListURL,
                dataType: 'jsonp',
                type: 'GET',
                success: function (data) {
                    window.widgetList[widgetID] = data;
                    createWidgetContent(company_code, data, widgetID, json, widgetElement, callback, remoteFilter);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    createEmptyWidget();
                }
            });
        }

        function resolveDepartmentsFilter(departmentsFieldId, departmentFilterIds) {
            if (!departmentsFieldId || !departmentFilterIds) {
                return '';
            }

            var departmentFilters = [];
            var departmentIds = jQuery.isArray(departmentFilterIds) ? departmentFilterIds : [departmentFilterIds];
            for (var i = 0; i < departmentIds.length; i++) {
                departmentFilters.push(departmentsFieldId + '|' + departmentIds[i]);
            }

            return encodeURIComponent(departmentFilters.join(','));
        }

        function extendWithFilters(orginalJson, widgetID) {
            var json = orginalJson;
            if (filerJSON && filerJSON[widgetID]) {
                json = jQuery.extend({}, orginalJson, filerJSON[widgetID]);
            }
            return json;
        }

        var customFieldRegexp = /^custom_field_(.*)/;

        function isFilterParam(key, translations) {
            if (key) {
                return translations[key] || key.match(customFieldRegexp);
            }
            return false;
        }

        function isCustomField(key) {
            if (key) {
                return key.match(customFieldRegexp);
            }
            return false;
        }

        function getParamNameForFilter(key, translations) {
            var customFieldMatch = key.match(customFieldRegexp);
            if (customFieldMatch) {
                return 'custom_field_value_id_' + customFieldMatch[1];
            } else {
                return translations[key];
            }
        }

        function addEvents(widgetID) {
            var remoteFilter;
            jQuery('#' + widgetID).undelegate('.srSearchOptionListElement', 'click');
            jQuery('#' + widgetID).undelegate('.srFilterRemoteElement', 'change');
            jQuery('#' + widgetID).undelegate('.srSearch .srSearchOption', 'click');
            jQuery('#' + widgetID).undelegate('.srSearchForm', 'submit');
            jQuery('#' + widgetID).undelegate('.srSearchButton', 'click');
            jQuery('#' + widgetID).undelegate('.srSearchInput', 'keypress');
            jQuery('html').unbind('click');
            jQuery('#' + widgetID).delegate('.srSearchOptionListElement', 'click', function () {
                var selectedElement = jQuery(this).find('.srSearchOptionListElementText').html();
                remoteFilter = jQuery('.srFilterRemoteElement').hasClass('srFilterRemoteElementChecked');
                jQuery(this).siblings().removeClass('srSearchOptionListElementChecked');
                if (jQuery(this).hasClass('srSearchOptionListElementChecked')) {
                    jQuery(this).removeClass('srSearchOptionListElementChecked');
                } else {
                    jQuery(this).parents('ul').prev().html(add3Dots(selectedElement, 10));
                    jQuery(this).addClass('srSearchOptionListElementChecked');
                }
                setCurrentPage(widgetID, 0);
                executeQueryWithFilter(this, remoteFilter);
            });
            jQuery('#' + widgetID).delegate('.srSearch .srSearchOption', 'click', function () {
                var listElement = jQuery(this).children('.srSearchOptionList');
                listElement.children().length > 0 ? listElement.removeClass('none') : listElement.addClass('none');
                if (jQuery(this).children('.srSearchOptionList').is(':visible')) {
                    jQuery(this).children('.srSearchOptionList').slideUp('fast');
                } else {
                    jQuery(this).children('.srSearchOptionList').slideDown('fast');
                }
                return false;
            });
            jQuery('#' + widgetID).delegate('.srSearchForm', 'submit', function (e) {
                e.preventDefault();
            });
            jQuery('#' + widgetID).delegate('.srSearchButton', 'click', function () {
                setCurrentPage(widgetID, 0);
                executeQueryWithFilter(this, remoteFilter);
            });
            jQuery('#' + widgetID).delegate('.srSearchInput', 'keypress', function (e) {
                if (e.keyCode == 13) {
                    setCurrentPage(widgetID, 0);
                    executeQueryWithFilter(this, remoteFilter);
                }
            });
            jQuery('#' + widgetID).delegate('.srFilterRemoteElement', 'change', function (e) {
                if (jQuery(e.target).hasClass('srFilterRemoteElementChecked')) {
                    jQuery(e.target).removeClass('srFilterRemoteElementChecked');
                    setCurrentPage(widgetID, 0);
                    executeQueryWithFilter(this, false);
                } else {
                    jQuery(e.target).addClass('srFilterRemoteElementChecked');
                    setCurrentPage(widgetID, 0);
                    executeQueryWithFilter(this, true);
                }
            });
            jQuery('html').bind('click', function () {
                jQuery('.srSearchOptionList').slideUp('fast');
            });
        }

        function getWidgetId(element) {
            return jQuery(element).parents('.smartWidget, #widget_content').attr('id');
        }

        function getCurrentPage(id) {
            return filerJSON[id].currentPage;
        }

        function setCurrentPage(id, value) {
            filerJSON[id].currentPage = value;
        }

        function getPageCount(id) {
            return filerJSON[id].pageCount;
        }

        function setPageCount(id, value) {
            filerJSON[id].pageCount = value;
        }

        function getOffset(id) {
            return filerJSON[id].offset;
        }

        function setOffset(id, value) {
            filerJSON[id].offset = value;
        }

        function getLimit(id) {
            return filerJSON[id].limit;
        }

        function setLimit(id, value) {
            filerJSON[id].limit = value;
        }

        function executeQueryWithFilter(filter, remoteFilter) {
            var filterObject = jQuery(filter);
            var widgetID = filterObject.parents('.smartWidget, #widget_content').attr('id');
            var filerID = filterObject.parents('.srSearchOption').attr('id');
            if (!filerJSON[widgetID]) {
                filerJSON[widgetID] = {};
            }
            if (filterObject.hasClass('srSearchOptionListElementChecked') && !filterObject.hasClass('srSearchOptionClearListElement')) {
                filerJSON[widgetID][keyFacetToFilterTranslation[filerID]] = filterObject
                    .children('.srSearchOptionListElementText')
                    .attr('data-filter-value');
            } else {
                filerJSON[widgetID][keyFacetToFilterTranslation[filerID]] = restoreFilter(widgetID, keyFacetToFilterTranslation[filerID]);
            }
            var queryString = escapeHtml(
                jQuery('#' + widgetID)
                    .find('.srSearchInput')
                    .val() || ''
            );
            if (queryString !== defaultContent()) {
                filerJSON[widgetID]['queryString'] = queryString;
            } else {
                filerJSON[widgetID]['queryString'] = '';
            }

            executeQuery(widgetID, queryString, null, null, null, remoteFilter);
        }

        function executeCurrentQuery(offset, limit, widgetId) {
            var queryString = filerJSON[widgetId]['queryString'];
            executeQuery(widgetId, queryString, null, offset, limit);
        }

        function loadCSS(url) {
            var targetelement = 'link';
            var targetattr = 'href';
            var allsuspects = document.getElementsByTagName(targetelement);
            var present = false;
            for (var i = allsuspects.length; i >= 0; i--) {
                if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr) == url) {
                    present = true;
                }
            }
            if (!present) {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.media = 'screen';
                link.setAttribute('href', url);
                if (typeof link !== 'undefined') {
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
            }
        }

        function populateColorInputs() {
            for (var key in window.JobWidget.colorPickerArray) {
                if (window.JobWidget.colorPickerArray.hasOwnProperty(key)) {
                    var fieldID = key + '_field';
                    var selectorID = key + '_selector';
                    if (key.indexOf('bg_color') === 0) {
                        css = 'backgroundColor';
                    } else {
                        css = 'color';
                    }
                    if (jQuery('#' + fieldID).val() != undefined && jQuery('#' + fieldID).val().length != 0) {
                        var hex = jQuery('#' + fieldID).val();
                        var colorString = hex2rgb(hex);
                    } else {
                        var colorString = jQuery(window.JobWidget.colorPickerArray[key]).css(css);
                        if (colorString != undefined && colorString.substr(0, 1) == '#') {
                            var hex = colorString;
                            colorString = hex2rgb(colorString);
                        } else {
                            var hex = rgb2hex(colorString);
                        }
                    }
                    if (colorString != undefined) {
                        jQuery('#' + fieldID).val(hex);
                        jQuery('#' + fieldID).css('backgroundColor', colorString);
                        jQuery('#' + fieldID)
                            .parents('.srWidgetInputContainer')
                            .css('backgroundColor', hex);
                        jQuery('#' + fieldID)
                            .prevAll('.jobWidgetPageColorField')
                            .css('backgroundColor', hex);
                        //jQuery("#" + fieldID).parents(".srWidgetInputContainer").find("div").css('backgroundColor', hex);
                        jQuery('#' + selectorID).ColorPickerSetColor(hex);
                    }
                }
            }
        }

        function rgb2hex(rgb) {
            if (rgb != undefined) {
                rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                if (rgb != null) {
                    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
                } else {
                    return '';
                }
            }
            return '';
        }

        function hex(x) {
            return ('0' + parseInt(x).toString(16)).slice(-2);
        }

        function hex2rgb(hex) {
            var c,
                o = [],
                k = 0,
                m = hex.match(/^#(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})|([0-9a-f])([0-9a-f])([0-9a-f]))$/i);
            if (!m) return 'rgb(0,0,0)';
            for (var i = 2, s = m.length; i < s; i++) {
                if (undefined === m[i]) continue;
                c = parseInt(m[i], 16);
                o[k++] = c + (i > 4 ? c * 16 : 0);
            }
            return 'rgb(' + o[0] + ',' + o[1] + ',' + o[2] + ')';
        }

        function findCustomFieldName(data) {
            if (!data.results || !data.results.length > 0) {
                return 'Custom Field';
            }

            for (var i = 0; i < data.results.length; i++) {
                var cfValues = data.results[i].customFieldValues;
                if (cfValues && cfValues.length > 0 && cfValues[0].fieldLabel) {
                    return cfValues[0].fieldLabel;
                }
            }

            return 'Custom Field';
        }

        function createWidgetContent(companyIdentifier, data, widgetID, json, widgetElement, callback, remoteFilter) {
            if (data === undefined) {
                return false;
            }
            var htmlContent = '';
            if (json.custom_css_url != undefined && json.custom_css_url.length > 0) {
                htmlContent = htmlContent + "<link href='" + json.custom_css_url + "' type='text/css' rel='stylesheet'>";
            }
            //SearchBar
            if (json.add_search && json.add_search === 'true') {
                htmlContent += createSearchBar(data, widgetID, json, remoteFilter);
            }

            //Content Table
            //Columns Header
            htmlContent = htmlContent + "<table border='1' class='srJobList' style='display:none;'>";
            if (json.remove_headers == undefined || (json.remove_headers != undefined && json.remove_headers != 'true')) {
                json.$customFieldName = findCustomFieldName(data);
                htmlContent = htmlContent + createHeader(json);
            }
            //Data
            var countOfItems = 0;
            var countOnPage = json.jobs_number || jobNumber;
            if (data.results != undefined) {
                countOfItems = data.results.length;

                if (json.job_ad_url && json.job_ad_url.length > 0) {
                    var domain = json.job_ad_url;
                } else {
                    var domain = 'https://jobs.smartrecruiters.com';
                }

                var translatedDepartments = mapDepartmentsById(data);
                jQuery.each(data.results, function (i, vacancy) {
                    var link = '"' + domain + '/' + vacancy.companyIdentifier + '/' + vacancy.publicationId;

                    // if is internal
                    if (vacancy && vacancy.destinationCode && vacancy.destinationCode.toLowerCase() === 'internal_widget') {
                        link = '"' + domain + '/ni/' + vacancy.companyIdentifier + '/' + vacancy.uuid;
                    }

                    if (vacancy.urlJobName) {
                        link = link + '-' + vacancy.urlJobName;
                    }

                    if (json.trid) {
                        link += '?trid=' + json.trid;
                    }

                    link += '"';

                    if (i % 2 === 0) {
                        htmlContent = htmlContent + "<tr tabindex='0' class='srJobListJobOdd' onClick ='window.open(" + link + ");'>";
                    } else {
                        htmlContent = htmlContent + "<tr tabindex='0' class='srJobListJobEven' onClick ='window.open(" + link + ");'>";
                    }
                    if (json.job_title !== 'undefined' && json.job_title == 'true') {
                        htmlContent += buildContentElement('srJobListJobTitle', escapeHtml(vacancy.vacancyName || ''));
                    }
                    if (typeof json.group_id != 'undefined' && json.group_id.length > 0) {
                        htmlContent += buildContentElement('srJobListCompanyName', escapeHtml(vacancy.companyName || ''));
                    }
                    if (json.ref_number !== 'undefined' && json.ref_number == 'true') {
                        htmlContent += buildContentElement('srJobListRefNumber', escapeHtml(vacancy.refNumber || ''));
                    }
                    if (json.type_of_employment != 'undefined' && json.type_of_employment == 'true') {
                        htmlContent += buildContentElement('srJobListTypeOfEmployment', escapeHtml(vacancy.typeOfEmployment || ''));
                    }
                    if (json.department != 'undefined' && json.department == 'true') {
                        var label = translatedDepartments[vacancy.departmentId] || vacancy.department;
                        htmlContent += buildContentElement('srJobListDepartment', escapeHtml(label || ''));
                    }
                    if (json.location != 'undefined' && json.location == 'true') {
                        var location = buildLocation(vacancy);
                        htmlContent += buildContentElement(
                            'srJobListLocation',
                            '<spl-job-location formattedAddress="' +
                                escapeHtml(location || '') +
                                '" workplaceDescription="' +
                                getWorkPlaceDescription(vacancy.locationRemote, translate('remote_info')) +
                                '" workplaceType="' +
                                getWorkPlaceType(vacancy.locationRemote) +
                                '"></spl-job-location>'
                        );
                    }
                    if (json.occupational_area !== undefined && json.occupational_area == 'true') {
                        htmlContent += buildContentElement('srJobListOccupationalArea', vacancy.occupationalArea || '');
                    }
                    if (json.published_since != 'undefined' && json.published_since == 'true') {
                        var releaseDate = vacancy.releasedDate;
                        var formattedDate = '';
                        if (releaseDate && json.dateFormat === 'eu') {
                            formattedDate = formatToEuDate(new Date(releaseDate));
                        } else {
                            formattedDate = formatToUsDate(new Date(releaseDate));
                        }
                        htmlContent += buildContentElement('srJobListPublishedSince', formattedDate);
                    }
                    if (json.custom_field != 'undefined' && json.custom_field == 'true') {
                        var customValueLabel =
                            vacancy.customFieldValues && vacancy.customFieldValues.length > 0
                                ? vacancy.customFieldValues[0].valueLabel
                                : '';
                        htmlContent += buildContentElement('srJobListCustomField', customValueLabel);
                    }
                    htmlContent = htmlContent + '</tr>';
                });
            }
            htmlContent = htmlContent + '</table>';

            if (json.add_search && json.add_search === 'true') {
                htmlContent = htmlContent + createPagination(countOfItems, countOnPage, widgetID);
            }
            jQuery('.srPagesTextPrevious').unbind('click');
            jQuery('.srPagesTextNext').unbind('click');

            widgetElement.html(htmlContent);

            addKeyDownListenerToRows(widgetElement);

            jQuery('.srPagesTextPrevious').bind('click', prev);
            jQuery('.srPagesTextNext').bind('click', next);

            var link = widgetElement.find('link');
            if (link.length > 0) {
                link.after(createCSS(json, widgetElement));
            } else {
                widgetElement.prepend(createCSS(json, widgetElement));
            }
            widgetElement.find('table').fadeIn('fast', function () {
                if (callback != undefined && jQuery.isFunction(eval(callback))) {
                    eval(callback).call();
                }
            });
            widgetElement.removeClass('loading');
            if (typeof jQuery('#widget_content').parents('#srWidgetPreviewContainer').AjaxIndicator == 'function') {
                jQuery('#widget_content').parents('#srWidgetPreviewContainer').AjaxIndicator('hide');
            }
            jQuery('.srSearchOptionList').each(function () {
                if (jQuery(this).css('height').replace('px', '') == 0) {
                    jQuery(this).addClass('none');
                } else if (jQuery(this).css('height').replace('px', '') <= 240) {
                    jQuery(this).css('overflow-y', 'auto');
                    jQuery(this).removeClass('none');
                } else {
                    jQuery(this).css('overflow-y', 'scroll');
                    jQuery(this).removeClass('none');
                }
            });
            jQuery('.srSearchOptionList .srSearchOptionListElementChecked').each(function () {
                jQuery(this)
                    .parent()
                    .prev('.srSearchOptionText')
                    .html(add3Dots(jQuery(this).find('.srSearchOptionListElementText').html(), 10));
            });
            return true;
        }

        function addKeyDownListenerToRows(widgetElement) {
            const trElements = widgetElement.find('tr');

            trElements.each(function () {
                const currentTr = jQuery(this);
                currentTr.on('keydown', function (event) {
                    if (event.key === 'Enter' || event.keyCode === 13) {
                        currentTr.click();
                    }
                });
            });
        }

        function mapDepartmentsById(data) {
            return mapDepartments(data, 'externalId');
        }

        function mapDepartmentsByLabel(data) {
            return mapDepartments(data, 'label');
        }

        function mapDepartments(data, field) {
            var departments = {};
            if (data.companyDepartments) {
                jQuery.each(data.companyDepartments, function (index, value) {
                    departments[value[field]] = value.translatedLabel;
                });
            }
            return departments;
        }

        function buildLocation(vacancy) {
            var location = [];
            location.push(vacancy.location);
            if (
                vacancy.regionAbbreviation &&
                vacancy.countryAbbreviation &&
                (vacancy.countryAbbreviation.toLowerCase() === 'us' || vacancy.countryAbbreviation.toLowerCase() === 'au')
            ) {
                location.push(vacancy.regionAbbreviation);
            } else if (vacancy.countryName) {
                location.push(vacancy.countryName);
            }
            return location.join(', ');
        }

        function buildContentElement(className, content, title) {
            return title
                ? "<td class='" + className + "' title='" + title + "'>" + content + '</td>'
                : "<td class='" + className + "'>" + content + '</td>';
        }

        function createEmptyWidget() {}

        function createCSS(json, widgetElement) {
            var ss1 = document.createElement('style');
            ss1.setAttribute('type', 'text/css');

            var styleContent = '';
            styleContent += '#' + widgetElement.attr('id') + '{';
            styleContent += addSizeRule('width', json.widget_width);
            styleContent += addSizeRule('width', json.auto_width, true);
            styleContent += addSizeRule('height', json.widget_height);
            styleContent += addSizeRule('height', json.auto_height, true);
            if (json.widget_height > 0 || json.widget_width > 0) {
                styleContent += addRule('overflow', 'hidden');
            }
            styleContent += '}\n';
            styleContent += '\n#' + widgetElement.attr('id') + ' .srJobList{';
            styleContent += addRule('background-color', json.bg_color_widget);
            styleContent += addSizeRule('width', json.widget_width);
            styleContent += addSizeRule('width', json.auto_width);
            styleContent += addSizeRule('height', json.widget_height);
            styleContent += addSizeRule('height', json.auto_height, true);
            styleContent += '}\n';

            styleContent += '#' + widgetElement.attr('id') + ' .srJobList .srJobListTitles *{';
            styleContent += addRule('background-color', json.bg_color_headers);
            styleContent += addRule('color', json.txt_color_headers);
            styleContent += '}\n';

            styleContent += '#' + widgetElement.attr('id') + ' .srJobList .srJobListJobOdd *{';
            styleContent += addRule('background-color', json.bg_color_odd_row);
            styleContent += '}\n';

            styleContent += '#' + widgetElement.attr('id') + ' .srJobList .srJobListJobEven *{';
            styleContent += addRule('background-color', json.bg_color_even_row);
            styleContent += '}\n';

            styleContent += '#' + widgetElement.attr('id') + ' .srJobList .srJobListJobEven td{';
            styleContent += addRule('color', json.txt_color_job);
            styleContent += '}\n';

            styleContent += '#' + widgetElement.attr('id') + ' .srJobList .srJobListJobOdd td{';
            styleContent += addRule('color', json.txt_color_job);
            styleContent += '}\n';

            styleContent += '#' + widgetElement.attr('id') + ' .srJobList .srJobListJobEven:hover *,';
            styleContent += '#' + widgetElement.attr('id') + ' .srJobList .srJobListJobEven:focus *{';
            styleContent += addRule('background-color', json.bg_color_links);
            styleContent += '}\n';

            styleContent += '#' + widgetElement.attr('id') + ' .srJobList .srJobListJobOdd:hover *,';
            styleContent += '#' + widgetElement.attr('id') + ' .srJobList .srJobListJobOdd:focus *{';
            styleContent += addRule('background-color', json.bg_color_links);
            styleContent += '}\n';

            if (ss1.styleSheet) {
                ss1.styleSheet.cssText = styleContent;
            } else {
                var tt1 = document.createTextNode(styleContent);
                ss1.appendChild(tt1);
            }
            return ss1;
        }

        function getObjectCss() {
            var css = null;
            try {
                css = document.styleSheets[0];
                if (!css) {
                    var head = document.getElementsByTagName('head').item(0);
                    head.appendChild(document.createElement('style'));
                    css = document.styleSheets[0];
                }
            } catch (ex) {
                css = document.createStyleSheet('styles.css');
            }
            return css;
        }

        function addRule(style, value) {
            if (value != undefined) {
                return style + ':' + value + ';\n';
            } else {
                return '';
            }
        }

        function addSizeRule(style, value, real_value) {
            if (value != undefined) {
                if (value == 'auto') {
                    if (real_value == true) {
                        return style + ':' + value + ';\n';
                    } else {
                        return style + ':100%;\n';
                    }
                } else {
                    return style + ':' + parseInt(value) + 'px;\n';
                }
            } else {
                return '';
            }
        }

        var keyFacetTranslation = {
            facet_location: 'location',
            facet_company: 'company_name',
            facet_department: 'department'
        };

        var keyFacetToFilterTranslation = {
            facet_location: 'filter_locations',
            facet_company: 'filter_companies',
            facet_department: 'filter_departments_name'
        };

        function createSearchBar(data, widgetID, json, remoteFilter) {
            var group_code = json.group_id;
            var htmlContent = '';
            var queryString;
            var departments = mapDepartmentsByLabel(data);
            if (filerJSON && filerJSON[widgetID] && filerJSON[widgetID]['queryString']) {
                queryString = filerJSON[widgetID]['queryString'];
            } else {
                queryString = defaultContent();
            }
            htmlContent += '<div class="srSearch">';
            htmlContent += '<form class="srSearchForm">';
            htmlContent += '<label class="display--none" for="filter-by">' + translate('filter_by') + '</label>';
            htmlContent +=
                '<input id="filter-by" aria-label="' +
                translate('filter_by') +
                '" class="srSearchInput" type="text" onblur="if(this.value==\'\') { this.value=\'' +
                defaultContent() +
                '\'; }" onfocus="if(this.value==\'' +
                defaultContent() +
                "') { this.value=''; }\" value='" +
                queryString +
                "' />" +
                '<input class="srSearchButton" type="button" value="' +
                translate('search_button') +
                '"/>';
            htmlContent += '</form>';
            for (var facet in keyFacetTranslation) {
                if (!(!group_code && facet === 'facet_company')) {
                    htmlContent += '<div class="srSearchOption" id="' + facet + '">';
                    htmlContent += '<span class="srSearchOptionText">' + add3Dots(translate(keyFacetTranslation[facet]), 10) + '</span>';
                    htmlContent += '<ul class="srSearchOptionList">';
                    var facetElements = data.facets[facet];

                    var facetFilter = filerJSON[widgetID][keyFacetToFilterTranslation[facet]];
                    var defaultFilter = restoreFilter(widgetID, keyFacetToFilterTranslation[facet]);
                    if (facetFilter && facetFilter !== defaultFilter) {
                        htmlContent += '<li class="srSearchOptionListElement srSearchOptionClearListElement">';
                        htmlContent += '<span class="srSearchOptionListElementText">' + translate('view_all') + '</span>';
                        htmlContent += '</li>';
                    }
                    for (var facetElement in facetElements) {
                        var filters = toList(filerJSON[widgetID][keyFacetToFilterTranslation[facet]]);
                        if (filerJSON[widgetID] && filters.length == 1 && facetElement === filters[0]) {
                            htmlContent += '<li class="srSearchOptionListElement srSearchOptionListElementChecked">';
                        } else {
                            htmlContent += '<li class="srSearchOptionListElement">';
                        }
                        if (facet === 'facet_department') {
                            var label = departments[facetElement] || facetElement;
                            htmlContent +=
                                '<span data-filter-value="' +
                                escapeHtml(facetElement) +
                                '" class="srSearchOptionListElementText">' +
                                escapeHtml(label) +
                                '</span>';
                        } else {
                            htmlContent +=
                                '<span data-filter-value="' +
                                escapeHtml(facetElement) +
                                '" class="srSearchOptionListElementText">' +
                                escapeHtml(facetElement) +
                                '</span>';
                        }
                        htmlContent += '</li>';
                    }
                    htmlContent += '</ul>';
                    htmlContent += '</div>';
                }
            }
            htmlContent += '<div class="srFilterRemote">';
            remoteFilter
                ? (htmlContent +=
                      '<input id="location_remote" type="checkbox" class="srFilterRemoteElement srFilterRemoteElementChecked" checked>')
                : (htmlContent += '<input id="location_remote" type="checkbox" class="srFilterRemoteElement">');
            htmlContent += '<label for="location_remote" class="srFilterRemoteElementText">' + translate('remote_info') + '</label>';
            htmlContent += '</div>';

            htmlContent += '</div>';
            return htmlContent;
        }

        function createHeader(json) {
            var header = "<tr class='srJobListTitles'>";
            if (json.job_title != 'undefined' && json.job_title == 'true') {
                header = header + buildHeaderColumn('srJobListJobTitle', 'job_title');
            }
            if (typeof json.group_id != 'undefined' && json.group_id.length > 0) {
                header = header + buildHeaderColumn('srJobListCompanyName', 'company_name');
            }
            if (json.ref_number === 'true') {
                header = header + buildHeaderColumn('srJobListRefNumber', 'ref_number');
            }
            if (json.type_of_employment != 'undefined' && json.type_of_employment == 'true') {
                header = header + buildHeaderColumn('srJobListTypeOfEmployment', 'type_of_employment');
            }
            if (json.department != 'undefined' && json.department == 'true') {
                header = header + buildHeaderColumn('srJobListDepartment', 'department');
            }
            if (json.location != 'undefined' && json.location == 'true') {
                header = header + buildHeaderColumn('srJobListLocation', 'location');
            }
            if (json.occupational_area != 'undefined' && json.occupational_area == 'true') {
                header = header + buildHeaderColumn('srJobListOccupationalArea', 'occupational_area');
            }
            if (json.published_since != 'undefined' && json.published_since == 'true') {
                header = header + buildHeaderColumn('srJobListPublishedSince', 'published_since');
            }
            if (json.custom_field != 'undefined' && json.custom_field == 'true') {
                header = header + buildHeaderColumn('srJobListCustomField', json.$customFieldName);
            }
            header = header + '</tr>';
            return header;
        }

        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function buildHeaderColumn(className, translation_key) {
            return "<th class='" + className + "'><nobr>" + translate(translation_key) + '</nobr></th>';
        }

        function prev(e) {
            var id = getWidgetId(this);
            var currentPage = getCurrentPage(id);
            if (currentPage > 0) {
                currentPage -= 1;
            }
            var limit = getLimit(id);
            var offset = currentPage * limit;
            setCurrentPage(id, currentPage);
            setOffset(id, offset);
            executeCurrentQuery(offset, limit, id);

            e.preventDefault();
            return false;
        }
        function next(e) {
            var id = getWidgetId(this);
            var currentPage = getCurrentPage(id);
            var pageCount = getPageCount(id);
            if (currentPage < pageCount - 1) {
                currentPage += 1;
            }
            var limit = getLimit(id);
            var offset = currentPage * limit;
            setCurrentPage(id, currentPage);
            setOffset(id, offset);
            executeCurrentQuery(offset, limit, id);

            e.preventDefault();
            return false;
        }

        function createPagination(itemsCount, countOnPage, id) {
            var content = '';
            var pageCount = Math.round(itemsCount / countOnPage);
            if (pageCount > 1) {
                setPageCount(id, pageCount);
                setLimit(id, countOnPage);
                content =
                    '<div class="srPages">' +
                    '<span class="srPagesText srPagesTextPrevious">&nbsp;</span>' +
                    '<span class="srPagesText srPagesTextCenter">' +
                    (getCurrentPage(id) + 1) +
                    ' of ' +
                    pageCount +
                    '</span>' +
                    '<span class="srPagesText srPagesTextNext">&nbsp;</span>' +
                    '</div>';
            }
            return content;
        }

        function add3Dots(string, limit) {
            var dots = '...';
            if (string.length > limit) {
                string = string.substring(0, limit) + dots;
            }

            return string;
        }

        function formatToUsDate(date) {
            var month = date.getMonth() + 1;
            return [month, date.getDate(), date.getFullYear()].join('/');
        }

        function formatToEuDate(date) {
            var month = date.getMonth() + 1;
            return [date.getDate(), month, date.getFullYear()].join('/');
        }

        function determineWidgetLanguage(json) {
            // list of preferred languages (order matters)
            var arr = [json.language];
            if (window.navigator.languages) {
                arr = arr.concat(window.navigator.languages);
            }
            arr.push(window.navigator.userLanguage || window.navigator.language);

            // pick the first one that matches
            for (var i = 0; i < arr.length; i++) {
                var verifiedLanguage = verifyLanguage(arr[i]);
                if (verifiedLanguage) {
                    return verifiedLanguage;
                }
            }

            // defaults to English if none match
            return 'en';
        }

        function verifyLanguage(language) {
            if (!language) {
                return;
            }
            // try with original language
            if (translation[language]) {
                return language;
            }
            // try with 2-letter language code
            var short = language.substring(0, 2);
            if (translation[short]) {
                return short;
            }
        }

        function translate(key) {
            return translation[widgetLanguage][key] ? translation[widgetLanguage][key] : key;
        }

        function restoreFilter(widgetID, key) {
            var defaultFilterValue = widgetJSON[widgetID][key];
            return defaultFilterValue ? defaultFilterValue : '';
        }

        function loadScriptFromUrl(url, retryTimes) {
            if (retryTimes < 1) {
                return;
            }
            var script = document.createElement('script');
            script.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(script);
            script.onerror = () => {
                loadScriptFromUrl(url, --retryTimes);
            };
            script.async = true;
            script.src = url;
        }

        function getWorkPlaceType(locationRemote) {
            return locationRemote ? 'remote' : 'on_site';
        }

        function getWorkPlaceDescription(locationRemote, description) {
            return locationRemote ? description : '';
        }

        var translation = {
            af: {
                job_title: 'Werkstitel',
                company_name: 'Maatskappy',
                type_of_employment: 'Soort betrekking',
                department: 'Departement',
                location: 'Plek ',
                occupational_area: 'Werksarea',
                published_since: 'Gepubliseer sedert',
                search_button: 'Soek',
                view_all: 'Sien alles',
                filter_by: 'Filter volgens titel, vakkundigheid',
                ref_number: 'Verwysingsnommer',
                remote_info: 'Werknemers kan op afstand werk'
            },
            ar: {
                job_title: 'المسمى الوظيفي',
                company_name: 'الشركة',
                type_of_employment: 'نوع التوظيف',
                department: 'القسم',
                location: 'الموقع',
                occupational_area: 'المجال المهني',
                published_since: 'تم النشر منذ',
                search_button: 'بحث',
                view_all: 'إظهار الكل',
                filter_by: 'الترشيح حسب المسمى الوظيفي، الخبرة',
                ref_number: 'رقم المرجع',
                remote_info: 'يمكن للموظفين العمل عن بعد'
            },
            bg: {
                job_title: 'Име на работа',
                company_name: 'Фирма',
                type_of_employment: 'Вид на заетостта',
                department: 'Отдел',
                location: 'Местоположение',
                occupational_area: 'Професионална област',
                published_since: 'Публикувано от',
                search_button: 'Търсене',
                view_all: 'Преглед на всички',
                filter_by: 'Филтриране по заглавие, специалност',
                ref_number: 'номер за справка',
                remote_info: 'Служителите могат да работят дистанционно'
            },
            cs: {
                job_title: 'Název práce',
                company_name: 'Společnost',
                type_of_employment: 'Typ práce',
                department: 'Oddělení',
                location: 'Umístění',
                occupational_area: 'Oblast zaměstnání',
                published_since: 'Publikováno od',
                search_button: 'Hledat',
                view_all: 'Podívat se na vše',
                filter_by: 'Filtrovat podle titulu/odbornosti',
                ref_number: 'Referenční číslo',
                remote_info: 'Zaměstnanci mohou pracovat na dálku'
            },
            da: {
                job_title: 'Jobtitel',
                company_name: 'Virksomhed',
                type_of_employment: 'Ansættelsestype',
                department: 'Afdeling',
                location: 'Sted',
                occupational_area: 'Arbejdsområde',
                published_since: 'Udgivet siden',
                search_button: 'Søg',
                view_all: 'Vis alle',
                filter_by: 'Filtrér efter titel, ekspertise',
                ref_number: 'Referencenummer',
                remote_info: 'Medarbejdere kan arbejde uden for kontoret'
            },
            de: {
                job_title: 'Stellenbezeichnung',
                company_name: 'Unternehmen',
                type_of_employment: 'Art der Beschäftigung',
                department: 'Abteilung',
                location: 'Standort',
                occupational_area: 'Berufsfeld',
                published_since: 'Veröffentlichungsdatum',
                search_button: 'Suchen',
                view_all: 'Alle anzeigen',
                filter_by: 'Nach Bezeichnung, Wissen filtern',
                ref_number: 'REF-Code',
                remote_info: 'Mitarbeiter können im Homeoffice arbeiten'
            },
            el: {
                job_title: 'Τίτλος θέσης εργασίας',
                company_name: 'Εταιρεία',
                type_of_employment: 'Τύπος απασχόλησης',
                department: 'Τμήμα',
                location: 'Τοποθεσία',
                occupational_area: 'Τομέας απασχόλησης',
                published_since: 'Δημοσιευμένο από τις',
                search_button: 'Αναζήτηση',
                view_all: 'Προβολή όλων',
                filter_by: 'Φιλτράρισμα κατά τίτλο, εμπειρία',
                ref_number: 'Κωδικός αναφοράς',
                remote_info: 'Οι εργαζόμενοι μπορούν να δουλεύουν εξ αποστάσεως'
            },
            en: {
                job_title: 'Job Title',
                company_name: 'Company',
                type_of_employment: 'Type of Employment',
                department: 'Department',
                location: 'Location',
                occupational_area: 'Occupational Area',
                published_since: 'Published Since',
                search_button: 'Search',
                view_all: 'View all',
                filter_by: 'Filter by title, expertise',
                ref_number: 'REF code',
                remote_info: 'Employees can work remotely'
            },
            es: {
                job_title: 'Título del empleo',
                company_name: 'Empresa',
                type_of_employment: 'Tipo de empleo',
                department: 'Departamento',
                location: 'Ubicación',
                occupational_area: 'Área de ocupación',
                published_since: 'Publicado desde',
                search_button: 'Buscar',
                view_all: 'Ver todo',
                filter_by: 'Filtrar por título, especialidad',
                ref_number: 'Código de referencia',
                remote_info: 'Los empleados pueden teletrabajar'
            },
            'es-mx': {
                job_title: 'Título del empleo',
                company_name: 'Empresa',
                type_of_employment: 'Tipo de empleo',
                department: 'Departamento',
                location: 'Ubicación',
                occupational_area: 'Área de ocupación',
                published_since: 'Publicado desde',
                search_button: 'Buscar',
                view_all: 'Ver todo',
                filter_by: 'Filtrar por título, especialidad',
                ref_number: 'Código de REF',
                remote_info: 'Los empleados pueden trabajar de forma remota'
            },
            et: {
                job_title: 'Ametinimetus',
                company_name: 'Ettevõte',
                type_of_employment: 'Tööhõive liik',
                department: 'Osakond',
                location: 'Asukoht',
                occupational_area: 'Töö valdkond',
                published_since: 'Avaldatud',
                search_button: 'Otsing',
                view_all: 'Vaata kõiki',
                filter_by: 'Filtreeri ametinimetuse, asjatundlikkuse järgi',
                ref_number: 'Viitenumber',
                remote_info: 'Töötajatel on võimalus teha kaugtööd'
            },
            fi: {
                job_title: 'Työnimike',
                company_name: 'Yritys',
                type_of_employment: 'Työpaikan tyyppi',
                department: 'Osasto',
                location: 'Sijainti',
                occupational_area: 'Ammattialue',
                published_since: 'Julkaistu',
                search_button: 'Hae',
                view_all: 'Katso kaikki',
                filter_by: 'Suodata nimikkeen, kokemuksen mukaan',
                ref_number: 'Viitenumero',
                remote_info: 'Työntekijät voivat työskennellä etänä'
            },
            fr: {
                job_title: 'Intitulé du poste',
                company_name: 'Entreprise',
                type_of_employment: 'Type de contrat',
                department: 'Filière',
                location: 'Localisation',
                occupational_area: 'Domaine professionnel',
                published_since: 'Publié depuis',
                search_button: 'Recherche',
                view_all: 'Afficher tout',
                filter_by: 'Filtrer par intitulé, spécialisation',
                ref_number: 'Code de réf.',
                remote_info: 'Le télétravail est possible pour les employés'
            },
            'fr-ca': {
                job_title: 'Intitulé du poste',
                company_name: 'Entreprise',
                type_of_employment: 'Type de contrat',
                department: 'Filière',
                location: 'Ville',
                occupational_area: 'Domaine professionnel',
                published_since: 'Date de publication',
                search_button: 'Recherche',
                view_all: 'Afficher tout',
                filter_by: 'Filtrer par intitulé, expertise',
                ref_number: 'Code de réf.',
                remote_info: 'Les employés peuvent travailler à distance'
            },
            he: {
                job_title: 'שם המשרה',
                company_name: 'חברה',
                type_of_employment: 'סוג העסקה',
                department: 'מחלקה',
                location: 'מיקום',
                occupational_area: 'תחום מקצועי',
                published_since: 'פורסם מאז',
                search_button: 'חפש',
                view_all: 'צפה בכל',
                filter_by: 'סנן לפי שם משרה, מומחיות',
                ref_number: 'מספר סימוכין',
                remote_info: 'עובדים יכולים לעבוד מרחוק'
            },
            hr: {
                job_title: 'Naziv posla',
                company_name: 'Tvrtka',
                type_of_employment: 'Vrsta zaposlenja',
                department: 'Odjel',
                location: 'Lokacija',
                occupational_area: 'Područje zanimanja',
                published_since: 'Objavljeno od',
                search_button: 'Pretraži',
                view_all: 'Prikaži sve',
                filter_by: 'Filtriranje prema tituli, stručnosti',
                ref_number: 'REF kod',
                remote_info: 'Zaposlenici mogu raditi na daljinu'
            },
            hu: {
                job_title: 'Állás megnevezése',
                company_name: 'Cég',
                type_of_employment: 'Foglalkoztatás típusa',
                department: 'Osztály',
                location: 'Helyszín',
                occupational_area: 'Foglalkoztatási terület',
                published_since: 'Hirdetés feladva',
                search_button: 'Keresés',
                view_all: 'Összes megtekintése',
                filter_by: 'Szűrés megnevezés, szakterület alapján',
                ref_number: 'Hivatkozási kód',
                remote_info: 'A munkavállalók távmunka keretében is dolgozhatnak'
            },
            id: {
                job_title: 'Jabatan Pekerjaan',
                company_name: 'Perusahaan',
                type_of_employment: 'Jenis Kontrak Kerja',
                department: 'Departemen',
                location: 'Lokasi',
                occupational_area: 'Area Kerja',
                published_since: 'Dipublikasikan Sejak',
                search_button: 'Cari',
                view_all: 'Lihat semua',
                filter_by: 'Filter berdasarkan jabatan, keahlian',
                ref_number: 'Kode REF',
                remote_info: 'Karyawan dapat bekerja secara jarak jauh'
            },
            it: {
                job_title: 'Titolo lavoro',
                company_name: 'Azienda',
                type_of_employment: 'Tipo di Impiego',
                department: 'Dipartimento',
                location: 'Luogo',
                occupational_area: 'Settore professionale',
                published_since: 'Pubblicato dal',
                search_button: 'Cerca',
                view_all: 'Visualizza tutto',
                filter_by: 'Filtra per titolo, competenza',
                ref_number: 'Numero di riferimento',
                remote_info: 'I dipendenti possono lavorare in remoto'
            },
            ja: {
                job_title: '募集職種',
                company_name: '会社',
                type_of_employment: '雇用タイプ',
                department: '部署',
                location: '勤務地',
                occupational_area: '専門分野',
                published_since: '掲載日',
                search_button: '検索',
                view_all: 'すべて表示',
                filter_by: '職種、専門分野で絞り込み',
                ref_number: 'REF コード',
                remote_info: '従業員はリモートワークができます'
            },
            ka: {
                job_title: 'პოზიციის დასახელება',
                company_name: 'კომპანია',
                type_of_employment: 'დასაქმების ტიპი',
                department: 'განყოფილება',
                location: 'ადგილმდებარეობა',
                occupational_area: 'დარგი',
                published_since: 'გამოქვეყნების თარიღი',
                search_button: 'ძებნა',
                view_all: 'ყველას ნახვა',
                filter_by: 'გაფილტრე',
                ref_number: 'საცნობარო კოდი',
                remote_info: 'თანამშრომლებს შეუძლიათ დისტანციურად მუშაობა'
            },
            ko: {
                job_title: '직책',
                company_name: '회사',
                type_of_employment: '고용 형태',
                department: '부서',
                location: '지역',
                occupational_area: '직업군',
                published_since: '최초 게시일',
                search_button: '검색',
                view_all: '모두 보기',
                filter_by: '직함, 전문성별로 필터링',
                ref_number: '참조 번호',
                remote_info: '직원은 원격으로 작업 할 수 있습니다'
            },
            lt: {
                job_title: 'Darbo pavadinimas',
                company_name: 'Įmonė',
                type_of_employment: 'Darbo pobūdis',
                department: 'Skyrius',
                location: 'Vieta',
                occupational_area: 'Profesinę sritį',
                published_since: 'Paskelbta nuo',
                search_button: 'Ieškoti',
                view_all: 'Rodyti viską',
                filter_by: 'Filter by title, expertise',
                ref_number: 'Nuorodinis kodas',
                remote_info: 'Darbuotojai gali dirbti nuotoliniu būdu'
            },
            lv: {
                job_title: 'Amata nosaukums',
                company_name: 'Uzņēmums',
                type_of_employment: 'Nodarbinātības veids',
                department: 'Nodaļa',
                location: 'Atrašanās vieta',
                occupational_area: 'Darba joma',
                published_since: 'Publicēts kopš',
                search_button: 'Meklēt',
                view_all: 'Skatīt visu',
                filter_by: 'Atlasīt pēc amata nosaukuma, prasmēm',
                ref_number: 'Atsauces numurs',
                remote_info: 'Darbinieki var strādāt attālināti'
            },
            nl: {
                job_title: 'Functietitel',
                company_name: 'Bedrijf',
                type_of_employment: 'Functieomschrijving',
                department: 'Afdeling',
                location: 'Locatie',
                occupational_area: 'Begroepsgroep',
                published_since: 'Gepubliceerd op',
                search_button: 'Search',
                view_all: 'Alles bekijken',
                filter_by: 'Filteren op titel, expertise',
                ref_number: 'Referentienummer',
                remote_info: 'Werknemer kan op afstand werken'
            },
            no: {
                job_title: 'Jobbtittel',
                company_name: 'Selskap',
                type_of_employment: 'Stillingstype',
                department: 'Avdeling',
                location: 'Plassering',
                occupational_area: 'Fagområde',
                published_since: 'Utgitt siden',
                search_button: 'Søk',
                view_all: 'Vis alle',
                filter_by: 'Filtrer etter tittel og ekspertise',
                ref_number: 'Referanse nummer',
                remote_info: 'Ansatte kan jobbe andre steder enn på arbeidsplassen'
            },
            pl: {
                job_title: 'Nazwa stanowiska',
                company_name: 'Firma',
                type_of_employment: 'Forma zatrudnienia',
                department: 'Dział',
                location: 'Lokalizacja',
                occupational_area: 'Branża zawodowa',
                published_since: 'Opublikowane od',
                search_button: 'Szukaj',
                view_all: 'Pokaż wszystko',
                filter_by: 'Filtruj wg. nazwy, doświadczenia',
                ref_number: 'Numer referencyjny',
                remote_info: 'Pracownicy mogą pracować zdalnie'
            },
            pt: {
                job_title: 'Cargo',
                company_name: 'Empresa',
                type_of_employment: 'Tipo de Emprego',
                department: 'Departamento',
                location: 'Localização',
                occupational_area: 'Área ocupacional',
                published_since: 'Publicado desde',
                search_button: 'Procurar',
                view_all: 'Ver tudo',
                filter_by: 'Filtrar por cargo, especialização',
                ref_number: 'Código REF',
                remote_info: 'Os colaboradores podem trabalhar remotamente'
            },
            ro: {
                job_title: 'Denumirea postului',
                company_name: 'Companie',
                type_of_employment: 'Tip angajare',
                department: 'Departament',
                location: 'Locație',
                occupational_area: 'Domeniul ocupațional',
                published_since: 'Publicat de la',
                search_button: 'Căutare',
                view_all: 'Vezi toate',
                filter_by: 'Filtrează după denumire, expertiză',
                ref_number: 'Numar de referinta',
                remote_info: 'Angajații pot lucra de la distanță'
            },
            ru: {
                job_title: 'Название вакансии',
                company_name: 'Компания',
                type_of_employment: 'Вид занятости',
                department: 'Отделение',
                location: 'Местоположение',
                occupational_area: 'Область занятий',
                published_since: 'Опубликовано с',
                search_button: 'Поиск',
                view_all: 'Просмотреть все',
                filter_by: 'Фильтр по названию, экспертизе',
                ref_number: 'REF-код',
                remote_info: 'Сотрудники могут работать удаленно'
            },
            sk: {
                job_title: 'Názov pracovnej ponuky',
                company_name: 'Spoločnosť',
                type_of_employment: 'Typ zamestnania',
                department: 'Oddelenie',
                location: 'Lokalita',
                occupational_area: 'Pracovná oblasť',
                published_since: 'Uverejnené od',
                search_button: 'Hľadať',
                view_all: 'Zobraziť všetko',
                filter_by: 'Filtrovať podľa názvu, skúseností',
                ref_number: 'Ref. kód',
                remote_info: 'Zamestnanci môžu pracovať z domu'
            },
            sl: {
                job_title: 'Naziv delovnega mesta',
                company_name: 'Podjetje',
                type_of_employment: 'Vrsta zaposlitve',
                department: 'Oddelek',
                location: 'Lokacija',
                occupational_area: 'Poklicno področje',
                published_since: 'Objavljeno od',
                search_button: 'Išči',
                view_all: 'Ogled vseh',
                filter_by: 'Filtriraj po nazivu, strokovnosti',
                ref_number: 'REF šifra',
                remote_info: 'Zaposleni lahko opravljajo delo na daljavo'
            },
            sr: {
                job_title: 'Naziv pozicije',
                company_name: 'Kompanija',
                type_of_employment: 'Vrsta zaposlenja',
                department: 'Odeljenje',
                location: 'Lokacija',
                occupational_area: 'Oblast zanimanja',
                published_since: 'Objavljeno od',
                search_button: 'Pretraži',
                view_all: 'Prikaži sve',
                filter_by: 'Filtriraj prema nazivu pozicije, ekspertizi',
                ref_number: 'REF. kôd',
                remote_info: 'Zaposleni mogu da rade od kuće'
            },
            sv: {
                job_title: 'Jobbtitel',
                company_name: 'Företag',
                type_of_employment: 'Anställningsform',
                department: 'Avdelning',
                location: 'Plats',
                occupational_area: 'Arbetsområde',
                published_since: 'Publicerad sedan',
                search_button: 'Sök',
                view_all: 'Visa alla',
                filter_by: 'Filtrera efter titel, yrkesområde',
                ref_number: 'REF-kod',
                remote_info: 'Anställda kan arbeta på distans'
            },
            th: {
                job_title: 'ชื่องาน',
                company_name: 'บริษัท',
                type_of_employment: 'ประเภทของการจ้างงาน',
                department: 'แผนก',
                location: 'ที่อยู่',
                occupational_area: 'พื้นที่เกี่ยวกับอาชีพ',
                published_since: 'เผยแพร่ตั้งแต่',
                search_button: 'ค้นหา',
                view_all: 'ดูทั้งหมด',
                filter_by: 'กรองตามชื่องาน, ความชำนาญ',
                ref_number: 'รหัส REF',
                remote_info: 'พนักงานสามารถทำงานจากทางไกลได้'
            },
            tr: {
                job_title: 'İş Unvanı',
                company_name: 'Firma',
                type_of_employment: 'İstihdam Türü',
                department: 'Departman',
                location: 'Konum',
                occupational_area: 'Mesleki Alan',
                published_since: 'İlk Yayınlanma Tarihi',
                search_button: 'Ara',
                view_all: 'Tümünü görüntüle',
                filter_by: 'Başlık, uzmanlık alanına göre filtrele',
                ref_number: 'REF kodu',
                remote_info: 'Çalışanlar uzaktan çalışabilir'
            },
            vi: {
                job_title: 'Chức danh Công việc',
                company_name: 'Công ty',
                type_of_employment: 'Hình thức Sử dụng lao động',
                department: 'Bộ phận',
                location: 'Địa điểm',
                occupational_area: 'Lĩnh vực Nghề nghiệp',
                published_since: 'Công khai Từ',
                search_button: 'Tìm kiếm',
                view_all: 'Xem tất cả',
                filter_by: 'Lọc theo chức danh, chuyên môn',
                ref_number: 'Mã Tham chiếu',
                remote_info: 'Nhân viên có thể làm việc từ xa'
            },
            'zh-cn': {
                job_title: '职位',
                company_name: '公司',
                type_of_employment: '职位类型',
                department: '部门',
                location: '地点',
                occupational_area: '职业领域',
                published_since: '发布日期',
                search_button: '搜索',
                view_all: '查看全部',
                filter_by: '按头衔、专业知识筛选',
                ref_number: '参考代码',
                remote_info: '员工可以远程工作'
            },
            'zh-tw': {
                job_title: '職稱',
                company_name: '公司',
                type_of_employment: '聘僱類型',
                department: '部門',
                location: '所在地點',
                occupational_area: '專業領域',
                published_since: '刊登時間',
                search_button: '搜尋',
                view_all: '檢視全部',
                filter_by: '依職稱和專業篩選',
                ref_number: '參照代碼',
                remote_info: '員工可以遠距工作'
            }
        };
        translation['zh'] = translation['zh-cn'];

        return widget;
    })(window);
