import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Http, Response } from "@angular/http";
import { FormsModule }   from "@angular/forms";

import { CommonModule } from "@angular/common";


import { USER } from "../app/app.global";

// import { ExpenditureStore }  from "./expenditure.store";
import { ExpenditureModel }     from "./expenditure.model";
import { AuthorizationModel }   from "../app/models/authorization.model";

import { SpendingComponent }    from "../spendings/spending.component";


@Component({
    selector: ".expenditure-component",
    templateUrl: "../../templates/expenditures/one.html"
})

export class ExpenditureComponent implements OnInit {

    @Input() authorization: AuthorizationModel;
    @Input() expenditure: ExpenditureModel;

    // We inject the router via DI
    constructor( private router: Router, private route: ActivatedRoute ) {
        // console.log("[ExpenditureComponent]");
    }

    ngOnInit() {
        let _exp = {data: this.expenditure};
        this.expenditure = new ExpenditureModel();
        this.expenditure.fromJson( _exp );
    }
}