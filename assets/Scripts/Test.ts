import { _decorator, Component, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {

    // Tạo một mảng SpriteFrame
    @property({ type: [SpriteFrame] })
    private backgrounds: SpriteFrame[] = [];

    start() {
        // Ví dụ: Sử dụng SpriteFrame từ mảng
        if (this.backgrounds.length > 0) {
            let firstBackground = this.backgrounds[0];
            // Làm gì đó với firstBackground
        }
    }
}
