const API_URL = "https://www.zooe.com.tw:8080/api/trades/";
const BTC_TWD = "btctwd";
const USDT_TWD = "usdttwd";
const USD = "USD";

let fromCurrency = "TWD";
let toCurrency = "BTC";

const fromAmountInput = document.getElementById("from-amount");
const fromCurrencySelect = document.getElementById("from-currency");
const swapButton = document.getElementById("swap-button");
const toAmountInput = document.getElementById("to-amount");
const toCurrencySelect = document.getElementById("to-currency");
const convertedAmount = document.getElementById("converted-amount");
const exchangeRate = document.getElementById("exchange-rate");
const currentTime = document.getElementById("current-time");
const timeDiv = document.getElementById("time");
let isFetching = false; // 定义 isFetching 变量

function getExchangeRate(from, to) {
  let market;
  if (from === "BTC" && to === "USDT") {
    market = "btcusdt";
  } else if (from === "BTC" && to === "TWD") {
    market = "btctwd";
  } else if (from === "USDT" && to === "BTC") {
    market = "btcusdt";
  } else if (from === "USDT" && to === "TWD") {
    market = "usdttwd";
  } else if (from === "TWD" && to === "BTC") {
    market = "btctwd";
  } else if (from === "TWD" && to === "USDT") {
    market = "usdttwd";
  } else {
    market = `${from.toLowerCase()}${to.toLowerCase()}`;
  }

  if (isFetching) {
    // 如果正在请求，则不再发送请求
    return;
  }

  isFetching = true;
  fetch(`${API_URL}${market}`)
    .then((response) => response.json())
    .then((data) => {
      const exchangeRate = Number(data.price);
      if (fromCurrency === "BTC" && toCurrency === "USDT") {
        const usdAmount = fromAmountInput.value * exchangeRate;
        toAmountInput.value = usdAmount
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        updateResult(exchangeRate);
      }
      isFetching = false; // 请求完成，将 isFetching 标记为 false
    })
    .catch((error) => {
      console.error(error);
      toAmountInput.classList.add("error");
      toAmountInput.value = "發生錯誤，請稍後再試。";
      isFetching = false; // 请求完成，将 isFetching 标记为 false
    });
}

function updateResult(exchangeRate) {
  toAmountInput.classList.remove("error");
  if (fromCurrency === "TWD") {
    const twdAmount = fromAmountInput.value;
    if (toCurrency === "BTC") {
      const markupPercent = 5; // 5% markup for BTC
      const thresholdValue = 300000; // 閾值設定為 300000
      const thresholdDiscount = -0.5; // 閾值折扣設定為 -0.5%
      let effectiveMarkup = markupPercent;

      // 檢查是否達到閾值，並如果適用，應用閾值折扣
      if (twdAmount >= thresholdValue) {
        effectiveMarkup += thresholdDiscount;
      }

      const btcPrice = exchangeRate * (1 + effectiveMarkup / 100); // 加上 markup
      const btcAmount = twdAmount / btcPrice;
      toAmountInput.value = btcAmount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      });
      convertedAmount.textContent = `${fromAmountInput.value} ${fromCurrency} = ${toAmountInput.value} ${toCurrency}`;
    } else if (toCurrency === "USDT") {
      const markupPercent = 3; // 3% markup for USDT
      const thresholdValue = 300000; // 閾值設定為 300000
      const thresholdDiscount = -0.5; // 閾值折扣設定為 -0.5%
      let effectiveMarkup = markupPercent;

      // 檢查是否達到閾值，並如果適用，應用閾值折扣
      if (twdAmount >= thresholdValue) {
        effectiveMarkup += thresholdDiscount;
      }

      const usdtPrice = exchangeRate * (1 + effectiveMarkup / 100); // 加上 markup
      const usdtAmount = twdAmount / usdtPrice;
      toAmountInput.value = usdtAmount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      });
      convertedAmount.textContent = `${fromAmountInput.value} ${fromCurrency} = ${toAmountInput.value} ${toCurrency}`;
    } else {
      toAmountInput.value = "";
    }
  } else if (fromCurrency === "BTC") {
    const btcAmount = fromAmountInput.value;
    if (toCurrency === "TWD") {
      const twdPrice = exchangeRate;
      const twdAmount = btcAmount * twdPrice;
      toAmountInput.value = twdAmount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
      convertedAmount.textContent = `${fromAmountInput.value} ${fromCurrency} = ${toAmountInput.value} ${toCurrency}`;
    } else if (toCurrency === "USDT") {
      const usdPrice = exchangeRate;
      const usdAmount = btcAmount * usdPrice;
      toAmountInput.value = usdAmount
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      convertedAmount.textContent = `${fromAmountInput.value} ${fromCurrency} = ${toAmountInput.value} ${toCurrency}`;
    } else {
      toAmountInput.value = "";
    }
  } else if (fromCurrency === "USDT") {
    const usdtAmount = fromAmountInput.value;
    if (toCurrency === "TWD") {
      const twdPrice = exchangeRate;
      const twdAmount = usdtAmount * twdPrice;
      toAmountInput.value = twdAmount
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      convertedAmount.textContent = `${fromAmountInput.value} ${fromCurrency} = ${toAmountInput.value} ${toCurrency}`;
    } else if (toCurrency === "BTC") {
      const btcPrice = exchangeRate;
      const btcAmount = usdtAmount / btcPrice;
      toAmountInput.value = btcAmount
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      convertedAmount.textContent = `${fromAmountInput.value} ${fromCurrency} = ${toAmountInput.value} ${toCurrency}`;
    } else {
      toAmountInput.value = "";
    }
  } else {
    toAmountInput.value = "";
  }
}

