import { Component, ElementRef }            from "@angular/core";

@Component({
    selector: "dialog",
    template: '<dialog><button class="button light icon-close" (click)="close()"></button></dialog>'
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
