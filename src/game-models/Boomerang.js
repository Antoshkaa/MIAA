// Бумеранг является оружием.
// В дальнейшем можно добавить другое оружие.
// Тогда можно будет создать класс Weapon и воспользоваться наследованием!

class Boomerang {
  constructor(pos0, pos1) {
    this.skin = '💩';
    this.position0 = pos0;
    this.position1 = pos1;
    this.forwardI = '';
    // this.backI = '',
  }

  flyForward() {
    // this.moveRight();
    this.forwardI = setInterval(() => {
      this.position1 += 1;
    }, 150);
  }

  flyBack() {
    // this.moveRight();
    this.backI = setInterval(() => {
      this.position1 -= 1;
    }, 150);
  }

  moveLeft() {
    // Идём влево.
    this.position1 -= 1;
  }

  moveRight() {
    // Идём вправо.
    this.position1 += 1;
  }
  moveUp() {
    this.position0 -= 1;
  }
  moveDown() {
    this.position0 += 1;
  }
}

module.exports = Boomerang;