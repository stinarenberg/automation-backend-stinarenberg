const faker = require ('faker')
    const ENDPOINT_GET_CLIENTS ='http://localhost:3000/api/clients'
    const ENDPOINT_POST_CLIENTS ='http://localhost:3000/api/client/new'
    const ENDPOINT_GET_CLIENT ='http://localhost:3000/api/client/'

function createRandomClientPayload(){
    const fakeName = faker.name.firstName() + ' ' + faker.name.lastName()
    const fakeEmail= faker.internet.email()
    const fakeTelephone = faker.phone.phoneNumber()

    const payload = {
        "name": fakeName,
        "email": fakeEmail,
        "telephone":fakeTelephone
    }
    return payload
}
function createRandomClientEditPayload(id, created){
    const fakeName = faker.name.firstName() + ' ' + faker.name.lastName()
    const fakeEmail= faker.internet.email()
    const fakeTelephone = faker.phone.phoneNumber()

    const payload = {
        "name": fakeName,
        "email": fakeEmail,
        "telephone":fakeTelephone,
        "id":id,
        "created":created
    }
    return payload
}

function getRequestAllClientsWithAssertion(cy, name, email, telephone){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(name)
        expect(responseAsString).to.have.string(email)
        expect(responseAsString).to.have.string(telephone)
    }))
}
function createClientRequest(cy){
    cy.authenticateSession().then((response =>{
        let fakeClientPayload = createRandomClientPayload()
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CLIENTS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeClientPayload
        }).then((response =>{
           const responseAsString = JSON.stringify(response)
           expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))
        getRequestAllClientsWithAssertion(cy, fakeClientPayload.name, fakeClientPayload.email,fakeClientPayload.telephone) //ta bort?
    }))
}

function createAndEditClientRequest(cy){

    createClientRequest(cy)

    cy.authenticateSession().then((response =>{
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_CLIENTS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            let lastId=response.body[response.body.length -1].id
            let lastCreated=response.body[response.body.length-1].created
            let fakeClientEditPayload = createRandomClientEditPayload(lastId, lastCreated)
            // cy.log(lastId)
            // cy.log(lastCreated)
            cy.request({
                method: "PUT",
                url: ENDPOINT_GET_CLIENT+lastId,
                headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
                },
                body: fakeClientEditPayload
            }).then((response=>{
                const responseAsString = JSON.stringify(response)
                expect(responseAsString).to.have.string(fakeClientEditPayload.name)
            }))
            getRequestAllClientsWithAssertion(cy, fakeClientEditPayload.name, fakeClientEditPayload.email,fakeClientEditPayload.telephone)
        }))
    }))
}

module.exports ={
    createAndEditClientRequest,
}


