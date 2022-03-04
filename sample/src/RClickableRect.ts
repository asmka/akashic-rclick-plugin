import * as rclick from "@asmka/akashic-rclick-plugin";

export class RClickableRect extends g.FilledRect implements rclick.RClickableE {
  rclickable: boolean = true;
  onRClickDown: g.Trigger<rclick.RClickDownEvent> =
    new g.Trigger<rclick.RClickDownEvent>();
  onRClickMove: g.Trigger<rclick.RClickMoveEvent> =
    new g.Trigger<rclick.RClickMoveEvent>();
  onRClickUp: g.Trigger<rclick.RClickUpEvent> =
    new g.Trigger<rclick.RClickUpEvent>();
  _cssColor: string;

  constructor(param: g.FilledRectParameterObject) {
    super(param);
    this._cssColor = this.cssColor;
    this.onRClickDown.add(this._onRClickDown, this);
    this.onRClickMove.add(this._onRClickMove, this);
    this.onRClickUp.add(this._onRClickUp, this);
  }

  _onRClickDown(e: rclick.RClickDownEvent): void {
    this.cssColor = "#f00";
    this.modified();
  }

  _onRClickMove(e: rclick.RClickMoveEvent): void {
    this.x -= e.prevDelta.x;
    this.y -= e.prevDelta.y;
    this.modified();
  }

  _onRClickUp(e: rclick.RClickUpEvent): void {
    this.cssColor = this._cssColor;
    this.modified();
  }
}
