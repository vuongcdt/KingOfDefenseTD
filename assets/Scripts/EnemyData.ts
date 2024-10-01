import { _decorator } from "cc";
const { ccclass, property } = _decorator;
import { CharacterType } from "./Enums";

export class EnemySpawn {
    @property({ type: CharacterType, displayName: "type" })
    public type: CharacterType;
    @property({ type: Number, displayName: "total" })
    public total: number = 0;
    @property({ type: Number, displayName: "time" })
    public time: number = 0;

    constructor(type: CharacterType, total: number, time: number) {
        this.time = time;
        this.total = total;
        this.type = type;
    }
}

export const enemiesData: EnemySpawn[] = [
    new EnemySpawn(CharacterType.Soldier, 3, 1),

    new EnemySpawn(CharacterType.Soldier, 3, 11),
    new EnemySpawn(CharacterType.Soldier, 3, 12),

    new EnemySpawn(CharacterType.Tank, 1, 20),
    new EnemySpawn(CharacterType.Soldier, 3, 21),

    new EnemySpawn(CharacterType.Tank, 3, 30),
    new EnemySpawn(CharacterType.Soldier, 3, 31),
    new EnemySpawn(CharacterType.Plane, 3, 32),

    new EnemySpawn(CharacterType.Tank, 3, 40),
    new EnemySpawn(CharacterType.Plane, 3, 41),
    new EnemySpawn(CharacterType.Soldier, 3, 41),

    new EnemySpawn(CharacterType.Tank, 3, 50),
    new EnemySpawn(CharacterType.Soldier, 3, 51),
    new EnemySpawn(CharacterType.Plane, 3, 52),

    new EnemySpawn(CharacterType.Plane, 3, 60),
    new EnemySpawn(CharacterType.Plane, 3, 62),
    new EnemySpawn(CharacterType.Plane, 3, 64),
]

const levels = [
    {
        name:'level 1',
        waves:[
            {
                name:'wave 1',
                stage: [
                    {
                        type: CharacterType.Soldier,
                        amount: 3,
                    },
                    {
                        type: CharacterType.Soldier,
                        amount: 3,
                    },
                ],
            },
            {
                name:'wave 2',
                stage: [
                    {
                        type: CharacterType.Soldier,
                        amount: 3,
                    },
                    {
                        type: CharacterType.Tank,
                        amount: 3,
                    }
                ],
               
            },
            {
                name:'wave 3',
                stage: [
                    {
                        type: CharacterType.Soldier,
                        amount: 3,
                    },
                    {
                        type: CharacterType.Plane,
                        amount: 3,
                    }
                ],
               
            },
            {
                name:'wave 4',
                stage: [
                    {
                        type: CharacterType.Tank,
                        amount: 3,
                    },
                    {
                        type: CharacterType.Plane,
                        amount: 3,
                    }
                ],
               
            },
        ]
    }
]
