document.addEventListener("DOMContentLoaded", () => {
    const noBtn = document.getElementById("NoBtn");
    const siBtn = document.getElementById("SiBtn");

    function moverBoton() {
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

        noBtn.style.position = "absolute";
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;

        noBtn.blur(); // Elimina el "focus" si quedó seleccionado
    }

    // Para PC: mouse
    noBtn.addEventListener("mouseenter", moverBoton);

    // Para móvil: touch
    noBtn.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Evita que el click se registre
        moverBoton();
    });

    // Backup universal: pointerdown (para navegadores modernos)
    noBtn.addEventListener("pointerdown", (e) => {
        e.preventDefault(); // También cancela click/tap
        moverBoton();
    });

    // Botón "Sí"
    siBtn.addEventListener("click", () => {
        window.location.href = "sabia.html";
    });
});
