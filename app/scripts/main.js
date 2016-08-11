(() => {
  new Vue({
    el: '#passgen',
    data: {
      keysentence: '',
      salt: ''
    },
    computed: {
      password() {
        return this.keysentence + this.salt;
      }
    }
  })
})();
