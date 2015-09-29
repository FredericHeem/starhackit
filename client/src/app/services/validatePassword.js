import Checkit from 'checkit';

export default class {

    constructor( password ) {
        this.password = password;
    }

    execute() {
        let rules = new Checkit( {
            password: [ 'required', 'alphaDash', 'minLength:6', 'maxLength:20' ]
        } );

        return rules.run( {
            password: this.password
        } );
    }
}