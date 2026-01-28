export class GameLogic {
  // --- 状態 ---
  puck = { x: 0, y: 0, w: 26, h: 26, vx: 0, vy: 0 };
  player = { x: 20, y: 0, w: 18, h: 80 };
  enemy = { x: 0, y: 0, w: 18, h: 80 };

  width = 800;
  height = 450;

  playerScore = 0;
  enemyScore = 0;

  enemySpeed = 4;
  speedMultiplier = 1.0;

  playerHits = 0;
  superReady = false;

  constructor(
    width: number,
    height: number,
    enemySpeed: number,
    speedMultiplier: number,
  ) {
    this.width = width;
    this.height = height;
    this.enemySpeed = enemySpeed;
    this.speedMultiplier = speedMultiplier;

    this.resetRound(true);
  }

  // --- ラウンド初期化 ---
  resetRound(initial = false, lastWinner: "player" | "enemy" | null = null) {
    this.puck.x = this.width / 2;
    this.puck.y = this.height / 2;

    const baseSpeed = 5 * this.speedMultiplier;

    if (initial || lastWinner === "player") {
      this.puck.vx = baseSpeed;
      this.puck.vy = 0;
    } else {
      this.puck.vx = -baseSpeed;
      this.puck.vy = 0;
    }

    this.player.y = this.height / 2 - this.player.h / 2;
    this.enemy.y = this.height / 2 - this.enemy.h / 2;
    this.enemy.x = this.width - 20 - this.enemy.w;
  }

  // --- 衝突判定 ---
  collide(a: any, b: any) {
    return !(
      a.x + a.w < b.x ||
      a.x > b.x + b.w ||
      a.y + a.h < b.y ||
      a.y > b.y + b.h
    );
  }

  // --- 毎フレーム更新 ---
  update() {
    const areaTop = this.height;
    const areaBottom = 0;

    // パック移動
    this.puck.x += this.puck.vx;
    this.puck.y += this.puck.vy;

    // 壁反射
    if (this.puck.y <= areaBottom) {
      this.puck.y = areaBottom;
      this.puck.vy *= -1;
    }

    if (this.puck.y + this.puck.h >= areaTop) {
      this.puck.y = areaTop - this.puck.h;
      this.puck.vy *= -1;
    }

    // ゴール判定
    const goalWidth = 20;

    if (this.puck.x <= goalWidth) {
      this.enemyScore++;
      this.resetRound(false, "enemy");
      return;
    }

    if (this.puck.x + this.puck.w >= this.width - goalWidth) {
      this.playerScore++;
      this.resetRound(false, "player");
      return;
    }

    // 勝敗
    if (this.playerScore >= 5) return "win";
    if (this.enemyScore >= 5) return "lose";

    // プレイヤー衝突
    if (this.collide(this.puck, this.player)) {
      const offset =
        this.puck.y + this.puck.h / 2 - (this.player.y + this.player.h / 2);
      this.puck.vy = offset * 0.05;
      this.puck.vx = Math.abs(this.puck.vx);

      this.playerHits++;
      if (this.playerHits >= 5) this.superReady = true;
    }

    // 敵衝突
    if (this.collide(this.puck, this.enemy)) {
      const offset =
        this.puck.y + this.puck.h / 2 - (this.enemy.y + this.enemy.h / 2);
      this.puck.vy = offset * 0.05;
      this.puck.vx = -Math.abs(this.puck.vx);
    }

    // 敵 AI
    const puckCenter = this.puck.y + this.puck.h / 2;
    const enemyCenter = this.enemy.y + this.enemy.h / 2;

    if (puckCenter > enemyCenter + 10) {
      this.enemy.y += this.enemySpeed;
    } else if (puckCenter < enemyCenter - 10) {
      this.enemy.y -= this.enemySpeed;
    }

    // 範囲制限
    this.enemy.y = Math.max(
      0,
      Math.min(this.enemy.y, this.height - this.enemy.h),
    );
    this.player.y = Math.max(
      0,
      Math.min(this.player.y, this.height - this.player.h),
    );
  }

  // --- プレイヤー操作 ---
  movePlayer(y: number) {
    this.player.y = y - this.player.h / 2;
  }

  // --- スーパーショット ---
  superShot() {
    if (!this.superReady) return;

    this.puck.vx *= 3;
    this.puck.vy *= 3;

    this.superReady = false;
    this.playerHits = 0;
  }
}
