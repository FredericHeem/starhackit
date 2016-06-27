//console.log("SETUP");

before(function (client, done) {
    //console.log("BEFORE");
    done()
});

after(function (client, done) {
    //console.log("after");
    client.end(function () {
        done();
    });
});
