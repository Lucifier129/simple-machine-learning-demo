(function() {
  window.Perceptron = Perceptron;

  // 感知机算法
  function Perceptron(total, learningRate) {
    this.weights = [];
    this.bias = 0;
    this.learningRate = learningRate || 0.01;
    this.setTotal(total);
    this.compute = this.compute.bind(this)
    this.computeLinear = this.computeLinear.bind(this)
  }

  Perceptron.prototype.setTotal = function(total) {
    this.weights.length = 0;
    for (var i = 0; i < total; i++) {
      this.weights.push(0);
    }
  };

  Perceptron.prototype.compute = function(inputs) {
    var sum = 0;
    for (var i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    return sum + this.bias;
  };

  Perceptron.prototype.computeLinear = function(x) {
      return this.compute([x, 0])
  }

  Perceptron.prototype.computeGradient = function(inputs, target) {
    var weights = this.weights;
    var output = this.compute(inputs);
    var dE_dY = (target - output) * -1;
    var gradient = {
      weights: [],
      bias: dE_dY * 1
    };

    for (var i = 0; i < weights.length; i++) {
      var dY_dW = inputs[i];
      var dE_dW = dE_dY * dY_dW;
      gradient.weights.push(dE_dW);
    }

    return gradient;
  };

  Perceptron.prototype.training = function(inputs, target) {
    var gradient = this.computeGradient(inputs, target)
    this.learning(gradient)
  }

  Perceptron.prototype.mergeGradient = function(
    gradientTarget,
    gradientSource
  ) {
    for (var i = 0; i < gradientSource.weights.length; i++) {
      if (typeof gradientTarget.weights[i] === 'undefined') {
        gradientTarget.weights[i] = 0
      }
      gradientTarget.weights[i] += gradientSource.weights[i];
    }
    gradientTarget.bias += gradientSource.bias;
  };

  Perceptron.prototype.batchTraining = function(list, target) {
    var gradientTotal = {
      weights: [],
      bias: 0
    };

    for (var i = 0; i < list.length; i++) {
      var gradientItem = this.computeGradient(list[i], target);
      this.mergeGradient(gradientTotal, gradientItem);
    }

    this.learning(gradientTotal);
  };

  Perceptron.prototype.learning = function(gradient) {
    for (var i = 0; i < this.weights.length; i++) {
      this.weights[i] += this.learningRate * -gradient.weights[i];
    }
    this.bias += this.learningRate * -gradient.bias;
  };
})();
