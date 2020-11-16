import * as roomHelpers from '../helpers/roomHelpers'


describe('testing auth', function(){
    it('Get all rooms with assertions', function(){
        roomHelpers.getAllRoomsRequestWithAssertion(cy)
    })
    it('Create a room', function(){
        roomHelpers.createRoomRequest(cy)
    })
    it.only('Delete a room', function(){
        roomHelpers.deleteRequestAfterGetRequest(cy)
    })
})