import { _decorator } from "cc";
import { CharacterType } from "./Enums";

export class DataEnemy {
    public name: string;
    public data: EnemySpawn[];
}

export class EnemySpawn {
    public type: CharacterType;
    public total: number = 0;
    public time: number = 0;
}

export const enemiesData: DataEnemy[] = [
    {
        name: 'wave 1',
        data: [{
            type: CharacterType.Soldier,
            total: 3,
            time: 1
        }]
    },
    {
        name: 'wave 2',
        data: [{
            type: CharacterType.Soldier,
            total: 3,
            time: 11
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            time: 12
        }]
    },
    {
        name: 'wave 3',
        data: [{
            type: CharacterType.Tank,
            total: 1,
            time: 21
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            time: 23
        }]
    },
    {
        name: 'wave 4',
        data: [{
            type: CharacterType.Tank,
            total: 3,
            time: 31
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            time: 33
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            time: 34
        }]
    },
    {
        name: 'wave 5',
        data: [{
            type: CharacterType.Tank,
            total: 3,
            time: 41
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            time: 43
        },
        {
            type: CharacterType.Plane,
            total: 3,
            time: 44
        }]
    },
    {
        name: 'wave 6',
        data: [{
            type: CharacterType.Tank,
            total: 3,
            time: 51
        },
        {
            type: CharacterType.Tank,
            total: 3,
            time: 53
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            time: 55
        },
        {
            type: CharacterType.Soldier,
            total: 3,
            time: 56
        },
        {
            type: CharacterType.Plane,
            total: 3,
            time: 56
        }]
    },
    {
        name: 'wave 7',
        data: [{
            type: CharacterType.Plane,
            total: 3,
            time: 61
        },
        {
            type: CharacterType.Plane,
            total: 3,
            time: 63
        },
        {
            type: CharacterType.Plane,
            total: 3,
            time: 65
        }]
    },
]
