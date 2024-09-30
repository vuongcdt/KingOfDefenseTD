import { _decorator, Component, Node, AudioSource, assert } from 'cc';
import { eventTarget } from './Common';
import { CHANGE_VOLUME_BACKGROUND_MUSIC, CHANGE_VOLUME_SHOOT, PLAY_AMMO_SOUND, PLAY_EXPLOSION_SOUND, PLAY_ROCKET_SOUND } from './CONSTANTS';
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
        eventTarget.on(CHANGE_VOLUME_BACKGROUND_MUSIC, this.changeVolunmBG, this);
        eventTarget.on(CHANGE_VOLUME_SHOOT, this.changeVolunmShootSound, this);
        eventTarget.on(PLAY_AMMO_SOUND, this.playAmmoSound, this);
        eventTarget.on(PLAY_ROCKET_SOUND, this.playRocketSound, this);
        eventTarget.on(PLAY_EXPLOSION_SOUND, this.playExplosionSound, this);

        this.backgroundSource.volume = 0.2;
        this.ammoSource.volume = 0.3;
        this.rocketSource.volume = 0.3;
        this.explosionSource.volume = 0.3;
    }

    changeVolunmBG(value: number) {
        this.backgroundSource.volume = value * 0.5;
    }

    changeVolunmShootSound(value: number) {
        this.ammoSource.volume = value * 0.5;
        this.rocketSource.volume = value * 0.5;
        this.explosionSource.volume = value * 0.5;
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