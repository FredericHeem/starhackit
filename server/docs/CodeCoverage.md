## Code Coverage
To generate the code coverage report:

    # npm test

It will not only test the code, but also checks the source code with eslint and generates a code coverage report located at `coverage/lcov-report/index.html`

```
  85 passing (10s)
  22 pending

----------------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------------------------
File                              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                                                  
----------------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------------------------
All files                         |   81.97 |     62.9 |   83.27 |   82.37 |                                                                                                    
 src                              |     100 |      100 |     100 |     100 |                                                                                                    
  app.js                          |     100 |      100 |     100 |     100 |                                                                                                    
 src/models                       |   97.96 |     87.5 |     100 |   97.96 |                                                                                                    
  Data.js                         |   97.96 |     87.5 |     100 |   97.96 | 96                                                                                                 
 src/plugins                      |     100 |      100 |     100 |     100 |                                                                                                    
  index.js                        |     100 |      100 |     100 |     100 |                                                                                                    
 src/plugins/dbSchema             |   93.33 |      100 |     100 |   93.33 |                                                                                                    
  PgSchema.js                     |     100 |      100 |     100 |     100 |                                                                                                    
  index.js                        |   89.47 |      100 |     100 |   89.47 | 18,19                                                                                              
 src/plugins/dbSchema/sql         |     100 |      100 |     100 |     100 |                                                                                                    
  index.js                        |     100 |      100 |     100 |     100 |                                                                                                    
 src/plugins/document             |   86.67 |     62.5 |   81.82 |    90.7 |                                                                                                    
  DocumentModel.js                |     100 |      100 |     100 |     100 |                                                                                                    
  index.js                        |   84.62 |     62.5 |   77.78 |   89.19 | 26,29,30,52                                                                                        
 src/plugins/expoPush             |   89.19 |       50 |   83.33 |   91.18 |                                                                                                    
  PushTokenApi.js                 |    87.5 |      100 |   66.67 |    87.5 | 14                                                                                                 
  PushTokenModel.js               |     100 |      100 |     100 |     100 |                                                                                                    
  index.js                        |      90 |      100 |      80 |     100 |                                                                                                    
  sendNotification.js             |   84.62 |       50 |     100 |   83.33 | 9,10                                                                                               
 src/plugins/ticket               |     100 |      100 |     100 |     100 |                                                                                                    
  TicketModel.js                  |     100 |      100 |     100 |     100 |                                                                                                    
  index.js                        |     100 |      100 |     100 |     100 |                                                                                                    
 src/plugins/users                |    74.6 |     62.5 |      75 |   73.77 |                                                                                                    
  PassportAuth.js                 |      52 |       50 |   33.33 |      52 | 16-18,20,24-26,28,32,34,38,40                                                                      
  index.js                        |   89.47 |       75 |   88.89 |   88.89 | 37,56-58                                                                                           
 src/plugins/users/auth-strategy  |   15.38 |       10 |       8 |   15.93 |                                                                                                    
  FacebookStrategy.js             |       0 |        0 |       0 |       0 | 1,4,7,8,10,12,17,30,48-50,58,59,61,63,66,69-72,88-90,95,97,101,106,137,138                         
  GoogleStrategy.js               |       0 |        0 |       0 |       0 | 1,2,5,7,8,10,12,17,31,51,52,59,60,62,64,68-70,76-78,83,85,88,93,98,104,112,113,118,120,121,128-130 
  JwtStrategy.js                  |   86.67 |       50 |     100 |   86.67 | 22,23                                                                                              
  StrategyUtils.js                |   14.71 |        0 |       0 |   14.71 | 12,13,20-22,24,28,36,37,39-41,44-46,50-52,54-56,58,70,72-75,77,78                                  
 src/plugins/users/authentication |   85.81 |    62.16 |   69.57 |   86.39 |                                                                                                    
  AuthenticationApi.js            |   98.48 |    92.86 |     100 |   98.48 | 96                                                                                                 
  AuthenticationRouter.js         |   75.61 |    43.48 |   58.82 |   76.54 | 11-14,16,21,22,28,29,33-36,38,42,43,137,143,149                                                    
 src/plugins/users/jobs/mail      |   70.83 |    41.67 |   90.91 |   70.42 |                                                                                                    
  MailJob.js                      |   70.83 |    41.67 |   90.91 |   70.42 | 24,35,36,40,41,45,46,72-74,76-78,89,90,96,97,102,104,105,122                                       
 src/plugins/users/me             |     100 |      100 |     100 |     100 |                                                                                                    
  MeRouter.js                     |     100 |      100 |     100 |     100 |                                                                                                    
 src/plugins/users/models         |   99.33 |    85.71 |     100 |   99.33 |                                                                                                    
  AuthProviderModel.js            |     100 |      100 |     100 |     100 |                                                                                                    
  GroupModel.js                   |     100 |      100 |     100 |     100 |                                                                                                    
  GroupPermissionModel.js         |     100 |      100 |     100 |     100 |                                                                                                    
  PasswordResetModel.js           |     100 |      100 |     100 |     100 |                                                                                                    
  PermissionModel.js              |     100 |      100 |     100 |     100 |                                                                                                    
  ProfileModel.js                 |     100 |      100 |     100 |     100 |                                                                                                    
  UserGroupModel.js               |     100 |      100 |     100 |     100 |                                                                                                    
  UserModel.js                    |   98.31 |       75 |     100 |   98.31 | 191                                                                                                
  UserPendingModel.js             |     100 |      100 |     100 |     100 |                                                                                                    
 src/plugins/users/models/utils   |   84.62 |    83.33 |     100 |   84.62 |                                                                                                    
  hashPasswordHook.js             |   84.62 |    83.33 |     100 |   84.62 | 12,13                                                                                              
 src/plugins/users/test           |   94.59 |       25 |     100 |   94.59 |                                                                                                    
  userUtils.js                    |   94.59 |       25 |     100 |   94.59 | 62,69                                                                                              
 src/plugins/users/user           |      90 |       75 |     100 |      90 |                                                                                                    
  UserRouter.js                   |      90 |       75 |     100 |      90 | 50,51                                                                                              
 src/plugins/version              |     100 |      100 |     100 |     100 |                                                                                                    
  index.js                        |     100 |      100 |     100 |     100 |                                                                                                    
 src/server/koa                   |   95.45 |       75 |     100 |   95.35 |                                                                                                    
  koaServer.js                    |   95.45 |       75 |     100 |   95.35 | 60,61                                                                                              
 src/server/koa/middleware        |   88.31 |    68.75 |     100 |   88.16 |                                                                                                    
  CorsMiddleware.js               |    87.5 |       50 |     100 |    87.5 | 12                                                                                                 
  LoggerMiddleware.js             |   90.91 |       50 |     100 |   90.91 | 4                                                                                                  
  PassportMiddleware.js           |   89.19 |     87.5 |     100 |   89.19 | 41-43,61                                                                                           
  SessionMiddleware.js            |   83.33 |       50 |     100 |   83.33 | 21,22                                                                                              
  StaticMiddleware.js             |   88.89 |       50 |     100 |    87.5 | 7                                                                                                  
 src/store                        |   78.95 |    54.55 |   69.23 |   78.95 |                                                                                                    
  Store.js                        |   78.95 |    54.55 |   69.23 |   78.95 | 8,16,17,27,51,55,56,64                                                                             
 src/test                         |    96.3 |    72.73 |   90.91 |    96.3 |                                                                                                    
  Client.js                       |    96.3 |    72.73 |   90.91 |    96.3 | 49                                                                                                 
 src/utils                        |   88.89 |    90.91 |     100 |   88.24 |                                                                                                    
  ApiUtils.js                     |     100 |      100 |     100 |     100 |                                                                                                    
  HttpUtils.js                    |   81.82 |    85.71 |     100 |   81.82 | 27-30                                                                                              
----------------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------------------------

=============================== Coverage summary ===============================
Statements   : 81.97% ( 914/1115 )
Branches     : 62.9% ( 117/186 )
Functions    : 83.27% ( 214/257 )
Lines        : 82.37% ( 902/1095 )
================================================================================

```