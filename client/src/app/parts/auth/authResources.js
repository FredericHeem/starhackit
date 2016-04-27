export default function(rest){
  return {
    me() {
        return rest.get('me');
    },
    register(payload) {
        return rest.post('auth/register', payload);
    },
    login(payload) {
        return rest.post('auth/login', payload);
    },
    logout() {
        return rest.post('auth/logout');
    },
    verifyEmailCode(payload) {
        return rest.post('auth/verify_email_code/', payload);
    },
    requestPasswordReset(payload) {
        return rest.post('auth/reset_password', payload);
    },
    verifyResetPasswordToken(payload) {
        return rest.post('auth/verify_reset_password_token', payload);
    }
  }
};
