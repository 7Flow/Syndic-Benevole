import { Component, ElementRef }            from "@angular/core";

@Component({
    selector: "dialog",
    templateUrl: "../templates/modal.html"
})

export class ModalComponent {

    private isOpened: boolean = false;

    constructor( private el: ElementRef ) {}

    open() {
        this.isOpened = true;
        $('html').addClass('modal-opened');
    }

    close(): void {
        this.isOpened = false;
        $('html').removeClass('modal-opened');
    }
}
