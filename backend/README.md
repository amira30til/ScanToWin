# Scan to win 🎯

`

## Welcome to the Scan to win Backend Repository!

`
Scan2Win is a dynamic promotional platform that helps businesses boost engagement through QR-based gamification. Visitors can scan QR codes, play games like spin-the-wheel, leave reviews, and earn gifts , while businesses track performance and manage campaigns from a central dashboard.

1.Key Features 🚀 :

-

- 2.Architecture & Interfaces 🧩 :

- [Visual interface map: ](https://www.gloomaps.com/vHscMynTEf)

## Useful links ✨

- [Github Repository](*******)
- [Figma Prototype Client ](***********)
- [Figma Prototype Admin Dashboard ](*********)

## Requirements ✨

To run the Scan2Win back-end, you'll need:

##### Node.js (version 20.4.0 or later)

`

    $ sudo apt-get update
    $ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
    $ sudo apt install nodejs
    $ node -v
    v20.4.0
    $ npm -v
    9.5.1

##### npm (version 9.5.1 or later)

`

    $ curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    $ sudo apt-get install -y nodejs
    $ node --version
    $ npm --version

## Installing dependencies ✨

To install the dependencies needed for the project, run:

```sh
 npm install
```

## Running the server ✨

To start the server, run:

```sh
npm start
```

To start the server in watch mode, run:

```sh
nest start --watch
```

To start the server in production model:

```sh
npm run start:prod
```

This will start the server and make it available at http://localhost:3000.

## Running Test ✨

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Variables Configuration ✨

##### set up your environment variables for server, database, and authentication:

`

```sh
#### SERVER
--------------------------------------------------------------------------------
PORT=******

DATABASE
--------------------------------------------------------------------------------
DB_HOST=*****
DB_PORT=*****
DB_USERNAME=****
DB_PASSWORD=*****
DB_DATABASE=****

AUTH
--------------------------------------------------------------------------------
JWT_SECRET=****
JWT_EXPIRED=***
REFRESH_JWT_SECRET=****
REFRESH_JWT_EXPIRED=****
GUEST_GUARD_KEY=****

-----------------------------------------------<---------------------------------
 MAIL
---------------------------------------------------------------------------------

MAIL_HOST=*****
MAIL_USER=****
MAIL_PASSWORD=******
MAIL_FROM=****
MAIL_RECEIVER=*****
```

## Project Structure ✨

The project is built with the NestJS framework, which follows the Model-View-Controller (MVC) pattern. The key directories and files include:

- src/controllers: Contains the application's controllers.
- src/models: Contains the application's models.
- src/services: Contains the application's services.
- src/app.module.ts: Defines the application's modules.

## Technology Stack ✨

The Scan2Win API is built with the following technologies:

- NestJS: A server-side application framework built on top of Node.js.
- PostgreSQL: A powerful and open-source relational database management system known for its robust features, extensibility, and adherence to SQL standards.
- TypeORM: A powerful ORM for TypeScript and JavaScript.

## Technologies ✨

Scan2Win built using the Nest framework, a powerful and modular web framework for Node.js. If you're not familiar with Nest, you can learn more about it [here](https://nestjs.com/).

## Documentaion Swagger✨

To access the API endpoint Swagger, please visit : [Click Here](*********).

## Description ✨

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## Version ✨

The current version of Scan2Win-api is 0.0.1.

`

## License

Nest is [MIT licensed](LICENSE).

# "Made with ❤️ by [ Amira Tilouche ]"

# The End!
