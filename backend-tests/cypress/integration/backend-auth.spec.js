import * as roomHelpers from '../helpers/roomHelpers'
import * as clientHelpers from '../helpers/clientHelpers'

describe('testing auth', function(){
    it('01. Get all rooms with assertions', function(){
        roomHelpers.getAllRoomsRequest(cy)
    })
    it('02. Create a room', function(){
        roomHelpers.createRoomRequest(cy)
    })
    it('03. Delete a room', function(){
        roomHelpers.deleteRequestAfterCreateRoomRequest(cy)
    })
    it('04. Edit client', function(){
        clientHelpers.createAndEditClientRequest(cy)
    })
})