/**
 * 拡張機能のアイコンがクリックされたときのイベントリスナ
 */
chrome.action.onClicked.addListener((tab) => {
  /**
   * ページ内の【〇〇】をクイズ形式に変換して描画する
   */
  const toQuiz = () => {
    // =========================================================
    // <style>をページ内に追加
    // =========================================================
    const styleHtmlStr = `<style> .chrome_ext_h2q_btn * { visibility: hidden; } </style>`;
    document.head.insertAdjacentHTML(`beforeend`, styleHtmlStr);

    // =========================================================
    // テキストに 【○○】 を含む要素を取得
    // ※<script>, <link> などは除外する
    // =========================================================
    const elems = document.evaluate(`.//*[text()[contains(., '【')] and text()[contains(., '】')]]`, document.body, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const elemArr = [];
    let e = null;
    while (e = elems.iterateNext()) {
      // TODO: 他にも除外するべきタグがあれば追記する
      const excludedTags = [
        'LINK', 'SCRIPT', 'NOSCRIPT', 'IFRAME'
      ];
      if (excludedTags.includes(e.tagName)) {
        continue;
      }
      elemArr.push(e);
    }

    // =========================================================
    // クイズ形式にして再描画
    // =========================================================
    // ボタンのstyle属性値
    const btnStyleAttr = [
      `color: transparent`,
      `display: inline-block`,
      `margin: 0.25rem 0.25rem`,
      `background-color: #EF9A9A`,
      `font-weight: bold`,
      `border: none`,
      `min-width: 4rem`,
      `cursor: pointer`,
      `user-select: none` // 選択できないようにする (選択すると答えが分かってしまうため)
    ].join(`; `);

    // ボタンのonclick属性値
    const onclickCode = `this.style.color = null; this.style.userSelect = null; this.classList.remove('chrome_ext_h2q_btn')`;
    elemArr.forEach(e => {
      // 【〇〇】を<span>に変換
      const newHtmlStr = e.innerHTML
        .replace(/【/g, `<span class="chrome_ext_h2q_btn" style="${btnStyleAttr}" onclick="${onclickCode}">`)
        .replace(/】/g, `</span>`);

      // 描画
      e.innerHTML = ``;
      e.insertAdjacentHTML(`beforeend`, newHtmlStr);
    });
  };

  // アクティブなタブ上で toQuiz() を実行する
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toQuiz,
  });
});