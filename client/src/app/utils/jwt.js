export default function(store) {
    return {
        selector() {
            return () => store.getState().auth.auth.token
        }
    }
}
