export class GameLogic {
  puck = { x: 0, y: 0, w: 26, h: 26, vx: 0, vy: 0 };
  player = { x: 20, y: 0, w: 18, h: 80 };
  enemy = { x: 0, y: 0, w: 18, h: 80 };

  onGoal: () => void;

  width: number;
  height: number;
  isPortrait: boolean;

  playerScore = 0;
  enemyScore = 0;

  enemySpeed: number;
  speedMultiplier: number;

  playerHits = 0;
  superReady = false;

  constructor(
    width: number,
    height: number,
    enemySpeed: number,
    speedMultiplier: number,
    isPortrait: boolean,
    onGoal: () => void,
  ) {
    this.width = width;
    this.height = height;
    this.isPortrait = isPortrait;
    this.onGoal = onGoal;

    const scale = this.height / 450;

    this.enemySpeed = enemySpeed * scale;
    this.speedMultiplier = speedMultiplier * scale;

    this.player.h *= scale;
    this.enemy.h *= scale;
    this.puck.w *= scale;
    this.puck.h *= scale;

    this.resetRound(true);
  }

  resetRound(initial = false, lastWinner: "player" | "enemy" | null = null) {
    const baseSpeed = 5 * this.speedMultiplier;

    this.puck.x = this.width / 2 - this.puck.w / 2;
    this.puck.y = this.height / 2 - this.puck.h / 2;

    if (this.isPortrait) {
      if (this.player.h > this.player.w) {
        [this.player.w, this.player.h] = [this.player.h, this.player.w];
        [this.enemy.w, this.enemy.h] = [this.enemy.h, this.enemy.w];
      }

      this.puck.vx = 0;
      this.puck.vy =
        initial || lastWinner === "player" ? -baseSpeed : baseSpeed;

      this.player.x = this.width / 2 - this.player.w / 2;
      this.player.y = this.height - 100;

      this.enemy.x = this.width / 2 - this.enemy.w / 2;
      this.enemy.y = 60;
    } else {
      if (this.player.w > this.player.h) {
        [this.player.w, this.player.h] = [this.player.h, this.player.w];
        [this.enemy.w, this.enemy.h] = [this.enemy.h, this.enemy.w];
      }

      this.puck.vx =
        initial || lastWinner === "player" ? baseSpeed : -baseSpeed;
      this.puck.vy = 0;

      this.player.x = 40;
      this.player.y = this.height / 2 - this.player.h / 2;

      this.enemy.x = this.width - 40 - this.enemy.w;
      this.enemy.y = this.height / 2 - this.enemy.h / 2;
    }
  }

  collide(a: any, b: any): boolean {
    return !(
      a.x + a.w < b.x ||
      a.x > b.x + b.w ||
      a.y + a.h < b.y ||
      a.y > b.y + b.h
    );
  }

  update() {
    const goalWidth = 20;

    this.puck.x += this.puck.vx;
    this.puck.y += this.puck.vy;

    if (this.isPortrait) {
      if (this.puck.x <= 0 || this.puck.x + this.puck.w >= this.width) {
        this.puck.vx *= -1;
      }
    } else {
      if (this.puck.y <= 0 || this.puck.y + this.puck.h >= this.height) {
        this.puck.vy *= -1;
      }
    }

    // ★ ゴール判定（onGoal を呼ぶ）
    if (this.isPortrait) {
      if (this.puck.y <= goalWidth) {
        this.playerScore++;
        this.onGoal();
        this.resetRound(false, "player");
        return;
      }
      if (this.puck.y + this.puck.h >= this.height - goalWidth) {
        this.enemyScore++;
        this.onGoal();
        this.resetRound(false, "enemy");
        return;
      }
    } else {
      if (this.puck.x <= goalWidth) {
        this.enemyScore++;
        this.onGoal();
        this.resetRound(false, "enemy");
        return;
      }
      if (this.puck.x + this.puck.w >= this.width - goalWidth) {
        this.playerScore++;
        this.onGoal();
        this.resetRound(false, "player");
        return;
      }
    }

    if (this.playerScore >= 5) return "win";
    if (this.enemyScore >= 5) return "lose";

    if (this.collide(this.puck, this.player)) {
      if (this.isPortrait) {
        const offset =
          this.puck.x + this.puck.w / 2 - (this.player.x + this.player.w / 2);
        this.puck.vx = offset * 0.05;
        this.puck.vy = -Math.abs(this.puck.vy);
      } else {
        const offset =
          this.puck.y + this.puck.h / 2 - (this.player.y + this.player.h / 2);
        this.puck.vy = offset * 0.05;
        this.puck.vx = Math.abs(this.puck.vx);
      }

      this.playerHits++;
      if (this.playerHits >= 5) this.superReady = true;
    }

    if (this.collide(this.puck, this.enemy)) {
      if (this.isPortrait) {
        const offset =
          this.puck.x + this.puck.w / 2 - (this.enemy.x + this.enemy.w / 2);
        this.puck.vx = offset * 0.05;
        this.puck.vy = Math.abs(this.puck.vy);
      } else {
        const offset =
          this.puck.y + this.puck.h / 2 - (this.enemy.y + this.enemy.h / 2);
        this.puck.vy = offset * 0.05;
        this.puck.vx = -Math.abs(this.puck.vx);
      }
    }

    const puckCenter = this.isPortrait
      ? this.puck.x + this.puck.w / 2
      : this.puck.y + this.puck.h / 2;

    const enemyCenter = this.isPortrait
      ? this.enemy.x + this.enemy.w / 2
      : this.enemy.y + this.enemy.h / 2;

    if (puckCenter > enemyCenter + 10) {
      if (this.isPortrait) this.enemy.x += this.enemySpeed;
      else this.enemy.y += this.enemySpeed;
    } else if (puckCenter < enemyCenter - 10) {
      if (this.isPortrait) this.enemy.x -= this.enemySpeed;
      else this.enemy.y -= this.enemySpeed;
    }

    if (this.isPortrait) {
      this.enemy.x = Math.max(
        0,
        Math.min(this.enemy.x, this.width - this.enemy.w),
      );
      this.player.x = Math.max(
        0,
        Math.min(this.player.x, this.width - this.player.w),
      );
    } else {
      this.enemy.y = Math.max(
        0,
        Math.min(this.enemy.y, this.height - this.enemy.h),
      );
      this.player.y = Math.max(
        0,
        Math.min(this.player.y, this.height - this.player.h),
      );
    }
  }

  movePlayer(pos: number) {
    if (this.isPortrait) {
      this.player.x = pos - this.player.w / 2;
    } else {
      this.player.y = pos - this.player.h / 2;
    }
  }

  superShot() {
    if (!this.superReady) return;
    this.puck.vx *= 3;
    this.puck.vy *= 3;
    this.superReady = false;
    this.playerHits = 0;
  }
}
