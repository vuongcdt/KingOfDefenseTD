import { _decorator, Collider2D, Color, Contact2DType, IPhysics2DContact, math, Node, randomRangeInt, Sprite, tween, Vec3 } from 'cc';
import { Ammo } from './Ammo';
import Store from '../Store';
import { eventTarget } from '../Common';
import { PLAY_EXPLOSION_SOUND, PLAY_ROCKET_SOUND } from '../CONSTANTS';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('Rocket')
export class Rocket extends Ammo {
    private _angleOffset: number = 20;
    private _offsetRound: number = 70;
    private _offsetLine: number = 250;
    private _speed: number = 1;

    initWithRocket(target: Node, speed: number, damage: number, angleShoot: number, levelTower: number) {
        eventTarget.emit(PLAY_ROCKET_SOUND);
        this._target = target;
        this._speed = speed;
        this._damage = damage;
        this.node.angle = angleShoot;
        this._collider = this.getComponent(Collider2D);
        this.getComponent(Sprite).spriteFrame = this.bodySprites[levelTower];

        const random = 0.7 + randomRangeInt(0, 5) / 5;

        const diff = target.position.clone().subtract(this.node.position);
        const dir = diff.normalize();
        const addPos = dir.clone().multiplyScalar(this._offsetLine * random);
        const newPos = target.position.clone().add(addPos);

        // this.drawLineFromPoints([this.node.position, newPos]);

        tween(this.node).to(this.getTimeMove(newPos), { position: newPos })
            .call(() => this.moveRocket(dir))
            .start();
    }

    moveRocket(dir: Vec3) {
        let index = 1;

        this.moveRound(dir, index);

        let time = setInterval(() => {
            index++;
            const angleToTarget = this.getAngleToTarget();

            if (this.node.angle - angleToTarget > this._angleOffset * 1) {
                this.moveRound(dir, index);
                return;
            }

            clearInterval(time);
            this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

            this.moveToTarget(angleToTarget);

            time = setInterval(() => {
                this.moveToTarget(time);
            }, this._offsetRound);

            setTimeout(() => {
                clearInterval(time);
            }, 1 * 1000);
        }, this._offsetRound);
    }

    moveRound(dir: Vec3, index: number) {
        this._currentPos = this.node.position;

        const addPos = this.rotateVector(dir.clone().multiplyScalar(this._offsetRound), -this._angleOffset * index);
        const position = this.node.position.clone().add(addPos);

        const angle = this.node.angle - this._angleOffset;

        // this.drawLineFromPoints([this.node.position, position]);

        tween(this.node).to(this.getTimeMove(position), { position }).start();
        tween(this.node).to(this.getTimeMove(position) * 0.5, { angle }).start();
    }

    moveToTarget(time: number) {
        const diff = this._target.position.clone().subtract(this.node.position);
        const dir = diff.normalize();
        const distance = Vec3.distance(this._target.position, this.node.position);

        const addPos = dir.clone().multiplyScalar(this._offsetRound);


        let position = Vec3.ZERO
        const isNearTarget = distance < this._offsetRound * 2;
        if (isNearTarget) {
            position = this._target.position;
            clearInterval(time);
            tween(this.node).to(this.getTimeMove(position), { position }).removeSelf().start();
        } else {
            position = this.node.position.clone().add(addPos);
            tween(this.node).to(this.getTimeMove(position), { position }).start();
        }

        const angle = this.getAngleRocket(position);
        tween(this.node).to(this.getTimeMove(position) * 0.5, { angle }).start();
    }

    getTimeMove(target: Vec3): number {
        const distance = Vec3.distance(target, this.node.position);
        return distance / 1000 / this._speed;
    }

    drawLineFromPoints(points: Vec3[]) {
        const store = Store.getInstance();
        const g = store.graphics;
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
        const diff = newPoint.clone().subtract(this._currentPos.clone());

        this._currentPos = newPoint.clone();
        const angle = Math.atan2(diff.y, diff.x) * (180 / Math.PI);

        return (270 + angle) % 360;
    }

    getAngleToTarget(): number {
        const diff = this._target.position.clone().subtract(this._currentPos);
        const angle = Math.atan2(diff.y, diff.x) * (180 / Math.PI);
        return angle - 90;
    }

    drawCurve(p0: Vec3, p1: Vec3, p2: Vec3) {
        const store = Store.getInstance();

        const graphics = store.graphics;
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

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const target = otherCollider.node.getComponent(Enemy);

        if (!target) {
            return;
        }
        eventTarget.emit(PLAY_EXPLOSION_SOUND);

        tween(this.node).removeSelf().start();

        target.setHP(this._damage);
    }
}


