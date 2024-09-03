import { _decorator, Component, EventTouch, instantiate, Node, Prefab, Sprite, SpriteFrame, Vec3 } from 'cc';
import { TowerType } from './Enums';
import { LevelManager } from './LevelManager';
import { Tower } from './Tower';
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
    private _gunType: TowerType;
    private _tower: Tower;

    public set levelManager(value: Node) {
        this._levelManager = value;
    }

    protected start(): void {
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
        this._gunType = TowerType.GunTower;
        this._levelTower++;
        this.initTower(this.gunTowerPrefab);
        this.onSetSprite();
    }

    onBuyRocket() {
        this._gunType = TowerType.RocketTower;
        this._levelTower++;
        this.initTower(this.rocketTowerPrefab);
        this.onSetSprite();
    }

    initTower(prefab: Prefab) {
        const tower = instantiate(prefab);
        tower.parent = this._levelManager;
        tower.position = this.node.position;
        this._tower = tower.getComponent(Tower);
        this._tower.initTower(this._levelTower, this.node.position, this._levelManager);
    }

    onSell() {
        this._gunType = TowerType.None;
        this._levelTower = 0;
        this.onSetSprite();
    }

    onSetSprite() {
        this._background.spriteFrame = this.backgrounds[this._levelTower];
        this.onHideAction();
        this._tower.levelTower = this._levelTower;
        this._tower.onSetSprite();
    }

    onHideAction() {
        this.action.setParent(null);
    }
}


