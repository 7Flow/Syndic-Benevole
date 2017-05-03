import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute, Params }   from "@angular/router";
import { Http, Response }                   from "@angular/http";
import { FormsModule }                      from "@angular/forms";

import { CommonModule }                     from "@angular/common";


import { USER }                 from "../app/app.global";

import { PlanningStore }       from "./planning.store";


@Component({
    selector: "section",
    templateUrl: "../../templates/planning/view.html"
})

/**
 * Found component, to see evolution over years
 */
export class PlanningComponent implements OnInit {
    // We inject the router via DI
    constructor( private router: Router, private route: ActivatedRoute, private store: PlanningStore ) {
        // console.log("[PlanningComponent]");
    }

    ngOnInit() {
        console.log("[PlanningComponent]:init");
    }
}