import { _decorator, Camera, Color, Component, EPhysics2DDrawFlags, EventTouch, game, Graphics, instantiate, Node, PhysicsSystem2D, Prefab, randomRange, randomRangeInt, Sprite, SpriteFrame, Vec3 } from 'cc';
import { Enemy } from './Enemy';
import { TowerPlacement } from './TowerPlacement';
import Store from './Store';
import { enemiesData, EnemySpawn } from './EnemyData';
import { CharacterType } from './Enums';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {
    @property(Camera)
    private camera: Camera = null;
    @property(Node)
    private maskLayer: Node = null;
    @property(Node)
    private enemyLayer: Node = null;
    @property(Node)
    private startPoint: Node = null;
    @property(Node)
    private endPoint: Node = null;
    @property([Prefab])
    private prefabEnemies: Prefab[] = [];
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
    @property([SpriteFrame])
    private stoneSprites: SpriteFrame[] = [];
    @property(Node)
    private background: Node;
    @property({ type: [EnemySpawn] })
    private enemiesData: EnemySpawn[] = [];

    private _treeNodes: Node[] = [];
    private _wayPaths: Vec3[] = [];
    private _planePaths: Vec3[] = [];
    private _towerPlacements: Vec3[] = [];
    private _startPos: Vec3;
    private _endPos: Vec3;
    private _towerPlacementList: TowerPlacement[] = [];
    private _store: Store;
    private _count: number = 0;
    private _coefficient = 2;
    private _indexSpawn: number = 0;
    private _arrIndex: number[] = [0, 1, -1, 2, -2, 3, -3];
    private _time = 0;


    start() {

        // PhysicsSystem2D.instance.debugDrawFlags = 
        // EPhysics2DDrawFlags.Aabb
        //     | EPhysics2DDrawFlags.Pair
        //     | EPhysics2DDrawFlags.CenterOfMass
        //     | EPhysics2DDrawFlags.Joint
        //     | EPhysics2DDrawFlags.Shape
        //     ;

        const graphics = this.getComponent(Graphics);
        this.enemiesData = enemiesData;
        this._store = Store.getInstance();
        this._store.setLevelManage(this.node);
        this._store.setGraphics(graphics);

        this._startPos = this.startPoint.position;
        this._endPos = this.endPoint.position;
        this._treeNodes = this.background.children;
        this._wayPaths = this.wayPathBlock.children.map(node => node.position);

        this._wayPaths.unshift(this._startPos);
        this._wayPaths.push(this._endPos);

        this._planePaths = this.planePathBlock.children.map(node => node.position);
        this._towerPlacements = this.towerPlacementBlock.children.map(node => node.position);

        this.generateWay();
        this.generateStoneAndTree();

        this.maskLayer.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        
        this.onStartClick();

        this.spawnTowerPlacement();
    }

    onStartClick(){
        this.spawnEnemyData();
        // this.spawnEnemy(this.soldierPrefab, this._wayPaths);
        // this.spawnEnemy(this.tankPrefab, this._wayPaths);

        setInterval(() => {
            if (game.isPaused()) {
                return;
            }
            this.spawnEnemyData();
            // this.spawnEnemy(this.soldierPrefab, this._wayPaths);
            // this.spawnEnemy(this.tankPrefab, this._wayPaths);
        }, 10 * 1000);
    }

    spawnEnemyData() {
        enemiesData.forEach(data => {
            const path = data.type == CharacterType.Plane ? this._planePaths : this._wayPaths;
            this._time += data.time;
            setTimeout(() => {
                for (const _ of Array(data.total)) {
                    this.spawnEnemy(this.prefabEnemies[data.type - 1], path);
                }
            }, this._time * 1000);
        })
    }

    generateStoneAndTree() {
        const offset = 150;
        const stonePos = [];
        while (true) {
            if (stonePos.length > this._treeNodes.length - 1) {
                break;
            }
            const randomX = randomRange(-960, 960);
            const randomY = randomRange(-540, 540);
            let isPass = true;

            for (let index = 0; index < this._wayPaths.length - 1; index++) {
                const point1 = this._wayPaths[index];
                const point2 = this._wayPaths[index + 1];

                const maxX = Math.max(point1.x, point2.x);
                const minX = Math.min(point1.x, point2.x);

                const maxY = Math.max(point1.y, point2.y);
                const minY = Math.min(point1.y, point2.y);
                if (randomX < maxX + offset && randomX > minX - offset && randomY < maxY + offset && randomY > minY - offset) {
                    isPass = false;
                    break;
                }
            }

            for (let index = 0; index < this._towerPlacements.length - 1; index++) {
                const point1 = this._towerPlacements[index];
                const point2 = this._towerPlacements[index + 1];

                const maxX = Math.max(point1.x, point2.x);
                const minX = Math.min(point1.x, point2.x);

                const maxY = Math.max(point1.y, point2.y);
                const minY = Math.min(point1.y, point2.y);
                if (randomX < maxX + offset && randomX > minX - offset && randomY < maxY + offset && randomY > minY - offset) {
                    isPass = false;
                    break;
                }
            }

            if (isPass) {
                stonePos.push(new Vec3(randomX, randomY));
            }
        }

        stonePos.forEach((pos, index) => {
            this._treeNodes[index].position = pos;
            // this._treeNodes[index].getComponent(Sprite).spriteFrame = this.stoneSprites[index % this.stoneSprites.length];
            this._treeNodes[index].getComponent(Sprite).spriteFrame = this.stoneSprites[randomRangeInt(0, this.stoneSprites.length)];
        })
    }

    generateWay() {
        let graphics = this.getComponent(Graphics);

        // graphics.strokeColor = new Color().fromHEX("#dc7633");//FC9451
        graphics.strokeColor = new Color().fromHEX("#47565A");
        graphics.lineWidth = 150;

        this.drawBezierCurve(graphics, this._wayPaths);
        graphics.stroke();
    }

    drawBezierCurve(graphics: Graphics, points: Vec3[]) {
        graphics.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i += 3) {
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

        const index = this._arrIndex[this._indexSpawn];

        const enemy = newEnemy.getComponent(Enemy);
        enemy.init(path, this, index)

        this._indexSpawn++;
        if (this._indexSpawn > 2) {
            this._indexSpawn = 0;
        }
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


