import { _decorator, Component, AudioSource } from 'cc';
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
        eventTarget.on(CHANGE_VOLUME_SOUND, this.changeVolumeSound, this);
        eventTarget.on(CHANGE_VOLUME_MUSIC, this.changeVolumeMusic, this);
        eventTarget.on(PLAY_AMMO_SOUND, this.playAmmoSound, this);
        eventTarget.on(PLAY_ROCKET_SOUND, this.playRocketSound, this);
        eventTarget.on(PLAY_EXPLOSION_SOUND, this.playExplosionSound, this);

        const music = localStorage.getItem('music');
        const sound = localStorage.getItem('sound');

        this.backgroundSource.volume = music ? Number(music) : 0.1;
        eventTarget.emit(CHANGE_HAND_MUSIC, music ?? 0.1);
        
        this.ammoSource.volume = sound ? Number(sound) : 0.1;
        this.rocketSource.volume = sound ? Number(sound) : 0.1;
        this.explosionSource.volume = sound ? Number(sound) : 0.1;
        eventTarget.emit(CHANGE_HAND_SOUND, sound ?? 0.1);
    }

    changeVolumeMusic(value: number) {
        this.backgroundSource.volume = value;
        localStorage.setItem('music', value.toString());
    }

    changeVolumeSound(value: number) {
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