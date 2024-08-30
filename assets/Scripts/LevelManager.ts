import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
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

    private _enemyList: Node[] = [];

    public get enemyList(): Node[] {
        return this._enemyList;
    }

    start() {
        setInterval(() => {
            let enemy = instantiate(this.enemyPrefab);
            enemy.parent = this.enemyLayer;
            enemy.position = this.startPoint.position;
            enemy.getComponent(Enemy).init(this.levelPath.map(node => node.position))
            this.enemyList.push(enemy);
        }, 3000);
    }

    update(deltaTime: number) {

    }

    removeEnemy(enemyRemove: Node) {
        this._enemyList = this._enemyList.filter(enemy => enemy != enemyRemove);
    }
}


