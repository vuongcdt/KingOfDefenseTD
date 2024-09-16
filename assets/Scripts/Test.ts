import { _decorator, Color, Component, Graphics, Node, SpriteFrame, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    @property(Node)
    private target: Node;

    // start() {
    //     const startPos = this.node.position;           // Vị trí bắt đầu của viên đạn
    //     const controlPoint = v3(300, 300);          // Điểm điều khiển để tạo đường cong
    //     const endPos = v3(600, 0);                  // Vị trí kết thúc của viên đạn

    //     // Tạo Tween với hành động tùy chỉnh
    //     tween(this.node)
    //         .to(2, { position: controlPoint })           // Di chuyển viên đạn tới điểm điều khiển
    //         .to(2, { position: endPos })                 // Sau đó di chuyển tới điểm kết thúc
    //         .start();
    // }

    start() {
        const p0 = v3(0, 0);
        const p1 = v3(400, 300);
        const p2 = v3(500, 0);

        const p3 = v3(100, 100);
        const p4 = v3(200, -600);
        const p5 = v3(300, -100);

        // this.drawCurve(p0, p1, p2);
        // this.drawCurve(p3, p4, p5);

    }

    drawCurve(p0: Vec3, p1: Vec3, p2: Vec3) {
        const graphics = this.getComponent(Graphics);
        graphics.strokeColor = Color.RED;
        graphics.lineWidth = 15;
        graphics.moveTo(p0.x,p0.y);
        graphics.bezierCurveTo(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y);
        graphics.stroke();

        const points = this.getBezierPoints(10, p0, p1, p2);
        console.log("Bezier Curve Points:", points);
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

    update(dt: number): void {

    }
}
