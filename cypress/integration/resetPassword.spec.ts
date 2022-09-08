
describe('validation form', () => {
    const password = 'Test';
    const password_confirmation = 'Tests';
    const validatePassword = (password) => {
        var re = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        return re.test(password);
    };

    it('Visit reset password page', () => {
        cy.visit('/auth/reset-password');
    });
    
    it('accept input', () => {
        cy.get('#password-input')
        .type(password)
        .should('have.value', password);
        cy.get('#password-input').should('have.length', 1);

        cy.get('#password-confirmation-input')
        .type(password_confirmation)
        .should('have.value', password_confirmation);
        cy.get('#password-confirmation-input').should('have.length', 1);

        if(password !== password_confirmation) {
            cy.get('.Mui-error').should('be.visible');
        }
    })
    it('wrong data submit', () => {
        cy.get('#double-button-submit').click();
        if(!validatePassword(password)) {
            cy.get('.Mui-error').should('be.visible');
        }
    })
});

describe('reset password form', () => {
    const password = 'Test!234';
    const password_confirmation = 'Test!234';
    
    it('Visit signup page', () => {
        cy.visit('/auth/reset-password');
    });
    it('accept input', () => {
        cy.get('#password-input')
        .type(password)
        .should('have.value', password);
        cy.get('#password-input').should('have.length', 1);

        cy.get('#password-confirmation-input')
        .type(password_confirmation)
        .should('have.value', password_confirmation);
        cy.get('#password-confirmation-input').should('have.length', 1);

    })
    it('confirm form', () => {
        cy.get('#double-button-submit').click();
    })
    it('should visit success', () => {
        cy.location('pathname').should('eq','/auth/sign-in')
        })
});
