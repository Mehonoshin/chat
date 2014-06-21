exports.repository = function Repository() {

  this.initialColors = [
    'red', 'green', 'blue', 'magenta',
    'purple', 'plum', 'orange'
  ];
  this.usedColors = [];

  this.initialColors.sort(function(a, b) {
    return Math.random() > 0.5;
  });


  this.getColor = function() {
    var color = this.initialColors.shift();
    this.usedColors.push(color);
    return color;
  }

  this.returnColor = function(color) {
    var index = this.usedColors.indexOf(color);
    this.usedColors.splice(index, 1);
    console.log(this.usedColors);
  }

}


