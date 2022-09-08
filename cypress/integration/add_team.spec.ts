import * as faker from 'faker';

context('Add Team', () => {
    beforeEach(() => {
        cy.login('hamidak22@gmail.com', 'H@k13227');
    })
    it('Add Tool Page save and add team', () => {
        const name = faker.random.word();
        cy.visit('/teams/add');
        cy.get('[data-cy=save-and-add-team]').should('be.disabled');
        cy.get('[data-cy=save-and-add-member]').should('be.disabled');
        cy.get('[data-cy=team-name]').type(name).should('have.value', name);
        cy.get('[data-cy=save-and-add-member]').click();
        cy.wait(500);
        cy.get('[data-cy*=member-card-]').first().click();
        cy.get('[data-cy*=member-card-]').first().drag('[data-cy=team-box]');
        cy.get('[data-cy=team-box]').contains('[data-cy*=member-card-]');
        cy.get('[data-cy=save-and-add-tools]').click();
        cy.wait(500);
        cy.get('[data-cy*=tool-box-]').first().drag('[data-cy=team-box]');
        cy.get('[data-cy=team-box]').contains('[data-cy*=tool-box-]');
        cy.get('[data-cy=finish]').click();
        cy.wait(500);
        cy.location('pathname').should('eq','/teams');
    });
    it('Save and Add Team step one', () => {
        const name = faker.random.word();
        cy.visit('/teams/add');
        cy.get('[data-cy=save-and-add-team]').should('be.disabled');
        cy.get('[data-cy=save-and-add-member]').should('be.disabled');
        cy.get('[data-cy=team-name]').type(name).should('have.value', name);
        cy.get('[data-cy=save-and-add-team]').click();
    });
    it('Save and Add Team step two', () => {
        const name = faker.random.word();
        cy.visit('/teams/add');
        cy.get('[data-cy=save-and-add-team]').should('be.disabled');
        cy.get('[data-cy=save-and-add-member]').should('be.disabled');
        cy.get('[data-cy=team-name]').type(name).should('have.value', name);
        cy.get('[data-cy=save-and-add-member]').click();
        cy.wait(500);
        cy.get('[data-cy=save-and-add-new-team]').click();
        cy.get('[data-cy=save-and-add-team]').should('be.disabled');
        cy.get('[data-cy=save-and-add-member]').should('be.disabled');
    });
    it('Save and Add Team step three', () => {
        const name = faker.random.word();
        cy.visit('/teams/add');
        cy.get('[data-cy=save-and-add-team]').should('be.disabled');
        cy.get('[data-cy=save-and-add-member]').should('be.disabled');
        cy.get('[data-cy=team-name]').type(name).should('have.value', name);
        cy.get('[data-cy=save-and-add-member]').click();
        cy.wait(500);
        cy.get('[data-cy=save-and-add-tools]').click();
        cy.wait(500);
        cy.get('[data-cy=add-members]').click();
        cy.get('[data-cy=save-and-add-new-team]');
    });
    it('Wrong team name error', () => {
        const name = 'general';
        cy.visit('/teams/add');
        cy.get('[data-cy=save-and-add-team]').should('be.disabled');
        cy.get('[data-cy=save-and-add-member]').should('be.disabled');
        cy.get('[data-cy=team-name]').type(name).should('have.value', name);
        cy.get('[data-cy=save-and-add-member]').click();
        cy.contains('There is already a team with this name choose another name.').should('be.visible');
        cy.get('[data-cy=team-name]').clear();
        cy.contains('name is a required field').should('be.visible');
    });
});
