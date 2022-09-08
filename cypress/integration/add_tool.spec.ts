import * as faker from 'faker';

context('Add Tools', () => {
    const filepath = 'images/member-avatar.jpg';
    beforeEach(() => {
        cy.login('hamidak22@gmail.com', 'H@k13227');
    })
    it('Add new Tool and save and add team', () => {
        const name = faker.random.word();
        const address = faker.internet.url();
        cy.visit('/tools/management/add/0');
        cy.get('[data-cy=first-step]').should('be.disabled');
        cy.get('[data-cy=search-input]').type(name);
        if(cy.contains('add a custom tool')) {
            cy.contains('add a custom tool').click();
        };
        cy.get('[data-cy=app-name]').type(name).should('have.value', name);
        cy.get('[data-cy=app-url]').type(address).should('have.value', address);
        cy.get('#appIcon').attachFile(filepath);
        cy.get('[data-cy=save-and-add-team]').click();
        cy.wait(500);
        cy.contains(name).drag('[data-cy=team-box]');
        cy.get('[data-cy=team-box]').contains(name);
        cy.get('[data-cy=finish]').click();
        cy.location('pathname').should('eq','/tools/management');
    });
    it('Add Tool from current tools and save and add team', () => {
        cy.visit('/tools/management/add/0');
        cy.get('[data-cy=first-step]').should('be.disabled');
        cy.get('[data-cy*=tool-box-]').first().click();
        cy.get('[data-cy=save-and-add-team]').click();
        cy.wait(500);
        cy.get('[data-cy*=tool-box-]').last().drag('[data-cy=team-box]');
        cy.get('[data-cy=team-box]').contains('[data-cy*=tool-box-]');
        cy.get('[data-cy=finish]').click();
        cy.location('pathname').should('eq','/tools/management');
    });
    it('Add Tool Page save and add team with wrong url', () => {
        const wrongAddress = "www.yechizi";
        const validateAddress = (address) => {
            var re = /((https?):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
            return re.test(address);
        };
        cy.visit('/tools/management/add/0');
        cy.get('[data-cy*=tool-box-]').first().click();
        cy.get('[data-cy=first-step]').click();
        cy.get('[data-cy=app-url]').clear().type(wrongAddress).should('have.value', wrongAddress);
        cy.get('[data-cy=save-and-add-team]').click();
        if(!validateAddress(wrongAddress)) {
            cy.contains('Url not valid').should('be.visible');
        }
    });
    it('Add Tool Page save and add a new tool', () => {
        cy.visit('/tools/management/add/0');
        cy.get('[data-cy*=tool-box-]').first().click();
        cy.get('[data-cy=first-step]').click();
        cy.wait(500);
        cy.get('[data-cy=save-and-add-tools]').click();
        cy.wait(500);
        cy.get('[data-cy*=tool-box-]');
    })
    it('Add Tool Page save and finish', () => {
        cy.visit('/tools/management/add/0');
        cy.get('[data-cy*=tool-box-]').last().click();
        cy.get('[data-cy=first-step]').click();
        cy.wait(500);
        cy.get('[data-cy=save-and-finish]').click();
        cy.wait(500);
        cy.location('pathname').should('eq','/tools/management');
    });
});
