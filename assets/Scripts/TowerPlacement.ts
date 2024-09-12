import { _decorator, Component, EventTouch, instantiate, Node, Prefab, Sprite, SpriteFrame, tween } from 'cc';
import { LevelManager } from './LevelManager';
import Store from './Store';
import { Turent } from './Turent';
const { ccclass, property } = _decorator;

@ccclass('TowerPlacement')
export class TowerPlacement extends Component {
    @property(Node)
    private gunTurrent: Node;
    @property(Node)
    private rocketTurrent: Node;
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
    @property(Node)
    private healthBar: Node;

    private _levelManager: Node;
    private _background: Sprite;
    private _levelTower: number = 0;
    private _turrent: Turent;
    private _store: Store;
    private _health: number = 10;
    private _currentHealth: number;

    public set levelManager(value: Node) {
        this._levelManager = value;
    }

    start(): void {
        this._store = Store.getInstance();
        this._background = this.getComponent(Sprite);
        this.onHideAction();
        this.healthBar.active = false;

        this.node.on(Node.EventType.TOUCH_START, this.onShowAction, this);
        this.actionBuyRocket.on(Node.EventType.TOUCH_START, this.onBuyRocket, this);
        this.actionBuyGun.on(Node.EventType.TOUCH_START, this.onBuyGun, this);
        this.actionSell.on(Node.EventType.TOUCH_START, this.onSell, this);
        this.actionUpgrade.on(Node.EventType.TOUCH_START, this.onUpgrade, this);
        this.gunTurrent.active = false;
        this.rocketTurrent.active = false;
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
        // this.gunTurrent.active = true;
        // this._turrent = this.gunTurrent.getComponent(Turent);
        this.onSetSprite();
    }

    onBuyRocket() {
        this._levelTower++;
        this.setTurrent(this.rocketTowerPrefab);
        // this.rocketTurrent.active = true;
        // this._turrent = this.rocketTurrent.getComponent(Turent);
        this.onSetSprite();
    }

    setTurrent(prefab: Prefab) {
        const turrent = instantiate(prefab);
        // turrent.parent = this._levelManager;
        turrent.parent = this.node;

        this._turrent = turrent.getComponent(Turent);
        this._turrent.initTurrent(this._levelTower);

        this._currentHealth = this._health;
    }

    onSell() {
        this._levelTower = 0;
        this.onSetSprite();
    }

    onSetSprite() {
        this._turrent.initTurrent(this._levelTower);
        this._currentHealth = this._health;
        this._background.spriteFrame = this.backgrounds[this._levelTower];
        this._turrent.onSetLevelTurrent(this._levelTower);
        this.onHideAction();
    }

    onHideAction() {
        this.action.setParent(null);
    }

    setHP(damage: number) {
        this._currentHealth -= damage;

        this.healthBar.active = true;
        this.healthBar.getComponentInChildren(Sprite).fillRange = this._currentHealth / this._health;

        if (this._currentHealth <= 0) {
            // this.onSell();
            this._levelTower = 0;
            // this._currentHealth = this._health;
            this._background.spriteFrame = this.backgrounds[this._levelTower];
            // tween(this.gunTurrent).destroySelf().start();
            tween(this._turrent.node).destroySelf().start();
            // tween(this.gunTurrent).hide().start();
        }
    }
}


