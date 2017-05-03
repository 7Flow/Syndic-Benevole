this["JST"] = this["JST"] || {};

this["JST"]["app/templates/abstractModuleLayout"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div ng-controller=\"{{controller}}\">\n  <section class=\"sub-section {{module}}\"></section>\n</div>");;return buf.join("");
};

this["JST"]["app/templates/apartment/layout"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];;return buf.join("");
};

this["JST"]["app/templates/apartment/list"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];;return buf.join("");
};

this["JST"]["app/templates/auth/layout"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];;return buf.join("");
};

this["JST"]["app/templates/auth/login"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div class=\"row\">\n  <div class=\"small-8 columns\">\n    <div class=\"panel glass\">\n      <h1 i18n=\"welcome\" class=\"title\"></h1>\n      <div i18n=\"welcome-text\" class=\"text\"></div><a i18n=\"email-syndic\" i18n-attr=\"href:mailto-syndic\" class=\"mail-to\"></a>\n    </div>\n  </div>\n  <div class=\"small-4 columns\">\n    <div class=\"panel\">\n      <h2 i18n=\"connect\" class=\"title\"></h2>\n      <form data-abide=\"data-abide\">\n        <div class=\"row\">\n          <input id=\"login\" name=\"login\" type=\"text\" placeholder=\"Login\" required=\"required\" pattern=\"[a-zA-Z0-9]+\"/>\n        </div>\n        <div class=\"row\">\n          <input id=\"password\" name=\"password\" type=\"password\" placeholder=\"Password\" required=\"required\" pattern=\"[a-zA-Z0-9]+\"/>\n        </div>\n        <div class=\"row\">\n          <button type=\"submit\" i18n=\"connection\"></button>\n        </div>\n      </form>\n    </div>\n  </div>\n  <div class=\"small-4 columns\"></div>\n</div>");;return buf.join("");
};

