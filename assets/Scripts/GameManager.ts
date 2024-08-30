import { _decorator, Component, Node, Quat, Vec2, Vec3, } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    private canvas: Node;

    @property(Node)
    private canvas2: Node;
    // @property(Graphics)
    // private line: Graphics;

    private _gameState: number;

    public get gameState(): number {
        return this._gameState;
    }

    public set gameState(value: number) {
        this._gameState = value;
    }

    checkGameState() {

    }

    start() {
        // for (let i = 0; i < this._listPoint.length; i++) {
        //     const newPos = this._listPoint[i];
        //     this.line.lineTo(newPos.x, newPos.y)
        //     this.line.moveTo(newPos.x, newPos.y)
        // }
        // this.line.stroke();
        // this.spawnEnemy();

        // Giả sử bạn có hai Vec3
        // let vecA = new Vec3(1, 0.5, 0);  // Vector đầu tiên
        // let vecB = new Vec3(0, 1, 0);  // Vector thứ hai

        // // Chuẩn hóa hai vector để đảm bảo chúng có độ dài bằng 1
        // Vec3.normalize(vecA, vecA);
        // Vec3.normalize(vecB, vecB);

        // // Tính toán quaternion đại diện cho góc quay từ vecA đến vecB
        // let rotationQuat = new Quat();
        // Quat.rotationTo(rotationQuat, vecA, vecB);
        // // let rot = new Vec3();
        // // rotationQuat.getEulerAngles(rot);
        // // this.canvas2.setRotationFromEuler(rot);

        // // Áp dụng quaternion này cho đối tượng
        // // let myNode = new Node(); // Giả sử bạn có một đối tượng Node
        // this.canvas2.setRotation(rotationQuat);
        // // console.log(rotationQuat);
        // console.log(this.canvas2.eulerAngles);
        // // let ro2t = new Vec3();
        // // console.log(this.canvas2.rotation.getEulerAngles(ro2t));

        // Giả sử bạn có hai Vec2
        let vecA = new Vec2(0, 200);  // Vector đầu tiên
        let vecB = new Vec2(200, 0);  // Vector thứ hai

        // Tính tích vô hướng của hai vector
        let dot = Vec2.dot(vecA, vecB);

        // Tính độ dài của từng vector
        let lengthA = vecA.length();
        let lengthB = vecB.length();

        // Tính cos(theta)
        let cosTheta = dot / (lengthA * lengthB);

        // Tính góc (theo radian)
        let angleInRadians = Math.acos(cosTheta);

        // Chuyển đổi sang độ
        let angleInDegrees = angleInRadians * (180 / Math.PI);
        this.canvas2.angle = angleInDegrees;
        console.log(angleInDegrees); // Kết quả sẽ là 90 độ nếu hai vector vuông góc

        // let diff:Vec2 = new Vec2();
        // Vec2.subtract(diff, vecA, vecB);
        // const angle = Math.atan2(diff.x,diff.y) * (180 / Math.PI);
        // console.log('angle',angle);
        
    }

    update(deltaTime: number) {

    }
}


