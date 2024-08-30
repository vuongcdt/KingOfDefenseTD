import { _decorator, Component, EventTouch, instantiate, Node, Prefab, Sprite, SpriteFrame, Vec3 } from "cc";
import { LevelManager } from "./LevelManager";
import { Ammo } from "./Ammo";
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component {
    @property(Node)
    private ammoLayer: Node;
    @property(Node)
    private action: Node;
    @property(Node)
    private actionUpgrade: Node;
    @property(Node)
    private actionSell: Node;
    @property(SpriteFrame)
    private sprite: SpriteFrame;
    @property(Prefab)
    private ammoPrefab: Prefab;
    @property(LevelManager)
    private levelManager: LevelManager;

    @property
    private speed: number = 1;

    @property
    private reloadTime: number = 0.5;
    @property
    private _range: number = 600;

    private _damage: number = 4;
    private _target: Node;
    private _avatar: Sprite;
    private _isAttack: boolean;
    private _isActive: boolean = true;
    private _countdown: number = 0;

    get damage() {
        return this._damage
    }

    set damage(val: number) {
        this._damage = val
    }

    get range() {
        return this._range
    }

    set range(val: number) {
        this._range = val
    }

    private elapsedTime: number = 1000 * this.reloadTime;

    protected start(): void {
        this._avatar = this.getComponent(Sprite);
        this.onInActive();

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.actionUpgrade.on(Node.EventType.TOUCH_START, this.onUpgrade, this);
        this.actionSell.on(Node.EventType.TOUCH_START, this.onSell, this);
    }

    protected update(dt: number): void {
        this._countdown += dt;
        
        const enemyNearest = this.findEnemyNearest();

        if (enemyNearest && !this._isAttack && this._isActive) {
            // console.log('1');

            this._isAttack = true;
            this._target = enemyNearest;

            // if(this._countdown >=this.reloadTime){
            //     this._isAttack = false;
            //     this.attackEnemy();
            // }

            setTimeout(() => {
                // console.log('2');
                this._isAttack = false;
                this.attackEnemy();
            }, 1000 * this.reloadTime);
        }

    }

    attackEnemy() {
        const ammo = instantiate(this.ammoPrefab);
        ammo.parent = this.ammoLayer;
        ammo.position = this.node.position;

        ammo.getComponent(Ammo).init(new Vec3(this._target.position.x, this._target.position.y), this.speed, this._damage);
    }

    findEnemyNearest(): Node {

        return this.levelManager.enemyList
            .find(enemy => {
                return Vec3.distance(enemy.position, this.node.position) <= this._range
            })
    }

    onTouchStart(event: EventTouch) {
        this.action.setParent(this.node);
    }

    onUpgrade() {
        this._avatar.spriteFrame = this.sprite;
        this._isActive = true;
        this.onInActive();
    }

    onSell() {
        this._avatar.spriteFrame = null;
        this._isActive = false;
        this.onInActive();
    }

    onInActive() {
        this.action.setParent(null);
    }
}


