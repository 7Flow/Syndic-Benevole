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
    template: '<div class="row"><div class="small-8 columns"><div class="panel"><h2 class="title">{{store.model.found_name}}</h2><input type="range" step="1" list="years"><datalist id="years"><option *ngFor="let year of store.model.years">{{year}}</option></datalist><div id="chart" class="chart"></div></div></div><div class="small-4 columns"><div class="panel"><h2 class="title">{{\'legend\' | translate}}</h2><ul id="chartLegend" class="chart-legend"><li *ngFor="let row of store.model.expenditures" [attr.data-name]="row.name"><span class="color" [style.background]="row.color"></span> <span class="name">{{row.name}}</span></li></ul></div></div></div>',
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