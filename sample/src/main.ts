import * as rclick from "@asmka/akashic-rclick-plugin";
import { RClickableLabel } from "./RClickableLabel";
import { RClickableRect } from "./RClickableRect";

g.game.operationPluginManager.register(rclick.RClickPlugin, 5);
g.game.operationPluginManager.start(5);

export function main(param: g.GameMainParameterObject): void {
  const scene = new g.Scene({ game: g.game, assetIds: ["aco"] });
  scene.onLoad.add(() => {
    const font = new g.DynamicFont({
      game: g.game,
      size: 40,
      fontFamily: "sans-serif",
    });

    g.game.focusingCamera = new g.Camera2D({
      width: g.game.width,
      height: g.game.height,
      scaleX: 1.25,
      scaleY: 1.25,
      anchorX: 0.2,
      anchorY: 0.2,
      x: 0,
      y: 0,
    });
    let frames = 0;

    scene.onUpdate.add(() => {
      frames += 1;
      const camera = g.game.focusingCamera as g.Camera2D;
      camera.x = frames % (g.game.width / 4);
      camera.modified();
      scene.modified();
    });

    for (let i = 0; i < 5; i++) {
      (() => {
        const aco = new g.FrameSprite({
          scene: scene,
          src: scene.asset.getImageById("aco"),
          x: 5,
          y: i * 50,
          width: 32,
          height: 48,
          frames: [5, 6, 7, 6],
        });
        const rclickableAco = rclick.Converter.asRClickable(aco);
        rclickableAco.onRClickDown.add(() => {
          aco.start();
        });
        rclickableAco.onRClickUp.add(() => {
          aco.stop();
        });
        rclickableAco.title = `aco${i + 1}: こんにちわ！`;

        const rect = new RClickableRect({
          scene: scene,
          x: 40,
          y: i * 50 + 20,
          width: 20,
          height: 20,
          cssColor: "#000",
          touchable: true,
        });

        const label = new RClickableLabel({
          scene: scene,
          x: 65,
          y: i * 50 + 18,
          text: `test${i + 1}`,
          fontSize: 20,
          font: font,
          touchable: true,
        });

        scene.append(aco);
        scene.append(rect);
        scene.append(label);
      })();
    }
  });
  g.game.pushScene(scene);
}

module.exports = main;
