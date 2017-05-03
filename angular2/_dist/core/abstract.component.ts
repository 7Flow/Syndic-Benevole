import { Component } from "@angular/core";

import { AbstractStore } from "./models/abstract.store";

@Component({
    selector: "section",
    templateUrl: ""
})

export class AbstractComponent {

    protected store: AbstractStore;

    ngOnInit() {
        console.log("Application component initialized ...");
    }

}