this["JST"]["app/templates/budget/details"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div class=\"row\">\n  <div class=\"small-8 columns\">\n    <div id=\"details\" class=\"panel details\">\n      <h1 i18n=\"budget\" class=\"title\"></h1>\n      <ul ng-model=\"data\" class=\"small-block-grid-1 table\">\n        <li>\n          <div class=\"list-head\">\n            <div i18n=\"expenditure\" class=\"expenditure-name\"></div>\n            <div i18n=\"provider\" class=\"expenditure-provider\"></div>\n            <div i18n=\"provision\" class=\"expenditure-provision\"></div>\n            <div i18n=\"spent\" class=\"expenditure-current\"></div>\n            <div i18n=\"remaining\" class=\"expenditure-remaining\"></div>\n            <div class=\"expenditure-btn\"></div>\n          </div>\n          <dl data-accordion=\"expenditures\" class=\"accordion\">\n            <dd ng-repeat=\"row in data\" class=\"accordion-navigation\"><a href=\"#details{{$index}}\">\n                <div class=\"expenditure-name\">{{row.name}}</div>\n                <div class=\"expenditure-provider\">{{row.provider}}</div>\n                <div class=\"expenditure-provision\">{{row.size | currency:'&euro;'}}</div>\n                <div class=\"expenditure-current\">{{row.current | currency:'&euro;'}}</div>\n                <div class=\"expenditure-remaining\">{{row.remaining | currency:'&euro;'}}</div>\n                <div ng-if=\"authorization.PUT\" ng-click=\"prevent($event)\" data-dropdown=\"expendAdmin{{$index}}\" aria-expended=\"false\" class=\"btn-admin icon-cog\"></div>\n                <ul id=\"expendAdmin{{$index}}\" data-dropdown-content=\"data-dropdown-content\" class=\"f-dropdown\">\n                  <li><a ng-if=\"authorization.PUT\" href=\"javascript:void(0);\" ng-click=\"modify(row.id)\" i18n=\"modify\" class=\"button icon-pencil\"></a><a ng-if=\"authorization.DELETE\" href=\"javascript:void(0);\" ng-click=\"delete(row.id)\" data-reveal-id=\"deleteModal\" i18n=\"delete\" class=\"button icon-cup\"></a></li>\n                </ul></a>\n              <div id=\"details{{$index}}\" class=\"content\">\n                <div class=\"container\">\n                  <div class=\"list\">\n                    <div class=\"list-head\">\n                      <div i18n=\"description\" class=\"spending-description\"></div>\n                      <div i18n=\"date\"></div>\n                      <div i18n=\"amount\"></div>\n                    </div>\n                    <ul>\n                      <li ng-repeat=\"spending in row.children\">\n                        <div class=\"spending-description\">{{spending.name}}</div>\n                        <div>{{spending.date | date:'mediumDate' : format:'fr-FR'}}</div>\n                        <div>{{spending.size | currency:'&euro;'}}</div>\n                        <div class=\"admin-buttons\"><a ng-if=\"authorization.PUT\" href=\"javascript:void(0);\" ng-click=\"modify(row.id)\" i18n-title=\"modify\" data-tooltip=\"\" aria-haspopup=\"true\" class=\"button icon-pencil\"></a><a ng-if=\"authorization.DELETE\" href=\"javascript:void(0);\" ng-click=\"delete(row.id)\" i18n-title=\"delete\" data-tooltip=\"\" aria-haspopup=\"true\" class=\"button alert icon-cup\"></a></div>\n                      </li>\n                    </ul>\n                    <div><a ng-if=\"authorization.POST\" href=\"javascript:void(0);\" ng-click=\"add()\" i18n=\"add-spending\" class=\"button icon-plus success\"></a></div>\n                  </div>\n                </div>\n              </div>\n            </dd>\n          </dl>\n        </li>\n      </ul>\n    </div>\n  </div>\n  <div class=\"small-4 columns\">\n    <div id=\"chart\" i18n-data=\"of-oftotal-remaining\" class=\"panel chart\">\n      <h2 i18n=\"repartition\" class=\"title\"></h2>\n      <div id=\"chartExplanation\" class=\"chart-explanation\"><span id=\"chartPercentage\" class=\"chart-percentage\"></span></div>\n    </div>\n    <div id=\"budgetActions\" class=\"panel\">\n      <div i18n=\"\" class=\"button\"></div>\n      <div i18n=\"\" class=\"button\"></div>\n    </div>\n  </div>\n</div>\n<div id=\"deleteModal\" ng-show=\"showDeleteModal\" data-reveal=\"data-reveal\" ng-budgetid=\"budgetId\" class=\"delete-modal reveal-modal\"></div>\n<div id=\"addModal\" ng-show=\"showAddModal\" data-reveal=\"data-reveal\" class=\"add-modal reveal-modal\"></div>\n<div id=\"updateModal\" ng-show=\"showUpdateModal\" ng-budget=\"data\" data-reveal=\"data-reveal\" class=\"update-modal reveal-modal\"></div>");;return buf.join("");
};

this["JST"]["app/templates/budget/layout"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];;return buf.join("");
};

this["JST"]["app/templates/budget/overview"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div class=\"row\">\n  <div class=\"large-12 columns\">\n    <div class=\"panel\">\n      <label id=\"sliderLabel\" i18n=\"years\"></label>\n      <div data-range-slider=\"\" class=\"range-slider\"><span role=\"range-slider\" tabindex=\"0\" aria-labelledby=\"sliderLabel\" class=\"range-slider-handle start\"></span><span role=\"range-slider\" tabindex=\"1\" aria-labelledby=\"sliderLabel\" class=\"range-slider-handle end\"></span><span class=\"range-slider-active-segment\"></span>\n        <input type=\"hidden\"/>\n      </div>\n      <div id=\"chart\" data-tooltip=\"data-tooltip\" aria-haspopup=\"true\" title=\"\" class=\"chart bar\"></div>\n      <div id=\"chartLegend\" class=\"chart-legend\">\n        <div ng-repeat=\"row in data\" data-name=\"{{row.name}}\" class=\"line\"><span class=\"color\">\n            <div style=\"background: {{row.color}}\"></div></span><span class=\"name\">{{row.name}}</span></div>\n      </div>\n    </div>\n  </div>\n</div>");;return buf.join("");
};

