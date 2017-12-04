(function() {
  window.Perceptron = Perceptron;

  // 感知机算法
  function Perceptron(total, learningRate) {
    this.weights = [];
    this.bias = Math.random();
    this.learningRate = learningRate || 0.01;
    this.setTotal(total);
    this.compute = this.compute.bind(this);
    this.computeLinear = this.computeLinear.bind(this);
  }

  Perceptron.prototype.setTotal = function(total) {
    this.weights.length = 0;
    for (var i = 0; i < total; i++) {
      this.weights.push(Math.random());
    }
  };

  Perceptron.prototype.compute = function(inputs) {
    var sum = this.bias;
    for (var i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    return sum;
  };

  Perceptron.prototype.computeLinear = function(x) {
    return this.compute([x]);
  };

  Perceptron.prototype.computeGradient = function(inputs, target) {
    var weights = this.weights;
    var output = this.compute(inputs);
    var dE_dY = (target - output) * -1;
    var dY_dB = 1;
    var gradient = {
      weights: [],
      bias: dE_dY * dY_dB
    };

    for (var i = 0; i < inputs.length; i++) {
      var dY_dW = inputs[i];
      var dE_dW = dE_dY * dY_dW;
      gradient.weights.push(dE_dW);
    }

    return gradient;
  };

  Perceptron.prototype.training = function(inputs, target) {
    var output = this.compute([inputs[0]]);
    if (output * target <= 0) {
      for (var i = 0; i < this.weights.length; i++) {
        this.weights[i] += this.learningRate * inputs[0] * inputs[1];
      }
      this.bias += this.learningRate * inputs[1];
    }
  };

  Perceptron.prototype.mergeGradient = function(
    gradientTarget,
    gradientSource
  ) {
    for (var i = 0; i < gradientSource.weights.length; i++) {
      if (typeof gradientTarget.weights[i] === "undefined") {
        gradientTarget.weights[i] = 0;
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

  Perceptron.prototype.test = function(list) {
    var correct = 0
    for (var i = 0; i < list.length; i++) {
      var output = this.compute(list[i].inputs)
      if (output > 0 && list[i].target === 1 || output < 0 && list[i].target === 0) {
        correct += 1
      }
    }
    return correct / list.length * 100 + '%'
  }

})();
