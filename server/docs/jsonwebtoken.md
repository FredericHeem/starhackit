## Json Web Token

[Json Web Token](https://jwt.io/) is a modern alternative to HTTP cookie for authentication purposes.

[node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) is the node library which implements such a protocol.

A sequence diagram a worth a thousand words:

![Json Web Token Sequence Diagram](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgSldUIEF1dGhlbnRpY2F0aW9uIFNlcXVlbmNlCgpDbGllbnQtPlNlcnZlcjogUE9TVCAvYXV0aC9sb2dpbiBcbnVzZXJuYW1lOiJwaXBwbyJcbnBhc3N3b3JkOiAiAAMIIgoAPAYtPkRCOiBmaW5kIHVzZXIgYnkAAwVuYW1lCkRCAF4KZm91ABsIAFEFCm5vdGUgcmlnaHQgb2YgAIEHCHRva2VuID0gand0LnNpZ24odXNlciwgc2VjcmV0LCBvcHRpb25zKQB0CQCBSQY6IDIwMCBPS1xuADsGOiAiQTFCMkMzRDRFNTY3ODkwIgCBUQY6ewCBVAkgAIFXB319Cg&s=modern-blue)

Please change the following configuration according to your need, especially the *secret*.

For a list of all available options, please consult the [node-jsonwebtoken documentation](https://github.com/auth0/node-jsonwebtoken#usage)

```
"jwt": {
  "secret": "I love shrimp with mayonnaise",
  "options": {
    "expiresIn": "15 days"
  }
}
```