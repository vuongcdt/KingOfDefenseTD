import { _decorator } from "cc";
import { CharacterType } from "./Enums";

export class WaveData {
    public name: string;
    public dataEnemy: EnemySpawn[];
    public way: number;
}

export class EnemySpawn {
    public type: CharacterType;
    public total: number = 0;
    public timeDelay: number = 0;
}

export const enemiesData: WaveData[] = [
    {
        name: 'wave 1',
        way: 0,
        dataEnemy: [{
            type: CharacterType.Soldier,
            total: 3,
            timeDelay: 1
        }]
    },
    {
        name: 'wave 2',
        way: 1,
        dataEnemy: [{
            type: CharacterType.Soldier,
            total: 3,
            timeDelay: 1
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            timeDelay: 2
        }]
    },
    {
        name: 'wave 3',
        way: 0,
        dataEnemy: [{
            type: CharacterType.Tank,
            total: 1,
            timeDelay: 1
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            timeDelay: 3
        }]
    },
    {
        name: 'wave 4',
        way: 0,
        dataEnemy: [{
            type: CharacterType.Tank,
            total: 3,
            timeDelay: 1
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            timeDelay: 3
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            timeDelay: 4
        }]
    },
    {
        name: 'wave 5',
        way: 0,
        dataEnemy: [{
            type: CharacterType.Tank,
            total: 3,
            timeDelay: 1
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            timeDelay: 3
        },
        {
            type: CharacterType.Plane,
            total: 3,
            timeDelay: 4
        }]
    },
    {
        name: 'wave 6',
        way: 0,
        dataEnemy: [{
            type: CharacterType.Tank,
            total: 3,
            timeDelay: 1
        },
        {
            type: CharacterType.Tank,
            total: 3,
            timeDelay: 3
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            timeDelay: 5
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            timeDelay: 6
        },
        {
            type: CharacterType.Plane,
            total: 3,
            timeDelay: 6
        }]
    },
    {
        name: 'wave 7',
        way: 0,
        dataEnemy: [{
            type: CharacterType.Plane,
            total: 3,
            timeDelay: 1
        },
        {
            type: CharacterType.Plane,
            total: 3,
            timeDelay: 3
        },
        {
            type: CharacterType.Plane,
            total: 3,
            timeDelay: 5
        }]
    },
]
