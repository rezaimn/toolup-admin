module.exports = plop => {
    plop.setGenerator('Atom', {
        description: 'Create an Atom',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is your Atom name?',
            },
        ],
        actions: [
            {
                type: 'add',
                path:
                    '../src/Components/Atoms/{{pascalCase name}}/{{pascalCase name}}.tsx',
                templateFile: 'PlopTemplates/Atom/component.tsx.hbs',
            },
            {
                type: 'add',
                path: '../src/Components/Atoms/{{pascalCase name}}/index.ts',
                templateFile: 'PlopTemplates/Atom/index.ts.hbs',
            },
        ],
    });
    plop.setGenerator('Molecule', {
        description: 'Create an Molecule',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is your Molecule name?',
            },
        ],
        actions: [
            {
                type: 'add',
                path:
                    '../src/Components/Molecules/{{pascalCase name}}/{{pascalCase name}}.tsx',
                templateFile: 'PlopTemplates/Molecule/component.tsx.hbs',
            },
            {
                type: 'add',
                path:
                    '../src/Components/Molecules/{{pascalCase name}}/index.ts',
                templateFile: 'PlopTemplates/Molecule/index.ts.hbs',
            },
        ],
    });
    plop.setGenerator('Organism', {
        description: 'Create an Organism',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is your Organism name?',
            },
        ],
        actions: [
            {
                type: 'add',
                path:
                    '../src/Components/Organisms/{{pascalCase name}}/{{pascalCase name}}.tsx',
                templateFile: 'PlopTemplates/Organism/component.tsx.hbs',
            },
            {
                type: 'add',
                path:
                    '../src/Components/Organisms/{{pascalCase name}}/index.ts',
                templateFile: 'PlopTemplates/Organism/index.ts.hbs',
            },
        ],
    });
    plop.setGenerator('Template', {
        description: 'Create an Template',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is your Template name?',
            },
        ],
        actions: [
            {
                type: 'add',
                path:
                    '../src/Components/Templates/{{pascalCase name}}/{{pascalCase name}}.tsx',
                templateFile: 'PlopTemplates/Template/component.tsx.hbs',
            },
            {
                type: 'add',
                path:
                    '../src/Components/Templates/{{pascalCase name}}/index.ts',
                templateFile: 'PlopTemplates/Template/index.ts.hbs',
            },
        ],
    });
    plop.setGenerator('Page', {
        description: 'Create an Page',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is your Page name?',
            },
        ],
        actions: [
            {
                type: 'add',
                path:
                    '../src/Pages/{{pascalCase name}}/{{pascalCase name}}.tsx',
                templateFile: 'PlopTemplates/Page/component.tsx.hbs',
            },
            {
                type: 'add',
                path: '../src/Pages/{{pascalCase name}}/index.tsx',
                templateFile: 'PlopTemplates/Page/index.tsx.hbs',
            },
        ],
    });
};
