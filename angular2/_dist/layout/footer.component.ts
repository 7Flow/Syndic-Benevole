import { Component, OnInit } from "@angular/core";
import { Routes, Router, RouterModule } from "@angular/router";


import { TranslateService }             from "../translate";
import { USER }                         from "../app/app.global";


@Component({
    selector: "footer",
    template: '<p>Florian FIEVET</p>'
})

export class FooterComponent implements OnInit {

    constructor( private router: Router ) {
        console.log("[FooterComponent]");
    }

    ngOnInit() {

    }
}