import { _decorator, Button, Component, Label, Layout } from 'cc';
import { eventTarget } from '../Common';
import { RESET_GAME, SHOW_HOME_SCREEN, START_GAME } from '../CONSTANTS';
import { BaseUIComponent } from './BaseUIComponent';
import { GameState } from '../Enums';
const { ccclass, property } = _decorator;

@ccclass('HomeScreen')
export class HomeScreen extends BaseUIComponent {
    start() {
        super.start();
        eventTarget.on(SHOW_HOME_SCREEN, this.showHomeScreen, this);

        this.generateLevelSelect();
    }

    generateLevelSelect() {
        const buttonList = this.node.getComponentInChildren(Layout).getComponentsInChildren(Button);

        buttonList.forEach((button, index) => {
            button.getComponentInChildren(Label).string = `Level ${index + 1}`;
            button.node.on(Button.EventType.CLICK, () => this.onLevelClicked(index + 1), this);
        })
    }

    onLevelClicked(value: number) {
        this._store.level = value - 1;
        this._store.gameState = GameState.PlayGame;
        // eventTarget.emit(RESET_GAME);
        eventTarget.emit(START_GAME);
        this.hideNode();
    }

    showHomeScreen() {
        if (this._store.gameState != GameState.PlayGame) {
            eventTarget.emit(RESET_GAME);
        }
        this.showNode();
    }
}


