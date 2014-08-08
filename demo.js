var IntlFilters = angular.module('Intl.filters', []);
IntlFilters.filter('dateIntl', ['$locale', function($locale) {

    var data = {
        "en-us" : {
            "medium" : { month : "short", day : "numeric", year : "numeric", hour : "numeric", minute : "2-digit", second : "2-digit", hour12 : true },
            "short" : { month : "numeric", day : "numeric", year : "2-digit", hour : "numeric", minute : "2-digit",  hour12 : true  },
            "fullDate" : { weekday : "long", month : "long", day : "numeric", year : "numeric" },
            "longDate" : { month : "long", day : "numeric", year : "numeric" },
            "mediumDate" : { month : "short", day : "numeric", year : "numeric" },
            "shortDate" : { month : "numeric", day : "numeric", year : "2-digit" },
            "mediumTime" : { hour : "numeric", minute : "2-digit",  second : "2-digit", hour12 : true },
            "shortTime" : { hour : "numeric", minute : "2-digit",  hour12 : true }
        }
    };

    // sample usage:
    // {{ then | dateIntl:"en-US":"longDate" }}
    // {{ then | dateIntl:"es-MX":"longDate" }}
    // {{ then | dateIntl:"longDate" }}

    return function(date, arg0, arg1) {
        var culture = ( arg1 ? arg0 : $locale.id );
        var format = (arg1 ? arg1 : arg0 );
        var s = date.toISOString();
        var fmt = data["en-us"][format];
        if (typeof format == "string") {
            switch (format) {
                case "medium" :
                case "short" :
                    s = date.toLocaleString(culture, fmt);
                    break;
                case "fullDate" :
                case "longDate" :
                case "mediumDate" :
                case "shortDate" :
                    s = date.toLocaleDateString(culture, fmt);
                    break;
                case "mediumTime" :
                case "shortTime" :
                    s = date.toLocaleTimeString(culture, fmt);
                    break;

            }
        } else {
            s = date.toLocaleString(culture, format);
        }
        return s;
    };
}]);

var app = angular.module("demo", ["ngRoute","ui.bootstrap", "ui.bootstrap.datepicker", "ui.bootstrap.tabs", "pascalprecht.translate", "ngCookies", "tmh.dynamicLocale", "Intl.filters"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            templateUrl: "view/home.html"
        })
        .when('/character',
        {
            templateUrl: "view/character.html",
            controller: "CharacterCtrl"
        })
        .when('/number',
        {
            templateUrl: "view/number.html",
            controller: "NumberCtrl"
        })
        .when('/date',
        {
            templateUrl: "view/date.html",
            controller: "DateCtrl"
        })
        .when('/bio',
        {
            templateUrl: "view/bio.html",
            controller: "BioCtrl"
        });
});

app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.preferredLanguage('en-us');
    //$translateProvider.addInterpolation('$translateMessageFormatInterpolation');

    $translateProvider.translations('en-us', {
        LANG : "Language",
        SALUTATION : "Salutation",
        MR: 'Mr.',
        MRS : "Mrs.",
        MS : "Ms.",
        FIRST_NAME : "First Name",
        LAST_NAME : "Last Name",
        FAV_COLOR : "Favorite Color",
        FRIENDS : "Friends",
        BLUE : "Blue",
        GREEN : "Green",
        ORANGE : "Orange",
        SUMMARY : "Summary"
    });

    $translateProvider.translations('es-mx', {
        LANG : "Idioma",
        SALUTATION : "Saludo",
        MR: 'Sr.',
        MRS : "Sra.",
        MS : "Srta.",
        FIRST_NAME : "Primer Nombre",
        LAST_NAME : "Apellido",
        FAV_COLOR : "Color Favorito",
        FRIENDS : "Amigos",
        BLUE : "Azul",
        GREEN : "Verde",
        ORANGE : "Naranja",
        SUMMARY : "Resumen"
    });

    $translateProvider.translations('fr-ca', {
        LANG : "Langue",
        SALUTATION : "Salutation",
        MR: 'M.',
        MRS : "Mme",
        MS : "Mlle",
        FIRST_NAME : "Prénom",
        LAST_NAME : "Nom",
        FAV_COLOR : "Couleur préférée",
        FRIENDS : "Amis",
        BLUE : "Bleu",
        GREEN : "Vert",
        ORANGE : "Orange",
        SUMMARY : "Résumé"
    });

}]);

app.config(function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.useCookieStorage();
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
});

app.run(['$log', '$rootScope', '$timeout', function($log, $rootScope, $timeout) {
    $rootScope.$on('$localeChangeSuccess', function(event, localeId, $locale) {
        $log.log(localeId);
        var parts = localeId.split('-');
        if (parts.length > 1) {
            parts[1] = parts[1].toUpperCase();
        }
        $.getScript( "twitter_cldr/" + parts[0] + ".js", function( data, textStatus, jqxhr ) {
            $rootScope.$broadcast( 'TwitterCldrChangeSucces' );
        });

        Globalize.culture(parts.join('-'));
        $timeout(function() {
            $rootScope.$broadcast( 'GlobalizeChangeSuccess' );
        },0);
    });
}]);

app.controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'home';
        return page === currentRoute ? 'active' : '';
    };
}]);

