(function() {
  var canvas = document.getElementById("coordinate");
  canvas.width = canvas.height = Math.min(window.screen.width - 20, 500);

  var coordinate = new Coordinate(canvas);
  var interval = canvas.width / 30; // 坐标间隔
  coordinate.setOptions("axis", {
    max: 15,
    interval: interval
  });

  function Linear(a, b) {
    this.a = typeof a === "number" ? a : 1;
    this.b = typeof b === "number" ? b : 0;
    this.compute = this.compute.bind(this);
  }

  Linear.prototype.update = function(a, b) {
    if (typeof a === "number") {
      this.a = a;
    }
    if (typeof b === "number") {
      this.b = b;
    }
  };

  Linear.prototype.compute = function(x) {
    return this.a * x + this.b;
  };

  Linear.prototype.computeWithRandom = function(x, range) {
    return this.compute(x) + getRandomNumber(range);
  };

  Linear.prototype.batchTraining = function(list) {
    var gradientA = 0;
    var gradientB = 0;

    for (var i = 0; i < list.length; i++) {
      var data = list[i];
      var input = data.x
      var target = data.y
      var output = this.compute(input);
      var dE_dY = (target - output) * -1;
      var dY_dA = input;
      var dY_dB = 1;

      gradientA += dE_dY * dY_dA;
      gradientB += dE_dY * dY_dB;
    }

    gradientA = gradientA / list.length;
    gradientB = gradientB / list.length;

    if (Math.abs(gradientA) < 0.00001 && Math.abs(gradientB) < 0.00001) {
      return;
    }

    var learningRate = 0.02;
    this.a += learningRate * -gradientA;
    this.b += learningRate * -gradientB;
  };

  function getRandomNumber(range) {
    return range * 2 * (Math.random() - 0.5);
  }

  function generateTrainingData() {
    var linear = new Linear(getRandomNumber(5), getRandomNumber(10));
    var data = [];
    for (var i = -15; i < 15; i += 0.05) {
      if (Math.random() > 0.7) {
        // 取 70% 的点
        continue;
      }
      if (Math.abs(i) < 0.0001) {
        // 避开临近 0 点的值，容易梯度爆炸
        continue;
      }
      var x = i + getRandomNumber(2);
      var y = linear.computeWithRandom(x, getRandomNumber(3));
      data.push({
        x: x,
        y: y
      });
    }
    return data;
  }

  var trainingData = generateTrainingData();
  var linear = new Linear(1, 0);

  function handleClick(event) {
    trainingData = generateTrainingData();
  }

  // set custom training data
  canvas.addEventListener("click", handleClick);

  function drawing() {
    coordinate.clearWithTrailingEffect();

    // draw axis
    coordinate.drawAxis();

    // draw traning data
    coordinate.drawDots(trainingData, {
      type: "stroke",
      color: "#333",
      radius: 2
    });

    coordinate.drawLineByFunction(linear.compute, {
      color: "red"
    });

    linear.batchTraining(trainingData);
    requestAnimationFrame(drawing);
  }

  drawing();
})();
