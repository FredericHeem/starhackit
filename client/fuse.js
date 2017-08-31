const {
    FuseBox,
    SVGPlugin,
    CSSPlugin,
    BabelPlugin,
    QuantumPlugin,
    WebIndexPlugin,
    ReplacePlugin,
    Sparky
} = require("fuse-box");

var pkg = require('./package.json');

let fuse, app, vendor, isProduction;

Sparky.task("config", () => {
    fuse = new FuseBox({
        homeDir: "src/app",
        sourceMaps: !isProduction,
        hash: isProduction,
        output: "dist/$name.js",
        sourceMaps: true,
        plugins: [
            SVGPlugin(), CSSPlugin(), BabelPlugin(),
            WebIndexPlugin({
                template: "src/index.ejs",
                title: "Starhackit"
            }),
            isProduction && QuantumPlugin({
                removeExportsInterop: false,
                uglify: true
            }),
            ReplacePlugin({ __VERSION__: JSON.stringify(pkg.version) }),
        ],
        experimentalFeatures: true,
        alias: {
                'react': 'preact-compat',
                'react-dom': 'preact-compat',
                'create-react-class': 'preact-compat/lib/create-react-class',
                'glamorous': 'glamorous/dist/glamorous.es.tiny.js',
                components: '~/components',
                utils: '~/utils',
                services: '~/services',
                parts: '~/parts',
                icons: '~/icons',
                config: '~/config.js'
            }
    });
    // vendor
    vendor = fuse.bundle("vendor").instructions("~ index.js").target("browser")

    // bundle app
    app = fuse.bundle("app").instructions("> [index.js]").target("browser")
});

Sparky.task("default", ["clean", "config"], () => {
    fuse.dev();
    // add dev instructions
    app.watch().hmr()
    return fuse.run();
});

Sparky.task("clean", () => Sparky.src("dist/").clean("dist/"));
Sparky.task("prod-env", ["clean"], () => { isProduction = true })
Sparky.task("dist", ["prod-env", "config"], () => {
    // comment out to prevent dev server from running (left for the demo)
    //fuse.dev();
    return fuse.run();
});