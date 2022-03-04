export { Converter } from "./Converter";
export { RClickableE } from "./RClickableE";
export { RClickDownEvent, RClickMoveEvent, RClickUpEvent } from "./RClickEvent";

// RClickPlugin.ts で module.exports しているため、そのまま export すると使用側で型がおかしくなる。
// 後方互換性のため module.exports は残しここでキャストしている。
import * as plugin from "./RClickPlugin";
const rclickPlugin = plugin as g.OperationPluginStatic;
export { rclickPlugin as RClickPlugin };
