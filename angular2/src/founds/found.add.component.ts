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
    templateUrl: "../../templates/found/found-add-modal.html",
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