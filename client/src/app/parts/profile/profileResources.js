export default function(rest){
  return {
    get() {
        return rest.get('profile');
    },
    update(payload) {
        return rest.update('profile', payload);
    }
  }
};
