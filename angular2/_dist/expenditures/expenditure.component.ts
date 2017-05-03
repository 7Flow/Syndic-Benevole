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
    template: '<details><summary><div class="expenditure-name">{{expenditure.name}}</div><div class="expenditure-provider">{{expenditure.provider}}</div><div class="expenditure-provision">{{expenditure.size | currency:\'EUR\':true:\'2.2-2\'}}</div><div class="expenditure-current">{{expenditure.current | currency:\'EUR\':true:\'2.2-2\'}}</div><div class="expenditure-remaining">{{expenditure.remaining | currency:\'EUR\':true:\'2.2-2\'}}</div></summary><ul class="small-block-grid-1 table"><li class="list-head"><div class="spending-description">{{\'description\' | translate}}</div><div>{{\'date\' | translate}}</div><div>{{\'amount\' | translate}}</div></li><li class="spending-component" *ngFor="let spending of expenditure.children" [spending]="spending" [id]="spending.expenditure_id"></li></ul><div><a *ngIf="expenditure.authorization.POST" class="button icon-plus success">{{\'add\' | translate}}</a></div><div *ngIf="expenditure.authorization.PUT" class="btn-admin icon-cog" aria-expended="false"></div><ul id="expendAdmin{{$index}}" class="f-dropdown"><li><a *ngIf="expenditure.authorization.PUT" class="button icon-pencil">{{\'modify\' | translate}}></a></li><li><a *ngIf="expenditure.authorization.DELETE" class="button icon-cup">{{\'delete\' | translate}}></a></li></ul></details>'
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