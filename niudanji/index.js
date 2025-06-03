// 定义游戏设置对象，包含各种初始设置值
const settings = {
    // 胶囊数量
    capsuleNo: 20,
    // 是否正在转动手柄
    isTurningHandle: false,
    // 手柄是否锁定
    isHandleLocked: false,
    // 手柄上一次的角度
    handlePrevDeg: 0,
    // 手柄当前的角度
    handleDeg: 0,
    // 手柄旋转角度
    handleRotate: 0,
    // 挡板旋转角度
    flapRotate: 0,
    // 收集的胶囊数量
    collectedNo: 0,
  };

  // 定义DOM元素对象，包含游戏中使用的各种元素的引用
  const elements = {
    // 包裹元素
    wrapper: document.querySelector('.wrapper'),
    // 胶囊机元素
    capsuleMachine: document.querySelector('.capsule-machine'),
    // 震动按钮元素
    shakeButton: document.querySelector('.shake'),
    // 查看内部按钮元素
    seeInsideButton: document.querySelector('.see-inside'),
    // 圆形元素
    circle: document.querySelector('.circle'),
    // 手柄元素
    handle: document.querySelector('.handle'),
    // 玩具盒元素
    toyBox: document.querySelector('.toy-box'),
  };

  // 定义向量对象，包含向量的x和y坐标以及创建向量的方法
  const vector = {
    // x坐标
    x: 0,
    // y坐标
    y: 0,
    // 创建向量的方法，接收x和y坐标作为参数
    create: function (x, y) {
      // 创建一个新的对象，继承自当前对象
      const obj = Object.create(this);
      // 设置新对象的x坐标
      obj.x = x;
      // 设置新对象的y坐标
      obj.y = y;
      // 返回新创建的向量对象
      return obj;
    },
        // 设置向量的x和y坐标
    setXy: function ({ x, y }) {
      // 设置向量的x坐标
      this.x = x;
      // 设置向量的y坐标
      this.y = y;
    },
    // 设置向量的角度
    setAngle: function (angle) {
      // 获取向量的长度
      const length = this.magnitude();
      // 根据角度和长度计算新的x坐标
      this.x = Math.cos(angle) * length;
      // 根据角度和长度计算新的y坐标
      this.y = Math.sin(angle) * length;
    },
    // 设置向量的长度
    setLength: function (length) {
      // 获取向量的角度
      const angle = Math.atan2(this.y, this.x);
      // 根据角度和长度计算新的x坐标
      this.x = Math.cos(angle) * length;
      // 根据角度和长度计算新的y坐标
      this.y = Math.sin(angle) * length;
    },
    // 计算向量的长度（模）
    magnitude: function () {
      // 返回向量的长度
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    // 向量与标量相乘
    multiply: function (n) {
      // 返回一个新的向量，其坐标为原向量坐标乘以标量
      return this.create(this.x * n, this.y * n);
    },
    // 将另一个向量加到当前向量
    addTo: function (v2) {
      // 将另一个向量的x坐标加到当前向量的x坐标
      this.x += v2.x;
      // 将另一个向量的y坐标加到当前向量的y坐标
      this.y += v2.y;
    },
    // 将当前向量乘以标量
    multiplyBy: function (n) {
      // 将当前向量的x坐标乘以标量
      this.x *= n;
      // 将当前向量的y坐标乘以标量
      this.y *= n;
    },
  };
  // 旋转点
  const rotatePoint = ({ angle, axis, point }) => {
    // 将角度转换为弧度
    const a = degToRad(angle);
    // 计算点相对于轴的x偏移量
    const aX = point.x - axis.x;
    // 计算点相对于轴的y偏移量
    const aY = point.y - axis.y;
    // 返回旋转后的点
    return {
      // 计算旋转后的x坐标
      x: aX * Math.cos(a) - aY * Math.sin(a) + axis.x,
      // 计算旋转后的y坐标
      y: aX * Math.sin(a) + aY * Math.cos(a) + axis.y,
    };
  };
    // 将数字转换为像素单位的字符串，例如：10 => '10px'
  const px = (num) => `${num}px`;

  // 生成一个介于1和max之间的随机整数，包括1和max
  const randomN = (max) => Math.ceil(Math.random() * max);

  // 将角度转换为弧度，例如：90° => 1.5707963267948966
  const degToRad = (deg) => deg / (180 / Math.PI);

  // 将弧度转换为角度并四舍五入到最接近的整数，例如：1.5707963267948966 => 90
  const radToDeg = (rad) => Math.round(rad * (180 / Math.PI));

  // 计算从点a到点b的角度，返回值为弧度
  const angleTo = ({ a, b }) => Math.atan2(b.y - a.y, b.x - a.x);

  // 计算两点之间的距离并四舍五入到最接近的整数
  const distanceBetween = (a, b) =>
    Math.round(Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)));

  // 根据事件类型获取鼠标或触摸事件的页面坐标
  const getPage = (e, type) =>
    e.type[0] === 'm' ? e[`page${type}`] : e.touches[0][`page${type}`];

  // 计算收集的胶囊在x轴上的位置，基于收集的胶囊数量
  const calcCollectedX = () => (settings.collectedNo % 10) * 32;

  // 计算收集的胶囊在y轴上的位置，基于收集的胶囊数量
  const calcCollectedY = () => Math.floor(settings.collectedNo / 10) * 32;

  // 将角度调整为最接近的360度倍数，例如：361 => 360, -1 => 359
  const nearest360 = (n) =>
    n === 0 ? 0 : n - 1 + Math.abs(((n - 1) % 360) - 360);

  // 设置元素的样式，包括位置和旋转角度
  const setStyles = ({ el, x, y, w, deg }) => {
    // 如果提供了宽度参数，则设置元素的宽度样式
    if (w) el.style.width = w;
    // 设置元素的变换样式，包括平移和旋转
    el.style.transform = `translate(${x ? px(x) : 0},${
      y ? px(y) : 0
    })rotate(${deg || 0}deg)`;
  };

  // 定义线条数据，包括起点、终点、关键点、轴点和ID
  const lineData = [
    {
      start: { x: 0, y: 280 },
      end: { x: 160, y: 360 },
      point: 'end',
      axis: 'start',
      id: 'flap_1',
    },
    {
      start: { x: 160, y: 360 },
      end: { x: 320, y: 280 },
      point: 'start',
      axis: 'end',
      id: 'flap_2',
    },
    {
      start: { x: 70, y: 340 },
      end: { x: 230, y: 490 },
      point: 'start',
      axis: 'end',
      id: 'ramp',
    },
  ];

  // 从预定义的玩具列表中随机选择一个玩具
  const getRandomToy = () => {
    return [
      'bunny',
      'duck-yellow',
      'duck-pink',
      'star',
      'water-melon',
      'panda',
      'dino',
      'roboto-san',
      'roboto-sama',
      'penguin',
      'turtle',
    ][randomN(11) - 1];
  };
    // 创建指定数量的胶囊并添加到胶囊机中
  new Array(settings.capsuleNo).fill('').forEach(() => {
    // 创建一个胶囊元素
    const capsule = Object.assign(document.createElement('div'), {
      // 设置胶囊的类名
      className: 'capsule-wrapper pix',
      // 设置胶囊的内部HTML结构，包括盖子、玩具和底座
      innerHTML: `<div class="capsule"><div class="lid"></div><div class="${getRandomToy()} toy pix"></div><div class="base ${
        ['red', 'pink', 'white', 'blue'][randomN(4) - 1]
      }"></div></div>`,
    });
    // 将胶囊添加到胶囊机元素中
    elements.capsuleMachine.appendChild(capsule);
  });
  // 为每个线条数据创建线条元素并添加到胶囊机中
  lineData.forEach(() => {
    // 创建线条的起始点和结束点元素
    [
      Object.assign(document.createElement('div'), {
        // 设置起始点的类名
        className: 'line-start',
        // 设置起始点的内部HTML结构，包括线条
        innerHTML: '<div class="line"></div>',
      }),
      Object.assign(document.createElement('div'), {
        // 设置结束点的类名
        className: 'line-end',
      }),
    ].forEach((ele) => {
      // 将起始点和结束点元素添加到胶囊机元素中
      elements.capsuleMachine.appendChild(ele);
    });
  });
  // 获取所有线条的起始点、线条和结束点元素
  const lineStarts = document.querySelectorAll('.line-start');
  const lines = document.querySelectorAll('.line');
  const lineEnds = document.querySelectorAll('.line-end');
  // 获取所有玩具元素
  const toys = document.querySelectorAll('.toy');
  // 获取胶囊机的宽度和高度
  const { width: capsuleMachineWidth, height: capsuleMachineHeight } =
    elements.capsuleMachine.getBoundingClientRect();
  // 获取手柄的轴点坐标
  const handleAxis = () => {
    // 获取手柄的边界矩形
    const { left: handleX, top: handleY } =
      elements.circle.getBoundingClientRect();
    // 获取胶囊机的边界矩形
    const { top, left } = elements.capsuleMachine.getBoundingClientRect();
    // 返回手柄的轴点坐标
    return { x: handleX - left + 80, y: handleY - top + 80 };
  };
  // 更新所有线条的位置和旋转角度
  const updateLines = () => {
    lineData.forEach((l, i) => {
      // 计算线条的长度
      l.length = distanceBetween(l.start, l.end);
      // 设置线条起始点的位置和旋转角度
      setStyles({
        el: lineStarts[i],
        x: l.start.x,
        y: l.start.y,
        deg: radToDeg(angleTo({ a: l.start, b: l.end })),
      });
      // 设置线条的宽度
      setStyles({ el: lines[i], w: px(l.length) });
      // 设置线条结束点的位置
      setStyles({ el: lineEnds[i], x: l.end.x, y: l.end.y });
    });
  };
  // 创建胶囊数据数组，每个胶囊包含位置、速度、加速度等信息
  const capsuleData = Array.from(
    document.querySelectorAll('.capsule-wrapper')
  ).map((c, i) => {
    const data = {
      // 继承向量对象的方法和属性
      ...vector,
      // 胶囊元素
      el: c,
      // 胶囊的唯一标识
      id: i,
      // 胶囊的初始角度
      deg: 0,
      // 胶囊的半径
      radius: 36,
      // 胶囊的反弹系数
      bounce: -0.3,
      // 胶囊的摩擦力
      friction: 0.99,
      // 胶囊内的玩具元素
      toy: toys[i],
    };
    // 创建胶囊的初始速度向量
    data.velocity = data.create(0, 1);
    // 设置胶囊的初始速度长度
    data.velocity.setLength(10);
    // 设置胶囊的初始速度角度
    data.velocity.setAngle(degToRad(90));
    // 设置胶囊的初始位置
    data.setXy({
      x: randomN(capsuleMachineWidth - 32),
      y: randomN(capsuleMachineHeight - 250),
    });
    // 创建胶囊的加速度向量
    data.acceleration = data.create(0, 4);
    // 定义胶囊的加速方法
    data.accelerate = function (acceleration) {
      // 将加速度向量加到速度向量上
      this.velocity.addTo(acceleration);
    };
    // 返回胶囊数据对象
    return data;
  });
  // 根据目标位置计算新的位置
  const getNewPosBasedOnTarget = ({
    start,
    target,
    distance: d,
    fullDistance,
  }) => {
    // 获取起始点的坐标
    const { x: aX, y: aY } = start;
    // 获取目标点的坐标
    const { x: bX, y: bY } = target;
    // 计算剩余距离
    const remainingD = fullDistance - d;
    // 返回新的位置坐标
    return {
      x: Math.round((remainingD * aX + d * bX) / fullDistance),
      y: Math.round((remainingD * aY + d * bY) / fullDistance),
    };
  };
  // 模拟摇晃胶囊机的效果
  const shake = () => {
    // 遍历所有胶囊数据
    capsuleData.forEach((c) => {
      // 设置胶囊的随机速度角度
      c.velocity.setAngle(degToRad(randomN(270)));
      // 设置胶囊的初始速度
      c.velocity.setXy({ x: 10, y: 10 });
      // 加速胶囊
      c.accelerate(c.acceleration);
    });
    // 添加摇晃动画类名到胶囊机元素
    elements.capsuleMachine.classList.add('shake');
    // 延迟移除摇晃动画类名
    setTimeout(
      () => elements.capsuleMachine.classList.remove('shake'),
      500
    );
  };
    // 旋转线条函数，根据给定的角度数组旋转线条的端点
  const rotateLines = (angles) => {
    // 遍历角度数组
    angles.forEach((angle, i) => {
      // 获取当前线条的轴点和端点
      const { axis, point } = lineData[i];
      // 旋转端点并更新线条数据
      lineData[i][point] = rotatePoint({
        angle, // 旋转角度
        axis: lineData[i][axis], // 轴点坐标
        point: lineData[i][point], // 端点坐标
      });
    });
  };
  // 打开挡板函数
  const openFlap = () => {
    // 如果挡板旋转角度大于 -20 度
    if (settings.flapRotate > -20) {
      // 减少挡板旋转角度
      settings.flapRotate -= 2;
      // 旋转线条
      rotateLines([2, -2, -4]);
      // 更新线条位置和旋转角度
      updateLines();
      // 延迟 30 毫秒后再次调用 openFlap 函数
      setTimeout(openFlap, 30);
    } else {
      // 延迟 800 毫秒后调用 closeFlap 函数
      setTimeout(closeFlap, 800);
    }
  };

  // 关闭挡板函数
  const closeFlap = () => {
    // 如果挡板旋转角度小于 0 度
    if (settings.flapRotate < 0) {
      // 增加挡板旋转角度
      settings.flapRotate += 1;
      // 如果挡板旋转角度等于 0 度
      if (settings.flapRotate === 0) {
        // 重置线条端点位置
        [
          { x: 160, y: 360 },
          { x: 160, y: 360 },
          { x: 70, y: 340 },
        ].forEach((item, i) => {
          lineData[i][lineData[i].point].x = item.x;
          lineData[i][lineData[i].point].y = item.y;
        });
        // 解锁手柄
        settings.isHandleLocked = false;
      } else {
        // 旋转线条
        rotateLines([-1, 1, 2]);
      }
      // 更新线条位置和旋转角度
      updateLines();
      // 延迟 30 毫秒后再次调用 closeFlap 函数
      setTimeout(closeFlap, 30);
    }
  };

  // 释放胶囊函数
  const release = () => {
    // 设置挡板旋转角度为 0
    settings.flapRotate = 0;
    // 锁定手柄
    settings.isHandleLocked = true;
    // 延迟 30 毫秒后调用 openFlap 函数
    setTimeout(openFlap, 30);
  };

  // 遍历所有胶囊数据，为每个胶囊添加点击事件监听器
  capsuleData.forEach((c) => {
    // 为胶囊元素添加点击事件监听器
    c.el.addEventListener('click', () => {
      // 获取包裹元素的宽度和高度
      const { width: bodyWidth, height: bodyHeight } =
        elements.wrapper.getBoundingClientRect();
      // 获取胶囊机元素的边界矩形
      const { top, left } = elements.capsuleMachine.getBoundingClientRect();
      // 获取玩具盒元素的边界矩形
      const { left: toyBoxLeft, top: toyBoxTop } =
        elements.toyBox.getBoundingClientRect();
      // 给包裹元素添加锁定类名，防止页面滚动
      elements.wrapper.classList.add('lock');
      // 给胶囊元素添加放大类名
      c.el.classList.add('enlarge');
      // 设置胶囊为选中状态
      c.selected = true;
      // 设置胶囊元素的样式，包括位置和旋转角度
      setStyles({
        el: c.el,
        x: bodyWidth / 2 - left, // 水平居中
        y: bodyHeight / 2 - top, // 垂直居中
        deg: nearest360(c.deg), // 最接近的360度倍数角度
      });

            // 设置玩具元素的旋转角度为0度
      setStyles({ el: c.toy, deg: 0 });
      // 延迟700毫秒后给胶囊元素添加打开类名
      setTimeout(() => c.el.classList.add('open'), 700);
      // 延迟1800毫秒后执行以下操作
      setTimeout(() => {
        // 移除包裹元素的锁定类名，允许页面滚动
        elements.wrapper.classList.remove('lock');
        // 给玩具元素添加收集类名，表示已收集
        c.toy.classList.add('collected');
        // 设置胶囊元素的样式，包括位置和旋转角度
        setStyles({
          // 设置胶囊元素
          el: c.el,
          // 设置胶囊元素的x坐标，使其位于玩具盒内的水平位置
          x: toyBoxLeft - left + 16 + calcCollectedX(),
          // 设置胶囊元素的y坐标，使其位于玩具盒内的垂直位置
          y: toyBoxTop - top + 16 + calcCollectedY(),
        });
        // 增加收集的胶囊数量
        settings.collectedNo++;
      }, 1800);
    });
    // 设置胶囊元素的样式
    setStyles(c);
  });
  // 调整胶囊之间的间距函数
  const spaceOutCapsules = (c) => {
    // 遍历所有胶囊数据
    capsuleData.forEach((c2) => {
      // 如果当前胶囊和另一个胶囊的ID相同，或者另一个胶囊已被选中，则跳过
      if (c.id === c2.id || c2.selected) return;
      // 计算两个胶囊之间的距离
      const distanceBetweenCapsules = distanceBetween(c, c2);
      // 如果两个胶囊之间的距离小于它们半径之和
      if (distanceBetweenCapsules < c.radius * 2) {
        // 减少当前胶囊的速度
        c.velocity.multiplyBy(-0.6);
        // 计算重叠部分的距离
        const overlap = distanceBetweenCapsules - c.radius * 2;
        // 根据目标位置计算新的位置
        c.setXy(
          getNewPosBasedOnTarget({
            // 起始点为当前胶囊
            start: c,
            // 目标点为另一个胶囊
            target: c2,
            // 移动距离为重叠部分的一半
            distance: overlap / 2,
            // 总距离为两个胶囊之间的距离
            fullDistance: distanceBetweenCapsules,
          })
        );
      }
    });
  };
  // 检测胶囊与线条的碰撞函数
  const hitCheckLines = (c) => {
    // 遍历所有线条数据
    lineData.forEach((l) => {
      // 计算胶囊到线条起始点的距离
      const d1 = distanceBetween(c, l.start);
      // 计算胶囊到线条结束点的距离
      const d2 = distanceBetween(c, l.end);
      // 如果胶囊到线条起始点和结束点的距离之和在一定范围内
      if (
        d1 + d2 >= l.length - c.radius &&
        d1 + d2 <= l.length + c.radius
      ) {
        // 计算胶囊到线条的最近点的距离
        const dot =
          ((c.x - l.start.x) * (l.end.x - l.start.x) +
            (c.y - l.start.y) * (l.end.y - l.start.y)) /
          Math.pow(l.length, 2);
        // 计算胶囊到线条的最近点的坐标
        const closestXy = {
          x: l.start.x + dot * (l.end.x - l.start.x),
          y: l.start.y + dot * (l.end.y - l.start.y),
        };
        // 计算胶囊到最近点的距离
        const fullDistance = distanceBetween(c, closestXy);
        // 如果胶囊到最近点的距离小于胶囊半径
        if (fullDistance < c.radius) {
          // 减少胶囊的速度
          c.velocity.multiplyBy(-0.6);
          // 计算重叠部分的距离
          const overlap = fullDistance - c.radius;
          // 根据目标位置计算新的位置
          c.setXy(
            getNewPosBasedOnTarget({
              // 起始点为当前胶囊
              start: c,
              // 目标点为最近点
              target: closestXy,
              // 移动距离为重叠部分的一半
              distance: overlap / 2,
              // 总距离为胶囊到最近点的距离
              fullDistance,
            })
          );
        }
      }
    });
  };
  // 检测胶囊与胶囊机墙壁的碰撞函数
  const hitCheckCapsuleMachineWalls = (c) => {
    // 设置一个缓冲区，避免胶囊直接贴在墙壁上
    const buffer = 5;
    // 如果胶囊的右侧超出胶囊机的右侧边界
    if (c.x + c.radius + buffer > capsuleMachineWidth) {
      // 将胶囊的右侧位置设置为胶囊机的右侧边界减去胶囊半径和缓冲区
      c.x = capsuleMachineWidth - (c.radius + buffer);
      // 胶囊的水平速度取反并乘以反弹系数
      c.velocity.x = c.velocity.x * c.bounce;
    }
    // 如果胶囊的左侧超出胶囊机的左侧边界
    if (c.x - (c.radius + buffer) < 0) {
      // 将胶囊的左侧位置设置为胶囊半径加上缓冲区
      c.x = c.radius;
      // 胶囊的水平速度取反并乘以反弹系数
      c.velocity.x = c.velocity.x * c.bounce;
    }
    // 如果胶囊的底部超出胶囊机的底部边界
    if (c.y + c.radius + buffer > capsuleMachineHeight) {
      // 将胶囊的底部位置设置为胶囊机的底部边界减去胶囊半径和缓冲区
      c.y = capsuleMachineHeight - c.radius - buffer;
      // 胶囊的垂直速度取反并乘以反弹系数
      c.velocity.y = c.velocity.y * c.bounce;
    }
    // 如果胶囊的顶部超出胶囊机的顶部边界
    if (c.y - c.radius < 0) {
      // 将胶囊的顶部位置设置为胶囊半径
      c.y = c.radius;
      // 胶囊的垂直速度取反并乘以反弹系数
      c.velocity.y = c.velocity.y * c.bounce;
    }
  };
    // 定义一个名为 animateCapsules 的函数，用于处理胶囊的动画效果
  const animateCapsules = () => {
    // 遍历胶囊数据数组中的每个胶囊对象
    capsuleData.forEach((c, i) => {
      // 如果胶囊已被选中，则跳过当前循环
      if (c.selected) return;
      // 记录胶囊的当前位置作为上一个位置
      c.prevX = c.x;
      c.prevY = c.y;
      // 根据加速度更新胶囊的速度
      c.accelerate(c.acceleration);
      // 应用摩擦力到胶囊的速度上
      c.velocity.multiplyBy(c.friction);
      // 根据速度更新胶囊的位置
      c.addTo(c.velocity);
      // 调整胶囊之间的间距，避免碰撞
      spaceOutCapsules(c);
      // 检查胶囊与线条的碰撞
      hitCheckLines(c);
      // 检查胶囊与胶囊机墙壁的碰撞
      hitCheckCapsuleMachineWalls(c);
      // 如果胶囊的位置变化小于阈值，则停止胶囊的运动
      if (Math.abs(c.prevX - c.x) < 2 && Math.abs(c.prevY - c.y) < 2) {
        c.velocity.setXy({ x: 0, y: 0 });
        c.setXy({ x: c.prevX, y: c.prevY });
      } else {
        // 如果胶囊在水平方向上有移动，则更新玩具的旋转角度
        if (Math.abs(c.prevX - c.x)) {
          setStyles({ el: c.toy, deg: c.deg + (c.x - c.prevX) * 2 });
          c.deg += (c.x - c.prevX) * 2;
        }
      }
      // 更新胶囊的样式
      setStyles(capsuleData[i]);
    });
  };
  // 定义一个名为 grabHandle 的函数，用于处理手柄的抓取事件
  const grabHandle = (e) => {
    // 如果手柄已被锁定，则直接返回，不执行任何操作
    if (settings.isHandleLocked) return;
    // 获取胶囊机元素的边界矩形信息
    const { top, left } = elements.capsuleMachine.getBoundingClientRect();
    // 设置手柄正在被转动的状态为 true
    settings.isTurningHandle = true;
    // 计算并设置手柄的初始旋转角度
    settings.handleDeg = radToDeg(
      angleTo({
        // 获取鼠标点击位置或触摸位置相对于胶囊机的坐标
        a: { x: getPage(e, 'X') - left, y: getPage(e, 'Y') - top },
        // 获取手柄的轴点坐标
        b: handleAxis(),
      })
    );
    // 初始化手柄的旋转角度为 0
    settings.handleRotate = 0;
  };
  // 定义一个名为 releaseHandle 的函数，用于处理手柄的释放事件
  const releaseHandle = () => {
    // 设置手柄正在被转动的状态为 false
    settings.isTurningHandle = false;
    // 将手柄的旋转角度设置为 0
    setStyles({ el: elements.handle, deg: 0 });
  };
  // 定义一个名为 rotateHandle 的函数，用于处理手柄的旋转事件
  const rotateHandle = (e) => {
    // 如果手柄未被转动或已被锁定，则直接返回，不执行任何操作
    if (!settings.isTurningHandle || settings.isHandleLocked) return;
    // 获取胶囊机元素的边界矩形信息
    const { top, left } = elements.capsuleMachine.getBoundingClientRect();
    // 记录手柄的上一个旋转角度
    settings.prevHandleDeg = settings.handleDeg;
    // 计算并设置手柄的当前旋转角度
    const deg = radToDeg(
      angleTo({
        // 获取鼠标移动位置或触摸位置相对于胶囊机的坐标
        a: { x: getPage(e, 'X') - left, y: getPage(e, 'Y') - top },
        // 获取手柄的轴点坐标
        b: handleAxis(),
      })
    );
    // 更新手柄的旋转角度
    settings.handleDeg = deg;
    // 计算手柄旋转角度的变化量
    const diff = settings.handleDeg - settings.prevHandleDeg;
    // 如果旋转角度变化量大于等于 1，则更新手柄的样式
    if (diff >= 1) {
      setStyles({ el: elements.handle, deg: settings.handleRotate });
    }
    // 如果旋转角度变化量在 0 到 50 之间，则累加手柄的旋转角度
    if (diff > 0 && diff < 50) settings.handleRotate += diff;
    // 如果手柄的旋转角度超过 350 度，则触发释放操作并停止手柄的转动
    if (settings.handleRotate > 350) {
      setStyles({ el: elements.handle, deg: 10 });
      release();
      settings.isTurningHandle = false;
    }
  };
  // 为手柄元素添加鼠标按下和触摸开始事件监听器，触发 grabHandle 函数
  ['mousedown', 'touchstart'].forEach((action) => {
    elements.handle.addEventListener(action, grabHandle);
  });
  // 为圆形元素添加鼠标抬起、鼠标离开和触摸结束事件监听器，触发 releaseHandle 函数
  ['mouseup', 'mouseleave', 'touchend'].forEach((action) => {
    elements.circle.addEventListener(action, releaseHandle);
  });
  // 为窗口添加鼠标移动和触摸移动事件监听器，触发 rotateHandle 函数
  ['mousemove', 'touchmove'].forEach((action) => {
    window.addEventListener(action, rotateHandle);
  });
  // 为摇晃按钮元素添加点击事件监听器，触发 shake 函数
  elements.shakeButton.addEventListener('click', shake);
  // 为查看内部按钮元素添加点击事件监听器，切换胶囊机的透视效果并更新按钮文本
  elements.seeInsideButton.addEventListener('click', () => {
    elements.capsuleMachine.classList.toggle('see-through');
    elements.seeInsideButton.innerHTML =
      elements.capsuleMachine.classList.contains('see-through')
        ? '隐藏'
        : '偷看';
  });
  // 更新线条的位置和旋转角度
  updateLines();
  // 每隔 30 毫秒调用 animateCapsules 函数，实现胶囊的动画效果
  setInterval(animateCapsules, 30);
