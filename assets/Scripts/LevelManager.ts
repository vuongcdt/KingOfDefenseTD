import { _decorator, Color, Component, EventTouch, game, Graphics, instantiate, Node, Prefab, random, randomRange, v3, Vec2, Vec3 } from 'cc';
import { Enemy } from './Enemy';
import { TowerPlacement } from './TowerPlacement';
import Store from './Store';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {
    @property(Node)
    private maskLayer: Node = null;
    @property(Node)
    private enemyLayer: Node = null;
    @property(Node)
    private startPoint: Node = null;
    @property(Node)
    private endPoint: Node = null;
    @property(Prefab)
    private soldierPrefab: Prefab = null;
    @property(Prefab)
    private tankPrefab: Prefab = null;
    @property(Prefab)
    private planePrefab: Prefab = null;
    @property(Node)
    private wayPathBlock: Node;
    @property(Node)
    private planePathBlock: Node;
    @property(Node)
    private towerPlacementBlock: Node;
    @property(Prefab)
    private towerPlacementPrefab: Prefab;

    private _wayPaths: Vec3[] = [];
    private _planePaths: Vec3[] = [];
    private _towerPlacements: Vec3[] = [];
    private _startPos: Vec3;
    private _endPos: Vec3;
    private _towerPlacementList: TowerPlacement[] = [];
    private _store: Store;
    private _count: number = 0;
    private _time1: number;
    private _time2: number;
    private _coefficient = 1;

    start() {
        this._store = Store.getInstance();
        this._store.setLevelManage(this.node);

        this._startPos = this.startPoint.position;
        this._endPos = this.endPoint.position;
        this._wayPaths = this.wayPathBlock.children.map(node => node.position);
        this._planePaths = this.planePathBlock.children.map(node => node.position);
        this._towerPlacements = this.towerPlacementBlock.children.map(node => node.position);

        this.generateWay();
        this.maskLayer.on(Node.EventType.TOUCH_START, this.onTouchStart, this);

        this.spawnEnemy(this.soldierPrefab, this._wayPaths);
        this.spawnEnemy(this.soldierPrefab, this._wayPaths);
        // this.spawnEnemy(this.tankPrefab, this._wayPaths);

        setInterval(() => {
        if (game.isPaused()) {
            return;
        }
            this.spawnEnemy(this.soldierPrefab,this._wayPaths);
            this.spawnEnemy(this.soldierPrefab,this._wayPaths);
        }, 2000 * this._coefficient);

        this._time1 = setInterval(() => {
            // if (this._count >= 5) {
            // clearInterval(this._time1);
            // }

            if (game.isPaused()) {
                return;
            }
            this._count++;
            this.spawnEnemy(this.tankPrefab, this._wayPaths);
            this.spawnEnemy(this.tankPrefab, this._wayPaths);
        }, 5000 * this._coefficient);

        this._time2 = setInterval(() => {
            // if (this._count >= 5) {
            //     clearInterval(this._time2);
            // }
            if (game.isPaused()) {
                return;
            }
            this.spawnEnemy(this.planePrefab, this._planePaths);
            this.spawnEnemy(this.planePrefab, this._planePaths);
        }, 5000 * this._coefficient);

        this.spawnTowerPlacement();
    }

    generateWay() {
        let graphics = this.getComponent(Graphics);

        graphics.strokeColor = new Color().fromHEX("#dc7633");
        graphics.lineWidth = 200;

        let points = [
            this._startPos,
            ...this._wayPaths,
            this._endPos,
        ];

        this.drawBezierCurve(graphics, points);
        graphics.stroke();
    }

    drawBezierCurve(graphics: Graphics, points: Vec3[]) {
        if (points.length < 4) {
            console.error("Cần ít nhất 4 điểm để vẽ một đoạn Bezier.");
            return;
        }

        graphics.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i += 3) {
            let p0 = points[i - 1];
            let p1 = points[i];
            let p2 = points[i + 1];

            graphics.bezierCurveTo(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y);
        }
    }

    spawnEnemy(prefab: Prefab, path: Vec3[]) {
        let newEnemy = instantiate(prefab);
        newEnemy.parent = this.enemyLayer;
        newEnemy.position = this._startPos;

        const enemy = newEnemy.getComponent(Enemy);
        enemy.init(path, this)
    }

    spawnTowerPlacement() {
        this._towerPlacements.forEach(point => {
            const towerPlacement = instantiate(this.towerPlacementPrefab);
            towerPlacement.parent = this.towerPlacementBlock;
            towerPlacement.position = point;
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

    update(deltaTime: number) {

    }

}


