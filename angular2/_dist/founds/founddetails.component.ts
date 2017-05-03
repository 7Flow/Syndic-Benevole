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
    template: '<div class="row"><div class="small-8 columns"><div class="panel"><h2 class="title">{{store.model.found_name}}</h2><a routerLink="/found/{{store.model.found_name}}" class="button light icon-bargraph"><span hidden>{{\'history\' | translate}}</span></a><ul class="small-block-grid-1 table"><li class="list-head"><div class="expenditure-name">{{\'expenditure\' | translate}}</div><div class="expenditure-provider">{{\'provider\' | translate}}</div><div class="expenditure-provision">{{\'provision\' | translate}}</div><div class="expenditure-current">{{\'spent\' | translate}}</div><div class="expenditure-remaining">{{\'remaining\' | translate}}</div><div class="expenditure-btn"></div></li><li class="expenditure-component" *ngFor="let expenditure of store.model.expenditures" [expenditure]="expenditure" [authorization]="store.model.authorization"></li></ul><button class="button light icon-close" (click)="delete()">{{"delete" | translate}}</button></div></div><div class="small-4 columns"><div class="panel"><h2 class="title">{{\'repartition\' | translate}}</h2><div id="chart{{store.model.found_id}}" class="chart" [attr.data-oftotal]="\'oftotal\' | translate" [attr.data-of]="\'of\' | translate"><span id="chartPercent{{store.model.found_id}}" class="chart-percentage"></span></div><ul id="chartLegend{{store.model.found_id}}" class="chart-legend"><li *ngFor="let row of store.model.expenditures" [attr.data-name]="row.name"><span class="color" [style.background]="row.color"></span> <span class="name">{{row.name}} - {{row.provider}}</span></li></ul></div></div></div><modal-confirm class="modal-container" *ngIf="store.model.authorization.DELETE"></modal-confirm>',
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