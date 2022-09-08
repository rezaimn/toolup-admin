import * as faker from 'faker';
import { Simulate } from 'react-dom/test-utils';
import mouseOver = Simulate.mouseOver;

context('Edit Team', () => {
    beforeEach(() => {
        cy.login('mohammadrezaimn@gmail.com', 'Aa@12345*');
    });
    it('Change team name to an existent team should shown an error in team name field and make the border red', () => {
        cy.visit('/teams');
        cy.get('[data-cy=teamForEditInfo]').click();
        cy.wait(5000);
        cy.get('#team-name').clear().type('teamForDelete').blur();
        cy.get('#team-name').should('have.class', 'border-red-500');
        cy.get('[data-cy=teamNameError]').should(
            'have.text',
            'There is already a team with this name choose another name.'
        );
        cy.get('[data-cy=teamNameError]').should('have.class', 'text-red-500');
    });
    it('Change team color should be done successfully.', () => {
        cy.visit('/teams');
        cy.get('[data-cy=teamForEditInfo]').click();
        cy.wait(5000);
        cy.get('[data-cy=EC4899]').click();
        cy.get('#toast-message').should(
            'have.text',
            'Team color updated successfully.'
        );
    });
    it('General team color must be shown correctly in UI and add a border to the red circle', () => {
        cy.visit('/teams');
        cy.get('[data-cy=General]').click();
        cy.wait(5000);
        cy.get('[data-cy=E11D48]').should('have.class', 'border');
    });
    // it('Mouse over a circle must add a border to it', () => {
    //     cy.visit('/teams');
    //     cy.get('[data-cy=General]').click();
    //     cy.wait(5000);
    //     cy.get('[data-cy=EC4899]')
    //         .realHover()
    //         .should('have.css', 'border', '1px solid');
    // });
    it('If user change the team name to general none case sensitive the input field should become disable.', () => {
        cy.visit('/teams');
        cy.get('[data-cy=teamForEditInfo]').click();
        cy.wait(5000);
        cy.get('#team-name').clear().type('general');
        cy.get('#team-name').should('be.disabled');
    });
    it('Edit team name should be done successfully', () => {
        cy.visit('/teams');
        cy.get('[data-cy=teamForEditInfo]').click();
        cy.wait(5000);
        cy.get('#team-name').type(faker.random.word()).blur();
        cy.get('#toast-message').should(
            'have.text',
            'Team name updated successfully.'
        );
    });

    // it('General team has no edit button for members and tools', () => {
    //     cy.visit('/teams');
    //     cy.get('[data-cy=General]').click();
    //     cy.wait(5000);
    //     cy.get('[data-cy=teamMembersEditBtn]').should('not.exist');
    // });
    it('Delete team should be done successfully.', () => {
        cy.visit('/teams');
        cy.get('[data-cy=teamForDelete]').click();
        cy.wait(5000);
        cy.get('[data-cy=deleteTeamBtn]').click();
        cy.get('[data-cy=confirmModal]').should('exist');
        cy.get('[data-cy=confirmMessage]').should(
            'have.text',
            'Are you sure to delete this team?'
        );
        cy.get('[data-cy=confirmMessage]').should('have.class', 'text-red-600');
        cy.get('[data-cy=confirmOkBtn]').click();
        cy.location('pathname').should('eq', '/teams');
    });
});
