(function() {
  window.Perceptron = Perceptron;

  // 感知机算法
  function Perceptron(total, learningRate) {
    this.weights = [];
    this.bias = 0;
    this.learningRate = learningRate || 0.01;
    this.setTotal(total);
    this.compute = this.compute.bind(this);
    this.computeLinear = this.computeLinear.bind(this);
  }

  Perceptron.prototype.setTotal = function(total) {
    this.weights.length = 0;
    for (var i = 0; i < total; i++) {
      this.weights.push(0);
    }
  };

  Perceptron.prototype.sum = function(inputs) {
    var sum = this.bias;
    for (var i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    return sum;
  };

  Perceptron.prototype.activation = function(value) {
    return value >= 0 ? 1 : -1;
  };

  Perceptron.prototype.compute = function(inputs) {
    return this.activation(this.sum(inputs));
  };

  Perceptron.prototype.computeLinear = function(x) {
    var point1 = {
      x: 0,
      y: -this.bias / this.weights[1]
    }
    var point2 = {
      x: -this.bias / this.weights[0],
      y: 0
    }
    var bias = point1.y - point2.y;
    var slope = (point1.y - point2.y) / (point1.x - point2.x)
    return slope * x + bias;
  };

  Perceptron.prototype.training = function(inputs, target) {
    var output = this.compute(inputs);
    var gradient = (target - output) * -1;
    for (var i = 0; i < this.weights.length; i++) {
      this.weights[i] += this.learningRate * inputs[i] * -gradient;
    }
    this.bias += this.learningRate * -gradient;
  };

  Perceptron.prototype.test = function(list) {
    var correct = 0;
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var output = this.compute(item.inputs);
      if (output === item.target) {
        correct += 1;
      }
    }
    return correct / list.length * 100 + "%";
  };
})();
