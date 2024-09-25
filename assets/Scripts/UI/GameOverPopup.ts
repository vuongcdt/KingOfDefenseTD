import { _decorator, Button, Component, game, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverPopup')
export class GameOverPopup extends Component {

    start() {
        const replayBtn = this.node.getComponentInChildren(Button);
        
        replayBtn.node.on(Button.EventType.CLICK, this.onReplayGame, this);
    }

    update(deltaTime: number) {

    }

    onReplayGame() {
        this.node.active = false;
    }
}


