//-------------------------------------------------------------------------------------------------------------------//
// EXTENDS BASE CONTROLLERS
// - must be done after app bootstrapping
//-------------------------------------------------------------------------------------------------------------------//
// get Module Controller
// -> controller are not defined at this time (so don't try to get a specific controller)
_ctrl.extendBudgetAllController = function( $scope, $element, $factory, $injector, $compile, $location ) {

    // CALLBACK METHOD
    $scope.renderCallback = function() {
        //console.log( $scope.data );
        // BUILD BARS
        var stack = d3.layout.stack().values(function(d) { return d.values; }),
            layers = stack( $scope.data );

        var yGroupMax = d3.max(layers, function(layer) { return d3.max(layer.values, function(d) { return d.y; }); }),
            yStackMax = d3.max(layers, function(layer) { return d3.max(layer.values, function(d) { return d.y0 + d.y; }); }),
            xGroupMax = d3.max(layers, function(layer) { return d3.max(layer.values, function(d) { return d.x; }); }),
            margin = {top: 20, right: 0, bottom: 20, left: 40},
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var _yRange = [];
        for (var i= 0; i<=xGroupMax; ++i) {
            _yRange.push( i );
        }

        // - x: abscisses
        var x = d3.scale.linear()
            .domain([0, yStackMax])
            .range([0, width], .08);
        // - y: ordonnées
        var y = d3.scale.ordinal()
            .domain(_yRange)
            .rangeRoundBands([0, height]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(height)
            .orient("bottom");

        var years = d3.scale.ordinal()
            .domain( $scope.years )
            .rangeRoundBands([0, height]);
        var yAxis = d3.svg.axis()
            .scale(years)
            .ticks(d3.time.years)
            .tickSize(6, 0)
            .orient("left");

        var svg = d3.select("#chart")
            .append("svg:svg")
            .attr("width", 600)
            .attr("height", 400)
            .append("g")
            .attr("transform", "translate("+ margin.left +", "+margin.top +")");

        var layer = svg.selectAll(".layer")
            .data(layers)
            .enter().append("g")
            .attr("class", "layer")
            .style("fill", function(d, i) { return d.color; });

        var rect = layer.selectAll("rect")
            .data(function(d) { return d.values; })
            .enter().append("rect")
            .attr("y", function(d) { return y(d.x); })
            .attr("x", 0)
            .attr("width", 0)
            .attr("height", y.rangeBand());

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0)")
            .call(yAxis);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,0)")
            .call(xAxis);

        // TRANSITION
        rect.transition()
            .duration(500)
            .delay(function(d, i) { return i * 10; })
            .attr("x", function(d) { return x(d.y0); })
            .attr("width", function(d) { return x(d.y); })
            .transition()
            .attr("y", function(d) { return y(d.x) + 10; })
            .attr("height", y.rangeBand()-20);
            //.attr("height", 20);

        function mouseOver( current ) {
            rect.filter(function(node) {
                    return (node.x!=current.x);
                })
                .transition()
                .duration(500)
                .style('opacity', 0.4);
        }
        function mouseLeave() {
            rect.transition()
                .duration(400)
                .style('opacity', 1);
        }
        function mouseClick( current ) {
            $location.path( '/budget/'+$scope.years[current.x] );
            // notify angular
            $scope.$apply();
        }

        rect.on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
            .on("click", mouseClick);


        function toggleExpenditure( e ) {
            var $el = $(e.currentTarget);
            if (!$el.hasClass('selected')) {
                selectExpenditure( $el );
            } else {
                unselectExpenditure( $el );
            }
        }
        function selectExpenditure( $el ) {
            // unselect
            unselectExpenditure( $element.find('.chart-legend .line.selected') );

            $el.addClass('selected');

            layer.filter(function(node) {
                    return (node.name!=$el.data('name'));
                })
                .transition()
                .duration(500)
                .style('opacity', 0.4);
        }
        function unselectExpenditure( $el ) {
            $el.removeClass('selected');

            layer.transition()
                .duration(400)
                .style('opacity', 1);
        }

        $element.find('.chart-legend .line').on('click', toggleExpenditure );
    }
};