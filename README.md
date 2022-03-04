# akashic-rclick-plugin

<p align="center">
  <img src="https://github.com/asmka/akashic-rclick-plugin/blob/master/img/akashic.png"/>
</p>

本リポジトリは[akashic-games/akashic-hover-plugin](https://github.com/akashic-games/akashic-hover-plugin)に
インスパイアされています。

**akashic-rclick-plugin**は Akashic で右クリック可能なエンティティを利用することができるプラグインです。

実装例は `sample` ディレクトリ以下にあるサンプルプロジェクトを参照してください。

## 利用方法

[akashic-cli](https://github.com/akashic-games/akashic-cli)をインストールした後、

```sh
akashic install @asmka/akashic-rclick-plugin
```

でインストールできます。

本プラグインをコンテンツへ登録し利用するには `g.OperationPluginManager#register()` を利用します。
`g.OperationPluginManager#register()` の第一引数にはプラグインの実態、第二引数には識別コードを指定する必要があります。識別コードは対象のプラグインを開始/停止する操作に必要となります。

```javascript
import * as rclick from "@asmka/akashic-rclick-plugin";
...
g.game.operationPluginManager.register(rclick.RClickPlugin, 5); // RClickPlugin を 識別コード 5 で 登録
g.game.operationPluginManager.start(5); // 識別コード 5 のプラグインを開始
...

g.game.operationPluginManager.stop(5) // 識別コード 5 のプラグインを停止
```

第三引数には次の名前のプロパティ名と対応する値を持つオブジェクトを指定することができます。

- cursor
  - 文字列 (省略可能。省略された場合 `"pointer"`)
  - 右クリック時の cursor を指定。CSS に準拠。
- showTooltip
  - 真偽値 (省略可能。省略された場合 `false`)
  - 右クリック時に tooltip を表示されるかどうか。
  - 表示内容は `RClickableE#title` 。

```javascript
g.game.operationPluginManager.register(rclick.RClickPlugin, 5, {
  cursor: "help",
  showTooltip: true,
});
```

### コンテンツへの適用

`E#touchable`, `E#rclickable` プロパティが `true` を返すエンティティに対して `E#onRClickDown`, `E#onRClickMove`, `E#onRClickUp` トリガを発火させます。
このインタフェースは `RClickableE` として `src/RClickableE` に定義されています。

```typescript
export interface RClickableE extends g.E {
  rclickable: boolean;
  onRClickDown: g.Trigger<RClickDownEvent>;
  onRClickMove: g.Trigger<RClickMoveEvent>;
  onRClickUp: g.Trigger<RClickUpEvent>;
  cursor?: string;
}
```

`E#onRClickDown` は右クリックダウン時、`E#onRClickMove` は右クリックムーブ時、`E#onRClickUp` は右クリックアップ時に発火されます。

### 既存のエンティティへの適用

`g.FilledRect` など既存のエンティティを右クリック可能にするには以下のようにします。

```javascript
import * as rclick from "@asmka/akashic-rclick-plugin";

...
const rect = new g.FilledRect(...);
const rclickableRect = rclick.Converter.asRClickable(rect);
rclickableRect.onRClickDown.add((e) => {
	rect.cssColor = "#f00";
	rect.modified();
});
rclickableRect.onRClickMove.add((e) => {
  rect.x -= e.prevDelta.x;
  rect.y -= e.prevDelta.y;
  rect.modified();
});
rclickableRect.onRClickUp.add((e) => {
	rect.cssColor = "#000";
	rect.modified();
});
```

## ライセンス

本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/asmka/akashic-rclick-plugin/blob/master/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[akashic-games/akashic-hover-plugin](https://github.com/akashic-games/akashic-hover-plugin) に帰属し、
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の下に提供されています。
