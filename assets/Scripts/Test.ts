import { _decorator, Component, Node, SpriteFrame, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    @property(Node)
    private target: Node;

    start() {
        setTimeout(() => {
            tween(this.target.getParent())
                .to(2, { position: new Vec3(0, 200) })
                .start();
        }, 1000);
        setTimeout(() => {
            tween(this.target.getParent())
                .to(2, { position: new Vec3(-200, 0) })
                .start();
        }, 4000);
        setTimeout(() => {
            tween(this.target.getParent())
                .to(2, { position: new Vec3(0, -200) })
                .start();
        }, 7000);
        setTimeout(() => {
            tween(this.target.getParent())
                .to(2, { position: new Vec3(200, 0) })
                .start();
        }, 10000);
    }

    update(dt: number): void {

        const diffTowerToTarget = new Vec3();
        Vec3.subtract(diffTowerToTarget, this.node.getParent().position, this.target.getParent().position);

        const angleShoot = 90 - Math.atan2(diffTowerToTarget.x, diffTowerToTarget.y) * (180 / Math.PI);

        this.node.angle = angleShoot;
    }
}
