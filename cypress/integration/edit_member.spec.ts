// import BASE_URL from '../../src/Constants/baseUrl';
import * as faker from 'faker';

describe('Edit member  page', () => {
    const teamName = faker.random.word();
    const filepath = 'images/member-avatar.jpg';

    beforeEach(() => {
        cy.login('mohammadrezaimn@gmail.com', 'Aa@12345*');
        cy.visit('/members');
        cy.wait(5000);
    });

    it('Update member basic info should complete successfully', () => {
        cy.get('[data-cy=normalUserForUpdateInfo]').click();
        cy.wait(5000);
        cy.get('#member-avatar').attachFile(filepath);
        cy.get('#toast-message').should(
            'have.text',
            'Member profile picture successfully updated.'
        );

        cy.get('#first-name').type(faker.name.firstName()).blur();
        cy.get('#toast-message').should(
            'have.text',
            'Member successfully updated.'
        );

        cy.get('#last-name').type(faker.name.lastName()).blur();
        cy.get('#toast-message').should(
            'have.text',
            'Member successfully updated.'
        );

        cy.get('#select-team').type(teamName);
        cy.get('div.css-fhf2ac-option:first').click();
        cy.get('#toast-message').should(
            'have.text',
            'Member team has been changed successfully'
        );

        cy.get('#email').should('be.disabled');

        cy.get('#select-team').type('{downarrow}');
        cy.get('div.css-fhf2ac-option:first').click();
        cy.get('#toast-message').should(
            'have.text',
            'Member team has been changed successfully'
        );
    });
    it('Not onboarded user onboard status should have the right title and text', () => {
        cy.get('[data-cy=notOnboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=onboardStatusTitle]').should(
            'have.text',
            'Not on boarded'
        );
        cy.get('[data-cy=onboardStatusText]').should(
            'have.text',
            'Start onboarding the member by adding the tools from the onboarding page'
        );
    });
    it('Not onboarded user onboarding date must be edited successfully', () => {
        cy.get('[data-cy=notOnboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=onboardingEditBtn]').click();
        cy.get('[data-cy=onboardingDatePicker]').should('exist');
        cy.get('span.nice-dates-day')
            .not('.-today')
            .not('.-outside')
            .last()
            .click();
        cy.get('[data-cy=onboardingDatePicker]').should('not.exist');
    });
    it('Onboarding user onboard status should have the right title and text', () => {
        cy.get('[data-cy=OnboardingNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=onboardStatusTitle]').should(
            'have.text',
            'On boarding'
        );
        cy.get('[data-cy=onboardStatusText]').should(
            'have.text',
            'Start onboarding the member by adding the tools from the onboarding page'
        );
    });
    it('Onboarding user Should not see the onboarding date edit icon', () => {
        cy.get('[data-cy=OnboardingNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=onboardingEditBtn]').should('not.exist');
    });
    it('onboarded user onboarding date input should not exist ', () => {
        cy.get('[data-cy=OnboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=onboardingDateInput]').should('not.exist');
    });

    it('Onboarded user onboard status should have the right title and text and color', () => {
        cy.get('[data-cy=OnboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=onboardStatusTitle]').should(
            'have.text',
            'On boarded'
        );
        cy.get('[data-cy=onboardStatusTitle]').should(
            'have.class',
            'text-lime-400'
        );
        cy.get('[data-cy=onboardStatusText]').should(
            'have.text',
            "The member has the access to all of his team's apps"
        );
    });

    it('Onboarded user should see the Offboard button in the right side of onboarding status', () => {
        cy.get('[data-cy=OnboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=offboardBtn]').should('exist');
    });
    it('Onboarded user should click on the ofboard button and see the offboarding date picker and pick a date for offboarding', () => {
        cy.get('[data-cy=OnboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=offboardBtn]').click();
        cy.get('[data-cy=offboardingDatePicker]').should('exist');
        cy.get('span.nice-dates-day')
            .not('.-today')
            .not('.-outside')
            .last()
            .click();
        cy.get('[data-cy=offboardingDatePicker]').should('not.exist');
        cy.get('[data-cy=offboardCancelBtn]').should('exist');
        cy.get('[data-cy=offboardingDateInput]').should('exist');
        cy.get('[data-cy=onboardStatusTitle]').should(
            'have.text',
            'Off boarding'
        );
    });

    it('offboarding user offboard status should have the right title and text', () => {
        cy.get('[data-cy=NotOffboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=onboardStatusTitle]').should(
            'have.text',
            'Off boarding'
        );
        cy.get('[data-cy=onboardStatusText]').should('not.exist');
    });

    it('offboarding user should be able to change the offboarding date', () => {
        cy.get('[data-cy=NotOffboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=offboardCancelBtn]').should('exist');

        cy.get('[data-cy=offboardingEditBtn]').click();
        cy.get('[data-cy=offboardingDatePicker]').should('exist');
        cy.get('span.nice-dates-day')
            .not('.-today')
            .not('.-outside')
            .last()
            .click();
        cy.get('[data-cy=offboardingDatePicker]').should('not.exist');
    });

    it('offboarding user should see cancel button and could cancel the offboarding', () => {
        cy.get('[data-cy=NotOffboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=offboardCancelBtn]').click();
        cy.get('[data-cy=onboardStatusTitle]').should(
            'have.text',
            'On boarded'
        );
        cy.get('[data-cy=onboardStatusTitle]').should(
            'have.class',
            'text-lime-400'
        );
        cy.get('[data-cy=onboardStatusText]').should(
            'have.text',
            "The member has the access to all of his team's apps"
        );
    });
    it('offboarded user offboard status should have the right title and text and color', () => {
        cy.get('[data-cy=OffboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=onboardStatusTitle]').should(
            'have.text',
            'Off boarded'
        );
        cy.get('[data-cy=onboardStatusTitle]').should(
            'have.class',
            'text-red-500'
        );
        cy.get('[data-cy=onboardStatusText]').should('not.exist');
        cy.get('[data-cy=offboardedStatusText]').should(
            'have.text',
            'Offboarding of the member is complete'
        );
    });

    it('offboarded user should see onboard button and should choose a date for onboarding', () => {
        cy.get('[data-cy=OffboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=onboardBtn]').click();
        cy.get('[data-cy=onboardingDatePicker]').should('exist');
        cy.get('span.nice-dates-day')
            .not('.-today')
            .not('.-outside')
            .last()
            .click();
        cy.get('[data-cy=onboardingDatePicker]').should('not.exist');
        cy.get('[data-cy=onboardingDateInput]').should('exist');
        cy.get('[data-cy=onboardStatusTitle]').should(
            'have.text',
            'Not on boarded'
        );
        cy.get('[data-cy=onboardStatusText]').should(
            'have.text',
            'Start onboarding the member by adding the tools from the onboarding page'
        );
    });

    it('Not Active user send and resend invitation email must be done successfully', () => {
        cy.get('[data-cy=notOnboardedNewNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=sendInvitationBtn]').should('exist');
        cy.get('[data-cy=memberStatusTitle]').should('have.text', 'NEW');
        cy.get('[data-cy=memberStatusText]').should(
            'have.text',
            'This member has not been invited yet!'
        );
        cy.get('[data-cy=sendInvitationBtn]')
            .should('have.text', 'Send Invitation Email')
            .click();
        cy.wait(5000);
        cy.get('#toast-message').should(
            'have.text',
            'Email invitation has been sent successfully to this Member'
        );
        cy.get('[data-cy=resendInvitationBtn]').should('exist');
        cy.get('[data-cy=resendInvitationBtn]')
            .should('have.text', 'Resend Invitation Email')
            .click();
        cy.wait(5000);
        cy.get('#toast-message').should(
            'have.text',
            'Email invitation has been sent successfully to this Member'
        );
        cy.get('[data-cy=memberStatusTitle]').should('have.text', 'INVITED');
        cy.get('[data-cy=memberStatusText]').should(
            'have.text',
            'Invitation email has been sent to the member'
        );
    });
    it('Normal user Activated change status from Active to Suspended', () => {
        cy.get('[data-cy=notOnboardedActiveNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=Active]').should('exist');
        cy.get('[data-cy=Active]').should('have.class', 'bg-lime-400');
        cy.get('[data-cy=Suspended]').should('exist').click();
        cy.get('[data-cy=Suspended]').should('have.class', 'bg-yellow-400');
        cy.get('#toast-message').should(
            'have.text',
            'Member successfully updated.'
        );
    });
    it('Normal user Activated change status from Suspended to Active', () => {
        cy.get('[data-cy=notOnboardedActiveNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=Suspended]').should('exist');
        cy.get('[data-cy=Suspended]').should('have.class', 'bg-yellow-400');
        cy.get('[data-cy=Active]').should('exist').click();
        cy.get('#toast-message').should(
            'have.text',
            'Member successfully updated.'
        );
        cy.get('[data-cy=Active]').should('have.class', 'bg-lime-400');
    });
    it('Normal user change access to Admin should be done successfully', () => {
        cy.get('[data-cy=notOnboardedActiveNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=User]').should('exist');
        cy.get('[data-cy=Admin]').should('exist');
        cy.get('[data-cy=User]').should('have.class', 'bg-lime-400');
        cy.get('[data-cy=Admin]').click();
        cy.get('[data-cy=confirmModal]').should('exist');
        cy.get('[data-cy=confirmMessage]').should(
            'have.text',
            'The user access is changing from User to Admin'
        );
        cy.get('[data-cy=confirmOkBtn]').click();
        cy.get('#toast-message').should(
            'have.text',
            'Member successfully updated.'
        );
        cy.get('[data-cy=Admin]').should('have.class', 'bg-lime-400');
    });
    it('Admin user change access to Normal User should be done successfully', () => {
        cy.get('[data-cy=notOnboardedActiveNormalUser]').click();
        cy.wait(5000);
        cy.get('[data-cy=User]').should('exist');
        cy.get('[data-cy=Admin]').should('exist');
        cy.get('[data-cy=Admin]').should('have.class', 'bg-lime-400');
        cy.get('[data-cy=User]').click();
        cy.get('[data-cy=confirmModal]').should('exist');
        cy.get('[data-cy=confirmMessage]').should(
            'have.text',
            'The user access is changing from Admin to User'
        );
        cy.get('[data-cy=confirmOkBtn]').click();
        cy.get('#toast-message').should(
            'have.text',
            'Member successfully updated.'
        );
        cy.get('[data-cy=User]').should('have.class', 'bg-lime-400');
    });
    it('Normal user should be deleted successfully', () => {
        cy.get('[data-cy=notOnboardedActiveNormalUserForDelete]').click();
        cy.wait(5000);
        cy.get('[data-cy=deleteMemberBtn]').should('exist').click();
        cy.get('[data-cy=confirmModal]').should('exist');
        cy.get('[data-cy=confirmMessage]').should(
            'have.text',
            'Are you sure to delete this member?'
        );
        cy.get('[data-cy=confirmMessage]').should('have.class', 'text-red-600');
        cy.get('[data-cy=confirmOkBtn]').click();
        cy.location('pathname').should('eq', '/members');
    });
});
