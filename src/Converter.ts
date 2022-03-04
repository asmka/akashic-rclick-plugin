import { RClickableE } from "./RClickableE";
import { RClickDownEvent, RClickMoveEvent, RClickUpEvent } from "./RClickEvent";

/**
 * コンバータオプション。
 */
export interface ConverterOptions {
  /**
   * ホバー時のカーソルの形状。
   * CSSのcursorプロパティと同価。
   * @default HoverPluginに渡したcursorの値
   */
  cursor?: string;
}

/**
 * コンバータ機能を提供するクラス。
 */
export class Converter {
  /**
   * エンティティをホバー可能に変換する。
   */
  static asRClickable(e: g.E, opts?: ConverterOptions): RClickableE {
    const rclickableE = e as RClickableE;
    rclickableE.rclickable = true;
    rclickableE.touchable = true;
    rclickableE.onRClickDown =
      rclickableE.onRClickDown || new g.Trigger<RClickDownEvent>();
    rclickableE.onRClickMove =
      rclickableE.onRClickMove || new g.Trigger<RClickMoveEvent>();
    rclickableE.onRClickUp =
      rclickableE.onRClickUp || new g.Trigger<RClickUpEvent>();
    if (opts) {
      if (opts.cursor) rclickableE.cursor = opts.cursor;
    }
    return rclickableE;
  }

  /**
   * エンティティのホバーを解除する。
   */
  static asUnRClickable(e: g.E): g.E {
    const rclickableE = e as Partial<RClickableE>;
    delete rclickableE.rclickable;
    if (rclickableE.onRClickDown && !rclickableE.onRClickDown.destroyed()) {
      rclickableE.onRClickDown.destroy();
      delete rclickableE.onRClickDown;
    }
    if (rclickableE.onRClickMove && !rclickableE.onRClickMove.destroyed()) {
      rclickableE.onRClickMove.destroy();
      delete rclickableE.onRClickMove;
    }
    if (rclickableE.onRClickUp && !rclickableE.onRClickUp.destroyed()) {
      rclickableE.onRClickUp.destroy();
      delete rclickableE.onRClickUp;
    }
    return rclickableE as g.E;
  }
}
