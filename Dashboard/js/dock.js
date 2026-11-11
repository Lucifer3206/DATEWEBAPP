// ==============================
// DOCK MAGNIFICATION EFFECT
// ==============================

const dock = document.querySelector(".dashboard-dock");
const dockItems = document.querySelectorAll(".dock-item");

if (dock && dockItems.length > 0) {

    dock.addEventListener("pointermove", (event) => {

        // Magnification only for mouse and trackpad
        if (event.pointerType !== "mouse") return;

        dockItems.forEach((item) => {

            const rect = item.getBoundingClientRect();

            const itemCenter = rect.left + rect.width / 2;
            const distance = Math.abs(event.clientX - itemCenter);

            // Calculate magnification
            const maxDistance = 150;
            const influence = Math.max(0, 1 - distance / maxDistance);

            const scale = 1 + influence * 0.45;
            const moveUp = influence * 12;

            item.style.transform =
                `translateY(-${moveUp}px) scale(${scale})`;

            item.style.zIndex = Math.round(scale * 100);
        });

    });


    // Reset when pointer leaves Dock
    dock.addEventListener("pointerleave", () => {

        dockItems.forEach((item) => {
            item.style.transform = "";
            item.style.zIndex = "";
        });

    });

}