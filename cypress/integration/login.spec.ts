
describe('fail Login', () => {
    const email = 'test@test.com';
    const password = 'Test!234';
    it('Visit login page', () => {
        cy.visit('/auth/sign-in');
    });
    
    it('accept input', () => {
        cy.get('#email-input')
        .type(email)
        .should('have.value', email);
        cy.get('#email-input').should('have.length', 1);

        cy.get('#password-input')
        .type(password)
        .should('have.value', password)
        cy.get('#password-input').should('have.length', 1)
    })
    it('wrong data submit', () => {
        cy.get('#double-button-submit').click();
        cy.get('.Mui-error').should('be.visible');
    })
});

describe('Login form', () => {
    const email = 'hamidak22@gmail.com';
    const password = 'H@k13227';
    
    it('Visit login page', () => {
        cy.visit('/auth/sign-in');
    });
    it('accept input', () => {
        cy.get('#email-input')
        .type(email)
        .should('have.value', email);
        cy.get('#email-input').should('have.length', 1);

        cy.get('#password-input')
        .type(password)
        .should('have.value', password)
        cy.get('#password-input').should('have.length', 1)
    })
    it('confirm form', () => {
        cy.get('#double-button-submit').click();
        cy.get('.content-body').should('be.visible')
        cy.location('pathname').should('eq','/dashboard')
    })
});
