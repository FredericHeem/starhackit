export default () => ({
  features: [
    {
      img: require("./img/stack.svg").default,
      title: "Full Stack",
      text: "A complete frontend, backend and deployment solution to bootstrap your application",
      height: "100",
    },
    {
      img: require("./img/users.svg").default,
      title: "Authentication",
      text: "Account registration with username and password, or with identity provider such as Google, Facebook, Twitter, GitHub etc ..",
      height: "100",
    },
    {
      img: require("./img/protection.svg").default,
      title: "Authorization",
      text: "A group and permissions based authorization",
      height: "100",
    },
    {
      img: require("./img/database.svg").default,
      title: "Relational SQL Database",
      text: "The data are modeled with sequelize, an ORM which support PostgreSQL, MySQL, MariaDB, SQLite and MSSQL",
      height: "100",
    },
  ],
  frontend: [
    {
      img: require("./img/react.svg").default,
      height: "100",
      title: "React",
      link: "https://reactjs.org/",
      text: "A library for building user interfaces",
    },
    {
      img: require("./img/mobx.svg").default,
      title: "Mobx",
      height: "100",
      link: "https://mobx.js.org/",
      text: "Simple, scalable state management",
    },
    {
      img: require("./img/emotion.png").default,
      title: "Emotion",
      height: "150",
      link: "https://emotion.sh",
      text: "Style React Components with Style.",
    },
    {
      img: require("./img/i18next.svg").default,
      title: "i18next",
      width: "180",
      link: "http://i18next.com/",
      text: "Internationalisation matters",
    },
  ],
  backend: [
    {
      img: require("./img/nodejs.png").default,
      title: "Node.js",
      height: "120",
      link: "https://nodejs.org",
      text: "A scalable javascript application server.",
    },
    {
      img: require("./img/passportjs.png").default,
      title: "Passportjs",
      width: "64",
      link: "http://passportjs.org/",
      text: "Simple, unobtrusive authentication for Node.js, supports more than 300 authentication stragegies such as username and password, Facebook, google etc ...",
    },
  ],
  tools: [
    {
      img: require("./img/eslint.svg").default,
      title: "ESLint",
      height: "120",
      link: "http://eslint.org/",
      text: "The pluggable linting utility for JavaScript and JSX, find errors and coding style violation.",
    },
    {
      img: require("./img/mocha.svg").default,
      title: "Mocha",
      height: "160",
      link: "https://mochajs.org/",
      text: "A rich asynchronous test framework",
    },
    {
      img: require("./img/nightwatch.png").default,
      title: "Nightwatch",
      link: "http://nightwatchjs.org/",
      text: "Write End-to-End tests in Node.js quickly and effortlessly that run against a Selenium server.",
    },
    {
      img: require("./img/webpack.svg").default,
      title: "Webpack",
      height: "160",
      link: "http://webpack.github.io/docs/",
      text: "A bundler for javascript and friends. Packs many modules into a few bundled assets.",
    },

    {
      img: require("./img/raml.png").default,
      title: "RAML",
      link: "http://raml.org",
      text: "RESTful API Modeling Language, model your API, generate html documentation, mock server for frontend, ensure the backend implements the API",
    },

    {
      img: require("./img/ansible.png").default,
      title: "Ansible",
      width: "128",
      link: "http://www.ansible.com/",
      text: "Deploy apps. Manage systems. DevOps made easy",
    },
    {
      img: require("./img/grucloud-logo.png").default,
      title: "GruCloud",
      width: "200",
      link: "https://grucloud.com",
      text: "Infrastructure as Code in Javascript",
    },
    {
      img: require("./img/docker.png").default,
      title: "Docker",
      link: "https://www.docker.com/",
      text: "An open platform for distributed applications for developers and sysadmins",
    },
  ],
});
