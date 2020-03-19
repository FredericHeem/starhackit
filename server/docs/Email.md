## Sending Email
Sending email is a very common task for an application. For instance, an email is sent during registration, when a user requests a new password etc ...

The project is leveraging [nodemailer](http://nodemailer.com/) which makes sending e-mail easy as cake:

```
"mail": {
  "from": "StarHackIt <notification@yourproject.com>",
  "signature": "The Team",
  "smtp": {
    "service": "Mailgun",
    "auth": {
      "user": "postmaster@yourproject.mailgun.org",
      "pass": "blabla"
    }
  }
}
```

Please have a look at the [nodemailer documentation](https://github.com/nodemailer/nodemailer) for more information about how to use another mail provider.
