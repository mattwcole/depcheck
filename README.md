# Depcheck

Proof of concept web app for checking open source GitHub project dependencies.

## Running

The app makes use of the GitHub GraphQL API and requires an access token with the `public_repo` scope. [Create a token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) and set the environment variable `GITHUB_API_TOKEN` before running (a [.env](https://github.com/motdotla/dotenv) file can be used for this).

To run in Docker.

```sh
docker-compose up
```

To run natively, ensure you have Node 8 and yarn installed.

```sh
yarn install
yarn start
```

Browse the application at [http://localhost:3000](http://localhost:3000).
