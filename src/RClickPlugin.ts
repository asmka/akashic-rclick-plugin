import { RClickableE } from "./RClickableE";
import { RClickDownEvent, RClickMoveEvent, RClickUpEvent } from "./RClickEvent";
import { RClickPluginOptions } from "./RClickPluginOptions";

/**
 * 右クリック機能を提供するプラグイン。
 */
class RClickPlugin implements g.OperationPlugin {
  game: g.Game;
  view: HTMLElement;
  beforeRClick: RClickableE | null;
  startPoint: Readonly<g.CommonOffset> | null;
  startWindowPoint: Readonly<g.CommonOffset> | null;
  prevWindowPoint: Readonly<g.CommonOffset> | null;
  operationTrigger: g.Trigger<g.OperationPluginOperation | (number | string)[]>;
  _cursor: string;
  _showTooltip: boolean;

  _onContextMenu_bound: (e: MouseEvent) => void;
  _onMouseDown_bound: (e: MouseEvent) => void;
  _onMouseMove_bound: (e: MouseEvent) => void;
  _getScale: (() => { x: number; y: number }) | null;

  static isSupported(): boolean {
    return (
      typeof document !== "undefined" &&
      typeof document.addEventListener === "function"
    );
  }

  constructor(
    game: g.Game,
    viewInfo: g.OperationPluginViewInfo | null,
    option: RClickPluginOptions = {}
  ) {
    this.game = game;
    this.view = viewInfo!.view as HTMLElement; // viewInfo が必ず渡ってくるため null にはならない
    this.beforeRClick = null;
    this.startPoint = null;
    this.startWindowPoint = null;
    this.prevWindowPoint = null;
    this.operationTrigger = new g.Trigger();
    this._cursor = option.cursor || "pointer";
    this._showTooltip = !!option.showTooltip;
    this._getScale = (viewInfo as any).getScale
      ? () => (viewInfo as any).getScale()
      : null;

    this._onContextMenu_bound = this._onContextMenu.bind(this);
    this._onMouseDown_bound = this._onMouseDown.bind(this);
    this._onMouseMove_bound = this._onMouseMove.bind(this);
  }

  start(): boolean {
    this.view.addEventListener("mousedown", this._onMouseDown_bound, false);
    this.view.addEventListener("mousemove", this._onMouseMove_bound, false);
    this.view.addEventListener("contextmenu", this._onContextMenu_bound, false);
    return true;
  }

  stop(): void {
    this.view.removeEventListener("mousedown", this._onMouseDown_bound, false);
    this.view.removeEventListener("mousemove", this._onMouseMove_bound, false);
    this.view.removeEventListener(
      "contextmenu",
      this._onContextMenu_bound,
      false
    );
  }

  _onMouseDown(e: MouseEvent): void {
    // 右ボタン以外は無効
    if (e.button !== 2) return;

    const scene = this.game.scene();
    if (!scene) return;

    const windowPoint = this._getWindowPoint(e);
    const absPoint = this._getAbsPoint(windowPoint);
    const target = scene.findPointSourceByPoint(absPoint).target as RClickableE;
    if (target && target.rclickable) {
      this._onRClickDown(target, windowPoint, absPoint);
    }
  }

  _onMouseMove(e: MouseEvent): void {
    const scene = this.game.scene();
    if (!scene) return;

    if (!this.beforeRClick) return;

    const windowPoint = this._getWindowPoint(e);
    this._onRClickMove(this.beforeRClick, windowPoint);
  }

  _onContextMenu(e: MouseEvent): void {
    // コンテキストメニュー表示の無効化
    e.preventDefault();

    const scene = this.game.scene();
    if (!scene) return;

    const windowPoint = this._getWindowPoint(e);
    if (this.beforeRClick) {
      this._onRClickUp(this.beforeRClick, windowPoint);
    }
  }

  _onRClickDown(
    target: RClickableE,
    windowPoint: g.CommonOffset,
    absPoint: g.CommonOffset
  ): void {
    this.view.style.cursor = target.cursor ? target.cursor : this._cursor;
    if (this._showTooltip && target.title) {
      this.view.setAttribute("title", target.title);
    }
    const point = target.globalToLocal(absPoint);
    const e = new RClickDownEvent(point);
    target.onRClickDown.fire(e);

    this.beforeRClick = target;
    this.startPoint = point;
    this.startWindowPoint = windowPoint;
    this.prevWindowPoint = windowPoint;
  }

  _onRClickMove(target: RClickableE, windowPoint: g.CommonOffset): void {
    if (this.startPoint && this.startWindowPoint && this.prevWindowPoint) {
      const startDelta = {
        x: windowPoint.x - this.startWindowPoint.x,
        y: windowPoint.y - this.startWindowPoint.y,
      };
      const prevDelta = {
        x: windowPoint.x - this.prevWindowPoint.x,
        y: windowPoint.y - this.prevWindowPoint.y,
      };
      const e = new RClickMoveEvent(this.startPoint, startDelta, prevDelta);
      target.onRClickMove.fire(e);
    }
    this.prevWindowPoint = windowPoint;
  }

  _onRClickUp(_target: RClickableE, windowPoint: g.CommonOffset): void {
    this.view.style.cursor = "auto";
    if (
      this.beforeRClick &&
      this.startPoint &&
      this.startWindowPoint &&
      this.prevWindowPoint
    ) {
      const startDelta = {
        x: windowPoint.x - this.startWindowPoint.x,
        y: windowPoint.y - this.startWindowPoint.y,
      };
      const prevDelta = {
        x: windowPoint.x - this.prevWindowPoint.x,
        y: windowPoint.y - this.prevWindowPoint.y,
      };
      const e = new RClickUpEvent(this.startPoint, startDelta, prevDelta);
      this.beforeRClick.onRClickUp.fire(e);
      if (this._showTooltip) {
        this.view.removeAttribute("title");
      }
    }
    this.beforeRClick = null;
    this.startPoint = null;
    this.startWindowPoint = null;
    this.prevWindowPoint = null;
  }

  _getWindowPoint(e: MouseEvent): g.CommonOffset {
    const rect = this.view.getBoundingClientRect();
    const positionX = rect.left + window.pageXOffset;
    const positionY = rect.top + window.pageYOffset;
    const offsetX = e.pageX - positionX;
    const offsetY = e.pageY - positionY;
    let scale = { x: 1, y: 1 };
    if (this._getScale) {
      scale = this._getScale();
    }
    return { x: offsetX / scale.x, y: offsetY / scale.y };
  }

  _getAbsPoint(windowPoint: g.CommonOffset): g.CommonOffset {
    const camera = g.game.focusingCamera as g.Camera2D;
    let absPoint: Readonly<g.CommonOffset>;
    if (camera) {
      const cameraOrigin = {
        x:
          camera.x -
          camera.width * camera.scaleX * (camera.anchorX ? camera.anchorX : 0),
        y:
          camera.y -
          camera.height * camera.scaleY * (camera.anchorY ? camera.anchorY : 0),
      };
      absPoint = {
        x: cameraOrigin.x + windowPoint.x * camera.scaleX,
        y: cameraOrigin.y + windowPoint.y * camera.scaleY,
      };
    } else {
      absPoint = {
        x: windowPoint.x,
        y: windowPoint.y,
      };
    }
    return absPoint;
  }
}

module.exports = RClickPlugin;
