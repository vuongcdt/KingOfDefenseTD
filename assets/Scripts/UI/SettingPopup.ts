import { _decorator, Button, Component, Node } from 'cc';
import { SHOW_HOME_SCREEN } from '../CONSTANTS';
import { eventTarget } from '../Events';
const { ccclass, property } = _decorator;

@ccclass('SettingPopup')
export class SettingPopup extends Component {
    start() {
        const homeBtn = this.node.getComponentInChildren(Button);
        homeBtn.node.on(Button.EventType.CLICK, this.onHomeClicked, this);
    }
    
    onHomeClicked() {
        this.node.active = false;
        eventTarget.emit(SHOW_HOME_SCREEN);
    }
}


