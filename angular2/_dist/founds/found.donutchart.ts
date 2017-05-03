/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/d3/index.d.ts" />

/**
 * D3.js charts for Found
 */
export class FoundDonutChart {

    private _chart: any;
    private total: number = 0;

    private $el: any;
    private selector: string;
    private percentSelector: string;

    constructor( elSelector, percentSelector ) {
        this.selector = elSelector;
        this.percentSelector = percentSelector;
    }

    public create( data: any ): void {

        this.$el = $( this.selector );

        let _size = this.$el.width(),
            _w = _size - 20,
            _h = _w,
            _offset = (_size - _w) * 0.5,
            _r = Math.min(_w, _h) * 0.5,
            _2PI = 2 * Math.PI;

        let _dataNodes = {
                name: "budget",
                children: data
            },
            _length = data.length,
            i = 0, j = 0, _childLength = 0, _expenditureTotalSpent = 0;

        // IN D3: CHILDS ARE ALWAYS REPRESENTED AS 100% OF THE PARENT
        // we want to show unused parts
        for (i = 0; i < _length; ++i) {
            let _node = _dataNodes.children[i];
            _childLength = _node.children.length;
            _expenditureTotalSpent = 0;

            this.total += _node.size;

            for (j = 0; j < _childLength; ++j) {
                _expenditureTotalSpent += _node.children[j].size;
            }

            if (_node.size > _expenditureTotalSpent) {
                _node.children.push( {
                    id: 0,
                    name: "Remaining",
                    size: _node.size - _expenditureTotalSpent,
                    provider: "remaining",
                    color: "#FFFFFF",
                    children: []
                } );
            }
        }

        this._chart = d3.select( this.selector )
            /*.style("width", _w+"px")*/
            /*.style("height", (_size)+"px")*/
            .append("svg:svg")
            .attr("width", _size)
            .attr("height", _size)
            .append("svg:g")
            .attr("id", "container")
            .attr("transform", "translate(" + (_w * 0.5 + _offset) + "," + (_h * 0.5 + _offset) + ")");

        let _segments = d3.layout.partition()
            .sort(null)
            .size([2 * Math.PI, _r * _r])
            .value(function(d) { return d.size; });

        let _arc = d3.svg.arc()
            .startAngle(function(d) { return d.x; })
            .endAngle(function(d) { return d.x + d.dx; })
            .innerRadius(function(d) { return Math.sqrt(d.y); })
            .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

        this._chart.append("svg:circle")
            .attr("r", _r + 1)
            .style("opacity", 0);

        this._chart.datum( _dataNodes )
            .selectAll("path")
            .data( _segments.nodes )
            .enter()
            .append("svg:path")
            .attr("display", function(d) { return d.depth ? null : "none"; })
            .attr("d", _arc)
            .attr("fill-rule", "evenodd")
            .style("stroke", "#fff")
            .style("fill", function(d) { return d.color; })
            .style("opacity", "0")
            .on("mouseover", this.mouseOver.bind(this) );

        // Add the mouseleave handler to the bounding circle.
        d3.select("#container").on( "mouseleave", this.mouseLeave.bind(this) );

        this.mouseLeave();
    }

    private mouseOver( d: any ): void {
        // SHOW ALL CONNECTED NODES
        if (d.depth > 1) {
            // GET ANCESTORS
            let _ancestors = [],
                _current = d;
            while (_current.parent) {
                _ancestors.push(_current);
                _current = _current.parent;
            }
            this._chart.selectAll("path")
                .filter(function(node) {
                    return (_ancestors.indexOf(node) >= 0);
                })
                .transition()
                .duration(500)
                .style("opacity", 1);

            this._chart.selectAll("path")
                .filter(function(node) {
                    return (node.depth === 1 && node !== d.parent);
                })
                .transition()
                .duration(500)
                .style("opacity", 0.4);

            // HIDE OTHER CHILDS
            this._chart.selectAll("path")
                .filter(function(node) {
                    return (node.depth > 1 && node.parent !== d.parent);
                })
                .transition()
                .duration(500)
                .style("opacity", 0.1);
        } else {
            // GET CHILDS
            this._chart.selectAll("path")
                .filter(function(node) {
                    return (node.depth > 1 && node.parent === d);
                })
                .transition()
                .duration(500)
                .style("opacity", 0.7);

            this._chart.selectAll("path")
                .filter( function(node) {
                    return (node === d);
                })
                .transition()
                .duration(500)
                .style("opacity", 1);

            // HIDE OTHER FIRST NODES
            this._chart.selectAll("path")
                .filter(function(node) {
                    return ((node.depth === 1 && node !== d) || (node.depth > 1 && node.parent !== d));
                })
                .transition()
                .duration(500)
                .style("opacity", 0.4);

            // HIDE OTHER CHILDS
            this._chart.selectAll("path")
                .filter(function(node) {
                    return (node.depth > 1 && node.parent !== d);
                })
                .transition()
                .duration(500)
                .style("opacity", 0.1);
        }

        // % OF TOTAL
        if (d.parent) {
            let percentage = parseFloat( (d.size / this.total * 100).toPrecision(3) );
            let percentageString = percentage + " %";

            if (percentage < 0.1) {
                percentageString = "< 0.1 %";
            }

            if (d.parent.name !== "budget") {
                // % OF EXPENDITURE
                let relativePercentage = parseFloat( (d.size / d.parent.size * 100).toPrecision(3) ),
                    relativeString = relativePercentage + " %";

                if (relativePercentage < 0.1) {
                    relativeString = "< 0.1 %";
                }

                if (d.name.toLowerCase() === "remaining") {
                    d3.select( this.percentSelector )
                        .html( this.$el.data("remaining") + "<br/>" + relativeString);
                } else {
                    d3.select( this.percentSelector )
                        .html( d.name + "<br/>" + relativeString + " " + this.$el.data("of") + " " + d.provider);
                }
            } else {
                d3.select( this.percentSelector )
                    .html(d.name + "<br/>" + d.provider + "<br/>" + percentageString + " " + this.$el.data("oftotal") );
            }
            // SHOW TOTAL if on center
        } else {
            this.showTotal();
        }
    }

    private mouseLeave( e?: any ): void {
        // console.log(d);
        this._chart.selectAll("path")
            .filter(function (d) {
                return (d.depth > 1);
            })
            .transition()
            .duration(500)
            .style("opacity", 0.1);

        this._chart.selectAll("path")
            .filter(function (d) {
                return (d.depth === 1);
            })
            .transition()
            .duration(500)
            .style("opacity", 1);

        this.showTotal();
    }

    private showTotal() {
        d3.select( this.percentSelector )
            .html("<br/>Total : " + this.total + " €");
    }
}