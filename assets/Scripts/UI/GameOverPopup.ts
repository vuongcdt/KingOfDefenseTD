import { _decorator, Button, Component, game, Tween } from 'cc';
import { BaseUIComponent } from './BaseUIComponent';
import { eventTarget } from '../Events';
import { RESET_GAME, SHOW_GAMEOVER_POPUP } from '../CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass('GameOverPopup')
export class GameOverPopup extends BaseUIComponent {


    start() {
        super.start();
        this.deActiveNode();

        const replayBtn = this.node.getComponentInChildren(Button);
        replayBtn.node.on(Button.EventType.CLICK, this.onReplayGame, this);
        eventTarget.on(SHOW_GAMEOVER_POPUP, this.show, this);
    }

    update(deltaTime: number) {

    }

    onReplayGame() {
        this.deActiveNode();
        eventTarget.emit(RESET_GAME);
    }

    show(){
        this.activeNode();
    }
}


