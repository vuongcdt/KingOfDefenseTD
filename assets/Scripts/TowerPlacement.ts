import { _decorator, Component, EventTouch, instantiate, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { LevelManager } from './LevelManager';
import { Tower } from './Tower';
import Store from './Store';
import { Turent } from './Turent';
const { ccclass, property } = _decorator;

@ccclass('TowerPlacement')
export class TowerPlacement extends Component {
    @property(Prefab)
    private gunTowerPrefab: Prefab;
    @property(Prefab)
    private rocketTowerPrefab: Prefab;
    @property(Node)
    private action: Node;
    @property(Node)
    private actionBuyRocket: Node;
    @property(Node)
    private actionUpgrade: Node;
    @property(Node)
    private actionSell: Node;
    @property(Node)
    private actionBuyGun: Node;
    @property([SpriteFrame])
    private backgrounds: SpriteFrame[] = [];

    private _levelManager: Node;
    private _background: Sprite;
    private _levelTower: number = 0;
    private _tower: Tower;
    private _turrent: Turent;
    private _store: Store;

    public set levelManager(value: Node) {
        this._levelManager = value;
    }

    start(): void {
        this._store = Store.getInstance();
        this._background = this.getComponent(Sprite);
        this.onHideAction();

        this.node.on(Node.EventType.TOUCH_START, this.onShowAction, this);
        this.actionBuyRocket.on(Node.EventType.TOUCH_START, this.onBuyRocket, this);
        this.actionBuyGun.on(Node.EventType.TOUCH_START, this.onBuyGun, this);
        this.actionSell.on(Node.EventType.TOUCH_START, this.onSell, this);
        this.actionUpgrade.on(Node.EventType.TOUCH_START, this.onUpgrade, this);
    }

    update(dt: number): void {

    }

    onShowAction(event: EventTouch) {
        this._levelManager.getComponent(LevelManager).onHideActionTower(this);
        this.action.setParent(this.node);
        this.actionSell.active = this._levelTower != 0;
        this.actionUpgrade.active = this._levelTower != 0 && this._levelTower != this.backgrounds.length - 1;
        this.actionBuyGun.active = this._levelTower == 0;
        this.actionBuyRocket.active = this._levelTower == 0;
    }

    onUpgrade() {
        this._levelTower++;
        this.onSetSprite();
    }

    onBuyGun() {
        this._levelTower++;
        this.setTurrent(this.gunTowerPrefab);
        this.onSetSprite();
    }

    onBuyRocket() {
        this._levelTower++;
        this.setTurrent(this.rocketTowerPrefab);
        this.onSetSprite();
    }

    initTower(prefab: Prefab) {
        const tower = instantiate(prefab);
        tower.parent = this._levelManager;
        tower.position = this.node.position;

        this._tower = tower.getComponent(Tower);
        this._tower.initTower(this._levelTower, this._levelManager);
    }

    setTurrent(prefab: Prefab) {
        const turrent = instantiate(prefab);
        turrent.parent = this._levelManager;
        turrent.position = this.node.position;

        this._turrent = turrent.getComponent(Turent);
        this._turrent.initTurrent(this._levelTower);
    }

    onSell() {
        this._levelTower = 0;
        this.onSetSprite();
    }

    onSetSprite() {
        this._background.spriteFrame = this.backgrounds[this._levelTower];
        this._turrent.onSetLevelTurrent(this._levelTower);
        this.onHideAction();
    }

    onHideAction() {
        this.action.setParent(null);
    }
}


