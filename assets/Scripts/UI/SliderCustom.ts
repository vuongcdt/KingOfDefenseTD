import { _decorator, Component, EventHandler, Node, ProgressBar, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SliderCustom')
export class SliderCustom extends Component {
    private _progressBar:ProgressBar;

    protected onLoad(): void {
        this._progressBar = this.getComponentInChildren(ProgressBar);
        this.node.on('slide', this.onChangeSlider, this);

        this._progressBar.progress = this.getComponent(Slider).progress;
    }

    onChangeSlider(slider: Slider) {
        this._progressBar.progress = slider.progress;
    }
}


