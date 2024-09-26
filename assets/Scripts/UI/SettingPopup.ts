import { _decorator, Button, Node } from 'cc';
import { SHOW_HOME_SCREEN, SHOW_SETTING_POPUP } from '../CONSTANTS';
import { eventTarget } from '../Events';
import { BaseUIComponent } from './BaseUIComponent';
const { ccclass, property } = _decorator;

@ccclass('SettingPopup')
export class SettingPopup extends BaseUIComponent {
    @property(Node)
    private homeBtn: Node;
    @property(Node)
    private closeBtn: Node;

    start() {
        super.start();
        this.hideNode();

        eventTarget.on(SHOW_SETTING_POPUP, this.showNode, this);
        this.homeBtn.on(Button.EventType.CLICK, this.onHomeClicked, this);
        this.closeBtn.on(Button.EventType.CLICK, this.hideNode, this);
    }

    onHomeClicked() {
        this.hideNode();
        eventTarget.emit(SHOW_HOME_SCREEN);
    }
}


