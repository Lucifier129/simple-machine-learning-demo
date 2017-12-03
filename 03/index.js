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
