import { _decorator, Graphics, Node } from "cc";
import { GameManager } from "./GameManager";
import { GameState } from "./Enums";
const { ccclass } = _decorator;

@ccclass
export default class Store {
    private static instance: Store;

    private state: any = {};
    private observers: Array<(state: any) => void> = [];

    public levelManager: Node;
    public ammoLayer: Node;
    public graphics: Graphics;
    public gameState: GameState = GameState.PlayGame;
    public heart: number = 3;
    public coinTotal: number = 1000;
    public waves: number = 2;
    public level: number = 1;

    private constructor() { }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    // public set levelManage(levelManage: Node) {
    //     this._levelManager = levelManage;
    //     this.notifyObservers();
    // }

    public getState(): any {
        return this.state;
    }

    public setState(newState: any): void {
        this.state = { ...this.state, ...newState };
        this.notifyObservers();
    }

    public subscribe(observer: (state: any) => void): void {
        this.observers.push(observer);
    }

    public unsubscribe(observer: (state: any) => void): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    private notifyObservers(): void {
        this.observers.forEach(observer => observer(this.state));
    }
}
