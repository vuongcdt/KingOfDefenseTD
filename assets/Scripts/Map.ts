import { _decorator, Component, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class Map extends Component {
    @property(Prefab)
    private boxPrefab: Prefab;
    @property(Node)
    private canvas: Node;

    private _pointArray: Vec3[];

    get pointArray() {
        return this._pointArray
    }

    set pointArray(val: Vec3[]) {
        this._pointArray = val
    }

    protected start(): void {
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 11; x++) {
                const boxRightTop = instantiate(this.boxPrefab)
                const boxLeftTop = instantiate(this.boxPrefab)
                const boxRightBot = instantiate(this.boxPrefab)
                const boxLeftBot = instantiate(this.boxPrefab)
                const tranform = boxRightTop.getComponent(UITransform);
                const size = tranform.contentSize;
                boxRightTop.parent = this.node;
                boxLeftTop.parent = this.node;
                boxRightBot.parent = this.node;
                boxLeftBot.parent = this.node;
                boxRightTop.position = new Vec3(x * size.width, y * size.height);
                boxLeftTop.position = new Vec3(-x * size.width, y * size.height);
                boxRightBot.position = new Vec3(x * size.width, -y * size.height);
                boxLeftBot.position = new Vec3(-x * size.width, -y * size.height);
            }
        }
    }

}


