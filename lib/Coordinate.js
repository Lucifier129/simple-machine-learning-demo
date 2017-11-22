(function() {
  if (!Object.assign) {
    Object.assign = function(target) {
      for (var i = 1; i < arguments.length - 1; i++) {
        for (var key in arguments[i]) {
          target[key] = arguments[i][key];
        }
      }
      return target;
    };
  }

  window.Coordinate = Coordinate;

  var defaults = {
    origin: null, // 原点坐标，默认无，在运行时默认取 canvas 中点
    axis: {
      unit: [1, 1, 1, 1],
      color: ["blue", "blue", "blue", "blue"], // 四个子轴的颜色
      interval: [50, 50, 50, 50], // 每个单位所占的像素值
      max: [10, 10, 10, 10] // 最大单位数量
    },
    text: {
      font: "12px serif", // 文本样式
      color: "#333",
      offset: 14
    },
    dot: {
      radius: 3,
      color: "#333"
    },
    markHeight: 10 // 单位刻度的高度
  };

  // 坐标系
  function Coordinate(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.options = Object.assign({}, defaults);
  }

  // 设置 options 选项
  Coordinate.prototype.setOptions = function(type, options) {
    if (typeof type === "object") {
      Object.assign(this.options, type);
    } else {
      Object.assign(this.options[type], options);
    }
  };

  // 获取 canvas 的尺寸
  Coordinate.prototype.getSize = function() {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    };
  };

  Coordinate.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Coordinate.prototype.clearWithTrailingEffect = function() {
    this.ctx.save();
    this.ctx.fillStyle = "rgba(255,255,255,0.3)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  };

  // 获取坐标轴的原点
  Coordinate.prototype.getOrigin = function() {
    var options = this.options;

    if (options.origin) {
      return options.origin;
    }

    var size = this.getSize();
    var origin = {
      x: size.width / 2,
      y: size.height / 2
    };

    options.origin = origin;
    return origin;
  };

  // 设置坐标轴的原点
  Coordinate.prototype.setOrigin = function(x, y) {
    var origin = {
      x: x,
      y: y
    };
    this.setOptions({
      origin: origin
    });
  };

  var axisType2index = {
    x: 0,
    "-x": 1,
    y: 2,
    "-y": 3
  };

  // 获取坐标配置信息
  Coordinate.prototype.getAxis = function(type) {
    var options = this.options;
    var index = axisType2index[type];
    var axis = {};

    if (Array.isArray(options.axis.unit)) {
      axis.unit = options.axis.unit[index] || defaults.axis.unit[index];
    } else {
      axis.unit = options.axis.unit;
    }

    if (Array.isArray(options.axis.color)) {
      axis.color = options.axis.color[index] || defaults.axis.color[index];
    } else {
      axis.color = options.axis.color;
    }

    if (Array.isArray(options.axis.max)) {
      axis.max = options.axis.max[index] || 0;
    } else {
      axis.max = options.axis.max;
    }

    if (Array.isArray(options.axis.interval)) {
      axis.interval =
        options.axis.interval[index] || defaults.axis.interval[index];
    } else {
      axis.interval = options.axis.interval;
    }

    return axis;
  };

  Coordinate.prototype.goToOrigin = function() {
    var origin = this.getOrigin();
    this.ctx.translate(origin.x, origin.y);
  };

  // 绘制文本
  Coordinate.prototype.drawText = function(data) {
    var ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = data.color;
    ctx.font = data.font;
    ctx.textAlign = data.align || "center";
    ctx.fillText(data.text, data.x, data.y);
    ctx.restore();
  };

  // 绘制线段
  Coordinate.prototype.drawLine = function(data) {
    var ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(data.start[0], data.start[1]);
    ctx.lineTo(data.end[0], data.end[1]);
    ctx.strokeStyle = data.color;
    ctx.stroke();
    ctx.restore();
  };

  Coordinate.prototype.getPixelX = function(x) {
    var axis = this.getAxis(x >= 0 ? "x" : "-x");
    return x * axis.unit * axis.interval;
  };

  Coordinate.prototype.getPixelY = function(y) {
    var axis = this.getAxis(y >= 0 ? "y" : "-y");
    return -y * axis.unit * axis.interval;
  };

  // 绘制坐标点
  Coordinate.prototype.drawDot = function(data, settings) {
    var ctx = this.ctx;
    var options = this.options;
    var axis = null;

    ctx.save();
    this.goToOrigin();
    ctx.beginPath();

    var radius =
      settings && settings.radius ? settings.radius : options.dot.radius;
    var color = settings && settings.color ? settings.color : options.dot.color;
    var isStroke = settings && settings.type === "stroke";

    ctx.arc(
      this.getPixelX(data.x),
      this.getPixelY(data.y),
      radius,
      0,
      2 * Math.PI
    );

    if (isStroke) {
      ctx.strokeStyle = color;
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }

    ctx.restore();
  };

  // 绘制一组坐标点
  Coordinate.prototype.drawDots = function(list, options) {
    for (var i = 0; i < list.length; i++) {
      this.drawDot(list[i], options);
    }
  };

  // 根据给定线性函数，绘制一条直线
  Coordinate.prototype.drawLineByFunction = function(fn, options) {
    options = options || {};
    var ctx = this.ctx;
    var axisNegativeX = this.getAxis("-x");
    var axisX = this.getAxis("x");
    var startX = this.getPixelX(-axisNegativeX.max);
    var startY = this.getPixelY(fn(-axisNegativeX.max));
    var endX = this.getPixelX(axisX.max);
    var endY = this.getPixelY(fn(axisX.max));
    var data = Object.assign(
      {
        color: "#333"
      },
      options,
      {
        start: [startX, startY],
        end: [endX, endY]
      }
    );
    ctx.save();
    this.goToOrigin();
    this.drawLine(data);
    ctx.restore();
  };

  Coordinate.prototype.drawX = function(negative) {
    negative = typeof negative === "number" ? negative / Math.abs(negative) : 1;

    var ctx = this.ctx;
    var options = this.options;
    var type = negative === -1 ? "-x" : "x";
    var axis = this.getAxis(type);

    ctx.save();
    this.goToOrigin();

    this.drawLine({
      start: [0, 0],
      end: [axis.max * axis.unit * axis.interval * negative, 0],
      color: axis.color
    });

    for (var i = 0; i < axis.max; i++) {
      var number = i * axis.unit * negative;
      var x = number * axis.unit * axis.interval;
      var y = options.text.offset;

      // 刻度值
      this.drawText({
        text: number,
        x: x,
        y: y,
        color: options.text.color,
        font: options.text.font,
        align: i === 0 ? "left" : "center"
      });

      // 绘制刻度条
      this.drawLine({
        start: [x, 0],
        end: [x, -options.markHeight],
        color: axis.color
      });
    }

    ctx.restore();
  };

  Coordinate.prototype.drawY = function(negative) {
    negative = typeof negative === "number" ? negative / Math.abs(negative) : 1;

    var ctx = this.ctx;
    var options = this.options;
    var type = negative === -1 ? "-y" : "y";
    var axis = this.getAxis(type);

    ctx.save();
    this.goToOrigin();

    this.drawLine({
      start: [0, 0],
      end: [0, axis.max * axis.unit * axis.interval * negative],
      color: axis.color
    });

    for (var i = 0; i < axis.max; i++) {
      var number = i * axis.unit * negative;
      var y = -number * axis.unit * axis.interval;
      var x = -options.text.offset;

      // 刻度值
      this.drawText({
        text: number,
        x: x,
        y: y,
        color: options.text.color,
        font: options.text.font,
        align: i === 0 ? "end" : "center"
      });

      // 绘制刻度条
      this.drawLine({
        start: [0, y],
        end: [options.markHeight, y],
        color: axis.color
      });
    }

    ctx.restore();
  };

  Coordinate.prototype.drawAxis = function() {
    var ctx = this.ctx;
    var options = this.options;
    var origin = this.getOrigin();

    ctx.save();
    this.drawX();
    this.drawX(-1);
    this.drawY();
    this.drawY(-1);
    ctx.restore();
  };
})();