this["JST"]["app/templates/budget/updateModal"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div class=\"modal-background\"><a href=\"javascript:void(0);\" ng-click=\"cancel()\" class=\"close-reveal-modal\">&times</a>\n  <div class=\"small-12 columns\">\n    <form data-abide=\"data-abide\" data-id=\"{{budget.id}}\">\n      <input id=\"id\" name=\"id\" type=\"hidden\" value=\"{{budget.id}}\"/>\n      <div class=\"row\">\n        <h3 i18n=\"update-buget\"></h3>\n      </div>\n      <div class=\"row\">\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"name\" name=\"name\" type=\"text\" placeholder=\"Name\" value=\"{{coOwner.name}}\" required=\"required\" pattern=\"[a-zA-Z0-9]+\"/>\n        </div>\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"lastName\" name=\"lastName\" type=\"text\" placeholder=\"Last Name\" value=\"{{coOwner.lastName}}\" required=\"required\" pattern=\"[a-zA-Z0-9]+\"/>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"email\" name=\"email\" type=\"email\" placeholder=\"E-mail\" value=\"{{coOwner.email}}\" pattern=\"[a-zA-Z0-9.@-_]+\"/>\n        </div>\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"phone\" name=\"phone\" type=\"text\" placeholder=\"Phone (fix or mobile)\" value=\"{{coOwner.phone}}\" pattern=\"[0-9-]+\"/>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"small-12 columns\">\n          <label i18n=\"apartment\"></label>\n          <select id=\"fk_apartment_id\" name=\"fk_apartment_id\" required=\"required\" data-ng-model=\"apartSelected\">\n            <option ng-repeat=\"apart in apartments\" value=\"{{apart.id}}\">Lot {{apart.lot}}: {{apart.address}} {{apart.street}}</option>\n          </select>\n        </div>\n      </div>\n      <div class=\"row buttons-container\"><a href=\"javascript:void(0);\" i18n=\"cancel\" class=\"button close-reveal-modal icon-cross\"></a>\n        <button type=\"submit\" i18n=\"confirm\" class=\"success icon-checkmark\"></button>\n      </div>\n    </form>\n  </div>\n</div>");;return buf.join("");
};

this["JST"]["app/templates/coowners/addModal"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div class=\"modal-background\"><a href=\"javascript:void(0);\" ng-click=\"cancel()\" class=\"close-reveal-modal\">&times</a>\n  <div class=\"small-12 columns\">\n    <form data-abide=\"data-abide\">\n      <div class=\"row\">\n        <h3 i18n=\"new-coowner\"></h3>\n      </div>\n      <div class=\"row\">\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"name\" name=\"name\" type=\"text\" placeholder=\"Name\" required=\"required\" pattern=\"[a-zA-Z0-9]+\"/>\n        </div>\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"lastName\" name=\"lastName\" type=\"text\" placeholder=\"Last Name\" required=\"required\" pattern=\"[a-zA-Z0-9]+\"/>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"email\" name=\"email\" type=\"email\" placeholder=\"E-mail\" pattern=\"[a-zA-Z0-9]+\"/>\n        </div>\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"phone\" name=\"phone\" type=\"text\" placeholder=\"Phone (fix or mobile)\" pattern=\"[0-9]+\"/>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"small-12 columns\">\n          <label i18n=\"apartment\"></label>\n          <select id=\"apartment\" name=\"apartment\" required=\"required\">\n            <option ng-repeat=\"apart in apartments\" value=\"{{apart.id}}\">Lot {{apart.lot}}: {{apart.address}} {{apart.street}}</option>\n          </select>\n        </div>\n      </div>\n      <div class=\"row buttons-container\"><a href=\"javascript:void(0);\" i18n=\"cancel\" class=\"button close-reveal-modal icon-cross\"></a>\n        <button type=\"submit\" i18n=\"confirm\" class=\"success icon-checkmark\"></button>\n      </div>\n    </form>\n  </div>\n</div>");;return buf.join("");
};

this["JST"]["app/templates/coowners/deleteModal"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div class=\"modal-background\"><a href=\"javascript:void(0);\" ng-click=\"cancel()\" class=\"close-reveal-modal\">&times</a>\n  <div class=\"small-12 columns\">\n    <div class=\"row\">\n      <h3 i18n=\"delete\"></h3>\n    </div>\n    <div class=\"row\">\n      <h6 i18n=\"confirm-delete-coowner\"></h6>\n    </div>\n    <div class=\"row buttons-container\"><a href=\"javascript:void(0);\" i18n=\"cancel\" class=\"button close-reveal-modal icon-cross\"></a><a href=\"javascript:void(0);\" ng-click=\"confirm()\" i18n=\"confirm\" class=\"button alert icon-checkmark\"></a></div>\n  </div>\n</div>");;return buf.join("");
};

