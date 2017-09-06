const {
  FuseBox,
  SVGPlugin,
  CSSPlugin,
  JSONPlugin,
  ImageBase64Plugin,
  BabelPlugin,
  QuantumPlugin,
  WebIndexPlugin,
  ReplacePlugin,
  EnvPlugin,
  Sparky
} = require("fuse-box");
var pkg = require("./package.json");

let fuse, app, vendor, isProduction;

Sparky.task("config", () => {
  fuse = new FuseBox({
    debug: true,
    cache: !isProduction,
    homeDir: "src/app",
    sourceMaps: !isProduction,
    hash: isProduction,
    output: "dist/$name.js",
    target: 'browser',
    plugins: [
      SVGPlugin(),
      CSSPlugin(),
      JSONPlugin(),
      ImageBase64Plugin(),
      EnvPlugin({
          "NODE_ENV": JSON.stringify(
            !isProduction ? "development" : "production"
          )
        }),
      [
        BabelPlugin(),
        ReplacePlugin({
          __VERSION__: JSON.stringify(pkg.version)
        })
      ],
      WebIndexPlugin({
        template: "src/index.fuse.html",
        title: "Starhackit"
      }),
      isProduction &&
        QuantumPlugin({
          target: "browser",
          removeExportsInterop: false,
          uglify: false,
          treeshake: false
        })
    ],
    experimentalFeatures: true,
    alias: {
      react: "preact-compat",
      "react-dom": "preact-compat",
      "create-react-class": "preact-compat/lib/create-react-class",
      glamorous: "glamorous/dist/glamorous.cjs.tiny.js",
      components: "~/components",
      utils: "~/utils",
      services: "~/services",
      parts: "~/parts",
      icons: "~/icons",
      config: "~/config.js"
    },
    natives: {
      stream: false,
      Buffer: false,
      http: false
   }
  });
  // vendor
  vendor = fuse
    .bundle("vendor")
    .instructions("~ index.js")

  // bundle app
  app = fuse
    .bundle("app")
    .split("parts/landing/**", "landing > parts/landing/landingScreen.js")
    .split(
      "components/componentGuide.js",
      "guide > components/componentGuide.js"
    )
    .split("parts/db/SchemaComponent.js", "dbSchema > parts/db/SchemaComponent.js")
    .split("parts/theme/ThemeView.js", "theme > parts/theme/ThemeView.js")
    .split("parts/admin/users.js", "users > parts/admin/users.js")
    .split("parts/profile/**", "profile > parts/profile/profileModule.js")
    .instructions("> [index.js] + [parts/**/**.{js, jsx}] -[**/*.spec.js] -[**/*.test.js")
});

Sparky.task("default", ["clean", "copy-locales", "config"], () => {
  fuse.dev({
    open: true,
    proxy: {
      "/api/v1": {
        logLevel: "debug",
        target: "http://localhost:9000"
      }
    }
  });
  // add dev instructions
  app.watch().hmr();
  return fuse.run();
});

Sparky.task("clean", () => Sparky.src("dist/").clean("dist/"));
Sparky.task("copy-locales", () =>
  Sparky.src("./locales/**/*.json").dest("./dist")
);
Sparky.task("prod-env", ["clean"], () => {
  isProduction = true;
});
Sparky.task("dist", ["prod-env", "config"], () => {
  // comment out to prevent dev server from running (left for the demo)
  //fuse.dev();
  return fuse.run();
});
