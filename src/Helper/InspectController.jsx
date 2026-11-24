import { useEffect } from "react";

function InspectController() {

    useEffect(() => {

        const handleContextMenu = (e) => e.preventDefault();

        const handleKeyDown = (e) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && ["I", "J", "C", "E"].includes(e.key.toUpperCase())) ||
                (e.ctrlKey && e.key.toUpperCase() === "U")
            ) {
                e.preventDefault();

                return
            }
        };

        const applyRules = () => {
            const path = window.location.pathname;

            if (path === "/admin/vendor-stats" || path === '/admin/merchant-details' || path == '/user/vendor/details' || path=='/user/dc/list') {
                // ✅ Is page par ENABLE
                document.removeEventListener("contextmenu", handleContextMenu);
                document.removeEventListener("keydown", handleKeyDown);

            } else {
                // ❌ Baaki sab par DISABLE
                document.addEventListener("contextmenu", handleContextMenu);
                document.addEventListener("keydown", handleKeyDown);

            }
        };

        // First run
        applyRules();

        // Back / forward detect
        window.addEventListener("popstate", applyRules);

        // React Router navigation detect
        const originalPush = history.pushState;
        history.pushState = function () {
            originalPush.apply(this, arguments);
            applyRules();
        };

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("popstate", applyRules);
            history.pushState = originalPush;
        };
    }, []);

    return null;
}

export default InspectController;
