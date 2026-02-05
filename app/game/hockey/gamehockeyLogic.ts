export class GameLogic {
  puck = { x: 0, y: 0, w: 26, h: 26, vx: 0, vy: 0 };
  player = { x: 20, y: 0, w: 18, h: 80 };
  enemy = { x: 0, y: 0, w: 18, h: 80 };

  onGoal: (type: "high" | "low") => void;

  onHit: () => void;
  onWallHit: () => void;
  width: number;
  height: number;
  isPortrait: boolean;

  reflectCount = 0;
  maxReflectCount = 0;

  enemySpeed: number;
  speedMultiplier: number;

  constructor(
    width: number,
    height: number,
    enemySpeed: number,
    speedMultiplier: number,
    isPortrait: boolean,
    onGoal: (type: "high" | "low") => void,
    onHit: () => void,
    onWallHit: () => void,
  ) {
    this.width = width;
    this.height = height;
    this.isPortrait = isPortrait;
    this.onGoal = onGoal;
    this.onHit = onHit;
    this.onWallHit = onWallHit;
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

      // ★ 画面サイズに応じて自動調整
      const playerBottomOffset = this.height * 0.01; // 下から8%
      const enemyTopOffset = this.height * 0.01; // 上から4%

      this.player.x = this.width / 2 - this.player.w / 2;
      this.player.y = this.height - this.player.h - playerBottomOffset;

      this.enemy.x = this.width / 2 - this.enemy.w / 2;
      this.enemy.y = enemyTopOffset;
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
      this.enemy.y = this.height / 2 - this.enemy.h / 2 - 40;
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

  update(): "reset" | undefined {
    const goalWidth = 20;
    const MAX_SPEED = 14;

    // ★ 自動調整オフセット
    const sideOffset = this.width * 0.01; // 縦画面の左右
    const bottomOffset = this.height * 0.01; // 横画面の下

    this.puck.x += this.puck.vx;
    this.puck.y += this.puck.vy;

    // -------------------------
    // ★ 壁反射（押し返しなし）
    // -------------------------
    if (this.isPortrait) {
      // 縦画面：左右の壁
      const leftLimit = sideOffset;
      const rightLimit = this.width - this.puck.w - sideOffset;

      if (this.puck.x <= leftLimit) {
        this.puck.x = leftLimit;
        this.puck.vx *= -1;
        this.onWallHit();
      }
      if (this.puck.x >= rightLimit) {
        this.puck.x = rightLimit;
        this.puck.vx *= -1;
        this.onWallHit();
      }
    } else {
      // 横画面：上下の壁
      if (this.puck.y <= 0) {
        this.puck.y = 0;
        this.puck.vy *= -1;
        this.onWallHit();
      }

      const bottomLimit = this.height - this.puck.h - bottomOffset;
      if (this.puck.y >= bottomLimit) {
        this.puck.y = bottomLimit;
        this.puck.vy *= -1;
        this.onWallHit();
      }
    }

    // -------------------------
    // ゴール判定
    // -------------------------
    // ★ ゴールラインを画面サイズに応じて自動調整
    const goalZoneVertical = this.height * 0.01; // 縦画面：上下3%
    const goalZoneHorizontal = this.width * 0.01; // 横画面：左右3%

    if (this.isPortrait) {
      // ★ 縦画面：上下ゴール
      if (this.puck.y <= goalZoneVertical) {
        const type = this.reflectCount >= 5 ? "high" : "low";
        this.onGoal(type);
        return "reset";
      }
      if (this.puck.y + this.puck.h >= this.height - goalZoneVertical) {
        const type = this.reflectCount >= 5 ? "high" : "low";
        this.onGoal(type);
        return "reset";
      }
    } else {
      // ★ 横画面：左右ゴール
      if (this.puck.x <= goalZoneHorizontal) {
        const type = this.reflectCount >= 5 ? "high" : "low";
        this.onGoal(type);
        return "reset";
      }
      if (this.puck.x + this.puck.w >= this.width - goalZoneHorizontal) {
        const type = this.reflectCount >= 5 ? "high" : "low";
        this.onGoal(type);
        return "reset";
      }
    }

    // -------------------------
    // プレイヤー衝突
    // -------------------------
    if (this.collide(this.puck, this.player)) {
      this.onHit();
      this.reflectCount++;
      this.maxReflectCount = Math.max(this.maxReflectCount, this.reflectCount);

      if (this.isPortrait) {
        const offset =
          this.puck.x + this.puck.w / 2 - (this.player.x + this.player.w / 2);
        this.puck.vx = Math.max(-MAX_SPEED, Math.min(offset * 0.05, MAX_SPEED));
        this.puck.vy = -Math.abs(this.puck.vy);
      } else {
        const offset =
          this.puck.y + this.puck.h / 2 - (this.player.y + this.player.h / 2);
        this.puck.vy = Math.max(-MAX_SPEED, Math.min(offset * 0.05, MAX_SPEED));
        this.puck.vx = Math.abs(this.puck.vx);
      }
    }

    // -------------------------
    // 敵衝突
    // -------------------------
    if (this.collide(this.puck, this.enemy)) {
      this.onHit();
      this.reflectCount++;
      this.maxReflectCount = Math.max(this.maxReflectCount, this.reflectCount);

      if (this.isPortrait) {
        const offset =
          this.puck.x + this.puck.w / 2 - (this.enemy.x + this.enemy.w / 2);
        this.puck.vx = Math.max(-MAX_SPEED, Math.min(offset * 0.05, MAX_SPEED));
        this.puck.vy = Math.abs(this.puck.vy);
      } else {
        const offset =
          this.puck.y + this.puck.h / 2 - (this.enemy.y + this.enemy.h / 2);
        this.puck.vy = Math.max(-MAX_SPEED, Math.min(offset * 0.05, MAX_SPEED));
        this.puck.vx = -Math.abs(this.puck.vx);
      }
    }

    // 速度制限
    this.puck.vx = Math.max(-MAX_SPEED, Math.min(this.puck.vx, MAX_SPEED));
    this.puck.vy = Math.max(-MAX_SPEED, Math.min(this.puck.vy, MAX_SPEED));

    // -------------------------
    // 敵AI
    // -------------------------
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

    // -------------------------
    // 壁制限（プレイヤー・CPU）
    // -------------------------
    if (this.isPortrait) {
      const leftLimit = sideOffset;
      const rightLimitPlayer = this.width - this.player.w - sideOffset;
      const rightLimitEnemy = this.width - this.enemy.w - sideOffset;

      this.player.x = Math.max(
        leftLimit,
        Math.min(this.player.x, rightLimitPlayer),
      );
      this.enemy.x = Math.max(
        leftLimit,
        Math.min(this.enemy.x, rightLimitEnemy),
      );
    } else {
      const playerBottom = this.height - this.player.h - bottomOffset;
      const enemyBottom = this.height - this.enemy.h - bottomOffset;

      this.player.y = Math.max(0, Math.min(this.player.y, playerBottom));
      this.enemy.y = Math.max(0, Math.min(this.enemy.y, enemyBottom));
    }
  }

  movePlayer(pos: number) {
    if (this.isPortrait) {
      this.player.x = pos - this.player.w / 2;
    } else {
      this.player.y = pos - this.player.h / 2;
    }
  }
}
