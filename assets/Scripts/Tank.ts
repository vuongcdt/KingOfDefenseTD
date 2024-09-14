import { _decorator, Component, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { Enemy } from './Enemy';
import { LevelManager } from './LevelManager';
const { ccclass, property } = _decorator;

@ccclass('Tank')
export class Tank extends Enemy {
    @property(Node)
    private headTank: Node;
    @property(SpriteFrame)
    private headSprites: SpriteFrame;

    protected _offset: number = 80;
    protected _number: number = 1;

    start() {
        this.headTank.getComponent(Sprite).spriteFrame = this.headSprites;
        this.headTank.angle = 180;
    }

    update(deltaTime: number) {
    }
    
    init(path: Vec3[], levelManage: LevelManager) {
        super.init(path,levelManage);
    }
}


