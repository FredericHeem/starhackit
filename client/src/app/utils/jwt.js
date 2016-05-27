export default function(store) {
    return {
        async loadJWT(parts) {
            let token = localStorage.getItem("JWT");
            if (token) {
                store.dispatch(parts.auth.actions.setToken(token))
            }
            return token;
        },
        selector() {
            return () => store.getState().auth.token
        }
    }
}
