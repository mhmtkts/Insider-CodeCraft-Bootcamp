document.addEventListener("DOMContentLoaded", function () {
  const calculateBtn = document.getElementById("calculate");
  const loading = document.getElementById("loading");
  const results = document.getElementById("results");
  const initialMessage = document.getElementById("initial-message");
  const startingNumberEl = document.getElementById("startingNumber");
  const longestChainEl = document.getElementById("longestChain");
  const userInput = document.getElementById("userInput");
  const calculateCustomBtn = document.getElementById("calculateCustom");
  const customResult = document.getElementById("customResult");

  calculateBtn.addEventListener("click", function () {
    initialMessage.classList.add("hidden");

    loading.classList.remove("hidden");
    results.classList.add("hidden");

    calculateBtn.disabled = true;
    calculateBtn.textContent = "Hesaplanıyor...";

    // UI bloklanmaması için işlemi setTimeout içinde yapıyoruz
    setTimeout(() => {
      const result = calculateLongestCollatzChain();

      startingNumberEl.textContent = result.startingNumber;
      longestChainEl.textContent = result.longestChain;

      loading.classList.add("hidden");
      results.classList.remove("hidden");

      calculateBtn.disabled = false;
      calculateBtn.textContent = "Tekrar Hesapla";
    }, 100);
  });

  // Özel hesaplama için
  calculateCustomBtn.addEventListener("click", function () {
    const num = parseInt(userInput.value);
    if (isNaN(num) || num <= 0) {
      customResult.innerHTML =
        '<p class="error">Lütfen pozitif bir tamsayı girin.</p>';
      return;
    }

    const sequence = calculateCollatzSequence(num);
    customResult.innerHTML = `
            <p>Başlangıç sayısı: <strong>${num}</strong></p>
            <p>Zincir uzunluğu: <strong>${sequence.length}</strong></p>
            <p>Zincir: <span class="sequence">${sequence.join(" → ")}</span></p>
        `;
  });

  function calculateLongestCollatzChain() {
    let longestChain = 0;
    let startingNumber = 0;
    const memo = new Map();
    memo.set(1, 1);

    for (let i = 2; i < 1000000; i++) {
      let n = i;
      let chainLength = 0;
      let sequence = [];

      while (n !== 1 && !memo.has(n)) {
        sequence.push(n);
        if (n % 2 === 0) {
          n = n / 2;
        } else {
          n = n * 3 + 1;
        }
      }

      chainLength = sequence.length + memo.get(n);
      memo.set(i, chainLength);

      if (chainLength > longestChain) {
        longestChain = chainLength;
        startingNumber = i;
      }
    }

    return {
      startingNumber,
      longestChain,
    };
  }

  function calculateCollatzSequence(n) {
    const sequence = [n];
    while (n !== 1) {
      if (n % 2 === 0) {
        n = n / 2;
      } else {
        n = n * 3 + 1;
      }
      sequence.push(n);
    }
    return sequence;
  }
});
