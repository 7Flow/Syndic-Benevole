import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Http, Response } from "@angular/http";
import { FormsModule }   from "@angular/forms";

import { CommonModule } from "@angular/common";


import { USER } from "../app/app.global";

// import { SpendingStore } from "./spending.store";
import { SpendingModel } from "./spending.model";


@Component({
    selector: ".spending-component",
    templateUrl: "../../templates/spendings/one.html"
})

export class SpendingComponent implements OnInit {

    @Input() id: number;

    @Input() spending: SpendingModel;

    // We inject the router via DI
    constructor( private router: Router, private route: ActivatedRoute ) {
        // console.log("[SpendingComponent]");
    }

    ngOnInit() {

    }
}