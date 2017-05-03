(function (module) {
    'use strict';

    // LIST OF SERVICES
    // - module list for Angular
    var config = {

        domain: 'http://127.0.0.1',
        port: '8080',
        prefix: '/api',

        /**
         * DEFINE ALL MODULES
         * - each controller name must be unique!
         * - api response is always an object:
         *      - data: raw results (Array | Object)
         *      - authorization: methods allowed (Object)
         *
         *  Always define the most generic route in first
         */
        api: {
            Auth: {
                Login:{
                    path: "/login",
                    methods: ['POST', 'DELETE'],
                    controller: "controllers/Auth"
                }
            },

            CoOwners: {
                CoOwnersAll: {
                    path: "/coowners",
                    methods: ["GET", "PUT"],
                    controller: "controllers/CoOwner",
                    template: "app/templates/coowners/list"
                },
                CoOwnersOne: {
                    path: "/coowners/:id",
                    methods: ["GET", "PUT", "DELETE"],
                    controller: "controllers/CoOwner",
                    template: "app/templates/coowners/list"
                }
            },

            Apartment: {
                ApartmentAll: {
                    path: "/apartments",
                    methods: ["GET"],
                    controller: "controllers/Apartment",
                    template: "app/templates/apartment/list"
                }
            },

            Budget: {
                BudgetAll: {
                    path: "/budget",
                    methods: ["GET", "POST"],
                    controller: "controllers/Budget",
                    template: "app/templates/budget/overview"
                },
                BudgetOne: {
                    path: "/budget/:budget_year",
                    methods: ["GET", "PUT", "DELETE"],
                    controller: "controllers/Budget",
                    template: "app/templates/budget/details"
                }
            },

            Found: {
                FoundOne: {
                    path: "/found/:found_name",
                    methods: ["GET", "PUT", "DELETE"],
                    controller: "controllers/Found",
                    template: "app/templates/budget/details"
                }
            },

            Documents: {
                DocumentsAll: {
                    path: "/documents",
                    methods: ["GET"],
                    controller: "controllers/Documents",
                    template: "app/templates/documents/planning"
                }
            },

            Discussions: {
                DiscussionsAll: {
                    path: "/discussions",
                    methods: ["GET"],
                    controller: "controllers/Discussions"
                },
                DiscussionsOne: {
                    path: "/discussions/:discussion_id",
                    methods: ["GET", "PUT", "DELETE"],
                    controller: "controllers/Discussions"
                }
            },

            /* Two possibilities for the same request */
            Dashboard: {
                DashboardAll: {
                    path: "/dashboard",
                    methods: ["GET"],
                    controller: "controllers/Dashboard"
                },
                DashboardOne: {
                    path: "/dashboard/:budget_year",
                    methods: ["GET"],
                    controller: "controllers/Dashboard"
                }
            },

            Planning: {
                PlanningAll: {
                    path: "/planning",
                    methods: ["GET", "POST"],
                    controller: "controllers/Planning"
                },
                PlanningOne: {
                    path: "/planning/:planning_id",
                    methods: ["GET", "PUT", "DELETE"],
                    controller: "controllers/Planning"
                }
            }
        },

        angular: {
            "GET": "query",
            "POST": "post",
            "PUT": "update",
            "DELETE": "delete"
        }
    };

    module.exports = config;

})(this['window'] ? window.module = window.module || {} : module);

