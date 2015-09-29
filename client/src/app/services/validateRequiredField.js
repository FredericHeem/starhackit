import Checkit from 'checkit';

export default class {

    constructor( fieldName, value ) {
        this.fieldName = fieldName;
        this.value = value;
    }

    execute() {
        let rules = new Checkit( {
            [this.fieldName]: [ 'required' ]
        } );

        return rules.run( {
            [ this.fieldName ]: this.value
        } );
    }
}