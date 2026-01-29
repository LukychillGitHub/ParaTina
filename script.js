document.addEventListener("DOMContentLoaded", () => {
  const noBtn = document.getElementById("NoBtn");
  const siBtn = document.getElementById("SiBtn");
  const btnZone = document.querySelector(".buttons-container");

  let scale = 1;

  // NO flotante
  let noFloating = false;
  let noW = 0, noH = 0;

  // SI flotante
  let yesFloating = false;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function vp() {
    const vv = window.visualViewport;
    return vv ? { w: vv.width, h: vv.height } : { w: window.innerWidth, h: window.innerHeight };
  }

  function makeFloatingBtn(btn) {
    const r = btn.getBoundingClientRect();

    // placeholder para que el layout no salte
    const ph = document.createElement("div");
    ph.style.width = `${r.width}px`;
    ph.style.height = `${r.height}px`;
    btn.parentNode.insertBefore(ph, btn);

    // mover al body (ya no lo limita la card)
    document.body.appendChild(btn);

    // congelar tamaño real (evita width:100% del viewport)
    btn.style.width = `${r.width}px`;
    btn.style.height = `${r.height}px`;

    // fijar donde estaba
    btn.style.left = `${r.left}px`;
    btn.style.top = `${r.top}px`;
    btn.style.display = "block";
    btn.style.visibility = "visible";
    btn.style.opacity = "1";

    return { w: r.width, h: r.height };
  }

  function makeNoFloatingOnce() {
    if (noFloating) return;
    const s = makeFloatingBtn(noBtn);
    noW = s.w; noH = s.h;
    noBtn.classList.add("floating-no");
    noBtn.style.position = "fixed";
    noBtn.style.zIndex = "2147483647";
    noFloating = true;
  }

  function makeYesFloatingOnce() {
    if (yesFloating) return;
    makeFloatingBtn(siBtn);
    siBtn.classList.add("floating-yes");
    siBtn.style.position = "fixed";
    siBtn.style.zIndex = "2147483646";
    yesFloating = true;

    // Para poder combinar translate(-50%) con scale
    placeYesInButtonsZone();
  }

  // ✅ Centrar SÍ en el área de botones (NO en la pantalla)
  function placeYesInButtonsZone() {
    const zoneRect = btnZone.getBoundingClientRect();

    const targetX = zoneRect.left + zoneRect.width / 2;
    const targetY = zoneRect.top + zoneRect.height / 2;

    siBtn.style.left = `${targetX}px`;
    siBtn.style.top = `${targetY}px`;

    // Importante: translate + scale juntos
    siBtn.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  // ✅ mover NO por pantalla evitando superponerse con el SÍ
  function moveNoSafeAvoidingYes() {
    const margin = 12;
    const safeGap = 18;
    const { w, h } = vp();

    const yesRect = siBtn.getBoundingClientRect();
    const forbidden = {
      left: yesRect.left - safeGap,
      top: yesRect.top - safeGap,
      right: yesRect.right + safeGap,
      bottom: yesRect.bottom + safeGap
    };

    const maxX = w - noW - margin;
    const maxY = h - noH - margin;

    for (let i = 0; i < 80; i++) {
      const x = clamp(margin + Math.random() * Math.max(0, maxX - margin), margin, Math.max(margin, maxX));
      const y = clamp(margin + Math.random() * Math.max(0, maxY - margin), margin, Math.max(margin, maxY));

      const bx1 = x, by1 = y;
      const bx2 = x + noW, by2 = y + noH;

      const intersectaSi =
        bx2 > forbidden.left &&
        bx1 < forbidden.right &&
        by2 > forbidden.top &&
        by1 < forbidden.bottom;

      if (!intersectaSi) {
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
        return;
      }
    }

    // fallback
    const x = clamp(margin + Math.random() * Math.max(0, maxX - margin), margin, Math.max(margin, maxX));
    const y = clamp(margin + Math.random() * Math.max(0, maxY - margin), margin, Math.max(margin, maxY));
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
  }

  function growYes() {
    if (scale >= 1.15) makeYesFloatingOnce();

    scale += 0.14;

    if (yesFloating) placeYesInButtonsZone();
    else siBtn.style.transform = `scale(${scale})`;
  }

  // NO: un solo evento para evitar doble disparo en mobile
  noBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();

    makeNoFloatingOnce();
    growYes();

    // Si ya flotó el SÍ, aseguramos ubicación en zona botones
    if (yesFloating) placeYesInButtonsZone();

    // Mover NO evitando el SÍ (así no hay toque accidental al SÍ)
    moveNoSafeAvoidingYes();
  }, { passive: false });

  // SÍ: clic normal
  siBtn.addEventListener("click", () => {
    window.location.href = "sabia.html";
  });

  // En resize/rotación: mantener SÍ en zona botones y NO dentro del viewport
  function onResize() {
    if (yesFloating) placeYesInButtonsZone();

    if (noFloating) {
      const margin = 12;
      const { w, h } = vp();
      const maxX = w - noW - margin;
      const maxY = h - noH - margin;

      const curX = parseFloat(noBtn.style.left) || margin;
      const curY = parseFloat(noBtn.style.top) || margin;

      noBtn.style.left = `${clamp(curX, margin, Math.max(margin, maxX))}px`;
      noBtn.style.top  = `${clamp(curY, margin, Math.max(margin, maxY))}px`;
    }
  }

  window.addEventListener("resize", onResize);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", onResize);
});
