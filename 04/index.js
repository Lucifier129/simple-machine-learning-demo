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
  var perceptron = new Perceptron(2, 0.01);

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
      color: "yellow",
      radius: 2
    });
    coordinate.drawDots(trainingData[1], {
      type: "stroke",
      color: "green",
      radius: 2
    });

    // coordinate.drawLineByFunction(linear.compute, {
    //   color: "green"
    // });

    coordinate.drawLineByFunction(perceptron.computeLinear, {
      color: "red"
    });

    // linear.batchTraining(
    //   trainingData[0]
    //     .concat(trainingData[1])
    //     // .sort(function() {
    //     //   return Math.random() - 0.5;
    //     // })
    //     // .slice(0, 50)
    // );

    for (var i = 0; i < 20; i++) {
      var dotA = trainingData[0].map(coor2Array)[Math.floor(trainingData[0].length * Math.random())]
      var dotB = trainingData[1].map(coor2Array)[Math.floor(trainingData[1].length * Math.random())]
  
      perceptron.training(dotA, 1)
      perceptron.training(dotB, -1)
    }

    var toObj = function(target) {
      return function(inputs) {
        return {
          inputs: inputs,
          target: target,
        }
      }
    }
    var listA = trainingData[0].map(coor2Array).map(toObj(1))
    var listB = trainingData[1].map(coor2Array).map(toObj(-1))
    var result = perceptron.test(listA.concat(listB))

    console.log(result)

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
