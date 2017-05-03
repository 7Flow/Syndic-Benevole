import { WSModel } from "../app/models/ws.model";

import { ApartmentModel } from "../apartments/apartment.model";

/**
 * Model for table found
 */
export class CoownerModel extends WSModel {
    // need to be initialized to be 'visible' by set method (which use hasOwnProperty)
    public id: number = 0;
    public fk_apartment_id: number = 0;
    public name: string = "";
    public lastName: string = "";
    public email: string = "";
    public phone: number = 0;

    public apartment: ApartmentModel;
}