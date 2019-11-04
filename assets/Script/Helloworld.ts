/*
 * @Author: conjurer
 * @Github: https://github.com/dot123
 * @Date: 2019-11-04 10:10:02
 * @LastEditors: conjurer
 * @LastEditTime: 2019-11-04 16:28:45
 * @Description:
 */
import RuleData from "./RuleData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {
    @property(cc.Node)
    private background: cc.Node = null;

    @property(cc.Node)
    private targetNode: cc.Node = null;

    @property(cc.Node)
    private leftNode: cc.Node = null;

    @property(cc.Node)
    private rightNode: cc.Node = null;

    @property(cc.Node)
    private bottomNode: cc.Node = null;

    @property(cc.Node)
    private topNode: cc.Node = null;

    @property(cc.Label)
    private timeLabel: cc.Label = null;

    private leftSpeed: number = 0;
    private rightSpeed: number = 0;
    private bottomSpeed: number = 0;
    private topSpeed: number = 0;

    private staticTime: number = 0; //静止时间
    private moveTime: number = 0; //移动时间
    private timeCount: number = 0;
    private isStart: boolean = false; //是否开始

    private count: number = 0;
    private scale: number = 0;

    private isEnd: boolean = false;

    private width: number = 0;
    private height: number = 0;
    private offsetY: number = 0;

    start() {
        let w = 960; //地图大小
        let h = 640;

        this.background.setContentSize(w, h);

        this.leftNode.setContentSize(w, h);
        this.rightNode.setContentSize(w, h);
        this.bottomNode.setContentSize(w, h);
        this.topNode.setContentSize(w, h);

        this.leftNode.setPosition(-w / 2, 0);
        this.rightNode.setPosition(w / 2, 0);
        this.bottomNode.setPosition(0, -h / 2);
        this.topNode.setPosition(0, h / 2);

        this.targetNode.setContentSize(w, h);

        this.Setup();
    }

    update(dt) {
        if (this.isEnd) {
            return;
        }

        if (this.isStart) {
            this.leftNode.x -= this.leftSpeed;
            this.rightNode.x -= this.rightSpeed;
            this.bottomNode.y -= this.bottomSpeed;
            this.topNode.y -= this.topSpeed;

            this.width = this.rightNode.x - this.leftNode.x;
            this.height = this.topNode.y - this.bottomNode.y;

            this.leftNode.height = this.height;
            this.leftNode.y += this.offsetY;
            this.rightNode.height = this.height;
            this.rightNode.y += this.offsetY;

            this.timeCount++;

            this.timeLabel.string = "移动时间:" + this.timeCount;

            if (this.timeCount >= this.moveTime) {
                this.timeCount = 0;
                this.isStart = false;

                this.Setup(); //设置下次
            }
        } else {
            this.timeCount++;

            this.timeLabel.string = "静止时间:" + this.timeCount;

            if (this.timeCount >= this.staticTime) {
                this.timeCount = 0;
                this.isStart = true;

                let size = this.targetNode.getContentSize();
                let curPos = this.targetNode.position;

                let w = size.width * (1 - this.scale);
                let h = size.height * (1 - this.scale);
                let w2 = w / 2;
                let h2 = h / 2; //锚点在0.5,0.5

                let y = this.RandInt(-h2, h2);

                this.offsetY = y / this.moveTime;
                this.targetNode.setContentSize(size.width - w, size.height - h);
                this.targetNode.position = cc.v2(curPos.x + this.RandInt(-w2, w2), curPos.y + y);

                this.CalcuSpeed();
            }
        }
    }

    private CalcuSpeed() {
        let xMin = this.targetNode.x - this.targetNode.width / 2;
        let xMax = this.targetNode.x + this.targetNode.width / 2;
        let yMin = this.targetNode.y - this.targetNode.height / 2;
        let yMax = this.targetNode.y + this.targetNode.height / 2;

        let leftDistance = this.leftNode.x - xMin; //距离
        let rightDistance = this.rightNode.x - xMax;
        let bottomDistance = this.bottomNode.y - yMin;
        let topDistance = this.topNode.y - yMax;

        this.leftSpeed = leftDistance / this.moveTime; //移动速度
        this.rightSpeed = rightDistance / this.moveTime;
        this.bottomSpeed = bottomDistance / this.moveTime;
        this.topSpeed = topDistance / this.moveTime;
    }

    private Setup() {
        this.width = this.targetNode.width;
        this.height = this.targetNode.height;

        this.count++;
        let info = RuleData[this.count];
        if (!info) {
            this.isEnd = true;
            return;
        }
        this.staticTime = info["staticTime"];
        this.moveTime = info["moveTime"];
        this.scale = info["scale"];
    }

    private RandInt(start, end) {
        return Math.random() * (end + 1 - start) + start;
    }

    public GetRect() {
        let pos = this.targetNode.position;
        pos = this.targetNode.parent.convertToWorldSpaceAR(pos);
        let w = this.width;
        let h = this.height;

        let rect = new cc.Rect(pos.x - w * 0.5, pos.y - h * 0.5, w, h);
        return rect;
    }
}
