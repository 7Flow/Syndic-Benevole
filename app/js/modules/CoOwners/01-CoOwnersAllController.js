//-------------------------------------------------------------------------------------------------------------------//
// EXTENDS BASE CONTROLLERS
// - must be done after app bootstrapping
//-------------------------------------------------------------------------------------------------------------------//
// get Module Controller
// -> controller are not defined at this time (so don't try to get a specific controller)
_ctrl = _module.controller();
// extend controller
_ctrl.extendCoOwnersAllController = function( $scope, $element, $factory, $injector, $compile ) {
    console.log('--- extend controller: CoOwnersAll ---');

    $scope.showDeleteModal = false;
    $scope.showAddModal = false;
    $scope.showUpdateModal = false;

    // DELETE
    $scope.delete = function( id ) {
        // display confirmation modal
        console.log('DELETE', id);
        $scope.coOwnerId = id;
        $scope.showDeleteModal = true;
    };
    $scope.confirmDelete = function( id ) {
        var _factory = $injector.get('CoOwnersOneFactory');
        _factory.delete({id: id}, $scope.feedBack);
    };

    // MODIFY
    $scope.modify = function( id ) {
        console.log('MODIFY', id);
        $scope.coOwnerId = id;

        var _factory = $injector.get('CoOwnersOneFactory');
        _factory.get({id: id}, function(data, status, headers, config) {
            $scope.coOwner = data.data[0];
            $scope.apartSelected = $scope.coOwner.fk_apartment_id;
            $scope.showUpdateModal = true;
        });
    };
    $scope.confirmModify = function( formData ) {
        console.log( formData );
        // PUT REQUEST
        //var _factory = $injector.get('CoOwnersOneFactory');
        $factory.update( formData, $scope.feedBack );
    };

    // ADD
    $scope.add = function() {
        $scope.showAddModal = true;
    };
    $scope.confirmAdd = function() {
        var _formData = $('#addModal').find('form:first').serialize();
        console.log( _formData );
        $factory.post( _formData, $scope.feedBack );
    };

    $scope.feedBack = function( data ) {
        console.log( '-> Feedback:', data );

        if (data.data.affectedRows == 1) {
            $scope.message = 'Success';
            $scope.switchStatus = "success";
        } else {
            $scope.message = data.data.message;
            $scope.switchStatus = "error";
        }

        $scope.showDeleteModal = false;
        $scope.showAddModal = false;
        $scope.showUpdateModal = false;

        //$element.foundation('reveal', 'close');

        setTimeout( function() {
            $element.find('div[ng-switch="switchStatus"]').foundation();
        }, 0 );
    };

    // CALLBACK METHOD
    // - preprocess data
    $scope.queryCallback = function() {
        console.log(' |-> get apartments list');
        // GET ALL APARTMENTS
        var _factory = $injector.get('ApartmentAllFactory');
        _factory.query({}, function(data, status, headers, config) {
            console.log( data.data );
            $scope.apartments = data.data;
        });
    };
};