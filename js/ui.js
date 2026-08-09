/* =========================================================
   StudySathi — UI Controller
   Handles navigation, modals, theme, notifications and toast
========================================================= */

const UI = {

    /* -----------------------------------------------------
       Application State
    ----------------------------------------------------- */

    currentSection: "dashboard",

    /* -----------------------------------------------------
       Section Configuration
    ----------------------------------------------------- */

    sections: {

        dashboard: {
            title: "Dashboard",
            subtitle: "Welcome back! Let's make today productive."
        },

        tasks: {
            title: "My Tasks",
            subtitle: "Manage your study tasks and deadlines."
        },

        subjects: {
            title: "My Subjects",
            subtitle: "Organize and track your subjects."
        },

        timer: {
            title: "Study Timer",
            subtitle: "Focus on your work and take meaningful breaks."
        },

        notes: {
            title: "My Notes",
            subtitle: "Keep your important study information organized."
        },

        progress: {
            title: "Study Progress",
            subtitle: "Understand your study habits and progress."
        },

        goals: {
            title: "Study Goals",
            subtitle: "Set meaningful goals and track your progress."
        }

    },


    /* =====================================================
       INITIALIZATION
    ====================================================== */

    init() {

        this.setupNavigation();

        this.setupModals();

        this.setupTheme();

        this.setupSidebar();

        this.setupNotifications();

        this.setupQuickActions();

        this.updateCurrentDate();

        this.loadSavedTheme();

    },


    /* =====================================================
       NAVIGATION
    ====================================================== */

    setupNavigation() {

        const navItems =
            document.querySelectorAll(
                ".nav-item[data-section]"
            );

        navItems.forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const section =
                        item.dataset.section;

                    this.showSection(section);

                }
            );

        });

    },


    showSection(sectionName) {

        const section =
            document.querySelector(
                `[data-page="${sectionName}"]`
            );

        if (!section) {

            console.warn(
                `StudySathi: Section "${sectionName}" not found.`
            );

            return;

        }


        /* Hide all sections */

        const sections =
            document.querySelectorAll(
                ".page-section"
            );

        sections.forEach(page => {

            page.classList.remove("active");

        });


        /* Show selected section */

        section.classList.add("active");


        /* Update navigation */

        const navItems =
            document.querySelectorAll(
                ".nav-item[data-section]"
            );

        navItems.forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.section === sectionName
            );

        });


        /* Update page heading */

        const sectionInfo =
            this.sections[sectionName];

        if (sectionInfo) {

            const title =
                document.getElementById(
                    "pageTitle"
                );

            const subtitle =
                document.getElementById(
                    "pageSubtitle"
                );


            if (title) {

                title.textContent =
                    sectionInfo.title;

            }


            if (subtitle) {

                subtitle.textContent =
                    sectionInfo.subtitle;

            }

        }


        this.currentSection =
            sectionName;


        /* Close mobile sidebar */

        this.closeSidebar();

    },


    /* =====================================================
       SIDEBAR
    ====================================================== */

    setupSidebar() {

        const menuToggle =
            document.getElementById(
                "menuToggle"
            );

        const sidebar =
            document.getElementById(
                "sidebar"
            );


        if (!menuToggle || !sidebar) {
            return;
        }


        menuToggle.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );


        /* Close sidebar when clicking outside */

        document.addEventListener(
            "click",
            event => {

                if (
                    window.innerWidth <= 900 &&
                    sidebar.classList.contains("open") &&
                    !sidebar.contains(event.target) &&
                    !menuToggle.contains(event.target)
                ) {

                    this.closeSidebar();

                }

            }
        );

    },


    closeSidebar() {

        const sidebar =
            document.getElementById(
                "sidebar"
            );

        if (sidebar) {

            sidebar.classList.remove(
                "open"
            );

        }

    },


    /* =====================================================
       QUICK ACTIONS
    ====================================================== */

    setupQuickActions() {

        const actions =
            document.querySelectorAll(
                "[data-section]"
            );


        actions.forEach(action => {

            if (
                action.classList.contains(
                    "nav-item"
                )
            ) {
                return;
            }


            action.addEventListener(
                "click",
                () => {

                    const section =
                        action.dataset.section;

                    if (section) {

                        this.showSection(
                            section
                        );

                    }

                }
            );

        });

    },


    /* =====================================================
       MODALS
    ====================================================== */

    setupModals() {

        /* Open buttons */

        const modalButtons = {

            addTaskButton: "taskModal",

            addSubjectButton: "subjectModal",

            addNoteButton: "noteModal",

            addGoalButton: "goalModal"

        };


        Object.entries(
            modalButtons
        ).forEach(
            ([buttonId, modalId]) => {

                const button =
                    document.getElementById(
                        buttonId
                    );

                if (button) {

                    button.addEventListener(
                        "click",
                        () => {

                            this.openModal(
                                modalId
                            );

                        }
                    );

                }

            }
        );


        /* Close buttons */

        const closeButtons =
            document.querySelectorAll(
                "[data-close-modal]"
            );


        closeButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const modalId =
                        button.dataset.closeModal;

                    this.closeModal(
                        modalId
                    );

                }
            );

        });


        /* Close when clicking overlay */

        const overlays =
            document.querySelectorAll(
                ".modal-overlay"
            );


        overlays.forEach(overlay => {

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target === overlay
                    ) {

                        this.closeModal(
                            overlay.id
                        );

                    }

                }
            );

        });


        /* Close with Escape */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    this.closeAllModals();

                }

            }
        );

    },


    openModal(modalId) {

        const modal =
            document.getElementById(
                modalId
            );

        if (!modal) {
            return;
        }


        modal.classList.add(
            "active"
        );


        document.body.classList.add(
            "modal-open"
        );


        const firstInput =
            modal.querySelector(
                "input, textarea, select"
            );


        if (firstInput) {

            setTimeout(
                () => firstInput.focus(),
                100
            );

        }

    },


    closeModal(modalId) {

        const modal =
            document.getElementById(
                modalId
            );

        if (!modal) {
            return;
        }


        modal.classList.remove(
            "active"
        );


        const activeModals =
            document.querySelectorAll(
                ".modal-overlay.active"
            );


        if (
            activeModals.length === 0
        ) {

            document.body.classList.remove(
                "modal-open"
            );

        }

    },


    closeAllModals() {

        const modals =
            document.querySelectorAll(
                ".modal-overlay.active"
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


    /* =====================================================
       THEME
    ====================================================== */

    setupTheme() {

        const themeToggle =
            document.getElementById(
                "themeToggle"
            );


        if (!themeToggle) {
            return;
        }


        themeToggle.addEventListener(
            "click",
            () => {

                this.toggleTheme();

            }
        );

    },


    toggleTheme() {

        const isDark =
            document.body.classList.toggle(
                "dark-theme"
            );


        this.updateThemeIcon(
            isDark
        );


        StorageManager.save(
            "theme",
            isDark ? "dark" : "light"
        );

    },


    loadSavedTheme() {

        const savedTheme =
            StorageManager.get(
                "theme",
                "light"
            );


        const isDark =
            savedTheme === "dark";


        if (isDark) {

            document.body.classList.add(
                "dark-theme"
            );

        }


        this.updateThemeIcon(
            isDark
        );

    },


    updateThemeIcon(isDark) {

        const themeToggle =
            document.getElementById(
                "themeToggle"
            );


        if (!themeToggle) {
            return;
        }


        themeToggle.textContent =
            isDark ? "☀️" : "🌙";

    },


    /* =====================================================
       NOTIFICATIONS
    ====================================================== */

    setupNotifications() {

        const button =
            document.getElementById(
                "notificationButton"
            );

        const panel =
            document.getElementById(
                "notificationPanel"
            );


        if (!button || !panel) {
            return;
        }


        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                panel.classList.toggle(
                    "active"
                );

                this.renderNotifications();

            }
        );


        document.addEventListener(
            "click",
            event => {

                if (
                    !panel.contains(
                        event.target
                    ) &&
                    !button.contains(
                        event.target
                    )
                ) {

                    panel.classList.remove(
                        "active"
                    );

                }

            }
        );


        const clearButton =
            document.getElementById(
                "clearNotifications"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                () => {

                    StorageManager.save(
                        "notifications",
                        []
                    );

                    this.renderNotifications();

                    this.updateNotificationDot();

                }
            );

        }


        this.renderNotifications();

    },


    renderNotifications() {

        const container =
            document.getElementById(
                "notificationList"
            );


        if (!container) {
            return;
        }


        const notifications =
            StorageManager.get(
                "notifications",
                []
            );


        if (
            notifications.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-state">

                    <span>🔔</span>

                    <p>No notifications</p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            notifications
                .map(
                    notification => `

                    <div class="notification-item">

                        <span class="notification-icon">
                            ${notification.icon || "🔔"}
                        </span>

                        <div>

                            <strong>
                                ${this.escapeHTML(
                                    notification.title ||
                                    "Notification"
                                )}
                            </strong>

                            <p>
                                ${this.escapeHTML(
                                    notification.message ||
                                    ""
                                )}
                            </p>

                        </div>

                    </div>

                `
                )
                .join("");

    },


    addNotification(
        title,
        message,
        icon = "🔔"
    ) {

        const notifications =
            StorageManager.get(
                "notifications",
                []
            );


        notifications.unshift({

            id: generateId(
                "notification"
            ),

            title,

            message,

            icon,

            timestamp:
                new Date().toISOString()

        });


        StorageManager.save(
            "notifications",
            notifications.slice(0, 20)
        );


        this.updateNotificationDot();

        this.renderNotifications();

    },


    updateNotificationDot() {

        const dot =
            document.getElementById(
                "notificationDot"
            );


        if (!dot) {
            return;
        }


        const notifications =
            StorageManager.get(
                "notifications",
                []
            );


        dot.style.display =
            notifications.length > 0
                ? "block"
                : "none";

    },


    /* =====================================================
       TOAST
    ====================================================== */

    showToast(
        message,
        type = "success",
        title = null
    ) {

        const toast =
            document.getElementById(
                "toast"
            );


        const toastMessage =
            document.getElementById(
                "toastMessage"
            );


        const toastTitle =
            document.getElementById(
                "toastTitle"
            );


        const toastIcon =
            document.getElementById(
                "toastIcon"
            );


        if (
            !toast ||
            !toastMessage ||
            !toastTitle ||
            !toastIcon
        ) {
            return;
        }


        const toastTypes = {

            success: {
                icon: "✓",
                title: "Success"
            },

            error: {
                icon: "✕",
                title: "Error"
            },

            warning: {
                icon: "⚠",
                title: "Warning"
            },

            info: {
                icon: "ℹ",
                title: "Information"
            }

        };


        const config =
            toastTypes[type] ||
            toastTypes.success;


        toastMessage.textContent =
            message;


        toastTitle.textContent =
            title || config.title;


        toastIcon.textContent =
            config.icon;


        toast.className =
            `toast ${type}`;


        requestAnimationFrame(
            () => {

                toast.classList.add(
                    "show"
                );

            }
        );


        clearTimeout(
            this.toastTimeout
        );


        this.toastTimeout =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                3500
            );

    },


    /* =====================================================
       DATE
    ====================================================== */

    updateCurrentDate() {

        const element =
            document.getElementById(
                "currentDate"
            );


        if (!element) {
            return;
        }


        element.textContent =
            getFormattedDate();

    },


    /* =====================================================
       LOADING STATE
    ====================================================== */

    showLoading(
        element
    ) {

        if (!element) {
            return;
        }


        element.classList.add(
            "loading"
        );

    },


    hideLoading(
        element
    ) {

        if (!element) {
            return;
        }


        element.classList.remove(
            "loading"
        );

    },


    /* =====================================================
       HTML SECURITY HELPER
    ====================================================== */

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
   Initialize UI
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        UI.init();

    }
);