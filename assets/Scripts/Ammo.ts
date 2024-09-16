import { _decorator, Collider2D, Color, Component, Contact2DType, game, IPhysics2DContact, Node, Sprite, SpriteFrame, Tween, tween, v3, Vec3 } from 'cc';
import { Enemy } from './Enemy';
import Store from './Store';
const { ccclass, property } = _decorator;

@ccclass('Ammo')
export class Ammo extends Component {
    @property([SpriteFrame])
    protected bodySprites: SpriteFrame[] = [];
    @property([SpriteFrame])
    protected rocketTailSprites: SpriteFrame[] = [];

    protected _damage: number;
    protected tweenMove: Tween<Node>[] = [];
    protected currentPos: Vec3 = Vec3.ZERO;
    protected _collider: Collider2D;

    start() {
        this._collider = this.getComponent(Collider2D);
        // if (collider) {
        //     collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        // }
    }

    update(deltaTime: number) {

    }

    init(target: Vec3, speed: number, damage: number, angleShoot: number, levelTower: number) {
        this._damage = damage;
        this.node.angle = angleShoot;

        this.getComponent(Sprite).spriteFrame = this.bodySprites[levelTower];
        this.getComponentInChildren(Sprite).spriteFrame = this.rocketTailSprites[levelTower];

        tween(this.node).to(speed, { position: target })
            .removeSelf()
            .start();
    }

    initWithRocket(target: Node, speed: number, damage: number, angleShoot: number, levelTower: number) {
        this._damage = damage;
        this.node.angle = angleShoot;

        this.getComponent(Sprite).spriteFrame = this.bodySprites[levelTower];
        this.getComponentInChildren(Sprite).spriteFrame = this.rocketTailSprites[levelTower];

        const p0 = this.node.position;
        const p2 = target.position;

        // const p1 = Math.abs(p2.x - p0.x) < Math.abs(p2.y - p0.y)
        //     ? v3((p0.x + p2.x) * 0.5, (p2.y - p0.y) * 3)
        //     : v3((p2.x - p0.x) * 3, (p2.y + p0.y) * 0.5);

        const p1 = Math.abs(p2.x - p0.x) < Math.abs(p2.y - p0.y)
            ? v3(p0.x - 200, (p2.y - p0.y) * 3)
            : v3((p2.x - p0.x) * 3, p2.y - 200);

        this.drawCurve(p0, p1, p2);
        const points = this.getBezierPoints(10, p0, p1, p2);
        this.currentPos = p0;

        points
            .slice(1, 10)
            .forEach((point, index) => {
                const nodeTween = tween(this.node)
                    .to(speed * 0.5, { position: point, angle: this.getAngleRocket(point) })
                    .call(() => {
                        if (index == 7) this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
                    });
                this.tweenMove.push(nodeTween);
            })
        // game.pause();

        tween(this.node)
            .sequence(...this.tweenMove)
            .start();
    }

    getAngleRocket(newPoint: Vec3) {
        let diff = new Vec3();
        Vec3.subtract(diff, newPoint, this.currentPos);

        this.currentPos = new Vec3(newPoint.x, newPoint.y);
        const angle = 270 + Math.atan2(diff.y, diff.x) * (180 / Math.PI)

        return angle;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let target = otherCollider.node.getComponent(Enemy);

        if (!target) {
            return;
        }

        tween(this.node).removeSelf().start();
        // target.setHP(this._damage);
    }

    drawCurve(p0: Vec3, p1: Vec3, p2: Vec3) {
        const store = Store.getInstance();

        const graphics = store.getGraphics();
        // const graphics = this.getComponent(Graphics);
        graphics.strokeColor = Color.RED;
        graphics.lineWidth = 5;
        graphics.moveTo(p0.x, p0.y);
        graphics.bezierCurveTo(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y);
        graphics.stroke();
    }


    // Hàm tính toán các điểm trên đường cong Bezier
    getBezierPoints(numPoints: number, P0: Vec3, P1: Vec3, P2: Vec3): Vec3[] {
        const points: Vec3[] = [];
        const step = 1 / (numPoints - 1); // Bước chia thời gian từ 0 đến 1

        for (let i = 0; i < numPoints; i++) {
            const t = step * i;
            const x = Math.pow(1 - t, 2) * P0.x + 2 * (1 - t) * t * P1.x + Math.pow(t, 2) * P2.x;
            const y = Math.pow(1 - t, 2) * P0.y + 2 * (1 - t) * t * P1.y + Math.pow(t, 2) * P2.y;
            points.push(new Vec3(x, y, 0)); // Tạo một điểm Vec3 mới và thêm vào danh sách
        }

        return points;
    }
}


