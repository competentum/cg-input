export default {
  number: {
    restrict: '[0-9\-\.]+',
    formatter: function(v){
      return v;
    },
    unformatter: function(v){
      v = parseFloat(v);
      v = isNaN(v) ? '' : v;

      return v;
    }
  },
  text: {
    restrict: '.',
    formatter: function(v){
      return v;
    },
    unformatter: function(v){
      return v;
    }
  },
  percent: {
    restrict: '^-?[0-9]+',
    formatter: function(v){
      return v + '%';
    },
    unformatter: function(v){
      v = v.replace(/%/g, '');
      v = parseInt(v, 10);
      v = isNaN(v) ? '' : v;

      return v;
    }
  }
};