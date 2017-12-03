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

  function generateTrainingData(amount, range) {
    var target = {
      x: getRandomNumber(15),
      y: getRandomNumber(15)
    };
    var data = [];
    for (var i = 0; i < amount; i++) {
      var x = target.x + getRandomNumber(range);
      var y = target.y + getRandomNumber(range);
      data.push({
        x: x,
        y: y
      });
    }
    return data;
  }

  var trainingData = [
    generateTrainingData(200, 3),
    generateTrainingData(200, 3)
  ];
  var linear = new Linear(1, 0, 0.02);
  var perceptron = new Perceptron(2, 0.0001);

  function handleClick(event) {
    trainingData = [generateTrainingData(200, 3), generateTrainingData(200, 3)];
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
      color: "red",
      radius: 2
    });
    coordinate.drawDots(trainingData[1], {
      type: "stroke",
      color: "blue",
      radius: 2
    });

    // coordinate.drawLineByFunction(linear.compute, {
    //   color: "green"
    // });

    coordinate.drawLineByFunction(perceptron.computeLinear, {
      color: "#00fddf"
    });

    // linear.batchTraining(
    //   trainingData[0]
    //     .concat(trainingData[1])
    //     // .sort(function() {
    //     //   return Math.random() - 0.5;
    //     // })
    //     // .slice(0, 50)
    // );
    perceptron.batchTraining(shuffle(trainingData[0].map(coor2Array)).slice(0, 50), 0);
    perceptron.batchTraining(shuffle(trainingData[1].map(coor2Array)).slice(0, 50), 1);
    requestAnimationFrame(drawing);
  }

  function coor2Array(coor) {
    return [coor.x, coor.y];
  }

  function shuffle(list) {
    return list.sort(function() {
      return Math.random() - 0.5
    })
  }

  drawing();
})();
