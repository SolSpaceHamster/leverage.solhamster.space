# Hams UI

Uses:

- [Typescript](https://www.typescriptlang.org/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Linting, typechecking and formatting on by default using [`husky`](https://github.com/typicode/husky) for commit hooks
- Testing with [Jest](https://jestjs.io/) and [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro)

## Running the UI locally

1. Install Node.js and npm (https://nodejs.org/en/download/), and Git (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. Open a new terminal window (if running Windows use Git Bash) and run `npm install -g yarn`
3. Run `git clone https://github.com/blockworks-foundation/mango-ui-v3.git && cd mango-ui-v3` to get the UI source code
4. Run `yarn install` to install dependencies
5. Run `yarn dev` to start the webserver
6. Navigate to `http://localhost:3000` in your browser

## Branches

- `production` is deployed to trade.mango.markets and app.mango.markets
- `main` is deployed to alpha.mango.markets
- `devnet` is deployed to devnet.mango.markets
