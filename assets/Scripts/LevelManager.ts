import { _decorator, Component, EventTouch, instantiate, Node, Prefab } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {

    @property(Node)
    private enemyLayer: Node = null;
    @property(Node)
    private startPoint: Node = null;
    @property(Prefab)
    private enemyPrefab: Prefab = null;
    @property(Node)
    private levelPath: Node[] = [];
    @property(Node)
    private towerPlacement: Node[] = [];
    @property(Prefab)
    private tower: Prefab;

    private _enemyList: Node[] = [];

    public get enemyList(): Node[] {
        return this._enemyList;
    }

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);

        this.towerPlacement.forEach(point => {
            const tower = instantiate(this.tower);
            tower.parent = this.node;
            tower.position = point.position;
            
            console.log('point', point.worldPosition);

        })

        setInterval(() => {
            let newEnemy = instantiate(this.enemyPrefab);
            newEnemy.parent = this.enemyLayer;
            newEnemy.position = this.startPoint.position;

            const enemy = newEnemy.getComponent(Enemy);
            enemy.init(this.levelPath.map(node => node.position))
            enemy.levelManager = this;

            this.enemyList.push(newEnemy);
        }, 3000);

    }

    update(deltaTime: number) {

    }

    removeEnemy(enemyRemove: Node) {
        this._enemyList = this._enemyList.filter(enemy => enemy != enemyRemove);
    }

    onTouchStart(event: EventTouch) {

    }
}


