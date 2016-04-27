export default function(rest){
  return {
      getAll(data) {
          return rest.get(`users/`, {params: data});
      }
  }
};
