import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params }   from "@angular/router";
import { Http, Response }                   from "@angular/http";
import { FormsModule }                      from "@angular/forms";

import { CommonModule }                     from "@angular/common";


import { USER }                 from "../app/app.global";

import { FoundStore }           from "./found.store";
import { FoundModel }           from "./found.model";

import { FoundDonutChart }       from "./found.donutchart.ts";

/* child component must be declared by a top-module (usually the router module) */
import { ExpenditureComponent } from "../expenditures/expenditure.component";
/* modals */
import { ConfirmComponent }     from "../app/components/confirm.component";


@Component({
    selector: "founddetails-component",
    templateUrl: "../../templates/found/found-details.html",
    providers: [
        FoundStore
    ]
})

/**
 * Found component, used as sub-component of Budget
 */
export class FoundDetailsComponent implements OnInit {

    @Input() found: FoundModel;

    /**
     * Output event, to notify parent component that this component is ready.
     */
    @Output() ready: EventEmitter<FoundModel> = new EventEmitter<FoundModel>();

    @ViewChild( ConfirmComponent ) confirmModal: ConfirmComponent;
    private subscription: any;

    // We inject the router via DI
    constructor( private router: Router, private route: ActivatedRoute, protected store: FoundStore ) {
        console.log("[FoundDetailsComponent]");
    }

    ngOnInit() {
        if (!this.found) {
            this.store.GET( this.route.params );
            this.store.signal.subscribe( this.buildChart.bind(this) );
        } else {
            this.store.model = this.found;
            // notify parent component
            this.ready.next( this.store.model );

            setTimeout( () => {
                this.buildChart();
            }, 0);
        }
    }

    buildChart() {
        let _chart = new FoundDonutChart( "#chart" + this.store.model.found_id, "#chartPercent" + this.store.model.found_id );
        _chart.create( this.store.model.expenditures );
    }

    public delete(): void {
        this.confirmModal.open();
        this.subscription = this.confirmModal.observable.subscribe( (confirm: boolean) => {
            if (confirm) {

            }
            this.subscription.unsubscribe();
        });
    }
}