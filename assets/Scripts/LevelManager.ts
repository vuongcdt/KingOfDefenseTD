import { _decorator, Component, EventTouch, instantiate, Node, Prefab } from 'cc';
import { Enemy } from './Enemy';
import { Tower } from './Tower';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {

    @property(Node)
    private maskLayer: Node = null;
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

    private _towerList: Tower[] = [];
    private _enemyList: Node[] = [];

    public get enemyList(): Node[] {
        return this._enemyList;
    }

    start() {
        this.maskLayer.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.spawnEnemy();
        this.spawnTowerPlacement();
    }

    update(deltaTime: number) {

    }

    spawnEnemy() {
        setInterval(() => {
            let newEnemy = instantiate(this.enemyPrefab);
            newEnemy.parent = this.enemyLayer;
            newEnemy.position = this.startPoint.position;

            const enemy = newEnemy.getComponent(Enemy);
            enemy.init(this.levelPath.map(node => node.position))
            enemy.levelManager = this;

            this.enemyList.push(newEnemy);
        }, 2000);
    }

    spawnTowerPlacement() {
        this.towerPlacement.forEach(point => {
            const newTower = instantiate(this.tower);
            newTower.parent = this.node;
            newTower.position = point.position;

            const tower = newTower.getComponent(Tower);
            tower.levelManager = this.node;
            tower.enemyName = this.enemyPrefab.name;

            this._towerList.push(tower);
        })
    }

    removeEnemy(enemyRemove: Node) {
        this._enemyList = this._enemyList.filter(enemy => enemy != enemyRemove);
    }

    onTouchStart(event: EventTouch) {
        this._towerList.forEach(tower => {
            tower.onHideAction();
        })
    }

    onHideActionTower(self: Tower) {
        this._towerList
            .filter(tower => tower != self)
            .forEach(tower => {
                tower.onHideAction();
            })
    }
}


