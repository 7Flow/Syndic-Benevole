import { Component, OnInit }    from "@angular/core";
import { Router }               from "@angular/router";
import { Http, Response }       from "@angular/http";
import { FormsModule }          from "@angular/forms";

import { CommonModule }         from "@angular/common";


import { USER }                 from "../app/app.global";

import { DashboardStore }       from "./dashboard.store";


@Component({
    selector: "section",
    templateUrl: "../../templates/dashboard/overview.html",
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