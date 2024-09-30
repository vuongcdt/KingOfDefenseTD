import { _decorator, Component, Enum, ProgressBar, Slider } from 'cc';
import { eventTarget } from '../Common';
import { CHANGE_VOLUME_BACKGROUND_MUSIC, CHANGE_VOLUME_SHOOT } from '../CONSTANTS';
import { SliderType } from '../Enums';
const { ccclass, property } = _decorator;

@ccclass('SliderCustom')
export class SliderCustom extends Component {
    @property({ type: Enum(SliderType) })
    private type: SliderType;
    private _progressBar: ProgressBar;

    onLoad() {
        this._progressBar = this.getComponentInChildren(ProgressBar);
        this.node.on('slide', this.onChangeSlider, this);

        this._progressBar.progress = this.getComponent(Slider).progress;
    }

    onChangeSlider(slider: Slider) {
        this._progressBar.progress = slider.progress;
        if (this.type == SliderType.Music) {
            eventTarget.emit(CHANGE_VOLUME_BACKGROUND_MUSIC, slider.progress);
        } else {
            eventTarget.emit(CHANGE_VOLUME_SHOOT, slider.progress);
        }
    }
}