this["JST"]["app/templates/coowners/layout"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];;return buf.join("");
};

this["JST"]["app/templates/coowners/list"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div ng-switch=\"switchStatus\">\n  <div data-alert=\"data-alert\" ng-switch-when=\"error\" class=\"alert-box alert\">\n    <p>{{message}}</p><a href=\"javascript:void(0);\" class=\"close\">&times;</a>\n  </div>\n  <div data-alert=\"data-alert\" ng-switch-when=\"success\" class=\"alert-box\">\n    <p>{{message}}</p><a href=\"javascript:void(0);\" class=\"close\">&times;</a>\n  </div>\n</div>\n<ul class=\"pagination\">\n  <li class=\"arrow unavailable\"><a href=\"\">&laquo;</a></li>\n  <li ng-repeat=\"row in data\" class=\"{current: $first}\"><a href=\"\">{{$index}}</a></li>\n  <li class=\"arrow\"><a href=\"\">&raquo;</a></li>\n</ul>\n<div class=\"row\">\n  <div class=\"small-8 columns\">\n    <div id=\"details\" class=\"panel\">\n      <h1 i18n=\"coowners\" class=\"title\"></h1>\n      <ul ng-model=\"data\" class=\"small-block-grid-1 table\">\n        <li>\n          <div class=\"list-head\">\n            <div i18n=\"apartment\"></div>\n            <div i18n=\"name\"></div>\n            <div i18n=\"lastName\"></div>\n          </div>\n          <dl>\n            <dd ng-repeat=\"row in data\">\n              <div>{{row.fk_apartment_id}}</div>\n              <div>{{row.name}}</div>\n              <div>{{row.lastName}}</div>\n              <div class=\"admin-buttons\"><a href=\"javascript:void(0);\" ng-click=\"modify(row.id)\" data-reveal-id=\"updateModal\" i18n-title=\"modify\" data-tooltip=\"\" aria-haspopup=\"true\" class=\"button icon-pencil\"></a><a href=\"javascript:void(0);\" ng-click=\"delete(row.id)\" data-reveal-id=\"deleteModal\" i18n-title=\"delete\" data-tooltip=\"\" aria-haspopup=\"true\" class=\"button alert icon-cup\"></a></div>\n            </dd>\n          </dl><a href=\"javascript:void(0);\" ng-click=\"add()\" data-reveal-id=\"addModal\" i18n=\"add-coowner\" class=\"button success icon-user-add\"></a>\n        </li>\n      </ul>\n    </div>\n  </div>\n  <div class=\"small-4 columns\">\n    <div class=\"panel\">\n      <h2 i18n=\"map\" class=\"title\"></h2>\n    </div>\n  </div>\n</div>\n<div id=\"deleteModal\" ng-show=\"showDeleteModal\" data-reveal=\"data-reveal\" ng-coownerid=\"coOwnerId\" class=\"delete-modal reveal-modal\"></div>\n<div id=\"addModal\" ng-show=\"showAddModal\" ng-apartments=\"apartments\" data-reveal=\"data-reveal\" class=\"add-modal reveal-modal\"></div>\n<div id=\"updateModal\" ng-show=\"showUpdateModal\" ng-apartments=\"apartments\" ng-coowner=\"coOwner\" data-reveal=\"data-reveal\" ng-coownerid=\"coOwnerId\" ng-apartselected=\"apartSelected\" class=\"update-modal reveal-modal\"></div>");;return buf.join("");
};

