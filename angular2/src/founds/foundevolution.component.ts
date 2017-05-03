import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute, Params }   from "@angular/router";
import { Http, Response }                   from "@angular/http";
import { FormsModule }                      from "@angular/forms";

import { CommonModule }                     from "@angular/common";


import { USER }                 from "../app/app.global";

import { FoundStore }           from "./found.store";
import { FoundModel }           from "./found.model";

import { FoundBarChart }         from "./found.barchart.ts";

@Component({
    selector: "section",
    templateUrl: "../../templates/found/found-evolution.html",
    providers: [
        FoundStore
    ]
})

/**
 * Found component, to see evolution over years
 */
export class FoundEvolutionComponent implements OnInit {
    // We inject the router via DI
    constructor( private router: Router, private route: ActivatedRoute, protected store: FoundStore ) {
        // console.log("[FoundComponent]");
    }

    ngOnInit() {
        console.log("[FoundEvolutionComponent]:init");
        this.store.GET( this.route.params );
        this.store.signal.subscribe( this.buildChart.bind(this) );
    }

    buildChart( res: any ) {
        let _chart = new FoundBarChart( "#chart", "#chartLegend" );
        _chart.create( this.store.model.expenditures, this.store.model.years );
    }

}