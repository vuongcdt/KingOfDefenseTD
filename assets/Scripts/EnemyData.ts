import { _decorator } from "cc";
import { CharacterType } from "./Enums";

export class WaveData {
    public name: string;
    public data: EnemySpawn[];
}

export class EnemySpawn {
    public type: CharacterType;
    public total: number = 0;
    public timeDelay: number = 0;
}

export const enemiesData: WaveData[] = [
    {
        name: 'wave 1',
        data: [{
            type: CharacterType.Soldier,
            total: 3,
            timeDelay: 1
        }]
    },
    {
        name: 'wave 2',
        data: [{
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
        data: [{
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
        data: [{
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
        data: [{
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
        data: [{
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
        data: [{
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