function updateTime() {
  const now = new Date();
  const year = now.getFullYear().toString().padStart(4, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  currentTime.textContent = timeString;
}

function currencySelectHandler() {
  fromCurrency = fromCurrencySelect.value;
  toCurrency = toCurrencySelect.value;
  if (toCurrency === "USDT") {
    market = "btcusdt";
  } else {
    market = `${fromCurrency.toLowerCase()}${toCurrency.toLowerCase()}`;
  }
  getExchangeRate(fromCurrency, toCurrency);
  // disable and hide the corresponding option
  toCurrencySelect.querySelector(
    `option[value="${fromCurrency}"]`
  ).disabled = true;
  toCurrencySelect.querySelector(
    `option[value="${fromCurrency}"]`
  ).hidden = true;
  fromCurrencySelect.querySelector(
    `option[value="${toCurrency}"]`
  ).disabled = true;
  fromCurrencySelect.querySelector(
    `option[value="${toCurrency}"]`
  ).hidden = true;
  // enable and show all other options
  [...fromCurrencySelect.options].forEach((option) => {
    if (option.value !== toCurrency) {
      option.disabled = false;
      option.hidden = false;
    }
  });
  [...toCurrencySelect.options].forEach((option) => {
    if (option.value !== fromCurrency) {
      option.disabled = false;
      option.hidden = false;
    }
  });
}

function init() {
  updateTime();
  setInterval(updateTime, 1000);

  fromCurrencySelect.addEventListener("change", currencySelectHandler);

  toCurrencySelect.addEventListener("change", currencySelectHandler);

  // 綁定事件
  swapButton.addEventListener("click", () => {
    // 取得 from-currency 與 to-currency 的值
    const fromCurrencyValue = fromCurrencySelect.value;
    const toCurrencyValue = toCurrencySelect.value;

    // 將 from-currency 與 to-currency 的值對調
    fromCurrencySelect.value = toCurrencyValue;
    toCurrencySelect.value = fromCurrencyValue;
    currencySelectHandler();
  });

  fromAmountInput.addEventListener("input", () => {
    getExchangeRate(fromCurrency, toCurrency);
  });

  fromCurrencySelect.value = fromCurrency;
  toCurrencySelect.value = toCurrency;
  // disable and hide the corresponding option
  toCurrencySelect.querySelector(
    `option[value="${fromCurrency}"]`
  ).disabled = true;
  toCurrencySelect.querySelector(
    `option[value="${fromCurrency}"]`
  ).hidden = true;
  // disable and hide the corresponding option
  fromCurrencySelect.querySelector(
    `option[value="${toCurrency}"]`
  ).disabled = true;
  fromCurrencySelect.querySelector(
    `option[value="${toCurrency}"]`
  ).hidden = true;
  // enable and show all other options
  [...fromCurrencySelect.options].forEach((option) => {
    if (option.value !== toCurrency) {
      option.disabled = false;
      option.hidden = false;
    }
  });
  // enable and show all other options
  [...toCurrencySelect.options].forEach((option) => {
    if (option.value !== fromCurrency) {
      option.disabled = false;
      option.hidden = false;
    }
  });
  getExchangeRate(fromCurrency, toCurrency);
}

init();
