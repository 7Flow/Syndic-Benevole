import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute, Params }   from "@angular/router";
import { Http, Response }                   from "@angular/http";
import { FormsModule }                      from "@angular/forms";

import { CommonModule }                     from "@angular/common";

import { Subject, Observable }              from 'rxjs';


import { USER }                 from "../app/app.global";

import { FoundStore }           from "./found.store";
import { FoundModel }           from "./found.model";

import { ModalComponent }       from "../core/components/modal.component";


@Component({
    selector: "modal-found-add",
    template: '<div class="modal" [attr.closed]="!isOpened"><button class="button light icon-close" (click)="close()">{{"close" | translate}}</button><h2 class="title">{{"newfound" | translate}}</h2><form><input type="hidden" name="fk_budget_id" [ngModel]="found.fk_budget_id"><div class="form-field"><label for="found-name">{{"name" | translate}}</label> <input id="found-name" name="found_name" type="text" required [(ngModel)]="found.found_name"></div><div class="form-field"><label for="found-num">{{"name" | translate}}</label><select id="found-num" name="found_num" [(ngModel)]="found.found_num"><option value="1">1</option><option value="2">2</option><option value="4">4</option></select></div><button type="submit" class="button light icon-validate">{{"yes" | translate}}</button></form></div>',
    providers: [
        FoundStore
    ]
})

/**
 * Found component, to see evolution over years
 */
export class FoundAddComponent extends ModalComponent implements OnInit {

    @Input() found: FoundModel;

    private stream = new Subject<boolean>();
    @Output() observable = this.stream.asObservable();

    ngOnInit() {
        console.log("[FoundComponent]:init");
    }

}