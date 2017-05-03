/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/d3/index.d.ts" />

/**
 * D3.js charts for Founds evolution over years
 */
export class FoundBarChart {

    private total: number;

    private layer: any;
    private rect: any;

    private $el: any;
    private selector: string;
    private legendSelector: string;
    private $legend: any;

    constructor( elSelector, legendSelector ) {
        this.selector = elSelector;
        this.legendSelector = legendSelector;
    }

    public create( data: any, years: Array<string> ): void {

        this.$el = $( this.selector );
        this.$legend = $( this.legendSelector );

        let stack = d3.layout.stack().values(function (d) {
                return d.values;
            }),
            layers = stack( data );

        let yGroupMax = d3.max(layers, function (layer) {
                return d3.max(layer.values, function (d) {
                    return d.y;
                });
            }),
            yStackMax = d3.max(layers, function (layer) {
                return d3.max(layer.values, function (d) {
                    return d.y0 + d.y;
                });
            }),
            xGroupMax = d3.max(layers, function (layer) {
                return d3.max(layer.values, function (d) {
                    return d.x;
                });
            }),
            margin = {top: 20, right: 0, bottom: 20, left: 40},
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        let _yRange = [];
        for (let i = 0; i <= xGroupMax; ++i) {
            _yRange.push(i);
        }

        // - x: abscisses
        let x = d3.scale.linear()
            .domain([0, yStackMax])
            .range([0, width], .08);
        // - y: ordonnées
        let y = d3.scale.ordinal()
            .domain(_yRange)
            .rangeRoundBands([0, height]);

        let xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(height)
            .orient("bottom");

        let _years = d3.scale.ordinal()
            .domain( years )
            .rangeRoundBands([0, height]);
        let yAxis = d3.svg.axis()
            .scale( _years )
            .ticks( d3.time.years )
            .tickSize(6, 0)
            .orient("left");

        let svg = d3.select( this.selector )
            .append("svg:svg")
            .attr("width", 600)
            .attr("height", 400)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        this.layer = svg.selectAll(".layer")
            .data(layers)
            .enter().append("g")
            .attr("class", "layer")
            .style("fill", function (d, i) {
                return d.color;
            });

        this.rect = this.layer.selectAll("rect")
            .data(function (d) {
                return d.values;
            })
            .enter().append("rect")
            .attr("y", function (d) {
                return y(d.x);
            })
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

        this.rect.on( "mouseover", this.mouseOver.bind(this) )
            .on( "mouseleave", this.mouseLeave.bind(this) )
            .on( "click", this.mouseClick.bind(this) );

        // dom not ready
        this.$legend.on("click", "li", this.toggleExpenditure.bind(this) );

        setTimeout( () => {
            // TRANSITION
            this.rect.transition()
                .duration(500)
                .delay(function (d, i) {
                    return i * 10;
                })
                .attr("x", function (d) {
                    return x(d.y0);
                })
                .attr("width", function (d) {
                    return x(d.y);
                })
                .transition()
                .attr("y", function (d) {
                    return y(d.x) + 10;
                })
                .attr("height", y.rangeBand() - 20);
            // .attr("height", 20);
        }, 0);
    }

    private mouseOver( current: any ) {
        this.rect.filter(function (node) {
                return (node.x !== current.x);
            })
            .transition()
            .duration(500)
            .style("opacity", 0.4);
    }

    private mouseLeave( e?: any ) {
        this.rect.transition()
            .duration(400)
            .style("opacity", 1);
    }

    private mouseClick( current ): void {
        // router.path('/budget/' + this.years[current.x]);
    }

    /**
     *
     * @param e {MouseEvent}
     */
    private toggleExpenditure( e: any ): void {
        console.log( ':toggleExpenditure' );
        let _$el = $(e.currentTarget);
        if (!_$el.hasClass("selected")) {
            this.selectExpenditure(_$el);
        } else {
            this.unselectExpenditure(_$el);
        }
    }

    private selectExpenditure( $el: any ): void {
        // unselect
        this.unselectExpenditure( this.$legend.find("li.selected") );

        $el.addClass("selected");

        this.layer.filter(function (node) {
                return (node.name !== $el.data("name"));
            })
            .transition()
            .duration(500)
            .style("opacity", 0.4);
    }

    private unselectExpenditure( $el: any ): void {
        $el.removeClass("selected");

        this.layer.transition()
            .duration(400)
            .style("opacity", 1);

    }
}