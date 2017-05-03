import { Component, OnInit, Input, Output } from "@angular/core";

import { Subject, Observable }          from 'rxjs';


import { ModalComponent }               from "../../core/components/modal.component";


@Component({
    selector: "modal-confirm",
    template: '<div class="modal" [attr.closed]="!isOpened"><button class="button light icon-close" (click)="close()">{{"close" | translate}}</button><h3>{{\'confirm\' | translate}}</h3><button class="button light icon-close" (click)="cancel()">{{"no" | translate}}</button> <button class="button light icon-validate" (click)="confirm()">{{"yes" | translate}}</button></div>'
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