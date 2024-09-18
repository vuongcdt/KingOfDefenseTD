import { _decorator, Camera, Component, EventMouse, EventTouch, input, Input, Node, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cannon')
export class Cannon extends Component {
    @property(Node)
    nodeParent: Node = null;
    @property(Camera)
    camera: Camera = null;

    @property(Node)
    node1: Node = null;

    systems: any = []

    start() {
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this)
        // input.on(Input.EventType.TOUCH_START, this.onMouseMove, this)
    }

    onMouseMove(e: EventMouse | EventTouch) {
        let mousePosUI = e.getLocation();
        const mousePosWorld = new Vec3();
        this.camera.screenToWorld(new Vec3(mousePosUI.x, mousePosUI.y, 0), mousePosWorld);
        let mouseInNode = new Vec3()
        this.node.getComponent(UITransform).convertToNodeSpaceAR(mousePosWorld, mouseInNode)


        // Tạo vector từ node đến vị trí chuột
        const direction = new Vec2(mouseInNode.x - this.node.position.x, mouseInNode.y - this.node.position.y);

        // Tính góc (trả về giá trị radian)
        const angle = Math.atan2(direction.y, direction.x);

        // Chuyển đổi từ radian sang độ nếu cần
        const angleInDegrees = angle * (180 / Math.PI);

        console.log('Góc giữa chuột và node: ', angleInDegrees);
        this.node1.angle = angleInDegrees - 90;

    }

    update(deltaTime: number) {
        this.systems.forEach(item => {
            item.update(deltaTime)
        });
    }

    // onLoad() {
    //     input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    // }

    // onDestroy() {
    //     input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    // }

    // onTouchStart(event: EventTouch) {
    //     console.log(event.getLocation());  // location on screen space
    //     console.log(event.getUILocation());  // location on UI space
    //     let world = new Vec3();
    //     console.log('this node', this.node.getComponent(UITransform).convertToWorldSpaceAR(world));

    // }
}


