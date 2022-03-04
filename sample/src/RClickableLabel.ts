import * as rclick from "@asmka/akashic-rclick-plugin";

export class RClickableLabel extends g.Label implements rclick.RClickableE {
  rclickable: boolean = true;
  onRClickDown: g.Trigger<rclick.RClickDownEvent> =
    new g.Trigger<rclick.RClickDownEvent>();
  onRClickMove: g.Trigger<rclick.RClickMoveEvent> =
    new g.Trigger<rclick.RClickMoveEvent>();
  onRClickUp: g.Trigger<rclick.RClickUpEvent> =
    new g.Trigger<rclick.RClickUpEvent>();
  _text: string;

  constructor(param: g.LabelParameterObject) {
    super(param);
    this._text = this.text;
    this.onRClickDown.add(this._onRClickDown, this);
    this.onRClickMove.add(this._onRClickMove, this);
    this.onRClickUp.add(this._onRClickUp, this);
  }

  _onRClickDown(e: rclick.RClickDownEvent): void {
    this.text = "rlick!";
    this.textColor = "#f00";
    this.invalidate();
  }

  _onRClickMove(e: rclick.RClickMoveEvent): void {
    this.x -= e.prevDelta.x;
    this.y -= e.prevDelta.y;
    this.modified();
  }

  _onRClickUp(e: rclick.RClickUpEvent): void {
    this.text = this._text;
    this.textColor = "#000";
    this.invalidate();
  }
}
