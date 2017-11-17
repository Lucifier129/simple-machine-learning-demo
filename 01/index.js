(function() {
  var canvas = document.getElementById("coordinate");
  canvas.width = Math.min(window.screen.width - 20, 500);

  var coordinate = new Coordinate(canvas);
  var interval = canvas.width / 10; // 坐标间隔
  coordinate.setOrigin(0, canvas.height / 2);
  coordinate.setOptions("axis", {
    max: [10],
    interval: interval
  });

  function generate_random_numbers_around_target_number(target, amount, range) {
    var numbers = [];
    for (var i = 0; i < amount; i++) {
      var number = target + range * (Math.random() - 0.5);
      numbers.push(number);
    }
    return numbers;
  }

  var target = 9 * Math.random();
  var numbers = generate_random_numbers_around_target_number(target, 50, 2);
  var model = 10 * Math.random();
  var learningRate = 0.01;
  var dataIndex = 0;

  function learning(output, labeled) {
    /**
         * Error = 1 / 2 * Math.pow(labeled - output, 2)
         * dE = labeled - output
        */
    var dE = labeled - output;
    /**
         * y = target - x
         * x = target - y
         * dX = -1
         */
    var dX = -1;
    var gradient = dE / dX;
    var nextModel = model + learningRate * -gradient;
    return nextModel;
  }

  function training() {
    var index = dataIndex++;
    dataIndex = dataIndex >= numbers.length ? 0 : dataIndex;
    model = learning(model, numbers[dataIndex++]);
  }

  function handleClick(event) {
    var origin = coordinate.getOrigin();
    var clientRect = canvas.getBoundingClientRect();
    target = (event.clientX - clientRect.left - origin.x) / interval;
    numbers = generate_random_numbers_around_target_number(target, 50, 2);
  }

  // set custom training data
  canvas.addEventListener("click", handleClick);

  function drawing() {
    coordinate.clear();

    // draw axis
    coordinate.drawAxis();

    // 将生成的随机数字，映射成坐标
    var dots = numbers.map(function(number) {
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
