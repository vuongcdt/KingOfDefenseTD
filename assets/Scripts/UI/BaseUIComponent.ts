import { _decorator, Color, Component, Node, Sprite } from 'cc';
import Store from '../Store';
import { BaseComponent } from '../BaseComponent';
const { ccclass, property } = _decorator;

@ccclass('BaseUIComponent')
export class BaseUIComponent extends BaseComponent {

    private _color: Color;

    start() {
        super.start();
        this._color = this.node.getComponent(Sprite)?.color;
    }

    update(deltaTime: number) {

    }

    activeNode() {
        this.node.getComponent(Sprite).color = new Color(this._color.r, this._color.g, this._color.b, 255);
    }

    deActiveNode() {
        this.node.getComponent(Sprite).color = new Color(this._color.r, this._color.g, this._color.b, 0);
    }
}


