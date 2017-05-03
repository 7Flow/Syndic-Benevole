import { WSModel } from "../app/models/ws.model";

import { SpendingModel } from "../spendings/spending.model";

/**
 * Model for table found
 */
export class ExpenditureModel extends WSModel {
    // need to be initialized to be 'visible' by set method (which use hasOwnProperty)
    public id: number = 0;
    public name: string = "";
    public contact: string = "";
    public provider: string = "";
    public current: number = 0;
    public remaining: number = 0;
    public size: number = 0;
    public color: string = "#000";

    public children: Array<SpendingModel> = [];
}