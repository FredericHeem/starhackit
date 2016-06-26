
export default {
    username: [ 'required', 'alphaDash', 'minLength:3', 'maxLength:64'],
    password: [ 'required', 'alphaDash', 'minLength:6', 'maxLength:64' ],
    biography: [ 'minLength:0', 'maxLength:2000' ],
    email: [ 'email', 'required', 'minLength:3', 'maxLength:64' ]
}
