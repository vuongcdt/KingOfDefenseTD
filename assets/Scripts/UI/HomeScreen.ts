import { _decorator, Button, Component, Label, Layout } from 'cc';
import { eventTarget } from '../Events';
import { SHOW_HOME_SCREEN } from '../CONSTANTS';
import { BaseUIComponent } from './BaseUIComponent';
const { ccclass, property } = _decorator;

@ccclass('HomeScreen')
export class HomeScreen extends BaseUIComponent {
    start() {
        super.start();
        eventTarget.on(SHOW_HOME_SCREEN, this.showNode, this);

        const buttonList = this.node.getComponentInChildren(Layout).getComponentsInChildren(Button);
        buttonList.forEach((button, index) => {
            button.getComponentInChildren(Label).string = `Level ${index + 1}`;
            button.node.on(Button.EventType.CLICK, () => this.onLevelClicked(index + 1), this);
        })
    }

    update(deltaTime: number) {

    }


    onLevelClicked(value: number) {
        this.hideNode();
    }
}


