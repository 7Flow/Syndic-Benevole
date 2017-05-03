import { WSModel } from "../app/models/ws.model";

/**
 * Model for table found
 */
export class SpendingModel extends WSModel {
    // need to be initialized to be 'visible' by set method (which use hasOwnProperty)
    public date: number = 0;
    public description: string = "";
    public amout: number = 0;
    public invoice: any = null;
}