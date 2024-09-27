import { _decorator, BlockInputEvents, Button, Node} from 'cc';
import { BaseUIComponent } from './BaseUIComponent';
import { eventTarget } from '../Events';
import { HIDE_POPUP, RESET_GAME, SHOW_GAMEOVER_POPUP } from '../CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass('GameOverPopup')
export class GameOverPopup extends BaseUIComponent {
    start() {
        super.start();
        
        this.hideNode();
        eventTarget.on(HIDE_POPUP, this.hideNode, this);

        const replayBtn = this.node.getComponentInChildren(Button);
        replayBtn.node.on(Button.EventType.CLICK, this.onReplayGame, this);
        eventTarget.on(SHOW_GAMEOVER_POPUP, this.showNode, this);
    }

    update(deltaTime: number) {

    }

    onReplayGame() {
        eventTarget.emit(RESET_GAME);
    }
}


