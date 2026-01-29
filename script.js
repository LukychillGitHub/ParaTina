document.addEventListener("DOMContentLoaded", () => {
  const noBtn = document.getElementById("NoBtn");
  const siBtn = document.getElementById("SiBtn");
  const container = document.querySelector(".buttons-container");
  const fxLayer = document.getElementById("fxLayer");

  function rand(min, max){ return Math.random() * (max - min) + min; }

  function moverBotonDentroDelContainer() {
    const c = container.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();

    const maxX = c.width - b.width;
    const maxY = c.height - b.height;

    const x = rand(0, Math.max(0, maxX));
    const y = rand(0, Math.max(0, maxY));

    noBtn.style.position = "absolute";
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.blur();
  }

  // Desktop
  noBtn.addEventListener("mouseenter", moverBotonDentroDelContainer);

  // Mobile
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moverBotonDentroDelContainer();
  }, { passive: false });

  noBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    moverBotonDentroDelContainer();
  });

  function miniLluvia() {
    const icons = ["💛","✨","🌙","🍿","🏡"];
    const count = 16;

    for(let i=0;i<count;i++){
      const el = document.createElement("div");
      el.className = "fx";
      el.textContent = icons[Math.floor(Math.random()*icons.length)];
      el.style.left = `${rand(10, window.innerWidth - 30)}px`;
      el.style.top = `${rand(10, window.innerHeight * 0.35)}px`;
      el.style.fontSize = `${rand(18, 28)}px`;
      el.style.animationDuration = `${rand(700, 1000)}ms`;
      fxLayer.appendChild(el);
      setTimeout(() => el.remove(), 1100);
    }
  }

  siBtn.addEventListener("click", () => {
    miniLluvia();
    setTimeout(() => {
      window.location.href = "sabia.html";
    }, 650);
  });
});
