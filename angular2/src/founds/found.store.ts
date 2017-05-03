import { Observable }   from "rxjs/Observable";

// RestService must be global (provider of the top-level module)
import { RestService }      from "../core/rest.service";

import { AbstractStore }    from "../core/models/abstract.store";

import { FoundModel }       from "./found.model";
import { FoundEvolutionModel } from "./foundevolution.model";


export class FoundStore extends AbstractStore {

    public name: string = "found";

    public GET( routeParams?: any ): void {
        if ( isNaN(routeParams.value.id) ) {
            this.model = new FoundEvolutionModel( routeParams.value.id );
        } else {
            this.model = new FoundModel();
        }
        super.GET( routeParams );
    }
}