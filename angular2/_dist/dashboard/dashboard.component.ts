import { Component, OnInit }    from "@angular/core";
import { Router }               from "@angular/router";
import { Http, Response }       from "@angular/http";
import { FormsModule }          from "@angular/forms";

import { CommonModule }         from "@angular/common";


import { USER }                 from "../app/app.global";

import { DashboardStore }       from "./dashboard.store";


@Component({
    selector: "section",
    template: '<div class="row small-up-1 medium-up-2 large-up-4"><div class="column"><div class="panel"><h4 class="title">{{\'budget\' | translate}}</h4><ul *ngIf="store.budget.founds.length"><li *ngFor="let found of store.budget.founds"><h6>{{found.found_name}}</h6>- <span>{{found.found_amount}}</span> <a class="button light icon-bargraph" routerLink="/found/{{found.found_name}}"><span hidden>{{\'history\' | translate}}</span></a></li></ul><a class="button expanded" routerLink="/budget/{{store.budget.budget_year}}"><span class="icon-piechart"></span>{{\'details\' | translate}}</a></div></div><div class="column"><div class="panel"><h4 class="title">{{\'discussions\' | translate}}</h4><button class="button expanded">{{\'seeMore\' | translate}}</button></div></div><div class="column"><div class="panel"><h4 class="title">{{\'documents\' | translate}}</h4><button class="button expanded">{{\'seeMore\' | translate}}</button></div></div></div>',
    providers: [
        DashboardStore
    ]
})

export class DashboardComponent implements OnInit {

    // We inject the router via DI
    constructor( private router: Router, protected store: DashboardStore ) {
        console.log("[DashboardComponent]");
    }

    ngOnInit() {
        let _year = new Date().getFullYear();
        let params = {
            value: {
                id: _year
            }
        };
        this.store.GET( params );
    }

}