this["JST"]["app/templates/coowners/updateModal"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div class=\"modal-background\"><a href=\"javascript:void(0);\" ng-click=\"cancel()\" class=\"close-reveal-modal\">&times</a>\n  <div class=\"small-12 columns\">\n    <form data-abide=\"data-abide\" data-id=\"{{coOwnerId}}\">\n      <input id=\"id\" name=\"id\" type=\"hidden\" value=\"{{coOwner.id}}\"/>\n      <div class=\"row\">\n        <h3 i18n=\"update-coowner\"></h3>\n      </div>\n      <div class=\"row\">\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"name\" name=\"name\" type=\"text\" placeholder=\"Name\" value=\"{{coOwner.name}}\" required=\"required\" pattern=\"[a-zA-Z0-9]+\"/>\n        </div>\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"lastName\" name=\"lastName\" type=\"text\" placeholder=\"Last Name\" value=\"{{coOwner.lastName}}\" required=\"required\" pattern=\"[a-zA-Z0-9]+\"/>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"email\" name=\"email\" type=\"email\" placeholder=\"E-mail\" value=\"{{coOwner.email}}\" pattern=\"[a-zA-Z0-9.@-_]+\"/>\n        </div>\n        <div class=\"small-12 medium-6 columns\">\n          <input id=\"phone\" name=\"phone\" type=\"text\" placeholder=\"Phone (fix or mobile)\" value=\"{{coOwner.phone}}\" pattern=\"[0-9-]+\"/>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"small-12 columns\">\n          <label i18n=\"apartment\"></label>\n          <select id=\"fk_apartment_id\" name=\"fk_apartment_id\" required=\"required\" data-ng-model=\"apartSelected\">\n            <option ng-repeat=\"apart in apartments\" value=\"{{apart.id}}\">Lot {{apart.lot}}: {{apart.address}} {{apart.street}}</option>\n          </select>\n        </div>\n      </div>\n      <div class=\"row buttons-container\"><a href=\"javascript:void(0);\" i18n=\"cancel\" class=\"button close-reveal-modal icon-cross\"></a>\n        <button type=\"submit\" i18n=\"confirm\" class=\"success icon-checkmark\"></button>\n      </div>\n    </form>\n  </div>\n</div>");;return buf.join("");
};

this["JST"]["app/templates/documents/loadModal"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div class=\"modal-background\"><a href=\"javascript:void(0);\" ng-click=\"cancel()\" class=\"close-reveal-modal\">&times</a>\n  <div class=\"small-12 columns\">\n    <form data-abide=\"data-abide\">\n      <div class=\"row\">\n        <h3 i18n=\"select-document\"></h3>\n      </div>\n      <div class=\"row\">\n        <div class=\"small-12 columns\">\n          <label i18n=\"document\">\n            <select id=\"document\" name=\"document\" required=\"required\">\n              <option ng-repeat=\"document in documents\" value=\"{{document.id}}\">{{document.title}}</option>\n            </select>\n          </label>\n        </div>\n      </div>\n      <div class=\"row\"><a href=\"javascript:void(0);\" i18n=\"cancel\" class=\"button close-reveal-modal icon-cross\"></a>\n        <button type=\"submit\" i18n=\"confirm\" class=\"success icon-checkmark\"></button>\n      </div>\n    </form>\n  </div>\n</div>");;return buf.join("");
};

this["JST"]["app/templates/documents/planning"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div id=\"Filters\" class=\"row filters\">\n  <div class=\"large-12 columns\">\n    <div class=\"panel\">\n      <div class=\"large-4 medium-4 small-4 columns\">\n        <label i18n=\"apartments\"></label>\n        <div class=\"apartments\">\n          <input id=\"All\" type=\"checkbox\" checked=\"true\" value=\"all\"/>\n          <label for=\"All\" i18n=\"all\"></label>\n          <div ng-repeat=\"apart in apartments\">\n            <input id=\"Apart{{apart.id}}\" type=\"checkbox\" value=\"{{$index}}\"/>\n            <label for=\"Apart{{apart.id}}\">Lot {{apart.lot}}: {{apart.coowners}}</label>\n          </div>\n        </div>\n      </div>\n      <div class=\"large-4 medium-4 small-4 columns period\">\n        <label i18n=\"period\"></label>\n        <select class=\"period\">\n          <option i18n=\"one week\" value=\"1\"></option>\n          <option i18n=\"two weeks\" value=\"2\" selected=\"true\"></option>\n          <option i18n=\"four weeks\" value=\"4\"></option>\n        </select>\n      </div>\n      <div class=\"large-4 medium-4 small-4 columns year\">\n        <label i18n=\"year\"></label>\n        <input id=\"IYear\" type=\"text\"/>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"row actions\">\n  <div class=\"large-12 columns\">\n    <div class=\"panel\"><a href=\"javascript:void(0);\" i18n=\"generate\" ng-click=\"generate()\" class=\"button\"></a><a href=\"javascript:void(0);\" i18n=\"save\" ng-click=\"save()\" class=\"button\"></a><a href=\"javascript:void(0);\" i18n=\"load\" ng-click=\"load()\" class=\"button\"></a></div>\n  </div>\n</div>\n<div id=\"Planning\" class=\"row planning\">\n  <div class=\"large-12 columns\">\n    <div class=\"panel\">\n      <input type=\"textfield\" i18n-attr=\"value:planning\" class=\"title\"/>\n    </div>\n  </div>\n</div>\n<div id=\"loadModal\" ng-show=\"showLoadModal\" data-reveal=\"data-reveal\" class=\"load-modal reveal-modal\"></div>");;return buf.join("");
};

