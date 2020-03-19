# Configuration

This project uses the library [node-config](https://lorenwest.github.io/node-config/) which supports config file hierarchy and the *NODE_CONFIG* environment variable.

Example of [the default config file](../config/default.json):
```
{
  "websiteUrl": "http://localhost:8080",
  "log": {
    "console": {
      "level": "debug",
      "timestamp": true,
      "colorize": true
    }
  },
  "redis":{
    "url": "//localhost:7379"
  },
  "koa": {
    "port": 9000,
    "apiBasePath": "/api/v1/",
    "cookieSecret": ["your-super-session-secret"],
    "staticContent": ["build"],
    "logger": true,
    "cors":{
      "credentials": true
    }
  },
  "db":{
    "url": "postgres://postgres:password@localhost:6432/dev?sslmode=disable",
    "options": {
      "logging": true
    }
  },
  "jwt": {
    "secret": "I love shrimp with mayonnaise",
    "options": {
      "expiresIn": "15 days"
    }
  },
  "mail": {
    "from": "StarHackIt <notification@starhack.it>",
    "signature": "The Team",
    "smtp": {
      "service": "Mailgun",
      "auth": {
        "user": "postmaster@yourproject.mailgun.org",
        "pass": "11111111111111111111"
      }
    }
    
  }
}
```


