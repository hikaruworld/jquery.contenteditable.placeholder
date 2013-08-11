/**
 * ContetEditable領域に対するplaceholderを実現するためのプラグインを提供します
 *
 * 
 * 独自にCSSを定義したいような場合、以下のCSS定義を行う必要があります。
 * <pre>
 *  [data-placeholder][data-placeholder-active=true]::before {
 *    content: attr(data-placeholder);
 *    opacity: 0.5
 *  } 
 * </pre>
 * <h3>利用方法</h3>
 * <pre>
 * <script type="text/javascript" charset="utf-8">
 *   $(function() {
 *     $.setPlaceholder();
 *   });
 * </script>
 * </pre>
 * <pre>
 * <script type="text/javascript" charset="utf-8">
 *   $(function() {
 *     $.setPlaceholder("#test");
 *   });
 * </script>
 * </pre>
 * <pre>
 * <script type="text/javascript" charset="utf-8">
 *   $(function() {
 *     $.setPlaceholder("#test", {inativeEvent: 'focus'});
 *   });
 * </script>
 * </pre>
 */
(function(jQuery) {
  //=======================================================
  // 定数定義
  //=======================================================
  /** 名前空間 */
  var NAMESPACE = 'contenteditableplaceholder'
  /** デフォルトStyle */
  PLACEHOLDER_STYLE = {
    'content': 'attr(data-placeholder)',
    'opacity': 0.5
  }
  /** 発行されるイベント */
  ,events = {
    ActiveEvent: 'placeholderactive'
    ,InActiveEvent: 'placeholderinactive'
  }
  /** 外部設定可能なオプション属性 */
  ,options = {
    /** placeholderが無効となるイベント */
    inativeEvent: 'change keydown keypress input'
    /** placeholderが有効となるイベント */
    ,activeEvent: 'blur'
    /** デフォルト設定で利用されるセレクタ要素 */
    ,defautlSelector: '[data-placeholder]'
    /**
     * スタイル設定を独自に行わない場合にfalseを設定します
     * @type {Boolean} 'dynamic'  :  <style>タグを動的生成します。
     *                 'none'     :  クラス定義を行いません。開発者が独自にクラス設定を行う必要があります。
     *                 'embeded'  :  {@code style}属性を利用して対象要素自体に基底のスタイルを埋め込みます(デフォルト)。
     * ※現在サポートされているプロパティは、noneのみです。
     */
    ,isClasActivate: 'embeded'
    /**
     * placeholer要素の状態が変更した場合にイベントを発行するかどうか
     * @type {Boolean} trueの場合にplaceholderが有効になった場合に{@code contenteditableplaceholder}イベントが発行されます(デフォルト)。
     *                 falseの場合においてはイベントが発行されません。
     * @default true
     */
    ,isTrigger: true
  };

  /** documentオブジェクトを参照するjQueryオブジェクトキャッシュ */
  var $doc = jQuery(document);

  //=======================================================
  // 内部クラス
  //=======================================================

  /**
   * Namespace連結処理を行います
   * @param  {string} eventName 対象イベント名
   * @return {string}           固有namespaceが付与されたイベント名が返されます
   */
  var _ns = function(eventName) {
    return (eventName ? eventName : '') + ('.' + NAMESPACE);
  };

  /**
   * トリガー設定が行こうになっている場合に、イベントを発行します
   * @param  {string} eventName 対象イベント名
   */
  var _trigger = function(eventName) {
    if (options.isTrigger) $doc.trigger(eventName)
  };

  /**
   * 引数に渡されたイベント群に対して一括でnamespace設定を行います。
   * eventNamesは単一のイベントか、ないしは半角スペースで区切られた任意の数のイベントをサポートします
   * @param  {string} eventNames 任意のイベント名{@code eventName.NAMESPACE}の形式で設定が行われます。
   * @param  {Boolean} isArray   trueの場合変換された要素を配列として返します。
   *                             falseの場合変換された要素を文字列で返します(デフォルト)。
   * @return {string}            namespaceが付与されたイベント一覧({@code iSArray}が無効な場合)
   *         {Array}             namespaceが付与されたイベント一覧({@code iSArray}が有効な場合)
   */
  var ns = function(eventNames, isArray) {
    if (!eventNames) return _ns();
    if (eventNames.indexOf(" ") === -1) return _ns(eventNames);
    var splits = eventNames.split(" ").map(function(val) { return _ns(val); });
    return isArray ? splits : splits.join(" ");
  };

  /**
   * このプラグイン用のCSS設定を行います
   * @param  {jQueryObject} selector 対象セレクタ
   * @deprecated このメソッドはまだ実装されていません
   */
  var setClassName = function(selector) {
    if (options.isClasActivate === 'embeded') {
      // selector.css(PLACEHOLDER_STYLE);
    } else if (options.isClasActivate === 'dynamic') {
      //TODO ...
    }
  };

  /**
   * Placeholderが`無効`になった場合に実行されるイベントハンドラを定義します
   */
  var inActiveHandler = function() {
    delete(this.dataset.placeholderactive);
    _trigger(events.InActiveEvent);
  };

  /**
   * Placeholderが`有効`になった場合に実行されるイベントハンドラを定義します
   */
  var activeHandler = function() {
    if (this.innerText.length !== 0) return;
    this.dataset.placeholderactive = 'true';
    _trigger(events.ActiveEvent);
  };

  //=======================================================
  // 公開メソッド
  //=======================================================

  /**
   * 属性として`data-placeholder`を保持する要素に対して一括でplaceholder設定を行います。
   * @param  {string} target 対象セレクタ要素(Optional)
   * @param  {Object} options デフォルトオプション。(Optional)
   *                          発行契機をカスタマイズしたい場合のこのオブジェクトを独自定義してください
   */
  jQuery.setPlaceholder = function(target, opts) {
    var selector, option = opts || target;
    if (typeof target === 'string') {
      selector = target;
      option = opts;
    }
    options = jQuery.extend(options, option || {});
    jQuery(selector || options.defautlSelector).placeholder();
  };

  /**
   * 指定した要素にplacehodler要素をCSSのcontent属性を利用して設定します
   */
  jQuery.fn.placeholder = function() {
    // 重複bindを防ためにnamespaceを使って一括削除します
    this.off(options.inativeEvent, ns())
        .off(options.activeEvent, ns());

    // setClassName();

    this.on(ns(options.inativeEvent), inActiveHandler)
        .on(ns(options.activeEvent), activeHandler);

    // 初期値としてplaceholderを有効にしておく
    activeHandler.bind(this.get()[0])();

    return this;
  };

})(jQuery);
