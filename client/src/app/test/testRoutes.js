export default {
    path: 'test',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./testHome').default)
        })
    }
}
