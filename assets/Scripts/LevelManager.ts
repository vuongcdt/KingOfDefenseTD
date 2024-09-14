import { _decorator, Color, Component, EventTouch, game, Graphics, instantiate, Node, Prefab, randomRange, randomRangeInt, Sprite, SpriteFrame, Vec3 } from 'cc';
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
    @property([SpriteFrame])
    private stoneSprites: SpriteFrame[] = [];
    @property(Node)
    private background: Node;

    private _treeNodes: Node[] = [];
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
    private _coefficient = 2;

    start() {
        this._store = Store.getInstance();
        this._store.setLevelManage(this.node);

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

        this.spawnEnemy(this.soldierPrefab, this._wayPaths);
        this.spawnEnemy(this.soldierPrefab, this._wayPaths);
        this.spawnEnemy(this.soldierPrefab, this._wayPaths);
        this.spawnEnemy(this.soldierPrefab, this._wayPaths);

        // this.spawnEnemy(this.tankPrefab, this._wayPaths);

        setInterval(() => {
            if (game.isPaused()) {
                return;
            }
            this.spawnEnemy(this.soldierPrefab, this._wayPaths);
            this.spawnEnemy(this.soldierPrefab, this._wayPaths);
            this.spawnEnemy(this.soldierPrefab, this._wayPaths);
            this.spawnEnemy(this.soldierPrefab, this._wayPaths);
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
            this.spawnEnemy(this.planePrefab, this._planePaths);
            this.spawnEnemy(this.planePrefab, this._planePaths);
        }, 5000 * this._coefficient);

        this.spawnTowerPlacement();
    }

    generateStoneAndTree() {
        const distance = 120;
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
                if (randomX < maxX + distance && randomX > minX - distance && randomY < maxY + distance && randomY > minY - distance) {
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
                if (randomX < maxX + distance && randomX > minX - distance && randomY < maxY + distance && randomY > minY - distance) {
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
        function transformArray(arr: number[]): number[] {
            return arr.map((num, index) => {
                return index % 2 === 0 ? num : -num;
            });
        }
        
        // Ví dụ sử dụng:
        const originalArray = [0, 1, 2, 3, 4];
        const transformedArray = transformArray(originalArray);
        
        console.log(transformedArray); // Kết quả: [0, 1, -1, 2, -2]


        
        let graphics = this.getComponent(Graphics);

        graphics.strokeColor = new Color().fromHEX("#dc7633");
        graphics.lineWidth = 200;

        this.drawBezierCurve(graphics, this._wayPaths);
        graphics.stroke();
    }

    drawBezierCurve(graphics: Graphics, points: Vec3[]) {
        graphics.moveTo(points[0].x, points[0].y);
        // const offsetX = 20;
        // const offsetY = 20;
        const offsetX = 0;
        const offsetY = 0;
   
        for (let i = 1; i < points.length; i += 3) {
            let p0 = points[i - 1];
            let p1 = points[i];
            let p2 = points[i + 1];

            graphics.bezierCurveTo(p0.x + offsetX, p0.y + offsetY, p1.x + offsetX, p1.y + offsetY, p2.x + offsetX, p2.y + offsetY);
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


