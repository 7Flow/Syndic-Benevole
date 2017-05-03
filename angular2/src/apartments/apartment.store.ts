import { Observable }   from "rxjs/Observable";

// RestService must be global (provider of the top-level module)
import { RestService }      from "../core/rest.service";

import { AbstractStore }    from "../core/models/abstract.store";

import { ApartmentModel }       from "./apartment.model";


export class ApartmentStore extends AbstractStore {

    public name: string = "apartments";

    public apartments: Array<ApartmentModel> = [];

    public mapToModel( json: any ): void {
        if (json.data) {
            for (let i = 0, l = json.data.length; i < l; ++i) {
                // WSModel couldn't be built directly from ctor
                let _apart: ApartmentModel = new ApartmentModel();
                _apart.fromJson( {data: json.data[i], authorization: json.authorization} );
                this.apartments.push( _apart );
            }
        }
        this.signal.emit( json );
    }
}