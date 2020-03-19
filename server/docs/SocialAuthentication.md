## Social authentication

Beside creating an account with username and password, this starter kit supports social authentication such as Facebook, Google, Twitter etc ...

[passportjs](http://passportjs.org/) has more than 300 different strategies to choose from.

### Facebook authentication

Here is the configuration for the Facebook authentication:

```
"authentication":{
  "facebook":{
    "clientID":"",
    "clientSecret":"",
    "callbackURL": "http://localhost:3000/v1/auth/facebook/callback"
  }
}
```