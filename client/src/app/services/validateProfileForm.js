import Checkit from 'checkit';

export default class {

    constructor( payload ) {
        this.payload = payload;
    }

    execute() {
        let rules = new Checkit( {
            username: [ 'required', 'minLength:3', 'maxLength:64' ]
        } );

        return rules.run( this.payload );
    }
}
