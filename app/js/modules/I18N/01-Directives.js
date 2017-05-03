// REPLACE ELEMENT CONTENT
APP.directive('i18n', ['I18N', function (I18N) {
    return {
        priority: 0,
        restrict: 'A',
        scope: false,
        compile: function compile(tElement, tAttrs, transclude) {
            if (tAttrs.i18n) {
                tElement.text(I18N.translate(tAttrs.i18n));
            }
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {},
                post: function postLink(scope, iElement, iAttrs, controller) {}
            };
        }
    };
}]);

// REPLACE ELEMENT ATTRIBUTE
// - use for Foundation Tooltip (in title attribute)
APP.directive('i18nTitle', ['I18N', function (I18N) {
    return {
        priority: 0,
        restrict: 'A',
        scope: false,
        compile: function compile(tElement, tAttrs, transclude) {
            if (tAttrs.i18nTitle) {
                tAttrs.$set('title', I18N.translate(tAttrs.i18nTitle));
            }
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {},
                post: function postLink(scope, iElement, iAttrs, controller) {}
            };
        }
    };
}]);

// ADD DATA-ATTRIBUTE CONTAINING LOCA TO THE ELEMENT
// - use for dynamic
// - multiple loca '-' separated
APP.directive('i18nData', ['I18N', function (I18N) {
    return {
        priority: 0,
        restrict: 'A',
        scope: false,
        compile: function compile(tElement, tAttrs, transclude) {
            if (tAttrs.i18nData) {
                var _datas = tAttrs.i18nData.split('-'),
                    _l = _datas.length,
                    _data;

                for (var i=0; i<_l; ++i) {
                    _data = _datas[i];
                    tAttrs.$set('data-'+_data, I18N.translate(_data));
                }
            }
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {},
                post: function postLink(scope, iElement, iAttrs, controller) {}
            };
        }
    };
}]);

// SET ELEMENT ATTRIBUTE
// - single couple attrName + '-' + loca
APP.directive('i18nAttr', ['I18N', function (I18N) {
    return {
        priority: 0,
        restrict: 'A',
        scope: false,
        compile: function compile(tElement, tAttrs, transclude) {
            if (tAttrs.i18nAttr) {
                var _datas = tAttrs.i18nAttr.split(':');

                tAttrs.$set(_datas[0], I18N.translate(_datas[1]));
            }
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {},
                post: function postLink(scope, iElement, iAttrs, controller) {}
            };
        }
    };
}]);