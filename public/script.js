/* 今日の一言 
const quotes = [
  "1問でもやったら勝ち",
  "今日は昨日よりえらい",
  "完璧じゃなくてOK",
  "歯科技工士は手が覚える",
  "サボっても戻ってくればOK"
];

document.getElementById("quote").textContent =
  quotes[Math.floor(Math.random() * quotes.length)];
*/

/* ページ遷移 */
function go(page) {
  // 対応ページ一覧
  const routes = {
    notes: "noteHome.html",
    quiz: "quiz.html",
    memo: "memo.html"
  };

  if (!routes[page]) {
    alert("ページが見つかりません");
    return;
  }

  // 画面遷移
  window.location.href = routes[page];
}

/* ランダム問題 */
function randomQuiz() {
  const q = [
    "歯科技工士の国家資格は何年ごとに更新？",
    "全部床義歯と部分床義歯の違いは？",
    "石膏模型の役割は？"
  ];
  alert("問題：\n" + q[Math.floor(Math.random() * q.length)]);
}

/* 勉強時間カウント（仮） */
let minutes = 0;
setInterval(() => {
  minutes++;
  document.getElementById("timer").textContent =
    `今日の勉強時間：${minutes} 分`;
}, 60000);
