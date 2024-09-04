import { _decorator, Component, EventTouch, instantiate, Node, Prefab } from 'cc';
import { Enemy } from './Enemy';
import { TowerPlacement } from './TowerPlacement';
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
    private soldierPrefab: Prefab = null;
    @property(Prefab)
    private tankPrefab: Prefab = null;
    @property(Prefab)
    private planePrefab: Prefab = null;
    @property(Node)
    private wayPath: Node[] = [];
    @property(Node)
    private planePath: Node[] = [];
    @property(Node)
    private towerPlacements: Node[] = [];
    @property(Prefab)
    private towerPlacementPrefab: Prefab;

    private _towerPlacementList: TowerPlacement[] = [];

    start() {
        this.maskLayer.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.spawnEnemy(this.soldierPrefab,this.wayPath);

        // setInterval(() => {
        //     this.spawnEnemy(this.soldierPrefab,this.wayPath);
        // }, 2000);

        setInterval(() => {
            this.spawnEnemy(this.tankPrefab,this.wayPath);
        }, 2000);

        setInterval(() => {
            this.spawnEnemy(this.planePrefab,this.planePath);
        }, 7000);

        this.spawnTowerPlacement();
    }

    update(deltaTime: number) {

    }

    spawnEnemy(prefab: Prefab, path: Node[]) {
        let newEnemy = instantiate(prefab);
        newEnemy.parent = this.enemyLayer;
        newEnemy.position = this.startPoint.position;

        const enemy = newEnemy.getComponent(Enemy);
        enemy.init(path.map(node => node.position), this)
    }

    spawnTowerPlacement() {
        this.towerPlacements.forEach(point => {
            const towerPlacement = instantiate(this.towerPlacementPrefab);
            towerPlacement.parent = this.node;
            towerPlacement.position = point.position;
            towerPlacement.getComponent(TowerPlacement).levelManager = this.node;

            const tower = towerPlacement.getComponent(TowerPlacement);
            tower.levelManager = this.node;

            this._towerPlacementList.push(tower);
        })
    }

    onTouchStart(event: EventTouch) {
        this._towerPlacementList.forEach(tower => {
            tower.onHideAction();
        })
    }

    onHideActionTower(towerPlacementSelf: TowerPlacement) {
        this._towerPlacementList
            .filter(towerPlacement => towerPlacement != towerPlacementSelf)
            .forEach(towerPlacement => {
                towerPlacement.onHideAction();
            })
    }
}


