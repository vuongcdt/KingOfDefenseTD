import { _decorator, BlockInputEvents, Button, director, Node } from 'cc';
import { HIDE_POPUP, SHOW_HOME_SCREEN, SHOW_SETTING_POPUP } from '../CONSTANTS';
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

        eventTarget.on(SHOW_SETTING_POPUP, this.showSettingPopup, this);
        eventTarget.on(HIDE_POPUP, this.hideNode, this);

        this.homeBtn.on(Button.EventType.CLICK, this.showHomeScreen, this);
        this.closeBtn.on(Button.EventType.CLICK, this.hideNode, this);

        const mask = this.node.getComponentInChildren(BlockInputEvents);
        mask.node.on(Node.EventType.TOUCH_START, this.hideNode, this);
    }

    showHomeScreen() {
        eventTarget.emit(SHOW_HOME_SCREEN);
    }

    showSettingPopup(){
        this.showNode();
    }
}


