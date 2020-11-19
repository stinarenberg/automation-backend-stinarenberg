const ENDPOINT_GET_ROOMS ='http://localhost:3000/api/rooms'
const ENDPOINT_POST_ROOMS ='http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOM ='http://localhost:3000/api/room/'

function createRandomRoomPayload(){
    const category = "double"
    const randomfloor = Math.floor(Math.random()*10)+1
    const randomnumber= (randomfloor*100)+(Math.floor(Math.random()*10)+1)
    const available = Math.random()<0.5
    const price = (Math.floor(Math.random()*10)+1)*1000
    const features = ["sea_view"]

    const payload = {
        "category":category, 
        "number": randomnumber,
        "floor":randomfloor, 
        "available":available,
        "price":price,
        "features":features
    }
    return payload
}
function getAllRoomsRequest(cy){
    cy.authenticateSession().then((response =>{
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ROOMS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            expect(response.status).to.eq(200)
        }))
    }))
}
function getAllRoomsRequestWithAssertion(cy, number, features, floor, price){
    cy.authenticateSession().then((response =>{
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ROOMS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(features)
            expect(responseAsString).to.have.string(number)
            expect(responseAsString).to.have.string(floor)
            expect(responseAsString).to.have.string(price)
        }))
    }))
}
function createRoomRequest(cy){
    cy.authenticateSession().then((response =>{
        let randomRoomPayload = createRandomRoomPayload()
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_ROOMS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: randomRoomPayload
        }).then((response =>{
           const responseAsString = JSON.stringify(response)
           expect(responseAsString).to.have.string(randomRoomPayload.number)
        }))
        getAllRoomsRequestWithAssertion(cy, randomRoomPayload.number, randomRoomPayload.features, randomRoomPayload.floor, randomRoomPayload.price)
    }))
}
function deleteRequestAfterGetRequest(cy){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ROOMS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        let lastId=response.body[response.body.length-1].id
        cy.request({
            method:"DELETE",
            url: ENDPOINT_GET_ROOM+lastId,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response=>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string("true")
        }))
    }))
}
function deleteRequestAfterCreateRoomRequest(cy){
    cy.authenticateSession().then((response =>{
        let randomRoomPayload = createRandomRoomPayload()
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_ROOMS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: randomRoomPayload
        }).then((response =>{
           const responseAsString = JSON.stringify(response)
           expect(responseAsString).to.have.string(randomRoomPayload.number)
        }))
        deleteRequestAfterGetRequest(cy)
    }))
}
module.exports ={
    getAllRoomsRequest,
    createRoomRequest,
    deleteRequestAfterCreateRoomRequest
}