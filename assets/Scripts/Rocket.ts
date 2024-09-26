import { _decorator, Collider2D, Color, Contact2DType, math, randomRangeInt, Sprite, tween, Vec3 } from 'cc';
import { Ammo } from './Ammo';
import Store from './Store';
const { ccclass, property } = _decorator;

@ccclass('Rocket')
export class Rocket extends Ammo {
    update(deltaTime: number) {
        this.setAngleEnd();
    }

    setAngleEnd() {
    }

    init(target: Vec3, speed: number, damage: number, angleShoot: number, levelTower: number) {
        this._damage = damage;
        this.node.angle = angleShoot;
        this._collider = this.getComponent(Collider2D);
        this.getComponent(Sprite).spriteFrame = this.bodySprites[levelTower];

        const p0 = this.node.position;
        const p2 = target;

        let diff = p2.clone().subtract(p0);
        diff = diff.normalize();

        const randomNum = randomRangeInt(8, 12);
        const angleAxis = -30;

        diff = this.rotateVector(diff, 15);
        this.node.angle += 15;

        let point = p0.clone().add(diff.clone().multiplyScalar(randomNum * 50));

        let anglePoint = diff.clone().multiplyScalar(120);

        this._currentPos = p0;
        const points = [p0.clone(), point.clone()];

        for (let index = 0; index < 6; index++) {
            anglePoint.multiplyScalar(0.9);
            const addPoint = this.rotateVector(anglePoint, angleAxis * (index + 1));
            point.add(addPoint);
            points.push(point.clone());
        }

        points.push(p2);

        let angle = angleShoot;
        let speedFly = speed * 0.1;

        for (let index = 1; index < points.length; index++) {
            const position = points[index];
            speedFly *= 0.9;
            let ducation = index == 1 ? speed * 0.4 : speedFly;

            if (index == points.length - 1) {
                ducation = speedFly * 3;
            }

            angle = (index == 1 || index == points.length - 1) ? angle : (angle + angleAxis) % 360;
            let nodeTween;

            if (index == points.length - 1) {
                nodeTween = tween(this.node)
                    .call(() => {

                        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

                        this.setAngleEnd = () => {
                            this.node.angle = this.getAngleRocket(target);
                            this.setAngleEnd = () => { };
                        }
                    })
                    .to(ducation, { position });
            } else {
                nodeTween = tween(this.node).to(ducation, { position, angle });
            }

            this._tweenMove.push(nodeTween);
        }

        // this.drawLineFromPoints(points.slice(0, points.length - 1));

        tween(this.node)
            .sequence(...this._tweenMove)
            .removeSelf()
            .start();
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
        let diff = newPoint.clone().subtract(this._currentPos);

        this._currentPos = newPoint.clone();
        const angle = Math.atan2(diff.y, diff.x) * (180 / Math.PI);
        const result = angle > 90 ? angle - 90 : 270 + angle;
        return result;
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
}


