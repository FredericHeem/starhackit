import App from '../app';

console.log('Seeding');
let app = App();
app.seed()
.then( () => console.log('Seeded'))
.catch( error => console.error(error));