this["JST"]["app/templates/home/layout"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];;return buf.join("");
};

this["JST"]["app/templates/layout"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<div data-offcanvas=\"data-offcanvas\" class=\"off-canvas-wrap\">\n  <div class=\"inner-wrap\">\n    <nav class=\"tab-bar\">\n      <section class=\"left-small\"><a class=\"left-off-canvas-toggle menu-icon\"><span></span></a></section>\n      <section class=\"middle tab-bar-section\">\n        <h1 class=\"title\">ESyndic</h1>\n      </section>\n      <section ng-switch=\"userLoggedIn\" class=\"right-small\"><a ng-switch-when=\"true\" href=\"javascript:void(0);\" data-dropdown=\"userMenu\" data-options=\"align: left; is_hover:true\" aria-expended=\"false\" class=\"icon-user\"></a>\n        <ul id=\"userMenu\" data-dropdown-content=\"data-dropdown-content\" class=\"small f-dropdown\">\n          <li><a href=\"#/coowners/{{user.id}}\" class=\"button\">Info Personnelles</a><a href=\"javascript:void(0);\" ng-click=\"logout()\" class=\"icon-exit button\">Déconnexion</a></li>\n        </ul>\n      </section>\n    </nav>\n    <aside class=\"left-off-canvas-menu\">\n      <ul class=\"off-canvas-list\">\n        <li>\n          <label>ESyndic</label>\n        </li>\n        <li><a href=\"#/apartment\" i18n=\"apartments\" class=\"icon-office\">Appartements</a></li>\n        <li><a href=\"#/coowners\" i18n=\"coowners\" class=\"icon-user\">Copropriétaires</a></li>\n        <li class=\"has-submenu\"><a href=\"#/budget\" i18n=\"budget\" class=\"icon-creditcard\">Budget</a>\n          <ul class=\"left-submenu\">\n            <li class=\"back\"><a href=\"#\" i18n=\"budget\">Budget</a></li>\n            <li><a href=\"#/budget/2015\" i18n=\"annual\" class=\"icon-pie\">Annuel</a></li>\n            <li><a href=\"#/budget\" i18n=\"evolution\" class=\"icon-graph\">Evolution</a></li>\n          </ul>\n        </li>\n        <li class=\"has-submenu\"><a href=\"#\" class=\"icon-users\">Assemblée Générales</a>\n          <ul class=\"left-submenu\">\n            <li class=\"back\"><a href=\"#\">Assemblée Générales</a></li>\n            <li><a href=\"#\" i18n=\"reports\" class=\"icon-clipboard\">Compte rendu</a></li>\n            <li><a href=\"#\" i18n=\"calendar\" class=\"icon-calendar\">Calendrier</a></li>\n            <li><a href=\"#\" i18n=\"archives\" class=\"icon-archive\">Archives</a></li>\n          </ul>\n        </li>\n        <li><a href=\"#/documents\" i18n=\"useful-documents\" class=\"icon-books\">Documents Utiles</a></li>\n      </ul>\n    </aside>\n    <section class=\"main-section\"></section><a class=\"exit-off-canvas\"></a>\n  </div>\n</div>");;return buf.join("");
};