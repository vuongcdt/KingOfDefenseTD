import { _decorator, Button} from 'cc';
import { BaseUIComponent } from './BaseUIComponent';
import { eventTarget } from '../Events';
import { RESET_GAME, SHOW_GAMEOVER_POPUP } from '../CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass('GameOverPopup')
export class GameOverPopup extends BaseUIComponent {
    start() {
        super.start();
        
        this.hideNode();

        const replayBtn = this.node.getComponentInChildren(Button);
        replayBtn.node.on(Button.EventType.CLICK, this.onReplayGame, this);
        eventTarget.on(SHOW_GAMEOVER_POPUP, this.showNode, this);
    }

    update(deltaTime: number) {

    }

    onReplayGame() {
        this.hideNode();
        eventTarget.emit(RESET_GAME);
    }
}


