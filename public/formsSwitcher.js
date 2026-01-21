 // ===== フォーム一覧（ここを増やすだけ） =====
    // title は右上の表示用。src は埋め込みURL。
    const FORMS = [
      {
        title: "ノート1-1",
        src: "https://docs.google.com/forms/d/e/1FAIpQLSd8glmPOr-wAVesjlUrIQJ4_9QLOpChcwedxyxVCIj12L_C6g/viewform?embedded=true"
      },
       {
        title: "ノート1-2",
        src: "https://docs.google.com/forms/d/e/1FAIpQLSea4FYfILCcBf5-WSTOsYLdEk1Yviu_lkhB2CU0PiNSccK6Hw/viewform?embedded=true"
      },
       {
        title: "ノート1-3",
        src: "https://docs.google.com/forms/d/e/1FAIpQLSeVc7IctWs4vItjbwB0X6_hT-WadVXIK0MVob4mPBUiRzmggQ/viewform?embedded=true"
      },
       {
        title: "ノート1-4",
        src: "https://docs.google.com/forms/d/e/1FAIpQLSd6GABRM2zkDgAINKVxSm3_srTT2pRZ-RrU38qVH4smaAq_8g/viewform?embedded=true"
      },
       {
        title: "ノート1-5",
        src: "https://docs.google.com/forms/d/e/1FAIpQLSe70ZHK6ZTHfAELLvOQs3qrZnVyxEKS5Swinitxt2dv8H-vGg/viewform?embedded=true"
      },
      {
        title: "ノート1-6",
        src: "https://docs.google.com/forms/d/e/1FAIpQLScy0KpG9r7bki1MEYBXjw8tsDwkAUydbDp_YtnAff-VyzAkHw/viewform?embedded=true"
      },
      {
        title: "ノート1-7",
        src: "https://docs.google.com/forms/d/e/1FAIpQLScBxJKb_7AtruWu-n0MUkIfyAOMNERePfSEloxpM2LBPc45Mg/viewform?embedded=true"
      },
      {
        title: "ノート1-8",
        src: "https://docs.google.com/forms/d/e/1FAIpQLSey1EZgYskVfvYcQz50CSXrbPv95NCaJd5uGNbm2KbFhQlBiQ/viewform?embedded=true"
      },
      {
        title: "ノート1-9",
        src: "https://docs.google.com/forms/d/e/1FAIpQLSerJA4k96F_7b2hW7yr_TqFUntmnDJofP2056UFCn1zKWCtAQ/viewform?embedded=true"
      },
      {
        title: "ノート1-10",
        src: "https://docs.google.com/forms/d/e/1FAIpQLScU3Bmc8ebHds6xCORHGEtfNiZjxYWVmQdLTN-1ONXcRIFi2w/viewform?embedded=true"
      },
      {
        title: "テスト1",
        src: "https://docs.google.com/forms/d/e/1FAIpQLSd8glmPOr-wAVesjlUrIQJ4_9QLOpChcwedxyxVCIj12L_C6g/viewform?embedded=true"
      },
      {
        title: "テスト2",
        src: "https://docs.google.com/forms/d/e/1FAIpQLScPviLHnzlidpIB5dj0AYPEqh4wF_-l85AT-CzAakFiqzq0ew/viewform?embedded=true"
      },
      {
        title: "テスト3",
        src: "https://docs.google.com/forms/d/e/1FAIpQLScNkTmBRtdMqrqZ8NLevEKTiOJ0IwX2xhP1bNillMkn_Uau6w/viewform?embedded=true"
      },
      
      
    ];

    const frame = document.getElementById("formFrame");
    const overlay = document.getElementById("overlay");
    const switcher = document.getElementById("switcher");
    const label = document.getElementById("formLabel");

    let currentIndex = 0;
    let switching = false;

    // ボタン生成
    FORMS.forEach((f, i) => {
      const btn = document.createElement("button");
      btn.className = "switch-btn" + (i === 0 ? " active" : "");
      btn.type = "button";
      btn.textContent = (i + 1);
      btn.title = f.title;
      btn.addEventListener("click", () => switchTo(i));
      switcher.appendChild(btn);
    });

    function setActiveButton(index){
      [...switcher.children].forEach((b, i) => {
        b.classList.toggle("active", i === index);
      });
    }

    // いい感じに切り替え（フェードアウト→src差し替え→loadでフェードイン）
    function switchTo(index){
      if (switching) return;
      if (index === currentIndex) return;

      switching = true;
      overlay.classList.add("show");

      // 旧フォームをフェードアウト
      frame.classList.add("fade-out");

      // 少し待ってからsrc変更（アニメが見えるように）
      setTimeout(() => {
        currentIndex = index;
        label.textContent = FORMS[index].title;
        setActiveButton(index);

        // load完了でフェードイン
        const onLoad = () => {
          frame.removeEventListener("load", onLoad);

          // フェードイン
          frame.classList.remove("fade-out");
          overlay.classList.remove("show");
          switching = false;

          // 上にスクロールして見やすく
          window.scrollTo({ top: 0, behavior: "smooth" });
        };

        frame.addEventListener("load", onLoad, { once: true });
        frame.src = FORMS[index].src;

        // もしロードが遅い/発火しない環境の保険（数秒で解除）
        setTimeout(() => {
          if (!switching) return;
          frame.classList.remove("fade-out");
          overlay.classList.remove("show");
          switching = false;
        }, 7000);

      }, 180);
    }

    // キーボード（PC操作用）：↑↓で切り替え
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        const next = (currentIndex + 1) % FORMS.length;
        switchTo(next);
      } else if (e.key === "ArrowUp") {
        const prev = (currentIndex - 1 + FORMS.length) % FORMS.length;
        switchTo(prev);
      }
    });