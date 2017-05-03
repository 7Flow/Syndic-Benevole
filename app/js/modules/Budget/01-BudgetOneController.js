//-------------------------------------------------------------------------------------------------------------------//
// EXTENDS BASE CONTROLLERS
// - must be done after app bootstrapping
//-------------------------------------------------------------------------------------------------------------------//
// get Module Controller
// -> controller are not defined at this time (so don't try to get a specific controller)
_ctrl = _module.controller();
// extend controller
_ctrl.extendBudgetOneController = function( $scope, $element, $factory, $injector, $compile ) {
    console.log('--- extend controller: BudgetOne ---');

    // PREPROCESS DATA
    // -> complexe mysql request with 3 left join...
    // -> transform 1d table into a 2d table
    $scope.queryCallback = function() {
        // budget total
        //$scope.total;
    };

    // CALLBACK METHOD
    $scope.renderCallback = function() {
        // BUILD CHART
        $('#chart').empty();

        var _size = $('#chart').width(),
            _w = _size - 20,
            _h = _w,
            _offset = (_size - _w) * 0.5,
            _r = Math.min(_w, _h) * 0.5,
            _2PI = 2 * Math.PI,
            _colors = {
                EDF: '#005BBB',
                Veolia: '#FF0000',
                Thelem: '#e04C2C',
                Portis: '#01408F',
                'TM-Incendie': '#7A0913',
                UNARC: '#33B2AA',
                Divers: '#C0C0C0',
                undefined: "#999999",
                null: "#FFFFFF",
                remaining: "#FFFFFF"
            };

        var _dataNodes = {
                name: "budget",
                children: $scope.data
            },
            _length = $scope.data.length,
            i= 0, j= 0, _childLength= 0, _expenditureTotalSpent=0;

        // IN D3: CHILDS ARE ALWAYS REPRESENTED AS 100% OF THE PARENT
        // we want to show unused parts
        for (i= 0; i<_length; ++i) {
            var _node = _dataNodes.children[i];
            _childLength = _node.children.length;
            _expenditureTotalSpent = 0;

            for (j=0; j<_childLength; ++j) {
                _expenditureTotalSpent += _node.children[j].size;
            }

            if (_node.size > _expenditureTotalSpent) {
                _node.children.push( {
                    id: 0,
                    name: 'Remaining',
                    size: _node.size - _expenditureTotalSpent,
                    provider: 'remaining',
                    color: "#FFFFFF",
                    children: []
                } );
            }
        }

        var _chart = d3.select("#chart")
            /*.style("width", _w+'px')*/
            /*.style("height", (_size)+'px')*/
            .append("svg:svg")
            .attr("width", _size)
            .attr("height", _size)
            .append("svg:g")
            .attr("id", "container")
            .attr("transform", "translate(" + (_w*0.5+_offset) + "," + (_h*0.5+_offset) + ")");

        var _segments = d3.layout.partition()
            .sort(null)
            .size([2 * Math.PI, _r * _r])
            .value(function(d) { return d.size; });

        var _arc = d3.svg.arc()
            .startAngle(function(d) { return d.x; })
            .endAngle(function(d) { return d.x + d.dx; })
            .innerRadius(function(d) { return Math.sqrt(d.y); })
            .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

        _chart.append("svg:circle")
            .attr("r", _r+1)
            .style("opacity", 0);

        _chart.datum( _dataNodes )
            .selectAll('path')
            .data( _segments.nodes )
            .enter()
            .append("svg:path")
            .attr("display", function(d) { return d.depth ? null : "none"; })
            .attr("d", _arc)
            .attr("fill-rule", "evenodd")
            .style("stroke", "#fff")
            .style("fill", function(d) { return d.color; })
            .style("opacity", '0')
            .on("mouseover", mouseover);

        // Add the mouseleave handler to the bounding circle.
        d3.select("#container").on("mouseleave", mouseleave);

        function mouseover(d) {
            // SHOW ALL CONNECTED NODES
            if (d.depth>1) {
                // GET ANCESTORS
                var _ancestors = [],
                    _current = d;
                while (_current.parent) {
                    _ancestors.push(_current);
                    _current = _current.parent;
                }
                _chart.selectAll('path')
                    .filter(function(node) {
                        return (_ancestors.indexOf(node) >= 0);
                    })
                    .transition()
                    .duration(500)
                    .style('opacity', 1);

                _chart.selectAll('path')
                    .filter(function(node) {
                        return (node.depth==1 && node!= d.parent);
                    })
                    .transition()
                    .duration(500)
                    .style('opacity', 0.4);

                // HIDE OTHER CHILDS
                _chart.selectAll('path')
                    .filter(function(node) {
                        return (node.depth>1 && node.parent!= d.parent);
                    })
                    .transition()
                    .duration(500)
                    .style('opacity', 0.1);
            } else {
                // GET CHILDS
                _chart.selectAll('path')
                    .filter(function(node) {
                        return (node.depth>1 && node.parent==d);
                    })
                    .transition()
                    .duration(500)
                    .style('opacity', 0.7);

                _chart.selectAll('path')
                    .filter( function(node) {return node==d;})
                    .transition()
                    .duration(500)
                    .style('opacity', 1);

                // HIDE OTHER FIRST NODES
                _chart.selectAll('path')
                    .filter(function(node) {
                        return ((node.depth==1 && node!=d) || (node.depth>1 && node.parent!=d));
                    })
                    .transition()
                    .duration(500)
                    .style('opacity', 0.4);

                // HIDE OTHER CHILDS
                _chart.selectAll('path')
                    .filter(function(node) {
                        return (node.depth>1 && node.parent!=d);
                    })
                    .transition()
                    .duration(500)
                    .style('opacity', 0.1);
            }

            // % OF TOTAL
            if (d.parent) {
                var percentage = (d.size / $scope.total * 100).toPrecision(3),
                    percentageString = percentage + "%";

                if (percentage < 0.1) {
                    percentageString = "< 0.1%";
                }

                if (d.parent.name != 'budget') {
                    // % OF EXPENDITURE
                    var relativePercentage = (d.size / d.parent.size * 100).toPrecision(3),
                        relativeString = relativePercentage + '%';

                    if (relativePercentage < 0.1) {
                        relativeString = "< 0.1%";
                    }

                    if (d.name.toLowerCase()=='remaining') {
                        d3.select("#chartPercentage")
                            .html($('#chart').data('remaining')+'<br/>'+ relativeString);
                    } else {
                        d3.select("#chartPercentage")
                            .html(d.name+'<br/>'+ relativeString + ' ' + $('#chart').data('of') + ' ' + d.provider);
                    }
                } else {
                    d3.select("#chartPercentage")
                        .html(d.name + '<br/>' + d.provider + '<br/>' + percentageString + ' ' + $('#chart').data('oftotal') );
                }
                // SHOW TOTAL if on center
            } else {
                d3.select("#chartPercentage")
                    .text('Total: ' + $scope.total+'€');
            }

            d3.select("#chartExplanation")
                .style("visibility", "");
        }
        function mouseleave(d) {
            //console.log(d);
            _chart.selectAll("path")
                .filter(function(d) {
                    return (d.depth>1);
                })
                .transition()
                .duration(500)
                .style("opacity", 0.1);

            _chart.selectAll("path")
                .filter(function(d) {
                    return (d.depth==1);
                })
                .transition()
                .duration(500)
                .style("opacity", 1);

            d3.select("#chartPercentage")
                .text('Total: ' + $scope.total+'€');
        }
        // INTRO
        mouseleave();

        // INSERT
        var _maxHeight = 0;
        $element.find('.content').each( function() {
            if ($(this).height()>_maxHeight) {
                _maxHeight = $(this).height();
            }
        });
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);

        style.sheet.insertRule(".accordion .accordion-navigation>.content, .accordion dd>.content { max-height: 0; }");
        style.sheet.insertRule(".accordion .accordion-navigation>.content.active, .accordion dd>.content.active { max-height: " + _maxHeight + "px;}", 0);
    };

    $scope.prevent = function( $event ) {
        $event.preventDefault();
        //$event.stopImmediatePropagation();
        $event.stopPropagation();
        // BUT PASS THE EVENT ONLY TO FOUNDATION
        //$( $($event.currentTarget).attr('data-dropdown') ).trigger( $event );
        $($event.currentTarget).trigger('click.fndtn.dropdown');
    };

    $scope.modify = function( id ) {
        console.log( ':modify', id );
        $scope.showModifyModal = true;
    };
    $scope.confirmModify = function() {
        // get form params

        // PUT REQUEST
        $factory.update( {id: 14}, $scope.feedBack );
    };


    $scope.delete = function( id ) {
        console.log( ':delete', id );
        $scope.showDeleteModal = true;
    };
    $scope.confirmDelete = function( id ) {
        var _factory = $injector.get('BudgetBudgetOneFactory');
        _factory.delete({id: id}, $scope.feedBack);
    };
};
