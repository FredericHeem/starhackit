before(function (client, done) {
    console.log("before");
    done();
});

after(function (client, done) {
    console.log("after");
    client.end(function () {
        done();
    });
});
