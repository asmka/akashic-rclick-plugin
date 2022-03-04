import { RClickDownEvent, RClickMoveEvent, RClickUpEvent } from "./RClickEvent";
/**
 * 右クリック可能なエンティティ
 */
export interface RClickableE extends g.E {
  /**
   * 右クリック可能かどうか。
   * この値がtrulyである場合、RClickPluginは以下の操作を行う。
   *  - 対象のエンティティ上でマウス右ボタンを押した際に `onRClickDown` トリガを発火する。
   *  - 対象のエンティティ上でマウス右ボタンを押しながら移動した際に `onRClickMove` トリガを発火する。
   *  - 対象のエンティティ上でマウス右ボタンを離した際に `onRClickUp` トリガを発火する。
   */
  rclickable: boolean;
  /**
   * このエンティティ上でマウス右ボタンを押した際に発火するトリガ。
   */
  onRClickDown: g.Trigger<RClickDownEvent>;
  /**
   * このエンティティ上でマウス右ボタンを押しながら移動した際に発火するトリガ。
   */
  onRClickMove: g.Trigger<RClickMoveEvent>;
  /**
   * このエンティティ上でマウス右ボタンを離した際に発火するトリガ。
   */
  onRClickUp: g.Trigger<RClickUpEvent>;
  /**
   * このエンティティにマウス右クリックした際に変化するカーソルの形状。
   */
  cursor?: string;
  /**
   * このエンティティのtitle。
   * `HoverPluinOptions#showTooltip` が true の場合、ツールチップとして表示される。
   */
  title?: string;
}
