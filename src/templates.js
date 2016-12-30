export default {
  number: {
    restrict: '[0-9\-\.]+',
    formatter: function(v){
      return v;
    },
    unformatter: function(v){
      return Number(v);
    },
    validate: function(v){
      return !isNaN(Number(v));
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
    restrict: '[0-9\-\.%]+',
    formatter: function(v){
      return v.toFixed(2) + '%';
    },
    unformatter: function(v){
      return Number(v.replace(/%/g, ''));
    },
    validate: function(v){
      return !isNaN(Number(v));
    }
  },
  negative: {
    restrict: '[0-9\(\)\-\.]+',
    formatter: function(v){
      return v < 0 ? '(' + -v + ')' : v;
    },
    unformatter: function(v){
      if((v.match(/[\(\)]/g) || []).length > 1){
        return -Number(v.replace(/[\(\)]/g, ''));
      }

      return Number(v);
    },
    validate: function(v){
      return !isNaN(Number(v));
    }
  }
};