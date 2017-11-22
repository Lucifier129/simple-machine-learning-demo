(function() {
  var canvas = document.getElementById("coordinate");
  canvas.width = canvas.height = Math.min(window.screen.width - 20, 500);

  var coordinate = new Coordinate(canvas);
  var interval = canvas.width / 10; // 坐标间隔
  coordinate.setOrigin(0, canvas.height / 2);
  coordinate.setOptions("axis", {
    max: [10],
    interval: interval
  });

  function generateTrainingData(target, amount, range) {
    var trainingData = [];
    for (var i = 0; i < amount; i++) {
      trainingData.push(target + range * (Math.random() - 0.5));
    }
    return trainingData;
  }

  var target = 9 * Math.random();
  var trainingData = generateTrainingData(target, 50, 2);
  var model = 10 * Math.random();
  var learningRate = 0.01;
  var dataIndex = 0;

  function learning(output, labeled) {
    var dE_dY = (labeled - output) * -1;
    var dY_dW = 1;
    var gradient = dE_dY * dY_dW;
    var nextModel = model + learningRate * -gradient;
    return nextModel;
  }

  function training() {
    var index = dataIndex++;
    dataIndex = dataIndex >= trainingData.length ? 0 : dataIndex;
    model = learning(model, trainingData[dataIndex++]);
  }

  function handleClick(event) {
    var origin = coordinate.getOrigin();
    var clientRect = canvas.getBoundingClientRect();
    target = (event.clientX - clientRect.left - origin.x) / interval;
    trainingData = generateTrainingData(target, 50, 2);
  }

  // set custom training data
  canvas.addEventListener("click", handleClick);

  function drawing() {
    coordinate.clearWithTrailingEffect();

    // draw axis
    coordinate.drawAxis();

    // 将生成的随机数字，映射成坐标
    var dots = trainingData.map(function(number) {
      return {
        x: number,
        y: 0
      };
    });

    // draw traning data
    coordinate.drawDots(dots, {
      type: "stroke",
      color: "#333",
      radius: 2
    });

    // draw model
    coordinate.drawDot(
      {
        x: model,
        y: 0
      },
      {
        type: "fill",
        color: "red"
      }
    );

    // training
    training();
    requestAnimationFrame(drawing);
  }

  drawing();
})();
