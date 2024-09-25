import { _decorator, Button, Component, Label, Layout, Node } from 'cc';
import { eventTarget } from '../Events';
import { SHOW_HOME_SCREEN } from '../CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass('HomeScreen')
export class HomeScreen extends Component {
    start() {
        eventTarget.on(SHOW_HOME_SCREEN, this.showHomeScreen, this);

        const buttonList = this.node.getComponentInChildren(Layout).getComponentsInChildren(Button);
        buttonList.forEach((button, index) => {
            button.getComponentInChildren(Label).string = `Level ${index + 1}`;
            button.node.on(Button.EventType.CLICK, () => this.onLevelClicked(index + 1), this);
        })
    }
    
    showHomeScreen() {
        console.log('show');
        
        this.node.active = true;
    }

    update(deltaTime: number) {

    }


    onLevelClicked(value: number) {
        console.log('level', value);

        this.node.active = false;
    }
}


