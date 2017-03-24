(() => {
  String.lowers = Array.from('abcdefghijklmnopqrstuvwxyz');
  String.uppers = String.lowers.map(c => c.toUpperCase());
  String.numbers = _.range(10).map(i => i.toString());

  Array.prototype.sum = function () {
    return this.reduce((a, b) => a + b);
  }

  const update_password = function () {
    const charset = this.charset;
    const len = this.len || 16;
    const pass64 = sha256(this.keysentence + this.salt);
    const proportion = parseInt(64 / len);
    const codes = Array.from(pass64).map(c => parseInt(c, 16)).slice(0, len * proportion);
    const pass = _.chunk(codes, proportion)
                  .map(a => (a.map((e, idx) => Math.pow(16, idx) * e).sum()))
                  .map(v => charset[v % charset.length])
                  .join('');

    this.password = pass;
  };

  new Vue({
    el: '#passgen',
    data: {
      keysentence: '',
      salt: '',
      len: 16,
      lower: true,
      upper: true,
      number: true,
      password: '',
    },
    computed: {
      charset() {
        let s = [];
        if (this.lower) {
          s = s.concat(String.lowers);
        }

        if (this.upper) {
          s = s.concat(String.uppers);
        }

        if (this.number) {
          s = s.concat(String.numbers);
        }

        return s;
      },
    },
    watch: {
      keysentence: update_password,
      salt: update_password,
      len: update_password,
      lower: update_password,
      upper: update_password,
      number: update_password,
    }
  });
})();
