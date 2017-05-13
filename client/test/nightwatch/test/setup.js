//console.log("SETUP");

before(function (client, done) {
    done()
});

after(function (client, done) {
    //console.log("after");
    client.end(function () {
        done();
    });
});
