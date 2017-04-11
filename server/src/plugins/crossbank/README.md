
# Open Banking with PSD2

This plugin implements the Open Banking API to be prepared for the PSD2 regulation.

Get ready to create a new Fintech application with the [Open Banking API](https://github.com/OpenBankProject/OBP-API)

OAuth and direct authentication as well as the basics operations (banks, accounts transactions) are already implemented and tested.

As an application developer, create an account and API keys at the [banking open project sandbox](https://apisandbox.openbankproject.com/)

```
"authentication":{
  "crossBank": {
    "apiHost": "https://apisandbox.openbankproject.com",
    "consumerKey": "",
    "consumerSecret": "",
    "callbackURL": "http://localhost:8080/crossbank/authCallback",
  }
}
```

## Authentication flow with OAuth


![Open Banking Authentication Sequence Diagram](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=IyBzZHNkCm5vdGUgb3ZlciBGRTogR28gdG8gbG9naW4gcGFnZQAQD0NsaWNrIG9uIFNpZ24gaW4gd2l0aCBPcGVuIEJhbmsKRkUtPkJFOiBHRVQgL2FwaS92MS9jcm9zc2JhbmsvAFIFCkJFLT5PQjogZ2V0T0F1dGhSZXF1ZXN0VG9rZW4KT0IAOwZyAAoLLAABDVNlY3JldABBBUZFOiAzMDIgUmVkaXJlY3QAegVPQgB4B29hdXRoL2F1dGhvcml6ZQCBJQYAEAVfdABjCUZFOiBIdG1sIEwAgWkKAD4IUE9TVCAAgS4HACQIACxDAIESIHRoYW5rcwCCVAZyAIFTB1VybCwAgTAMIGFuZACBRQd2ZXJpZmllcgCDOg8AgmwLYXV0aENhbGxiYWNrAIF1EQA2FACDKB4AQwwAgzwRQWNjZXNzAIM-DmEACgoAgTMFAAULAINIBWMAg0QKMjAwIE9LAIUFDwCBfQggdG8gL2Rhc2hib2FyZAoK&s=modern-blue)
