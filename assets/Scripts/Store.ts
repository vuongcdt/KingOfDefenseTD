import { _decorator, Graphics, Node } from "cc";
const { ccclass } = _decorator;

@ccclass
export default class Store {
    private static instance: Store;

    private state: any = {};
    private observers: Array<(state: any) => void> = [];
    private _levelManage: Node;
    private _graphics: Graphics;

    private constructor() { }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    public getGraphics(): Graphics {
        return this._graphics;
    }
    public setGraphics(value: Graphics) {
        this._graphics = value;
    }

    public getLevelManage(): any {
        return this._levelManage;
    }

    public setLevelManage(levelManage: Node): void {
        this._levelManage = levelManage;
        this.notifyObservers();
    }

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
