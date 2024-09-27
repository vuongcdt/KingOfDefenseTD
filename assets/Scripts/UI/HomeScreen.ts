import { _decorator, Button, Component, Label, Layout } from 'cc';
import { eventTarget } from '../Events';
import { RESET_GAME, SHOW_HOME_SCREEN } from '../CONSTANTS';
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

    update(deltaTime: number) {

    }

    generateLevelSelect() {
        const buttonList = this.node.getComponentInChildren(Layout).getComponentsInChildren(Button);

        buttonList.forEach((button, index) => {
            button.getComponentInChildren(Label).string = `Level ${index + 1}`;
            button.node.on(Button.EventType.CLICK, () => this.onLevelClicked(index + 1), this);
        })
    }

    onLevelClicked(value: number) {
        this._store.gameState = GameState.PlayGame;
        this.hideNode();
    }

    showHomeScreen() {
        console.log(GameState[this._store.gameState]);
        
        if(this._store.gameState == GameState.OverGame){
            console.log('OverGame');
            
            eventTarget.emit(RESET_GAME);
        }
        this.showNode();
    }
}


