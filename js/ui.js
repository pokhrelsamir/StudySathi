/* =========================================================
   StudySathi — UI Controller
========================================================= */

const UI = {

    /* -----------------------------------------------------
       Select Element
    ----------------------------------------------------- */

    select(selector) {
        return document.querySelector(selector);
    },


    /* -----------------------------------------------------
       Select Multiple Elements
    ----------------------------------------------------- */

    selectAll(selector) {
        return document.querySelectorAll(selector);
    },


    /* -----------------------------------------------------
       Show Element
    ----------------------------------------------------- */

    show(element) {

        if (!element) return;

        element.classList.remove("hidden");

        element.style.display = "";

    },


    /* -----------------------------------------------------
       Hide Element
    ----------------------------------------------------- */

    hide(element) {

        if (!element) return;

        element.classList.add("hidden");

        element.style.display = "none";

    },


    /* -----------------------------------------------------
       Toggle Element
    ----------------------------------------------------- */

    toggle(element) {

        if (!element) return;

        element.classList.toggle("hidden");

    },


    /* -----------------------------------------------------
       Set Text
    ----------------------------------------------------- */

    setText(element, text) {

        if (!element) return;

        element.textContent = text;

    },


    /* -----------------------------------------------------
       Set HTML
    ----------------------------------------------------- */

    setHTML(element, html) {

        if (!element) return;

        element.innerHTML = html;

    },


    /* -----------------------------------------------------
       Add Class
    ----------------------------------------------------- */

    addClass(element, className) {

        if (!element) return;

        element.classList.add(className);

    },


    /* -----------------------------------------------------
       Remove Class
    ----------------------------------------------------- */

    removeClass(element, className) {

        if (!element) return;

        element.classList.remove(className);

    },


    /* -----------------------------------------------------
       Toggle Class
    ----------------------------------------------------- */

    toggleClass(element, className) {

        if (!element) return;

        element.classList.toggle(className);

    },


    /* -----------------------------------------------------
       Active Navigation
    ----------------------------------------------------- */

    setActiveNavigation(target) {

        const navItems =
            document.querySelectorAll(
                ".nav-item"
            );

        navItems.forEach(item => {

            item.classList.remove("active");

        });

        const activeItem =
            document.querySelector(
                `.nav-item[data-section="${target}"]`
            );

        if (activeItem) {

            activeItem.classList.add("active");

        }

    },


    /* -----------------------------------------------------
       Show Section
    ----------------------------------------------------- */

    showSection(sectionId) {

        const sections =
            document.querySelectorAll(
                ".page-section"
            );

        sections.forEach(section => {

            section.classList.remove("active");

            section.style.display = "none";

        });


        const target =
            document.getElementById(sectionId);

        if (!target) {

            console.warn(
                `StudySathi: Section "${sectionId}" not found.`
            );

            return;

        }


        target.style.display = "";

        target.classList.add("active");

        this.setActiveNavigation(sectionId);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    },


    /* -----------------------------------------------------
       Toast Notification
    ----------------------------------------------------- */

    toast(
        message,
        type = "info",
        duration = 3000
    ) {

        let container =
            document.querySelector(
                ".toast-container"
            );


        if (!container) {

            container =
                document.createElement("div");

            container.className =
                "toast-container";

            document.body.appendChild(
                container
            );

        }


        const toast =
            document.createElement("div");

        toast.className =
            `toast toast-${type}`;


        const icons = {

            success: "✓",

            error: "✕",

            warning: "⚠",

            info: "ⓘ"

        };


        toast.innerHTML = `
            <span class="toast-icon">
                ${icons[type] || icons.info}
            </span>

            <span class="toast-message">
                ${message}
            </span>

            <button
                class="toast-close"
                type="button"
                aria-label="Close notification"
            >
                ×
            </button>
        `;


        container.appendChild(toast);


        requestAnimationFrame(() => {

            toast.classList.add("show");

        });


        const closeButton =
            toast.querySelector(
                ".toast-close"
            );


        const removeToast = () => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 250);

        };


        closeButton.addEventListener(
            "click",
            removeToast
        );


        setTimeout(
            removeToast,
            duration
        );

    },


    /* -----------------------------------------------------
       Loading State
    ----------------------------------------------------- */

    setLoading(
        element,
        loading = true
    ) {

        if (!element) return;


        if (loading) {

            element.classList.add(
                "loading"
            );

            element.setAttribute(
                "aria-busy",
                "true"
            );

        } else {

            element.classList.remove(
                "loading"
            );

            element.setAttribute(
                "aria-busy",
                "false"
            );

        }

    },


    /* -----------------------------------------------------
       Modal
    ----------------------------------------------------- */

    openModal(modal) {

        if (!modal) return;

        modal.classList.add("active");

        document.body.classList.add(
            "modal-open"
        );

    },


    closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("active");

        document.body.classList.remove(
            "modal-open"
        );

    },


    closeAllModals() {

        const modals =
            document.querySelectorAll(
                ".modal-overlay"
            );

        modals.forEach(modal => {

            modal.classList.remove(
                "active"
            );

        });

        document.body.classList.remove(
            "modal-open"
        );

    },


    /* -----------------------------------------------------
       Update Current Date
    ----------------------------------------------------- */

    updateDate() {

        const dateElement =
            document.querySelector(
                "[data-current-date]"
            );

        if (!dateElement) return;


        const now = new Date();


        const formatted =
            now.toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }
            );


        dateElement.textContent =
            formatted;

    },


    /* -----------------------------------------------------
       Update Greeting
    ----------------------------------------------------- */

    updateGreeting() {

        const greetingElement =
            document.querySelector(
                "[data-greeting]"
            );

        if (!greetingElement) return;


        const hour =
            new Date().getHours();


        let greeting;


        if (hour < 12) {

            greeting = "Good Morning";

        } else if (hour < 18) {

            greeting = "Good Afternoon";

        } else {

            greeting = "Good Evening";

        }


        greetingElement.textContent =
            greeting;

    },


    /* -----------------------------------------------------
       Dark Mode
    ----------------------------------------------------- */

    setTheme(theme) {

        const root =
            document.documentElement;


        if (theme === "dark") {

            root.setAttribute(
                "data-theme",
                "dark"
            );

        } else {

            root.removeAttribute(
                "data-theme"
            );

        }


        const themeIcon =
            document.querySelector(
                "[data-theme-icon]"
            );


        if (themeIcon) {

            themeIcon.textContent =
                theme === "dark"
                    ? "☀️"
                    : "🌙";

        }

    },


    /* -----------------------------------------------------
       Toggle Theme
    ----------------------------------------------------- */

    toggleTheme() {

        const currentTheme =
            document.documentElement
                .getAttribute(
                    "data-theme"
                );


        const newTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";


        this.setTheme(
            newTheme
        );


        if (
            typeof StorageManager !==
            "undefined"
        ) {

            const settings =
                StorageManager.get(
                    "settings",
                    {}
                );


            settings.darkMode =
                newTheme === "dark";


            StorageManager.save(
                "settings",
                settings
            );

        }

    },


    /* -----------------------------------------------------
       Initialize Theme
    ----------------------------------------------------- */

    initializeTheme() {

        if (
            typeof StorageManager ===
            "undefined"
        ) return;


        const settings =
            StorageManager.get(
                "settings",
                {}
            );


        this.setTheme(
            settings.darkMode
                ? "dark"
                : "light"
        );

    },


    /* -----------------------------------------------------
       Escape HTML
    ----------------------------------------------------- */

    escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            String(value);


        return div.innerHTML;

    }

};


/* =========================================================
   UI Initialization
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        UI.updateDate();

        UI.updateGreeting();

        UI.initializeTheme();

    }
);