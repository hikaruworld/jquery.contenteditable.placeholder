# jquery.contenteditable.placeholder

contenteditable領域に対してplaceholderを実現するためのjQueryプラグインです。

## Usage

### CSS

```css
[data-placeholder][data-placeholder-active=true]::before {
  content: attr(data-placeholder);
  opacity: 0.5
} 
```

### javascript

一括指定したい場合

```javascript
$(function() {
  $.setPlaceholder();
});
```

特定のID指定

```javascript
$(function() {
  $.setPlaceholder("#test");
});
```

色々カスタマイズしたい場合

```javascript
$(function() {
  $.setPlaceholder("#test", {inativeEvent: 'focus'});
});
```

## Event

placeholder要素が更新された場合、デフォルト設定では、
Placehodlerが有効になった場合`placeholderactive`が、
Placehodlerが無効になった場合'placeholderinactive'が発行されます。

## TODO

* CSS定義の独自カスタマイズ