import MyCharacter from "./mycharacter";
import WZManager from "./wzmanager";
import UICommon from "./uicommon";
import MapleInput from "./mapleinput";
import MapleMap from "./maplemap";

const UIMap = {};

UIMap.initialize = async function () {
  await UICommon.initialize();

  const basic = await WZManager.get("UI.wz/Basic.img");
  this.statusBarLevelDigits = basic.LevelNo.nChildren.map((d) => d.nGetImage());

  this.firstUpdate = true;
  this.chat = null;

  const statusBar = await WZManager.get("UI.wz/StatusBar.img");
  this.statusBg = statusBar.base.backgrnd.nGetImage();
  this.statusBg2 = statusBar.base.backgrnd2.nGetImage();
  this.bars = statusBar.gauge.bar.nGetImage();
  this.graduation = statusBar.gauge.graduation.nGetImage();
  this.barGray = statusBar.gauge.gray.nGetImage();

  this.numbers = statusBar.number.nChildren.reduce((numbers, node) => {
    numbers[node.nName] = node.nGetImage();
    return numbers;
  }, {});
};

UIMap.doUpdate = function (msPerTick, camera, canvas) {
  if (this.firstUpdate) {
    this.chat = new MapleInput(canvas, {
      x: 5,
      y: 540,
      width: 530,
      color: "#000000",
      background: "#ffffff",
      height: 13,
    });
    this.chat.addSubmitListener(() => {
      const msg = this.chat.input.value;
      this.chat.input.value = "";
      if (msg[0] === "!") {
        const [command, ...commandArgs] = msg.split(" ");
        console.log(command, commandArgs);
        switch (command) {
          case "!level": {
            const level = Number(commandArgs[0]);
            if (!Number.isInteger(level) || level > 250 || level < 1) {
              break;
            }
            if (level > MyCharacter.level) {
              MyCharacter.playLevelUp();
            }
            MyCharacter.level = level;
            break;
          }
          case "!map": {
            const mapId = Number(commandArgs[0]);
            if (!Number.isInteger(mapId)) {
              break;
            }
            MapleMap.load(mapId);
            break;
          }
          default: {
            break;
          }
        }
      }
      canvas.releaseFocusInput();
    });
    this.firstUpdate = false;
  }
  if (!canvas.focusInput && canvas.focusGame && canvas.isKeyDown("enter")) {
    this.chat.input.focus();
  }
  UICommon.doUpdate(msPerTick, camera, canvas);
};

UIMap.drawLevel = function (canvas, level) {
  const dy = 576;
  if (level >= 100) {
    const first = Math.floor(level / 100);
    const second = (Math.floor(level / 10) - 10) % 10;
    const third = level % 10;
    canvas.drawImage({
      img: this.statusBarLevelDigits[first],
      dx: 36,
      dy,
    });
    canvas.drawImage({
      img: this.statusBarLevelDigits[second],
      dx: 48,
      dy,
    });
    canvas.drawImage({
      img: this.statusBarLevelDigits[third],
      dx: 60,
      dy,
    });
  } else if (level >= 10) {
    const first = Math.floor(level / 10);
    const second = level % 10;
    canvas.drawImage({
      img: this.statusBarLevelDigits[first],
      dx: 42,
      dy,
    });
    canvas.drawImage({
      img: this.statusBarLevelDigits[second],
      dx: 54,
      dy,
    });
  } else {
    canvas.drawImage({
      img: this.statusBarLevelDigits[level],
      dx: 48,
      dy,
    });
  }
};

UIMap.drawNumbers = function (canvas, hp, maxHp, mp, maxMp) {
  canvas.drawImage({
    img: this.numbers.Lbracket,
    dx: 234,
    dy: 570,
  });

  const hpX = [...`${hp}`, "slash", ...`${maxHp}`].reduce((x, digit) => {
    canvas.drawImage({
      img: this.numbers[digit],
      dx: x,
      dy: 571,
    });
    x += this.numbers[digit].width + 1;
    return x;
  }, 238);

  canvas.drawImage({
    img: this.numbers.Rbracket,
    dx: hpX + 1,
    dy: 570,
  });

  canvas.drawImage({
    img: this.numbers.Lbracket,
    dx: 346,
    dy: 570,
  });

  const mpX = [...`${mp}`, "slash", ...`${maxMp}`].reduce((x, digit) => {
    canvas.drawImage({
      img: this.numbers[digit],
      dx: x,
      dy: 571,
    });
    x += this.numbers[digit].width + 1;
    return x;
  }, 350);

  canvas.drawImage({
    img: this.numbers.Rbracket,
    dx: mpX + 1,
    dy: 570,
  });
};

UIMap.doRender = function (canvas, camera, lag, msPerTick, tdelta) {
  canvas.drawImage({
    img: this.statusBg,
    dx: 0,
    dy: 529,
  });

  canvas.drawImage({
    img: this.statusBg2,
    dx: 0,
    dy: 529,
  });

  this.drawLevel(canvas, MyCharacter.level);

  canvas.drawText({
    text: MyCharacter.name,
    color: "#ffffff",
    x: 85,
    y: 585,
  });

  canvas.drawImage({
    img: this.bars,
    dx: 215,
    dy: 567,
  });

  const { hp, maxHp, mp, maxMp } = MyCharacter;

  const numHpGrays = 105 - Math.floor((hp / maxHp) * 105);
  for (let i = 0; i < numHpGrays; i += 1) {
    canvas.drawImage({
      img: this.barGray,
      dx: 321 - i,
      dy: 581,
    });
  }

  const numMpGrays = 105 - Math.floor((mp / maxMp) * 105);
  for (let i = 0; i < numMpGrays; i += 1) {
    canvas.drawImage({
      img: this.barGray,
      dx: 429 - i,
      dy: 581,
    });
  }

  canvas.drawImage({
    img: this.graduation,
    dx: 215,
    dy: 566,
  });

  this.drawNumbers(canvas, hp, maxHp, mp, maxMp);

  UICommon.doRender(canvas, camera, lag, msPerTick, tdelta);
};

export default UIMap;
