//-------------------------------------------------------------------------------------------------------------------//
// EXTENDS BASE CONTROLLERS
// - must be done after app bootstrapping
//-------------------------------------------------------------------------------------------------------------------//
// get Module Controller
// -> controller are not defined at this time (so don't try to get a specific controller)
_ctrl = _module.controller();
// extend controller
_ctrl.extendDocumentsAllController = function( $scope, $element, $factory, $injector, $compile ) {
    console.log('--- extend controller: DocumentsAll ---');

    $scope.filtersOpen = false;

    // GET DEFAULT
    $scope.initFilters = function() {
        var _maxHeight = 0,
            _label = null;

        $scope.$filters = $('#Filters');
        $scope.$filtersPanel = $scope.$filters.find('.panel:first');

        $scope.$filters.find('.columns').each( function() {
            var $this = $(this),
                $label = $this.find('label:first');

            if (_maxHeight < $this.height()) _maxHeight = $this.height();

            $label.on('click', function() {
                if (!$scope.filtersOpen) {
                    $scope.filtersOpen = true;
                    $scope.$filtersPanel.height( $scope.$filtersPanel.data('height') );
                } else {
                    $scope.closeFilters();
                }
            });
        });

        $scope.$filtersPanel.data('height', _maxHeight)
            .data('closed-height', $scope.$filtersPanel.height() );

        // CHECKBOXES: apartments
        $('#Filters').find('input:checkbox').change(function() {
            var _val = $(this).val(),
                _checked = $(this).is(':checked');

            if (_val=='all') {
                // select all: uncheck others
                if (_checked) {
                    $scope.$filters.find('input:checkbox').slice(1).prop('checked', false);
                }
            } else if ( $scope.$filters.find('input:checkbox:first').is(':checked') ) {
                $scope.$filters.find('input:checkbox:first').prop('checked', false);
            }
        });
        _label = $scope.$filters.find('.columns:first').find('label:first');
        _label.data('default', _label.text());

        // PERIOD
        _label = $scope.$filters.find('.columns.period').find('label:first');
        _label.data('default', _label.text());

        // YEAR
        var _today = new Date(),
            _year = _today.getFullYear();
        if (_today.getMonth()>10) ++_year;
        $('#IYear').val( _year );
        _label = $scope.$filters.find('.columns.year').find('label:first');
        _label.data('default', _label.text());

        $scope.updateFiltersLabels();
    };

    $scope.updateFilters = function() {
        $scope.year = $('#IYear').val();
        $scope.months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        $scope.monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        $scope.period = $element.find('select.period').val();
        // apartments
        $scope.selected = [];
        $('#Filters').find('.apartments').find('input:checked').each( function() {
            var _val = $(this).val();
            if (_val=='all') {
                $scope.selected = $scope.$filters.find('.apartments').find('input:checkbox').slice(1).map(function(){
                    return $(this).val();
                }).get();
            } else {
                $scope.selected.push( _val );
            }
        });
        $scope.updateFiltersLabels();
    };

    $scope.updateFiltersLabels = function() {
        var _label = null,
            _text = '';

        // APARTMENTS
        _label = $scope.$filters.find('.columns:first').find('label:first');

        var _selected = $scope.$filters.find('.apartments').find('input:checked').map(function(){
            return $(this).val();
        }).get();
        _label.text( _label.data('default') + ' : ' + _selected.join('-') );

        // PERIOD
        _label = $scope.$filters.find('.columns.period').find('label:first');
        _label.text( _label.data('default') + ' : ' + _label.next().val() );

        // YEAR
        _label = $scope.$filters.find('.columns.year').find('label:first');
        _label.text( _label.data('default') + ' : ' + _label.next().val() );
    };

    $scope.closeFilters = function() {
        $scope.filtersOpen = false;
        $scope.$filtersPanel.height( $scope.$filtersPanel.data('closed-height') );
        $scope.updateFiltersLabels();
    };

    $scope.createCouples = function() {
        // create coowners couple
        var _remains = $scope.selected.length,
            _unselected = $scope.selected.concat();
            _couplesNames = [];

        for (var i= 0, _l=Math.ceil(_remains*0.5); i<_l; ++i) {
            var _couple = [ _unselected.splice( parseInt( Math.random() * (_remains--) ), 1) ];
            _couple.push( _unselected.splice( parseInt( Math.random() * (_remains--) ), 1) );

            //$scope.couples.push( _couple );

            _couplesNames.push( [$scope.apartments[ _couple[0] ].coowners, $scope.apartments[ _couple[1] ].coowners] );
        }

        $scope.couples.push( _couplesNames );
    };

    $scope.generate = function() {
        $scope.updateFilters();
        $scope.closeFilters();

        // store couples name to save planning (coowners may changes in time)
        if (!$scope.dataLoaded) {
            $scope.couples = [];
            $scope.createCouples();
        }

        var _tpl = $scope.createMonths( $scope.months, $scope.year, $scope.period, $scope.couples, $scope.apartments );

        $scope.dataLoaded = false;

        // debug data
        var _data = {
            year: $scope.year,
            months: $scope.months,
            period: $scope.period,
            couples: JSON.stringify( $scope.couples )
        };
        console.log( JSON.stringify(_data) );

        if ( $('#Planning table').length>0 ) $('#Planning table').remove();
        $('#Planning > .columns > .panel').append( _tpl );
    };

    $scope.renderCallback = function() {

    };

    // CALLBACK METHOD
    // - preprocess data
    $scope.queryCallback = function() {
        // GET ALL APARTMENTS
        var _factory = $injector.get('ApartmentAllFactory');
        _factory.query({}, function(data, status, headers, config) {
            $scope.apartments = data.data;
            // wait for angular rendering
            setTimeout( $scope.initFilters, 0 );
        });
    };


    $scope.createMonths = function() {
        var i, j, k, _l, d,
            _tpl = '<table class="each-'+ $scope.period +'">',
            dayName = ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            dayOrder = [1, 2, 3, 4, 5, 6, 0],
            firstMonth = $scope.months[0],
            lastMonth = firstMonth + $scope.months.length;

        _tpl += '<thead><tr> <th></th>';
        for(i in dayOrder){
            _tpl += '<th>'+dayName[dayOrder[i]]+'</th>';
        }
        _tpl += '<th i18n="responsable"></th> <th i18n="spare"></th>';
        _tpl += '</tr></thead>';

        _tpl += '<tbody>';

        var periodClass = 'period-odd',
            monthClass = 'month-odd',
            // - current association responsable-suppléant
            currentCouple = 0,
            // - current set of couples
            currentCouples = 0,
            currentCoupleLength = 0,
            _couplesInverted = false,
            _monthWeekNum = 0;

        var _line = '<tr class="'+ periodClass +' '+ monthClass,
            _lineTDs = '<td class="name"></td>';

        for (i=firstMonth; i<lastMonth; ++i) {
            d = new Date($scope.year, $scope.months[i], 1);
            _monthWeekNum = 0;

            // IF FIRST MONTH
            // -> display empty cells
            if (i==firstMonth) {
                for (j = 0, _l = dayOrder.indexOf(d.getDay()); j < _l; ++j) {
                    _lineTDs += '<td class="blank"> </td>';
                }
            }

            // mont last day: get first day of next month
            d.setMonth($scope.months[i] + 1, 0);
            // fill with month's dates
            for (k = 1; k <= d.getDate(); ++k) {
                ++j;
                if (j > 7) {
                    j = 1;
                    // add couples
                    if (_couplesInverted) {
                        //_lineTDs += '<td class="coowner first">'+ $scope.apartments[ $scope.couples[currentCouple][1] ].coowners +'</td>';
                        //_lineTDs += '<td class="coowner">'+ $scope.apartments[ $scope.couples[currentCouple][0] ].coowners +'</td>';

                        _lineTDs += '<td class="coowner first">' + $scope.couples[currentCouples][currentCouple][1] + '</td>';
                        _lineTDs += '<td class="coowner">' + $scope.couples[currentCouples][currentCouple][0] + '</td>';
                    }
                    else {
                        //_lineTDs += '<td class="coowner first">'+ $scope.apartments[ $scope.couples[currentCouple][0] ].coowners +'</td>';
                        //_lineTDs += '<td class="coowner">'+ $scope.apartments[ $scope.couples[currentCouple][1] ].coowners +'</td>';

                        _lineTDs += '<td class="coowner first">' + $scope.couples[currentCouples][currentCouple][0] + '</td>';
                        _lineTDs += '<td class="coowner">' + $scope.couples[currentCouples][currentCouple][1] + '</td>';
                    }
                    // update couple cycle
                    ++currentCoupleLength;
                    if (currentCoupleLength >= $scope.period) {
                        // new period
                        if (periodClass=='period-odd') periodClass = 'period-even';
                        else periodClass = 'period-odd';

                        _lineTDs += '</tr><tr class="blank '+ monthClass +'"><td class="name"></td> <td colspan="9"></td>';

                        currentCoupleLength = 0;
                        ++currentCouple;
                        if (currentCouple >= $scope.couples[currentCouples].length) {
                            // second pass: invert couple
                            if (!_couplesInverted) {
                                _couplesInverted = true;
                                currentCouple = 0;
                            }
                            // or creates new couples association
                            else {
                                $scope.createCouples();
                                _couplesInverted = false;
                                currentCouple = 0;
                                ++currentCouples;
                            }
                        }
                    }
                    // close line
                    ++_monthWeekNum;
                    _line +=  '">' + _lineTDs + '</tr>';
                    _tpl += _line;

                    // init new line
                    _line = '<tr class="'+ periodClass +' '+ monthClass;
                    _lineTDs = '<td class="name">';
                    if (_monthWeekNum>1) {
                        _monthWeekNum = -10;
                        _lineTDs += '<span>'+ $scope.monthNames[i] +'</span>';
                    }
                    _lineTDs += '</td>';
                }
                _lineTDs += '<td class="'+ monthClass +'">' + k + '</td>';
            }

            // NEW MONTH
            if (monthClass=='month-odd') monthClass = 'month-even';
            else monthClass = 'month-odd';

            // 2 MONTHS ON THE SAME WEEK
            // (if its not the last day of the month on the last day of the week)
            if (k < d.getDate() || j < 7) {
                _line += '-' + monthClass;
            }

            // IF LAST MONTH
            // -> fill last lines with empty cells
            if (i==lastMonth-1) {
                for (j; j < 7; ++j) {
                    _lineTDs += '<td class="blank"> </td>';
                }
                // last week
                // -> add couples
                if (_couplesInverted) {
                    //_lineTDs += '<td class="coowner first">' + $scope.apartments[ $scope.couples[currentCouple][1] ].coowners + '</td>';
                    //_lineTDs += '<td class="coowner">' + $scope.apartments[ $scope.couples[currentCouple][0] ].coowners + '</td>';

                    _lineTDs += '<td class="coowner first">' + $scope.couples[currentCouples][currentCouple][1] + '</td>';
                    _lineTDs += '<td class="coowner">' + $scope.couples[currentCouples][currentCouple][0] + '</td>';
                }
                else {
                    //_lineTDs += '<td class="coowner first">' + $scope.apartments[ $scope.couples[currentCouple][0] ].coowners + '</td>';
                    //_lineTDs += '<td class="coowner">' + $scope.apartments[ $scope.couples[currentCouple][1] ].coowners + '</td>';

                    _lineTDs += '<td class="coowner first">' + $scope.couples[currentCouples][currentCouple][0] + '</td>';
                    _lineTDs += '<td class="coowner">' + $scope.couples[currentCouples][currentCouple][1] + '</td>';
                }
                // end planning
                _line += '">' + _lineTDs + '</tr>';
                _tpl += _line;
            }
        }

        _tpl += '</tbody></table>';
        return _tpl;
    };

    $scope.load = function() {
        console.log('LOAD');
        $scope.showLoadModal = true;

        // DEBUG
        $scope.loadDocument();
    };
    $scope.loadDocument = function( data ) {

        // DEBUG
        // -> version 2015
        var _data = {
            year: "2015",
            months: [0,1,2,3,4,5,6,7,8,9,10,11],
            period: 2,
            couples: [
                [
                    ["Bomandouki Olingou-Pourou", "Fievet / Chep"],
                    ["Stoeva / Clavreul", "Aboulker"],
                    ["Daufin / Ricart", "Naus"],
                    ["Faux / Poulain", "Dangel / Stouvenel"]
                ],

                [
                    ["Daufin / Ricart", "Dangel / Stouvenel"],
                    ["Naus", "Faux / Poulain"],
                    ["Bomandouki Olingou-Pourou", "Aboulker"],
                    ["Fievet / Chep", "Stoeva / Clavreul"]
                ],

                [
                    ["Faux / Poulain","Dangel / Stouvenel"],
                    ["Aboulker", "Naus"],
                    ["Daufin / Ricart", "Bomandouki Olingou-Pourou"],
                    ["Stoeva / Clavreul", "Fievet / Chep"]
                ],

                [
                    ["Faux / Poulain","Dangel / Stouvenel"],
                    ["Aboulker", "Bomandouki Olingou-Pourou"],
                    ["Naus", "Daufin / Ricart"],
                    ["Stoeva / Clavreul", "Fievet / Chep"]
                ]
            ]
        };

        $scope.year = _data.year;
        $scope.period = _data.period;
        //$scope.couples = JSON.parse( data.couples );
        $scope.couples = _data.couples;

        $scope.dataLoaded = true;
        $scope.generate();
    };

    $scope.save = function() {
        var _docData = {
            year: $scope.year,
            months: $scope.months,
            period: $scope.period,
            couples: $scope.couples
        };

        var _factory = $injector.get('DocumentsDocumentsOneFactory');
        _factory.post( _docData, $scope.feedBack );
    };
    $scope.feedBack = function() {

    };
};