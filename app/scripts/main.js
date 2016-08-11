(() => {
  new Vue({
    el: '#passgen',
    data: {
      keysentence: '',
      salt: ''
    },
    computed: {
      password() {
        return sha256(this.keysentence + this.salt);
      }
    }
  });
})();
