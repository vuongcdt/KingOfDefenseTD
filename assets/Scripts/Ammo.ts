import { _decorator, Collider2D, Color, Component, Contact2DType, game, IPhysics2DContact, math, Node, Sprite, SpriteFrame, Tween, tween, v3, Vec3 } from 'cc';
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
    protected _tweenMove: Tween<Node>[] = [];
    protected _currentPos: Vec3 = Vec3.ZERO;
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

        let diff = p2.clone().subtract(p0);
        diff = diff.normalize();

        const point = p0.clone().add(diff.clone().multiplyScalar(400));
        let anglePoint = diff.clone().multiplyScalar(100);

        this._currentPos = p0;

        const points = [];

        const nodeTweenStart = tween(this.node).to(speed * 1, { position: point.clone() });
        this._tweenMove.push(nodeTweenStart);

        points.push(p0.clone())
        points.push(point.clone());

        for (let index = 0; index < 6; index++) {
            const addPoint = this.rotateVector(anglePoint, 30 * (index + 1));
            point.add(addPoint);

            const nodeTween = tween(this.node).to(speed * 0.3, { position: point.clone(), angle: this.getAngleRocket(point.clone()) });
            this._tweenMove.push(nodeTween);
            points.push(point.clone());
        }

        const nodeTweenEnd = tween(this.node)
            .call(() => this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this))
            .to(speed * 1, { position: p2.clone(), angle: this.getAngleRocket(p2.clone()) });

        this._tweenMove.push(nodeTweenEnd);
        points.push(p2);

        // this.drawLineFromPoints(points);

        tween(this.node)
            .sequence(...this._tweenMove)
            .removeSelf()
            .start();
    }

    drawLineFromPoints(points: Vec3[]) {
        const store = Store.getInstance();
        const g = store.getGraphics();
        g.strokeColor = Color.RED;
        g.lineWidth = 5;

        g.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            g.lineTo(points[i].x, points[i].y);
        }

        g.stroke();
    }

    rotateVector(originalVector: Vec3, angleInDegrees: number): Vec3 {
        const angleInRadians = math.toRadian(angleInDegrees);

        const x = originalVector.x;
        const y = originalVector.y;

        const newX = x * Math.cos(angleInRadians) - y * Math.sin(angleInRadians);
        const newY = x * Math.sin(angleInRadians) + y * Math.cos(angleInRadians);

        return new Vec3(newX, newY);
    }

    getAngleRocket(newPoint: Vec3) {
        let diff = newPoint.clone().subtract(this._currentPos);

        this._currentPos = newPoint.clone();
        const angle = 270 + Math.atan2(diff.y, diff.x) * (180 / Math.PI)

        return angle;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let target = otherCollider.node.getComponent(Enemy);

        if (!target) {
            return;
        }

        tween(this.node).removeSelf().start();
        target.setHP(this._damage);
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

    getBezierPoints(numPoints: number, P0: Vec3, P1: Vec3, P2: Vec3): Vec3[] {
        const points: Vec3[] = [];
        const step = 1 / (numPoints - 1);

        for (let i = 0; i < numPoints; i++) {
            const t = step * i;
            const x = Math.pow(1 - t, 2) * P0.x + 2 * (1 - t) * t * P1.x + Math.pow(t, 2) * P2.x;
            const y = Math.pow(1 - t, 2) * P0.y + 2 * (1 - t) * t * P1.y + Math.pow(t, 2) * P2.y;
            points.push(new Vec3(x, y, 0));
        }

        return points;
    }
}


