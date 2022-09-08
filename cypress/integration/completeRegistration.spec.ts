
describe('fail complete registration', () => {
    const first_name = 'test';
    const last_name = 'testi';
    const name = 'tested';
    const position = 'tester';
    const team_size = '1 - 10';
    const subdomain = 'tested';
    const password = 'Test!234';
    const password_confirmation = 'Test!234';

    it('Visit complete registration page', () => {
        cy.visit('/auth/complete-registration?token=d19e4c0265e241d43e3319bd1b932e6a94361812');
    });
    
    it('accept input', () => {
        cy.get('#first-name-input')
        .type(first_name)
        .should('have.value', first_name);
        cy.get('#first-name-input').should('have.length', 1);

        cy.get('#last-name-input')
        .type(last_name)
        .should('have.value', last_name);
        cy.get('#last-name-input').should('have.length', 1);

        cy.get('#name-input')
        .type(name)
        .should('have.value', name);
        cy.get('#name-input').should('have.length', 1);

        cy.get('#position-input')
        .type(position)
        .should('have.value', position);
        cy.get('#position-input').should('have.length', 1);

        cy.get('#team-size-input')
        .type(team_size)
        .should('have.value', team_size);
        cy.get('#team-size-input').should('have.length', 1);

        cy.get('#subdomain-input')
        .type(subdomain)
        .should('have.value', subdomain);
        cy.get('#subdomain-input').should('have.length', 1);

        cy.get('#password-input')
        .type(password)
        .should('have.value', password);
        cy.get('#password-input').should('have.length', 1);

        cy.get('#password-confirmation-input')
        .type(password_confirmation)
        .should('have.value', password_confirmation);
        cy.get('#password-confirmation-input').should('have.length', 1);

        cy.get('#agreement-input').check()
        cy.get('#agreement-input').should('have.length', 1);
    })
    it('wrong data submit', () => {
        cy.get('#double-button-submit').click();
        cy.get('.Mui-error').should('be.visible');
    })
});

describe('validation complete registration', () => {
    const first_name = 'test';
    const last_name = 'testi';
    const name = 'tested';
    const position = 'tester';
    const team_size = '1 - 10';
    const subdomain = 'tested';
    const password = 'Test';
    const password_confirmation = 'Tests';

    const validatePassword = (password) => {
        var re = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        return re.test(password);
    };

    it('Visit complete registration page', () => {
        cy.visit('/auth/complete-registration?token=d19e4c0265e241d43e3319bd1b932e6a94361812');
    });
    
    it('accept input', () => {
        cy.get('#first-name-input')
        .type(first_name)
        .should('have.value', first_name);
        cy.get('#first-name-input').should('have.length', 1);

        cy.get('#last-name-input')
        .type(last_name)
        .should('have.value', last_name);
        cy.get('#last-name-input').should('have.length', 1);

        cy.get('#name-input')
        .type(name)
        .should('have.value', name);
        cy.get('#name-input').should('have.length', 1);

        cy.get('#position-input')
        .type(position)
        .should('have.value', position);
        cy.get('#position-input').should('have.length', 1);

        cy.get('#team-size-input')
        .type(team_size)
        .should('have.value', team_size);
        cy.get('#team-size-input').should('have.length', 1);

        cy.get('#subdomain-input')
        .type(subdomain)
        .should('have.value', subdomain);
        cy.get('#subdomain-input').should('have.length', 1);

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

        cy.get('#agreement-input').check()
        cy.get('#agreement-input').should('have.length', 1);
    })
    it('wrong data submit', () => {
        cy.get('#double-button-submit').click();
        if(!validatePassword(password)) {
            cy.get('.Mui-error').should('be.visible');
        }
    })
});

describe('complete registration form', () => {
    const first_name = 'fafs';
    const last_name = 'das';
    const name = 'toolup';
    const position = 'ceo';
    const team_size = '11 - 50';
    const subdomain = 'testedsd';
    const password = 'Test!234';
    const password_confirmation = 'Test!234';
    
    it('Visit complete registration page', () => {
        cy.visit('/auth/complete-registration?token=d19e4c0265e241d43e3319bd1b932e6a94361812');
        cy.wait(3000);
    });
    it('accept input', () => {
        cy.get('#first-name-input')
        .clear()
        .type(first_name)
        .should('have.value', first_name);
        cy.get('#first-name-input').should('have.length', 1);

        cy.get('#last-name-input')
        .clear()
        .type(last_name)
        .should('have.value', last_name);
        cy.get('#last-name-input').should('have.length', 1);

        cy.get('#name-input')
        .clear()
        .type(name)
        .should('have.value', name);
        cy.get('#name-input').should('have.length', 1);

        cy.get('#position-input')
        .clear()
        .type(position)
        .should('have.value', position);
        cy.get('#position-input').should('have.length', 1);

        cy.get('#team-size-input')
        .type(team_size)
        .should('have.value', team_size);
        cy.get('#team-size-input').should('have.length', 1);

        cy.get('#subdomain-input')
        .clear()
        .type(subdomain)
        .should('have.value', subdomain);
        cy.get('#subdomain-input').should('have.length', 1);

        cy.get('#password-input')
        .type(password)
        .should('have.value', password);
        cy.get('#password-input').should('have.length', 1);

        cy.get('#password-confirmation-input')
        .type(password_confirmation)
        .should('have.value', password_confirmation);
        cy.get('#password-confirmation-input').should('have.length', 1);

        cy.get('#agreement-input').check()
        cy.get('#agreement-input').should('have.length', 1);
    })
    it('confirm form', () => {
        cy.get('#double-button-submit').click();
    })
});
