import { _decorator, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { Enemy } from './Enemy';
import { LevelManager } from './LevelManager';
const { ccclass, property } = _decorator;

@ccclass('Tank')
export class Tank extends Enemy {
    @property(Node)
    private headTank: Node;
    @property(SpriteFrame)
    private headSprites: SpriteFrame;

    protected _offset: number = 60;

    start() {
        this.headTank.getComponent(Sprite).spriteFrame = this.headSprites;
        this.headTank.angle = 180;
    }

    update(deltaTime: number) {
    }

    init(path: Vec3[], levelManage: LevelManager, indexPos: number) {
        super.init(path, levelManage, indexPos);
    }
}


