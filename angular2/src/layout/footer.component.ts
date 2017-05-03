import { Component, OnInit } from "@angular/core";
import { Routes, Router, RouterModule } from "@angular/router";


import { TranslateService }             from "../translate";
import { USER }                         from "../app/app.global";


@Component({
    selector: "footer",
    templateUrl: "../../templates/layout/footer.html"
})

export class FooterComponent implements OnInit {

    constructor( private router: Router ) {
        console.log("[FooterComponent]");
    }

    ngOnInit() {

    }
}