app.controller("CharacterCtrl", function($scope) {

    $scope.$watch("characters", function() {
        var entity = "", entityHex = "", js = "", jsHex = "", s, x;

        for (x = 0; x < $scope.characters.length; x++ )  {
            if ($scope.characters.charCodeAt(x) < 128) {
                entity += $scope.characters.substr(x, 1);
                entityHex += $scope.characters.substr(x, 1);
                js += $scope.characters.substr(x, 1);
                jsHex += $scope.characters.substr(x, 1);
            } else {
                entity = entity + "&#" +  $scope.characters.charCodeAt(x) + ";";
                entityHex = entityHex + "&#x" +  $scope.characters.charCodeAt(x).toString(16).toUpperCase() + ";";
                s = "00" + $scope.characters.charCodeAt(x).toString(16).toUpperCase();
                js = js + "\\u" + s.substr(s.length - 4);
                if ($scope.characters.charCodeAt(x) < 256) {
                    jsHex = jsHex + "\\x" + s.substr(s.length - 2);
                } else {
                    jsHex = jsHex + "\\u" + s.substr(s.length - 4);
                }
            }
        }

        $scope.entity = entity;
        $scope.entityHex = entityHex;
        $scope.js = js;
        $scope.jsHex = jsHex;

        $scope.escape = escape($scope.characters);
        $scope.encode = encodeURIComponent($scope.characters);
        $scope.utf8 = unescape(encodeURIComponent($scope.characters));
        var re = /%/g;
        $scope.utf8hex = $scope.encode.replace(re, " ");
    });

    $scope.characters = "ñéç";
});

app.controller("NumberCtrl", function($scope, $locale, tmhDynamicLocale) {

    $scope.$watch("language", function() {
        tmhDynamicLocale.set($scope.language);
    });
    $scope.language = $locale.id;

    $scope.value = 12345.6789;
    $scope.fraction = 3;
    $scope.numberformat2 = 'n';

    $scope.cldrFormatter = "decimal";

    $scope.intlUseGrouping = false;
    $scope.intlStyle = "currency";
    $scope.intlCurrency = "USD";
    $scope.intlCurrencyDisplay = "symbol";

    $scope.globalizeFormat = function() {
        return Globalize.format($scope.value, $scope.numberformat2 + $scope.fraction);
    };
    $scope.$on('GlobalizeChangeSuccess', function(event) {
        $scope.$apply();
    });

    $scope.cldrFormat = function() {
        var fmt = new TwitterCldr.DecimalFormatter();
        if ($scope.cldrFormatter == "currency") {
            fmt = new TwitterCldr.CurrencyFormatter();
        } else if ($scope.cldrFormatter == "percent") {
            fmt = new TwitterCldr.PercentFormatter();
        }
        return fmt.format($scope.value, {precision:  $scope.fraction});
    };
    $scope.$on('TwitterCldrChangeSucces', function(event) {
        $scope.$apply();
    });

    $scope.intlFormat = function() {
        return $scope.value.toLocaleString($scope.language, { style : $scope.intlStyle,
            useGrouping: $scope.intlUseGrouping,
            currency : $scope.intlCurrency, currencyDisplay: $scope.intlCurrencyDisplay,
            maximumFractionDigits: $scope.fraction, minimumFractionDigits: $scope.fraction});
    };
});


app.controller("DateCtrl", function($scope, $locale, tmhDynamicLocale) {

    $scope.$watch("language", function() {
        tmhDynamicLocale.set($scope.language);

        $scope.then2 = null;
        $scope.then3 = null;
    });
    $scope.language = $locale.id;

    $scope.$watch("dateformat2", function() {
        $scope.then2 = Globalize.format( $scope.then , $scope.dateformat2 );
    });
    $scope.$on('GlobalizeChangeSuccess', function(event) {
        $scope.then2 = Globalize.format( $scope.then , $scope.dateformat2 );
        $scope.$apply();
    });

    var fmt = new TwitterCldr.DateTimeFormatter();
    $scope.$watch("dateformat3", function() {
        $scope.then3 = fmt.format($scope.then, {"type": $scope.dateformat3});
    });
    $scope.$on('TwitterCldrChangeSucces', function(event) {
        fmt = new TwitterCldr.DateTimeFormatter();
        $scope.then3 = fmt.format($scope.then, {"type": $scope.dateformat3});
        $scope.$apply();
    });

    $scope.then = new Date (2013,0,1,13,1,1);
    $scope.dateformat = 'medium';
    $scope.dateformat2 = 'f';
    $scope.dateformat3 = 'full';
});

app.controller("BioCtrl", function($scope, $timeout, $translate, $locale, $filter, tmhDynamicLocale) {

    $scope.$watch("language", function() {
        tmhDynamicLocale.set($scope.language);

        $translate.use($scope.language);
        $scope.langattr =  $scope.language.substr(0,2);
    });
    $scope.language = $locale.id;

    $scope.salutationkey = "MR";

    $scope.salutations = {
        "MR" : "Mr.",
        "MRS" : "Mrs.",
        "MS" : "Ms."
    };

    var salutationGender = {
        "MR" : "male",
        "MRS" : "female",
        "MS" : "female"
    };

    $scope.created = new Date();
    $scope.firstname = "John";
    $scope.lastname = "Doe";
    $scope.color = "BLUE";
    $scope.friends = 0;
    $scope.friendmessage = "???";

    $scope.$watch("salutationkey", function() {
        $scope.salutation = $scope.salutations[$scope.salutationkey];
    });

    var mf = new MessageFormat('en');
    var friendMessageTemplate = "{GENDER, select, male {He has} female {She has} other {They have} } " +
    "{NUM_FRIENDS, plural, =0 {no friends} one {1 friend} other {# friends}}.";

    var friendMessage = mf.compile(friendMessageTemplate);

    $scope.friendMessageStr = function() {
        return friendMessage({ "GENDER" : salutationGender[$scope.salutationkey] , "NUM_FRIENDS" : $scope.friends });
    };

 });