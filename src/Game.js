// Импортируем всё необходимое.
// Или можно не импортировать,
// а передавать все нужные объекты прямо из run.js при инициализации new Game().

const keypress = require('keypress');
const Hero = require('./game-models/Hero');
const Enemy = require('./game-models/Enemy');
// const Boomerang = require('./game-models/Boomerang');
const View = require('./View');

// Основной класс игры.
// Тут будут все настройки, проверки, запуск.
const Boomerang = require('./game-models/Boomerang');

class Game {
  constructor({
    trackLength,
  }) {
    this.trackLength = trackLength;
    this.hero = new Hero(5, 2); // Герою можно аргументом передать бумеранг.
    this.enemy = new Enemy();
    this.track = [];
    this.weapon = new Boomerang(5, 2);
    this.view = new View(this.track);
    this.regenerateTrack();
  }

  moveset() {
    const keyboard = {
      d: () => {
        if (this.hero.position[1] < this.trackLength) {
          this.hero.moveRight();
        }
      },
      a: () => {
        if (this.hero.position[1] > 0) {
          this.hero.moveLeft();
        }
      },

      w: () => {
        if (this.hero.position[0] > 0) {
          this.hero.moveUp();
        }
      },
      s: () => {
        if (this.hero.position[0] < 5) {
          this.hero.moveDown()
        }

      },
      space: () => {
        let rightCount = 0;
        let leftCount = 0;

        const rigthId = setInterval(() => {
          this.weapon.moveRight();
          rightCount++
          if (rightCount === 10) {
            clearInterval(rigthId)

            const leftId = setInterval(() => {
              leftCount++
              this.weapon.moveLeft()

              if (leftCount === 10) {
                clearInterval(leftId)
              }

            }, 50);

          }


        }, 50);
      },
    };

    // Какая-то функция.

    function runInteractiveConsole() {
      keypress(process.stdin);
      process.stdin.on('keypress', (ch, key) => {
        if (key) {
          // Вызывает команду, соответствующую нажатой кнопке.
          if (key.name in keyboard) {
            keyboard[key.name]();
          }
          // Прерывание программы.
          if (key.ctrl && key.name === 'c') {
            process.exit();
          }
        }
      });
      process.stdin.setRawMode(true);
    }

    // Давай попробуем запустить этот скрипт!

    runInteractiveConsole();
  }

  regenerateTrack() {
    // Сборка всего необходимого (герой, враг(и), оружие)
    // в единую структуру данных

    // this.track = [
    //   (new Array(this.trackLength)).fill('.'),
    //   (new Array(this.trackLength)).fill('.'),
    //   (new Array(this.trackLength)).fill('.'),
    //   (new Array(this.trackLength)).fill('.'),
    //   (new Array(this.trackLength)).fill('.'),
    // ];\
    this.track = [];
    for (let i = 0; i < 6; i += 1) {
      const newArr = [];
      for (let j = 0; j < 25; j += 1) {
        newArr.push(' ');
      }
      this.track.push(newArr);
    }
    // console.log(this.track);
    // this.track = (new Array(this.trackLength)).fill('.'); // тут нужно сделать 2мерный массив
    const i = this.hero.position[0];
    const j = this.hero.position[1];
    // console.log('TRACK ', this.track[i][j]);
    // console.log('SKIN ', this.hero.skin);
    this.track[this.weapon.position0][this.weapon.position1] = this.weapon.skin;
    this.track[i][j] = this.hero.skin;
    this.track[this.enemy.position0][this.enemy.position1] = this.enemy.skin;
  }

  check() {
    if (this.hero.position[1] === this.weapon.position1 ||
      this.hero.position[1] === this.weapon.position1 - 1 ||
      this.hero.position[1] === this.weapon.position1 + 1
    ) {

      this.weapon.position1 = this.hero.position[1]
      this.weapon.position0 = this.hero.position[0]
    }


    if (this.hero.position[0] === this.enemy.position0 && this.hero.position[1] === this.enemy.position1) {
      this.hero.die();
    }
    if (this.weapon.position0 === this.enemy.position0 && this.weapon.position1 === this.enemy.position1 ||
      this.weapon.position0 === this.enemy.position0 && this.weapon.position1 === this.enemy.position1 - 1||
      this.weapon.position0 === this.enemy.position0 && this.weapon.position1 === this.enemy.position1 + 1
      ) {
      this.enemy.die();
    }
    // if (this.enemy.position === this.boomerang.position){
    //   this.enemy.die();
    // }
    // тут проверки на валидность
  }

  play() {
    this.moveset();

    setInterval(() => {
      this.enemy.moveLeft();
      if (this.enemy.position1 < 0) {
        this.enemy.position1 = 25;
        this.enemy.position0 = Math.floor(Math.random() * 6);
      }
    }, 300);

    setInterval(() => {
      // Let's play!
      this.check();
      this.regenerateTrack();
      this.view.render(this.track);
    }, 100);
  }
}

module.exports = Game;
