// import BASE_URL from '../../src/Constants/baseUrl';
import * as faker from 'faker';

describe('Add Member Page', () => {
    const teamName = faker.random.word();
    const filepath = 'images/member-avatar.jpg';

    beforeEach(() => {
        cy.login('mohammadrezaimn@gmail.com', 'Aa@12345*');
    });

    it('Create a new member with a new team', () => {
        cy.visit('/members/add');
        cy.get('#member-avatar').attachFile(filepath);
        cy.get('span.-today').click();
        cy.get('#first-name').type(faker.name.firstName());
        cy.get('#last-name').type(faker.name.lastName());
        cy.get('#select-team').type(teamName);
        cy.get('div.css-fhf2ac-option:first').click();
        cy.get('#email').type(faker.internet.email());
        cy.get('#submit-new-member').click();
        cy.location('pathname').should('eq', '/members');
    });
    it('Create a new member with an existed team', () => {
        cy.visit('/members/add');
        cy.get('#member-avatar').attachFile(filepath);
        cy.get('span.-today').click();
        cy.get('#first-name').type(faker.name.firstName());
        cy.get('#last-name').type(faker.name.lastName());
        cy.get('#select-team').type('{downarrow}');
        cy.get('div.css-fhf2ac-option:first').click();
        cy.get('#email').type(faker.internet.email());
        cy.get('#submit-new-member').click();
        cy.location('pathname').should('eq', '/members');
    });

    it('Create new user with existed email should fail and show The email has already been taken. error', () => {
        cy.visit('/members/add');
        cy.get('#member-avatar').attachFile(filepath);
        cy.get('span.-today').click();
        cy.get('#first-name').type(faker.name.firstName());
        cy.get('#last-name').type(faker.name.lastName());
        cy.get('#select-team').type('{downarrow}');
        cy.get('div.css-fhf2ac-option:first').click();
        cy.get('#email').type('mohammadrezaimn@gmail.com');
        cy.get('#submit-new-member').click();
        cy.get('#email').should('have.class', 'border-red-500');
        cy.get('#email-existed-error').should(
            'have.text',
            'The email has already been taken.'
        );
    });
    it('Create new user with wrong email pattern should fail and show invalid email address error', () => {
        cy.visit('/members/add');

        cy.get('#email').type('test');
        cy.get('#submit-new-member').click();
        cy.get('#email').should('have.class', 'border-red-500');
        cy.get('#email-pattern-error').should(
            'have.text',
            'invalid email address'
        );
    });
});
