// 設定桌號數量
const tables = 5;
const container = document.getElementById('qrcode-container');
const welcomeDiv = document.getElementById('welcome');

// 讀取網址參數
function getTableFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('table');
}

// 顯示桌號訊息
const currentTable = getTableFromURL();
if (currentTable) {
    welcomeDiv.innerHTML = `<h2>歡迎來到桌號 ${currentTable}</h2>`;
} else {
    welcomeDiv.innerHTML = `<h2>請掃描 QR Code 進入桌號</h2>`;
}

// 產生每桌 QR Code，連結會帶桌號參數
for (let i = 1; i <= tables; i++) {
    const div = document.createElement('div');
    div.classList.add('qrcode-item');

    const title = document.createElement('h2');
    title.textContent = `桌號 ${i}`;

    const canvas = document.createElement('canvas'); // QRCode.js 生成在 canvas
    div.appendChild(title);
    div.appendChild(canvas);
    container.appendChild(div);

    // 每桌 QR Code 連結到帶桌號參數的首頁
    const url = `https://drink-order-demo.github.io/drink001/?table=${i}`;
    QRCode.toCanvas(canvas, url, { width: 150 }, function (error) {
        if (error) console.error(error);
    });
}
