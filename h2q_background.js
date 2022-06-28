/**
 * 拡張機能のアイコンがクリックされたときのイベントリスナ
 */
chrome.action.onClicked.addListener((tab) => {
  /**
   * ページ内の【〇〇】をクイズに変換する
   * 
   * NOTE: document.body.innerHTML のサイズが大きいと重くなりそう
   */
  const toQuiz = () => {
    // <style>をページ内に追加
    const styleHtmlStr = `<style> .chrome_ext_h2q_btn * { visibility: hidden; } </style>`;
    document.head.insertAdjacentHTML(`beforeend`, styleHtmlStr);

    // <body>内部のHTMLを文字列として取得
    const bodyHtmlStr = document.body.innerHTML;

    // ボタンのstyle属性値
    const btnStyleAttr = [
      `color: transparent`,
      `display: inline-block`,
      `margin: 0.25rem 0.25rem`,
      `background-color: #EF9A9A`,
      `font-weight: bold`,
      `border: none`,
      `min-width: 4rem`,
      `user-select: none` // 選択できないようにする (選択すると答えが分かってしまうため)
    ].join(`; `);

    // ボタンのonclick属性値
    const onclickCode = `this.style.color = null; this.style.userSelect = null; this.classList.remove('chrome_ext_h2q_btn')`;

    // 【〇〇】を<button>に変換
    const newBodyHtmlStr = bodyHtmlStr
      .replace(/【/g, `<button class="chrome_ext_h2q_btn" style="${btnStyleAttr}" onclick="${onclickCode}">`)
      .replace(/】/g, `</button>`);

    // 描画
    document.body.innerHTML = ``;
    document.body.insertAdjacentHTML(`beforeend`, newBodyHtmlStr);
  };

  // アクティブなタブ上で toQuiz() を実行する
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toQuiz,
  });
});