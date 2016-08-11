(() => {
  String.lowers = Array.from('abcdefghijklmnopqrstuvwxyz');
  String.uppers = String.lowers.map(c => c.toUpperCase());
  String.numbers = _.range(10).map(i => i.toString());

  Array.prototype.sum = function () {
    return this.reduce((a, b) => a + b);
  }

  new Vue({
    el: '#passgen',
    data: {
      keysentence: '',
      keysentence2: '',
      salt: '',
      len: 16,
      lower: true,
      upper: true,
      number: true
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
      password() {
        const charset = this.charset;
        const len = this.len || 16;
        const pass64 = sha256(this.keysentence + this.keysentence2 + this.salt);
        const proportion = parseInt(64 / len);
        const codes = Array.from(pass64).map(c => parseInt(c, 16)).slice(0, len * proportion);
        const pass = _.chunk(codes, proportion)
                      .map(a => (a.map((e, idx) => Math.pow(16, idx) * e).sum()))
                      .map(v => charset[v % charset.length])
                      .join('');

        return pass;
      }
    }
  });
})();
