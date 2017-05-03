import { WSModel }          from "../app/models/ws.model";

import { ExpenditureModel } from "../expenditures/expenditure.model";
import { PaymentModel }     from "../payments/payment.model";

/**
 * Model for table found
 */
export class FoundModel extends WSModel {
    // need to be initialized to be 'visible' by set method (which use hasOwnProperty)
    public found_id: number = 0;
    public fk_budget_id: number = 0;
    public found_name: string = "";
    public found_amount: number = 0;
    public found_num: number = 4;

    // only if found is of type charges
    public expenditures: Array<ExpenditureModel> = [];

    public payments: Array<PaymentModel> = [];
}