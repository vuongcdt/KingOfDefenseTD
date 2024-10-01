import { _decorator, Component, ProgressBar, Slider } from 'cc';
import { eventTarget } from '../Common';
import {  CHANGE_VOLUME_SOUND, CHANGE_VOLUME_MUSIC, CHANGE_HAND_MUSIC, CHANGE_HAND_SOUND } from '../CONSTANTS';
const { ccclass, property } = _decorator;

@ccclass('SliderCustom')
export class SliderCustom extends Component {
    @property(Slider)
    private soundSlider: Slider;
    @property(Slider)
    private musicSlider: Slider;

    private _soundProgressBar: ProgressBar;
    private _musicProgressBar: ProgressBar;

    onLoad() {
        this._soundProgressBar = this.soundSlider.getComponentInChildren(ProgressBar);
        this._musicProgressBar = this.musicSlider.getComponentInChildren(ProgressBar);

        this.soundSlider.node.on('slide', this.onChangeSoundSlider, this);
        this.musicSlider.node.on('slide', this.onChangeMusicSlider, this);

        this._soundProgressBar.progress = this.soundSlider.progress;
        this._musicProgressBar.progress = this.musicSlider.progress;

        eventTarget.on(CHANGE_HAND_MUSIC,this.onChangeHandMusic,this);
        eventTarget.on(CHANGE_HAND_SOUND,this.onChangeHandSound,this);
    }

    onChangeSoundSlider(slider: Slider) {
        this._soundProgressBar.progress = this.soundSlider.progress;
        eventTarget.emit(CHANGE_VOLUME_SOUND, slider.progress);
    }

    onChangeMusicSlider(slider: Slider) {
        this._musicProgressBar.progress = this.musicSlider.progress;
        eventTarget.emit(CHANGE_VOLUME_MUSIC, slider.progress);
    }

    onChangeHandSound(value: number) {
        this.soundSlider.progress = value;
        this._soundProgressBar.progress = value;
    }

    onChangeHandMusic(value: number) {
        this.musicSlider.progress = value;
        this._musicProgressBar.progress = value;
    }

}


