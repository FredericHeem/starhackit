export default function(rest){
  return {
    get() {
        return rest.get('me');
    },
    update(payload) {
        return rest.update('me', payload);
    }
  }
};
