
describe('fail submit', () => {
    const email = 'tesfasfast';
    const validateEmail = (email) => {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
    };
    it('Visit forgot password page', () => {
        cy.visit('/auth/forget-password');
    });
    
    it('accept input', () => {
        cy.get('#email-input')
        .type(email)
        .should('have.value', email);
        cy.get('#email-input').should('have.length', 1);
    })
    it('wrong data submit', () => {
        cy.get('#double-button-submit').click();
        if(!validateEmail(email)) {
            cy.get('.Mui-error').should('be.visible');
        }
    })
});

describe('forgot password form', () => {
    const email = 'hamidak22@gmail.com';
    
    it('Visit forgot password page', () => {
        cy.visit('/auth/forget-password');
    });
    it('accept input', () => {
        cy.get('#email-input')
        .type(email)
        .should('have.value', email);
        cy.get('#email-input').should('have.length', 1);
    })
    it('confirm form', () => {
        cy.get('#double-button-submit').click();
    })
    // it('should visit dashboard', () => {
    //     cy.location('pathname').should('eq','/dashboard')
    //     })
});
