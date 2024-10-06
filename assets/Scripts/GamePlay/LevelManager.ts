import { _decorator, Color, Component, EventTouch, game, Graphics, instantiate, Node, Prefab, randomRange, randomRangeInt, Sprite, SpriteFrame, Vec3 } from 'cc';
import { Enemy } from './Enemy';
import { TowerPlacement } from './TowerPlacement';
import Store from '../Store';
import { CharacterType, GameState } from '../Enums';
import { eventTarget } from '../Common';
import { RESET_GAME, SHOW_GAME_WIN_POPUP, START_GAME } from '../CONSTANTS';
import { levels } from '../LevelData';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {
    @property(Node)
    private maskLayer: Node = null;
    @property(Node)
    private enemyLayer: Node = null;
    @property(Node)
    private ammoLayer: Node = null;
    @property(Node)
    private towerLayer: Node = null;
    @property([Prefab])
    private prefabEnemies: Prefab[] = [];
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

    private _store: Store;
    private _treeNodes: Node[] = [];
    private _wayPaths: Vec3[][] = [];
    private _planePath: Vec3[] = [];
    private _towerPlacements: Vec3[] = [];

    private _towerPlacementList: TowerPlacement[] = [];
    private _indexSpawn: number = 0;
    private _arrIndex: number[] = [0, 1, -1, 2, -2, 3, -3];
    private _countTime: number = 0;
    private _timeWave: number = 20;
    private _offsetWay: number = 150;

    start() {
        eventTarget.on(RESET_GAME, this.resetGame, this);
        this.maskLayer.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        eventTarget.on(START_GAME, this.startGame, this);

        this.node.active = false;
        this.enabled = false;

        this.setStore();
    }

    setStore() {
        this._store = Store.getInstance();
        this._store.levelManager = this.node;
    }

    setDataGenerate() {
        this._treeNodes = this.background.children;
        this._planePath = this.planePathBlock.children.map(node => node.position);
        this._towerPlacements = this.towerPlacementBlock.children.map(node => node.position);

        const wayPaths = this.wayPathBlock.children;

        wayPaths.forEach((way, indexWay) => {
            this._wayPaths[indexWay] = [];
            const points = way.children;

            for (let index = 0; index < points.length - 1; index++) {
                const p1 = points[index].position;
                const p2 = points[index + 1].position;
                const dividePoints = this.findDividePoints(p1, p2, 2);

                this._wayPaths[indexWay].push(p1);
                this._wayPaths[indexWay].push(...dividePoints);
            }
        })

    }

    startGame() {
        const siblingIndex = this.node.getSiblingIndex();
        const isPass = siblingIndex == this._store.level;
        if(!isPass){
            return;
        }
        this.node.active = siblingIndex == this._store.level;
        // this.enabled = siblingIndex == this._store.level;

        this.setDataGenerate();

        this.generateWay();
        this.generateStoneAndTree();
        this.generateTowerPlacement();

        this._countTime = 0;
        if (!levels[this._store.level]?.dataLevel) {
            console.error('No data!');
            return;
        }

        this.enemyLayer.removeAllChildren();

        levels[this._store.level].dataLevel.forEach(({ dataEnemy, way }, indexWave) => {
            dataEnemy.forEach((data) => {
                const path = data.type == CharacterType.Plane ? this._planePath : this._wayPaths[way];
                this._countTime += data.timeDelay;
                const waveTime = indexWave * this._timeWave + data.timeDelay * 1.5

                for (const _ of Array(data.total)) {
                    this.spawnEnemy(this.prefabEnemies[data.type - 1], path, waveTime, indexWave + 1);
                }
            })
        })
    }

    spawnEnemy(prefab: Prefab, path: Vec3[], time: number, indexWave: number) {
        const newEnemy = instantiate(prefab);
        newEnemy.parent = this.enemyLayer;
        newEnemy.position = path[0];

        const index = this._arrIndex[this._indexSpawn];

        const enemy = newEnemy.getComponent(Enemy);

        enemy.init(path, this, index, time, indexWave);

        this._indexSpawn++;
        if (this._indexSpawn > 2) {
            this._indexSpawn = 0;
        }
    }

    generateStoneAndTree() {
        const stonePos = [];
        while (true) {
            if (stonePos.length > this._treeNodes.length - 1) {
                break;
            }
            const randomX = randomRange(-960, 960);
            const randomY = randomRange(-600, 600);
            let isPass = true;

            for (let index = 0; index < this._wayPaths.length; index++) {
                const points = this._wayPaths[index];
                for (let i = 0; i < points.length - 1; i++) {
                    const point1 = points[i];
                    const point2 = points[i + 1];

                    const maxX = Math.max(point1.x, point2.x);
                    const minX = Math.min(point1.x, point2.x);

                    const maxY = Math.max(point1.y, point2.y);
                    const minY = Math.min(point1.y, point2.y);
                    if (randomX < maxX + this._offsetWay && randomX > minX - this._offsetWay && randomY < maxY + this._offsetWay && randomY > minY - this._offsetWay) {
                        isPass = false;
                        break;
                    }
                }
                if (!isPass) {
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
                if (randomX < maxX + this._offsetWay && randomX > minX - this._offsetWay && randomY < maxY + this._offsetWay && randomY > minY - this._offsetWay) {
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
            this._treeNodes[index].getComponent(Sprite).spriteFrame = this.stoneSprites[randomRangeInt(0, this.stoneSprites.length)];
        })
    }

    generateWay() {
        // const graphics = this.getComponent(Graphics);
        const graphics = this._store.graphics;
        graphics.clear();

        this._wayPaths.forEach(points => {
            graphics.strokeColor = new Color().fromHEX("#B1B1B1");
            graphics.lineWidth = 170;

            this.drawBezierCurve(graphics, points);
            graphics.stroke();
        })

        this._wayPaths.forEach(points => {
            graphics.strokeColor = new Color().fromHEX("#47565A");
            graphics.lineWidth = 150;

            this.drawBezierCurve(graphics, points);
            graphics.stroke();
        })

    }

    drawBezierCurve(graphics: Graphics, points: Vec3[]) {
        graphics.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i += 3) {
            const p0 = points[i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];

            graphics.bezierCurveTo(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y);
        }
    }

    findDividePoints(p1: Vec3, p2: Vec3, numPoints: number): Vec3[] {
        const result: Vec3[] = [];

        const vector = new Vec3(
            (p2.x - p1.x),
            (p2.y - p1.y),
            (p2.z - p1.z)
        );

        for (let i = 1; i <= numPoints; i++) {
            const scale = i / (numPoints + 1);
            const dividePoint = new Vec3(
                p1.x + vector.x * scale,
                p1.y + vector.y * scale,
                p1.z + vector.z * scale
            );
            result.push(dividePoint);
        }

        return result;
    }

    generateTowerPlacement() {
        this._towerPlacements.forEach(point => {
            const towerPlacement = instantiate(this.towerPlacementPrefab);
            towerPlacement.parent = this.towerLayer;
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

    resetGame() {
        this.enemyLayer.removeAllChildren();
        this.ammoLayer.removeAllChildren();
        this.towerLayer.removeAllChildren();

        this._store.gameState = GameState.PlayGame;
        this.generateTowerPlacement();
    }
}


