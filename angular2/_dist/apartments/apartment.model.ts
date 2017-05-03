import { WSModel } from "../app/models/ws.model";


/**
 * Model for table found
 */
export class ApartmentModel extends WSModel {
    // need to be initialized to be 'visible' by set method (which use hasOwnProperty)
    public id: number = 0;
    public lot: number = 0;
    public address: string = "";
    public street: string = "";
    public apartment_ten_thousand: number = 0;
    public coowners: string = "";
}