import { _decorator } from 'cc';
import { BaseComponent } from '../BaseComponent';
import { eventTarget } from '../Events';
import { HIDE_POPUP } from '../CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass('BaseUIComponent')
export class BaseUIComponent extends BaseComponent {
    start() {
        super.start();
    }

    update(deltaTime: number) {

    }

    showNode() {
        eventTarget.emit(HIDE_POPUP);
        this.node.parent = this._store.canvas;
    }

    hideNode() {
        this.node.parent = null;
    }
}


