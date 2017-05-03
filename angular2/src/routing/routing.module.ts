import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule, Routes }         from "@angular/router";
import { FormsModule }                  from "@angular/forms";
// import commonmodule (for templating, like ngIf, ngFor)
// - defining submodule will breaks module's inheritence
import { CommonModule }                 from "@angular/common";

import { LoginComponent }               from "../login/login.component";
import { DashboardComponent }           from "../dashboard/dashboard.component";
import { BudgetComponent }              from "../budgets/budget.component";

import { FoundDetailsComponent }        from "../founds/founddetails.component";
import { FoundAddComponent }            from "../founds/found.add.component";
import { FoundEvolutionComponent }      from "../founds/foundevolution.component";

import { ExpenditureComponent }         from "../expenditures/expenditure.component";

import { SpendingComponent }            from "../spendings/spending.component";

import { PlanningComponent }            from "../planning/planning.component";
import { PlanningCreationComponent }    from "../planning/planningcreation.component";

import { ConfirmComponent }             from "../app/components/confirm.component";
import { PageNotFoundComponent }        from "../app/components/PageNotFoundComponent";

import { TranslateModule }              from "../translate";

const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },

    {
        path: "login",
        component: LoginComponent,
        data: {
            label: 'login'
        }
    },

    {
        path: "dashboard",
        component: DashboardComponent,
        data: {
            label: 'dashboard'
        }
    },

    {
        path: "budget",
        component: BudgetComponent,
        data: {
            label: 'budget'
        }
    },
    {
        path: "budget/:id",
        component: BudgetComponent
    },

    {
        path: "found/:id",
        component: FoundEvolutionComponent
    },


    {
        path: "planning",
        component: PlanningCreationComponent,
        data: {
            label: 'planning'
        }
    },
    {
        path: "planning/:id",
        component: PlanningComponent
    },

    {
        path: "**",
        component: PageNotFoundComponent,
        data: {
            label: 'notfound'
        }
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        RouterModule.forRoot(
            appRoutes
        )
    ],
    declarations: [
        LoginComponent,
        DashboardComponent,
        BudgetComponent,
        FoundDetailsComponent,
        FoundAddComponent,
        FoundEvolutionComponent,
        ExpenditureComponent,
        SpendingComponent,
        PlanningComponent,
        PlanningCreationComponent,
        PageNotFoundComponent,
        ConfirmComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    exports: [
        RouterModule
    ]
})

export class RoutingModule {

}
