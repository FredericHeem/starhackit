# Production Build

To build the production version:

```text
$ npm run build
```

_webpack_ will produce a report with all the assets and their respective size.

```text
$ npm run build
Webpack Bundle Analyzer saved report to /Users/fredericheem/starhackit/client/dist/report.html
Hash: e9d3997237a507a37f97
Version: webpack 4.42.0
Time: 9664ms
Built at: 18/03/2020 12:57:45
                            Asset       Size      Chunks                                Chunk Names
        0.e9d3997237a507a37f97.js   14.6 KiB           0  [emitted] [immutable]         
     0.e9d3997237a507a37f97.js.gz   5.03 KiB              [emitted]                     
       10.e9d3997237a507a37f97.js   7.81 KiB          10  [emitted] [immutable]         
    10.e9d3997237a507a37f97.js.gz   3.39 KiB              [emitted]                     
       11.e9d3997237a507a37f97.js    4.9 KiB  11, 14, 15  [emitted] [immutable]         
    11.e9d3997237a507a37f97.js.gz   1.79 KiB              [emitted]                     
       12.e9d3997237a507a37f97.js   4.33 KiB          12  [emitted] [immutable]         
    12.e9d3997237a507a37f97.js.gz   1.71 KiB              [emitted]                     
       13.e9d3997237a507a37f97.js   4.25 KiB          13  [emitted] [immutable]         
    13.e9d3997237a507a37f97.js.gz   1.63 KiB              [emitted]                     
       14.e9d3997237a507a37f97.js   4.75 KiB      14, 15  [emitted] [immutable]         
    14.e9d3997237a507a37f97.js.gz   1.74 KiB              [emitted]                     
       15.e9d3997237a507a37f97.js   4.37 KiB          15  [emitted] [immutable]         
    15.e9d3997237a507a37f97.js.gz   1.62 KiB              [emitted]                     
       16.e9d3997237a507a37f97.js   5.55 KiB          16  [emitted] [immutable]         
    16.e9d3997237a507a37f97.js.gz   1.73 KiB              [emitted]                     
       17.e9d3997237a507a37f97.js   39.9 KiB          17  [emitted] [immutable]         
    17.e9d3997237a507a37f97.js.gz   13.3 KiB              [emitted]                     
       18.e9d3997237a507a37f97.js   25.4 KiB          18  [emitted] [immutable]         
    18.e9d3997237a507a37f97.js.gz   3.99 KiB              [emitted]                     
       19.e9d3997237a507a37f97.js  422 bytes          19  [emitted] [immutable]         
    19.e9d3997237a507a37f97.js.gz  281 bytes              [emitted]                     
       20.e9d3997237a507a37f97.js  717 bytes          20  [emitted] [immutable]         
    20.e9d3997237a507a37f97.js.gz  455 bytes              [emitted]                     
       21.e9d3997237a507a37f97.js   81 bytes          21  [emitted] [immutable]         
                            5.css  608 bytes           5  [emitted]                     
                         5.css.gz  248 bytes              [emitted]                     
        5.e9d3997237a507a37f97.js     35 KiB           5  [emitted] [immutable]         
     5.e9d3997237a507a37f97.js.gz   8.89 KiB              [emitted]                     
        6.e9d3997237a507a37f97.js    213 KiB           6  [emitted] [immutable]         
     6.e9d3997237a507a37f97.js.gz    140 KiB              [emitted]                     
        7.e9d3997237a507a37f97.js   7.87 KiB           7  [emitted] [immutable]         
     7.e9d3997237a507a37f97.js.gz   2.75 KiB              [emitted]                     
        8.e9d3997237a507a37f97.js   4.92 KiB           8  [emitted] [immutable]         
     8.e9d3997237a507a37f97.js.gz   1.89 KiB              [emitted]                     
        9.e9d3997237a507a37f97.js   7.41 KiB           9  [emitted] [immutable]         
     9.e9d3997237a507a37f97.js.gz   3.29 KiB              [emitted]                     
    admin.e9d3997237a507a37f97.js    338 KiB           1  [emitted] [immutable]  [big]  admin
 admin.e9d3997237a507a37f97.js.gz    106 KiB              [emitted]                     
                 admin/index.html   2.17 KiB              [emitted]                     
              admin/index.html.gz  859 bytes              [emitted]                     
                      favicon.ico   1.12 KiB              [emitted]                     
                   favicon.ico.gz  220 bytes              [emitted]                     
                       index.html   2.26 KiB              [emitted]                     
                    index.html.gz  911 bytes              [emitted]                     
           locales/en/common.json  410 bytes              [emitted]                     
        locales/en/common.json.gz  200 bytes              [emitted]                     
           locales/fr/common.json  314 bytes              [emitted]                     
        locales/fr/common.json.gz  207 bytes              [emitted]                     
           locales/it/common.json  175 bytes              [emitted]                     
        locales/it/common.json.gz  138 bytes              [emitted]                     
    micro.e9d3997237a507a37f97.js    318 KiB           2  [emitted] [immutable]  [big]  micro
 micro.e9d3997237a507a37f97.js.gz    101 KiB              [emitted]                     
   public.e9d3997237a507a37f97.js    338 KiB           3  [emitted] [immutable]  [big]  public
public.e9d3997237a507a37f97.js.gz    106 KiB              [emitted]                     
                public/index.html   2.26 KiB              [emitted]                     
             public/index.html.gz  912 bytes              [emitted]                     
     user.e9d3997237a507a37f97.js    339 KiB           4  [emitted] [immutable]  [big]  user
  user.e9d3997237a507a37f97.js.gz    106 KiB              [emitted]                     
                  user/index.html   2.26 KiB              [emitted]                     
               user/index.html.gz  911 bytes              [emitted]                     
Entrypoint micro [big] = micro.e9d3997237a507a37f97.js
Entrypoint public [big] = public.e9d3997237a507a37f97.js
Entrypoint user [big] = user.e9d3997237a507a37f97.js
Entrypoint admin [big] = admin.e9d3997237a507a37f97.js
```

To find out exactly the weight of each individual library, the tool [https://github.com/webpack-contrib/webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) creates a report displaying the size and the relative percentage of the dependencies.

