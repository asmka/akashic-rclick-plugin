/**
 * RClickPluginに渡すオプション。
 */
export interface RClickPluginOptions {
  /**
   * 右クリック時のカーソルの形状。
   * CSSのcursorプロパティと同価。
   * @default "pointer"
   */
  cursor?: string;

  /**
   * 右クリック時にtooltipを表示されるかどうか。
   * 表示内容は `RClickableE#title` 。
   */
  showTooltip?: boolean;
}
