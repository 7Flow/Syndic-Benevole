import { Component, OnInit, Input, Output } from "@angular/core";

import { Subject, Observable }          from 'rxjs';


import { ModalComponent }               from "../../core/components/modal.component";


@Component({
    selector: "modal-confirm",
    templateUrl: "../../../templates/modals/confirm.html"
})

export class ConfirmComponent extends ModalComponent implements OnInit {

    private stream = new Subject<boolean>();
    @Output() observable = this.stream.asObservable();

    ngOnInit() {

    }

    confirm() {
        this.stream.next(true);
    }
    cancel() {
        this.stream.next(false);
        this.close();
    }
}