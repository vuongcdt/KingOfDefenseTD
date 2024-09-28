import { _decorator, BlockInputEvents, Button, Node} from 'cc';
import { BaseUIComponent } from './BaseUIComponent';
import { eventTarget } from '../Common';
import { HIDE_POPUP, RESET_GAME, SHOW_GAMEOVER_POPUP, SHOW_HOME_SCREEN } from '../CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass('GameOverPopup')
export class GameOverPopup extends BaseUIComponent {
    @property(Node)
    private homeBtn: Node;
    @property(Node)
    private replayBtn: Node;

    start() {
        super.start();
        
        this.hideNode();
        eventTarget.on(HIDE_POPUP, this.hideNode, this);

        this.replayBtn.on(Button.EventType.CLICK, this.onReplayGame, this);
        this.homeBtn.on(Button.EventType.CLICK, this.onHomeBtnClick, this);
        eventTarget.on(SHOW_GAMEOVER_POPUP, this.showNode, this);
    }

    update(deltaTime: number) {

    }

    onReplayGame() {
        eventTarget.emit(RESET_GAME);
    }

    onHomeBtnClick() {
        eventTarget.emit(RESET_GAME);
        eventTarget.emit(SHOW_HOME_SCREEN);
    }
}


