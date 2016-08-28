
<div class=wsd wsd_style="modern-blue" ><pre>

    title JSON Web Token Authentication

    Client->Server: POST /auth/login \nusername:"pippo"\npassword: "password"
    Server->DB: find user by username
    DB->Server: found user pippo
    note right of Server: token = jwt.sign(user, secret, options)
    Server->Client: 200 OK\n token: "A1B2C3D4E567890"\nuser:{username: "pippo"}}
    Client->Client: Save token to local storage
</pre></div><script type="text/javascript" src="http://www.websequencediagrams.com/service.js"></script>



