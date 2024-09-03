import { _decorator, Component, EventTouch, instantiate, Node, Prefab } from 'cc';
import { Enemy } from './Enemy';
import { Tower } from './Tower';
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
    private enemyPrefab: Prefab = null;
    @property(Node)
    private levelPath: Node[] = [];
    @property(Node)
    private towerPlacements: Node[] = [];
    @property(Prefab)
    private towerPlacementPrefab: Prefab;

    private _towerPlacementList: TowerPlacement[] = [];

    start() {
        this.maskLayer.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.spawnEnemy();
        setInterval(() => {
            this.spawnEnemy();
        }, 2000);
        this.spawnTowerPlacement();
    }

    update(deltaTime: number) {

    }

    spawnEnemy() {
        let newEnemy = instantiate(this.enemyPrefab);
        newEnemy.parent = this.enemyLayer;
        newEnemy.position = this.startPoint.position;

        const enemy = newEnemy.getComponent(Enemy);
        enemy.init(this.levelPath.map(node => node.position))
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


