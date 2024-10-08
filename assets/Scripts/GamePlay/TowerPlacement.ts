import { _decorator, Component, EventTouch, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, tween } from 'cc';
import { LevelManager } from './LevelManager';
import Store from '../Store';
import { Turent } from './Turent';
import { CharacterType } from '../Enums';
import { eventTarget } from '../Common';
import { SUB_COINT, ADD_COINT } from '../CONSTANTS';
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
    private actionRepair: Node;
    @property(Node)
    private actionSell: Node;
    @property(Node)
    private actionBuyGun: Node;
    @property([SpriteFrame])
    private backgrounds: SpriteFrame[] = [];
    @property(Node)
    private healthBar: Node;
    @property(Node)
    private fire: Node;

    private _store: Store;
    private _levelManager: Node;
    private _background: Sprite;
    private _levelTower: number = 0;
    private _turrent: Turent;
    private _health: number = 200;
    private _costGun: number = 150;
    private _costRocket: number = 300;
    private _currentHealth: number;
    private _turrentType: CharacterType;

    public set levelManager(value: Node) {
        this._levelManager = value;
    }

    start(): void {
        this._store = Store.getInstance();
        this._background = this.getComponent(Sprite);
        this.onHideAction();
        this.healthBar.active = false;
        this.fire.active = false;

        this.node.on(Node.EventType.TOUCH_START, this.onShowAction, this);
        this.actionBuyRocket.on(Node.EventType.TOUCH_START, this.onBuyRocket, this);
        this.actionBuyGun.on(Node.EventType.TOUCH_START, this.onBuyGun, this);
        this.actionSell.on(Node.EventType.TOUCH_START, this.onSell, this);
        this.actionUpgrade.on(Node.EventType.TOUCH_START, this.onUpgrade, this);
        this.actionRepair.on(Node.EventType.TOUCH_START, this.onRepair, this);

        this.actionBuyGun.getComponentInChildren(Label).string = this._costGun.toString();
        this.actionBuyRocket.getComponentInChildren(Label).string = this._costRocket.toString();
    }

    update(dt: number): void {

    }

    onShowAction(event: EventTouch) {
        this._levelManager.getComponent(LevelManager).onHideActionTower(this);
        this.action.setParent(this.node);
        // this.action.active = true;
        this.actionSell.active = this._levelTower != 0;
        this.actionUpgrade.active = this._levelTower != 0 && this._levelTower != this.backgrounds.length - 1;
        this.actionBuyGun.active = this._levelTower == 0;
        this.actionBuyRocket.active = this._levelTower == 0;
        this.actionRepair.active = this._currentHealth < this._health && this._levelTower > 0;

        this.actionRepair.getComponentInChildren(Label).string = this.getCostRepair().toString();
        this.actionSell.getComponentInChildren(Label).string = this.getCostSell().toString();
        this.actionUpgrade.getComponentInChildren(Label).string = this.getCostUpgrate().toString();
    }

    onUpgrade() {
        const cost = this.getCostUpgrate();

        if (this._store.coinTotal < cost) {
            return;
        }
        this._levelTower++;
        this.onSetSprite();

        eventTarget.emit(SUB_COINT, cost);
    }

    getCostUpgrate(): number {
        const cost = this._turrentType == CharacterType.GunTower ? this._costGun : this._costRocket;
        return cost * (this._levelTower + 1);
    }

    onBuyGun() {
        if (this._store.coinTotal < this._costGun) {
            return;
        }
        this._levelTower++;
        this.setTurrent(this.gunTowerPrefab);
        this.onSetSprite();
        this._turrentType = CharacterType.GunTower;

        eventTarget.emit(SUB_COINT, this._costGun);
    }

    onBuyRocket() {
        if (this._store.coinTotal < this._costRocket) {
            return;
        }
        this._levelTower++;
        this.setTurrent(this.rocketTowerPrefab);
        this.onSetSprite();
        this._turrentType = CharacterType.RocketTower;

        eventTarget.emit(SUB_COINT, this._costRocket);
    }

    setTurrent(prefab: Prefab) {
        this.fire.active = false;
        const turrent = instantiate(prefab);
        turrent.parent = this.node;

        this._turrent = turrent.getComponent(Turent);
        this._turrent.initTurrent(this._levelTower);
        this._currentHealth = this._health;
    }

    onSell() {
        this.onSetSprite();
        tween(this._turrent.node).destroySelf().start();
        this.healthBar.active = false;

        const cost = this.getCostSell();
        eventTarget.emit(ADD_COINT, cost);

        this._levelTower = 0;
        this._turrentType = CharacterType.None;
    }

    onRepair() {
        const cost = this.getCostRepair();

        this._currentHealth = this._health;
        this.healthBar.getComponentInChildren(Sprite).fillRange = 1;
        this.fire.active = false;
        this.onHideAction();

        eventTarget.emit(SUB_COINT, cost);

        setTimeout(() => {
            if (this.healthBar.active) {
                this.healthBar.active = false;
            }
        }, 200);
    }

    getCostSell(): number {
        const cost = this._turrentType == CharacterType.GunTower ? this._costGun : this._costRocket;
        return Math.round(cost * 0.75 * this._levelTower);
    }

    getCost(): number {
        const cost = this._turrentType == CharacterType.GunTower ? this._costGun : this._costRocket;
        return Math.round(cost * 0.5 * this._levelTower);
    }

    getCostRepair(): number {
        const cost = this._turrentType == CharacterType.GunTower ? this._costGun : this._costRocket;
        return Math.round(cost * this._levelTower * (1 - this._currentHealth / this._health));
    }

    onSetSprite() {
        this.onHideAction();
        this._turrent.initTurrent(this._levelTower);
        this._currentHealth = this._health;
        this._background.spriteFrame = this.backgrounds[this._levelTower];
        this._turrent.onSetLevelTurrent(this._levelTower);
    }

    onHideAction() {
        this.action.setParent(null);
    }

    setHP(damage: number) {
        this._currentHealth -= damage;

        this.healthBar.active = true;
        this.healthBar.getComponentInChildren(Sprite).fillRange = this._currentHealth / this._health;

        if (this.action.active) {
            this.actionRepair.active = true;
        }

        if (this._currentHealth <= 0) {
            this._levelTower = 0;
            this._background.spriteFrame = this.backgrounds[this._levelTower];
            tween(this._turrent.node).destroySelf().start();
            this.healthBar.active = false;
        }

        if (this._currentHealth < this._health / 2) {
            this.fire.active = true;
        }
    }
}


