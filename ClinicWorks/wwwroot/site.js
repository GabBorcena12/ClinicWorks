window.clinicWorksCardVisibility = (() => {
    let componentReference;
    let resizeTimer;
    let listening = false;

    const getColumnCount = gridId => {
        const grid = document.getElementById(gridId);
        if (!grid) return 1;

        const columns = window.getComputedStyle(grid).gridTemplateColumns;
        return columns && columns !== "none"
            ? columns.split(" ").filter(Boolean).length
            : 1;
    };

    const getDefaultRows = () => {
        if (window.matchMedia("(max-width: 600px)").matches) return 3;
        if (window.matchMedia("(max-width: 1050px)").matches) return 2;
        return 1;
    };

    const updateVisibleCounts = () => {
        if (!componentReference) return;

        const rows = getDefaultRows();
        const galleryVisibleCount = window.matchMedia("(max-width: 600px)").matches
            ? getColumnCount("gallery-cards") * rows
            : 4;
        componentReference.invokeMethodAsync(
            "UpdateVisibleCounts",
            getColumnCount("why-cards") * rows,
            getColumnCount("service-cards") * rows,
            getColumnCount("testimonial-cards") * rows,
            galleryVisibleCount);
    };

    const handleResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(updateVisibleCounts, 180);
    };

    return {
        initialize(reference) {
            componentReference = reference;
            updateVisibleCounts();

            if (!listening) {
                window.addEventListener("resize", handleResize);
                listening = true;
            }
        },
        dispose() {
            componentReference = undefined;
            window.clearTimeout(resizeTimer);

            if (listening) {
                window.removeEventListener("resize", handleResize);
                listening = false;
            }
        }
    };
})();
