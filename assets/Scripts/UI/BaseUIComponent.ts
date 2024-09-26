import { _decorator, Color, Sprite } from 'cc';
import Store from '../Store';
import { BaseComponent } from '../BaseComponent';
const { ccclass, property } = _decorator;

@ccclass('BaseUIComponent')
export class BaseUIComponent extends BaseComponent {
    start() {
        super.start();
    }

    update(deltaTime: number) {

    }

    showNode() {
        this.node.parent = this._store.canvas;
    }

    hideNode() {
        this.node.parent = null;
    }
}


