import { _decorator, Graphics, Node } from "cc";
import { GameState } from "./Enums";
const { ccclass } = _decorator;

@ccclass
export default class Store {
    private static instance: Store;

    private state: any = {};
    private observers: Array<(state: any) => void> = [];

    public canvas: Node;
    public levelManager: Node;
    public ammoLayer: Node;
    public towerLayer: Node;
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
}
