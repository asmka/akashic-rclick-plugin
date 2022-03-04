/**
 * イベントの種別。
 *
 * - `"rclick-down"`: 右クリックダウンイベント。
 * - `"rclick-move"`: 右クリックムーブイベント。
 * - `"rclick-up"`: 右クリックアップイベント。
 */
export type RClickEventTypeString = "rclick-down" | "rclick-move" | "rclick-up";

/**
 * イベントを表すインターフェース。
 */
export interface RClickEventBase {
  /**
   * イベントの種別。
   */
  type: RClickEventTypeString;
  point: g.CommonOffset;
}

export class RClickDownEvent implements RClickEventBase {
  type: "rclick-down" = "rclick-down";
  point: g.CommonOffset;

  constructor(point: g.CommonOffset) {
    this.point = point;
  }
}

export class RClickMoveEvent implements RClickEventBase {
  type: "rclick-move" = "rclick-move";
  point: g.CommonOffset;
  startDelta: g.CommonOffset;
  prevDelta: g.CommonOffset;

  constructor(
    point: g.CommonOffset,
    startDelta: g.CommonOffset,
    prevDelta: g.CommonOffset
  ) {
    this.point = point;
    this.startDelta = startDelta;
    this.prevDelta = prevDelta;
  }
}

export class RClickUpEvent implements RClickEventBase {
  type: "rclick-up" = "rclick-up";
  point: g.CommonOffset;
  startDelta: g.CommonOffset;
  prevDelta: g.CommonOffset;

  constructor(
    point: g.CommonOffset,
    startDelta: g.CommonOffset,
    prevDelta: g.CommonOffset
  ) {
    this.point = point;
    this.startDelta = startDelta;
    this.prevDelta = prevDelta;
  }
}
