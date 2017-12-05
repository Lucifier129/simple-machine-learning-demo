(function() {
  var canvas = document.getElementById("coordinate");
  canvas.width = canvas.height = Math.min(window.screen.width - 20, 500);

  var coordinate = new Coordinate(canvas);
  var interval = canvas.width / 30; // 坐标间隔
  coordinate.setOptions("axis", {
    max: 15,
    interval: interval
  });

  function getRandomNumber(range) {
    return range * 2 * (Math.random() - 0.5);
  }

  // 生成不均衡的两类点
  function generateTrainingData() {
    var linear = new Linear(getRandomNumber(5), getRandomNumber(10));
    var data = [[], []];
    var getDot = function(i) {
      var x = i + getRandomNumber(20);
      var y = linear.compute(x)
      
      if (Math.random() > 0.7) {
        var range = 0.5 + Math.abs(getRandomNumber(20))
        y += range
        data[1].push({ x: x, y: y })
      } else {
        if (Math.random() > 0.9) {
          var range = 0.5 + Math.abs(getRandomNumber(5))
          y -= range
          data[0].push({ x: x, y: y })
        }
      }
    }
    for (var i = -15; i < 15; i += 0.05) {
      if (Math.random() > 0.7) {
        // 取 70% 的点
        continue;
      }
      if (Math.abs(i) < 0.0001) {
        // 避开临近 0 点的值，容易梯度爆炸
        continue;
      }
      
      for (var ii = 0; ii < 5; ii += 1) {
        getDot(i)
      }

    }
    return data;
  }

  var trainingData = generateTrainingData();
  var perceptron = new Perceptron(2, 0.01);

  function handleClick(event) {
    trainingData = generateTrainingData()
  }

  // set custom training data
  canvas.addEventListener("click", handleClick);

  function drawing() {
    coordinate.clearWithTrailingEffect();

    // draw axis
    coordinate.drawAxis();

    // draw traning data
    coordinate.drawDots(trainingData[0], {
      type: "stroke",
      color: "brown",
      radius: 2
    });
    coordinate.drawDots(trainingData[1], {
      type: "stroke",
      color: "green",
      radius: 2
    });

    coordinate.drawLineByFunction(perceptron.computeLinear, {
      color: "red"
    });

    var batches = 20;
    for (var i = 0; i < batches; i++) {
      var randomIndexA = Math.floor(trainingData[0].length * Math.random());
      var randomIndexB = Math.floor(trainingData[1].length * Math.random());
      var dotA = coor2Array(trainingData[0][randomIndexA]);
      var dotB = coor2Array(trainingData[1][randomIndexB]);

      perceptron.training(dotA, 1);
      perceptron.training(dotB, 0);
    }

    requestAnimationFrame(drawing);
  }

  function coor2Array(coor) {
    return [coor.x, coor.y];
  }

  drawing();
})();
