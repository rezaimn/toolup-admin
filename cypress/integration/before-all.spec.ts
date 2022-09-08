describe('Seeding DB', () => {
    it('It should clear DB seed Data', () => {
        cy.fixture('rezaSeed').then(function (seedData) {
            this.seedData = seedData;
            return cy
                .request({
                    method: 'POST',
                    url:
                        'tooluptest-frontend-env.us-east-2.elasticbeanstalk.com/v1/frontend-test/seed/clear',
                    headers: {
                        'X-Toolup-Seed': 1,
                        Accept: 'application/json',
                    },
                    body: {
                        organization_names: ['RezaTest'], ////////make sure that you replace your organization name here
                    },
                })
                .then((res: any) => {});
        });
    });
    it('It should Add Seed data to DB', () => {
        cy.fixture('rezaSeed').then(function (seedData) {
            this.seedData = seedData;
            return cy
                .request({
                    method: 'POST',
                    url:
                        'tooluptest-frontend-env.us-east-2.elasticbeanstalk.com/v1/frontend-test/seed/run',
                    headers: {
                        'X-Toolup-Seed': 1,
                        Accept: 'application/json',
                    },
                    body: this.seedData,
                })
                .then((res: any) => {});
        });
    });
});
