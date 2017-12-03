(function() {
  window.Linear = Linear;

  // 线性回归
  function Linear(a, b, learningRate) {
    this.a = typeof a === "number" ? a : 1;
    this.b = typeof b === "number" ? b : 0;
    this.learningRate = learningRate || 0.02
    this.compute = this.compute.bind(this);
  }

  Linear.prototype.compute = function(x) {
    return this.a * x + this.b;
  };

  Linear.prototype.computeWithRandom = function(x, range) {
    return this.compute(x) + getRandomNumber(range);
  };

  Linear.prototype.computeGradient = function(input, target) {
    var output = this.compute(input)
    var dE_dY = (target - output) * -1;
    var dY_dA = input;
    var dY_dB = 1;
    var gradient = {
        a: dE_dY * dY_dA,
        b: dE_dY * dY_dB
    }
    return gradient
  }

  Linear.prototype.batchTraining = function(list) {
    var gradientA = 0;
    var gradientB = 0;

    for (var i = 0; i < list.length; i++) {
      var data = list[i];
      var input = data.x;
      var target = data.y;
      var gradient = this.computeGradient(data.x, data.y)
      gradientA += gradient.a;
      gradientB += gradient.b;
    }

    gradientA = gradientA / list.length;
    gradientB = gradientB / list.length;

    if (Math.abs(gradientA) < 0.00001 && Math.abs(gradientB) < 0.00001) {
      return;
    }

    gradientA = gradientA > 50 ? 50 : gradientA
    gradientB = gradientB > 50 ? 50 : gradientB

    var learningRate = this.learningRate
    this.a += learningRate * -gradientA;
    this.b += learningRate * -gradientB;
  };

  function getRandomNumber(range) {
    return range * 2 * (Math.random() - 0.5);
  }
})();
