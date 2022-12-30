(function() {
  var canvas = document.getElementById("coordinate");
  canvas.width = canvas.height = Math.min(window.screen.width - 20, 500);

  var coordinate = new Coordinate(canvas);
  var interval = canvas.width / 20; // 坐标间隔
  coordinate.setOptions("axis", {
    max: 10,
    interval: interval
  });

  function generateTrainingData(target, amount, range) {
    var data = [];
    for (var i = 0; i < amount; i++) {
      var x = target.x + range * 2 * (Math.random() - 0.5);
      var y = target.y + range * 2 * (Math.random() - 0.5);
      data.push({
        x: x,
        y: y
      });
    }
    return data;
  }

  var target = {
    x: 9 * 2 * (0.5 - Math.random()),
    y: 9 * 2 * (0.5 - Math.random())
  };
  var trainingData = generateTrainingData(target, 200, 3);
  var model = {
    x: 10 * 2 * (0.5 - Math.random()),
    y: 10 * 2 * (0.5 - Math.random())
  };
  var learningRate = 0.01;
  var dataIndex = 0;

  function learning(output, labeled) {
    var dE_dX = (labeled.x - output.x) * -1;
    var dE_dY = (labeled.y - output.y) * -1;
    var gradientX = dE_dX;
    var gradientY = dE_dY;
    model.x += learningRate * -gradientX;
    model.y += learningRate * -gradientY;
    return model;
  }

  function training() {
    var index = dataIndex++;
    dataIndex = dataIndex >= trainingData.length ? 0 : dataIndex;
    model = learning(model, trainingData[dataIndex]);
  }

  function handleClick(event) {
    var origin = coordinate.getOrigin();
    var clientRect = canvas.getBoundingClientRect();
    target = {
      x: (event.clientX - clientRect.left - origin.x) / interval,
      y: -(event.clientY - clientRect.top - origin.y) / interval
    };
    trainingData = generateTrainingData(target, 200, 3);
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

    // draw model
    coordinate.drawDot(model, {
      type: "fill",
      color: "red"
    });

    // training
    training();
    requestAnimationFrame(drawing);
  }

  drawing();
})();
