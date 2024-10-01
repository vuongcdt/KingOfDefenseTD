import { _decorator, Component } from 'cc';
import Store from '../Store';
const { ccclass, property } = _decorator;

@ccclass('BaseComponent')
export class BaseComponent extends Component {
    public _store: Store;

    start() {
        this._store = Store.getInstance();
    }

    update(deltaTime: number) {
        
    }
}


