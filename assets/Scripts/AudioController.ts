import { _decorator, Component, Node, AudioSource, assert } from 'cc';
import { eventTarget } from './Common';
import { CHANGE_VOLUME_SOUND, CHANGE_VOLUME_MUSIC, PLAY_AMMO_SOUND, PLAY_EXPLOSION_SOUND, PLAY_ROCKET_SOUND, CHANGE_HAND_SOUND, CHANGE_HAND_MUSIC } from './CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass("AudioController")
export class AudioController extends Component {
    @property(AudioSource)
    private backgroundSource: AudioSource = null;

    @property(AudioSource)
    private ammoSource: AudioSource = null;

    @property(AudioSource)
    private rocketSource: AudioSource = null;

    @property(AudioSource)
    private explosionSource: AudioSource = null;

    protected onLoad(): void {
        eventTarget.on(CHANGE_VOLUME_SOUND, this.changeVolunmBG, this);
        eventTarget.on(CHANGE_VOLUME_MUSIC, this.changeVolunmShootSound, this);
        eventTarget.on(PLAY_AMMO_SOUND, this.playAmmoSound, this);
        eventTarget.on(PLAY_ROCKET_SOUND, this.playRocketSound, this);
        eventTarget.on(PLAY_EXPLOSION_SOUND, this.playExplosionSound, this);

        const music = localStorage.getItem('music');
        const sound = localStorage.getItem('sound');

        if (sound) {
            this.backgroundSource.volume = Number(sound);
            eventTarget.emit(CHANGE_HAND_SOUND, sound);
        } else {
            this.backgroundSource.volume = 0.2;
            eventTarget.emit(CHANGE_HAND_SOUND, 0.2);
        }

        if (music) {
            this.ammoSource.volume = Number(music);
            this.rocketSource.volume = Number(music);
            this.explosionSource.volume = Number(music);

            eventTarget.emit(CHANGE_HAND_MUSIC, music);
        } else {
            this.ammoSource.volume = 0.2;
            this.rocketSource.volume = 0.2;
            this.explosionSource.volume = 0.2;

            eventTarget.emit(CHANGE_HAND_MUSIC, 0.2);
        }
    }

    changeVolunmBG(value: number) {
        this.backgroundSource.volume = value;
        localStorage.setItem('music', value.toString());
    }

    changeVolunmShootSound(value: number) {
        this.ammoSource.volume = value;
        this.rocketSource.volume = value;
        this.explosionSource.volume = value;
        localStorage.setItem('sound', value.toString());
    }

    playAmmoSound() {
        this.ammoSource.play();
    }

    playRocketSound() {
        this.rocketSource.play();
    }

    playExplosionSound() {
        this.explosionSource.play();
    }

}