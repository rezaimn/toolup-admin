// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// import BASE_URL from '../../src/Constants/baseUrl';
// import API_URLS from '../../src/Constants/apiUrls';

// Cypress.Commands.add('getSessionStorage', key => {
//     cy.window().then(window => window.sessionStorage.getItem(key));
// });
//
// Cypress.Commands.add('setSessionStorage', (key, value) => {
//     cy.window().then(window => {
//         window.sessionStorage.setItem(key, value);
//     });
// });
//
// Cypress.Commands.add('getLocalStorage', key => {
//     cy.window().then(window => window.localStorage.getItem(key));
// });
//
// Cypress.Commands.add('setLocalStorage', (key, value) => {
//     cy.window().then(window => {
//         window.localStorage.setItem(key, value);
//     });
// });
import { getDomain } from '../../src/Helpers/getDomain';

const { subDomain, subSubdomain } = getDomain(window?.location?.hostname);
import * as localStorage from '../../src/Helpers/localStorage';
import 'cypress-file-upload';
import '@4tw/cypress-drag-drop';
import BASE_URL from '../../src/Constants/baseUrl';

declare namespace Cypress {
    interface Chainable {
        login(email: string, password: string): Cypress.Chainable;
    }
}

Cypress.Commands.add('login', (email, password) => {
    return cy
        .request('POST', BASE_URL + '/auth/login', {
            email: email,
            password: password,
            subdomain: subSubdomain,
        })
        .then((res: any) => {
            cy.window().then(window => {
                window.localStorage.setItem('token', res.body.access_token);
                localStorage.setItem('access', res.body.user.access);
            });
        });
});

// //new command
Cypress.Commands.add(
    'attach_file',
    {
        prevSubject: 'element',
    },
    (input, fileName, fileType) => {
        cy.fixture(fileName)
            .then(content => Cypress.Blob.base64StringToBlob(content, fileType))
            .then(blob => {
                const testFile = new File([blob], fileName);
                const dataTransfer = new DataTransfer();

                dataTransfer.items.add(testFile);
                input[0].files = dataTransfer.files;
                return input;
            });
    }
);
//
// Cypress.Commands.add('get', url => {
//     return cy.request({
//         url: url,
//         method: 'GET',
//         headers: { Authorization: 'Bearer ' + cy.getLocalStorage('token') },
//     });
// });
//
// Cypress.Commands.add('post', (body, url) => {
//     return cy.request({
//         url: url,
//         method: 'POST',
//         body: body,
//         headers: { Authorization: 'Bearer ' + cy.getLocalStorage('token') },
//     });
// });
//
// Cypress.Commands.add('put', (body, url) => {
//     return cy.request({
//         url: url,
//         method: 'PUT',
//         body: body,
//         headers: { Authorization: 'Bearer ' + cy.getLocalStorage('token') },
//     });
// });
//
// Cypress.Commands.add('delete', url => {
//     return cy.request({
//         url: url,
//         method: 'DELETE',
//         headers: { Authorization: 'Bearer ' + cy.getLocalStorage('token') },
//     });
// });
