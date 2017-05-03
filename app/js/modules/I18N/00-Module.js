angular.module('module.I18N', [], function($provide) {
    $provide.factory('I18N', I18NFactory);
});

function I18NFactory() {
    var labels = {
        'delete': "Supprimer",
        'modify': "Modifier",
        'add': "Ajouter",
        'generate': "Générer",
        'validate': "Valider",
        'save': "Sauvegarder",
        'load': "Charger",
        'confirm': "Confirmer",
        'cancel': "Annuler",

        'title': "Titre",

        'connection': "Connexion",
        'connect': "Connectez-vous",
        'welcome': "Bienvenue",
        'welcome-text': "Si vous n'avez pas encore vos accès au site, merci de contacter le syndic par mail à l'adresse suivante :",
        'mailto-syndic': "mailto:syndic-hdl@gmail.com",
        'email-syndic': "syndic-hdl@gmail.com",

        'apartment': "Appartement",
        'apartments': "Appartements",
        'name': "Prénom",
        'lastName': "Nom",

        'coowners': "Copropriétaires",
        'map': "Plan",
        'add-coowner': "Ajouter un copropriétaire",
        'new-coowner': "Nouveau copropriétaire",
        'update-coowner': "Mise à jour d'un copropriétaire",
        'confirm-delete-coowner': "Etes-vous sur de vouloir supprimer ce copropriétaire ?",

        'budget': "Budget",
        'evolution': "Evolution",
        'annual': "Annuel",
        'repartition': "Repartition",

        'expenditure': 'Poste de dépense',
        'provider': 'Fournisseur',
        'provision': 'Provision',
        'amount': 'Montant',
        'description': 'Description',
        'spent': 'Consommés',
        'remaining': 'Restant',

        'add-spending': "Ajouter une dépense",

        'all': "Tous",
        'of': 'de',
        'total': 'total',
        'oftotal': 'du total',

        'documents': 'Documents',
        'document': "Document",
        'archives': "Archives",
        'useful-documents': "Documents utiles",
        'reports': "Compte rendus",
        'select-document': "Selection du document",
        'planning': "Planning",

        'date': 'Date',

        'period': "Alternance",
        'one week': "Une semaine",
        'two weeks': "Deux semaines",
        'four weeks': "Quatre semaines",
        'one month': "Un mois",
        'year': "Année"

    };
    return {
        translate: function (id, text) {
            var text = labels[id];
            return text ? text : '*Traduction introuvable*';
        }
    };
}

// ADD APP DEPENDENCE
_deps.push( 'module.I18N' );