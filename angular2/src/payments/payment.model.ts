import { WSModel } from "../app/models/ws.model";

/**
 * Model for table found
 */
export class PaymentModel extends WSModel {
    // need to be initialized to be 'visible' by set method (which use hasOwnProperty)
    public id: number = 0;
    public date: string = "";
    public fk_found_id: number = 0;
}