/* =========================================================
   StudySathi — Main Application Controller
   Connects and coordinates all application modules
========================================================= */

const StudySathiApp = {

    /* -----------------------------------------------------
       Application State
    ----------------------------------------------------- */

    currentSection: "dashboard",

    initialized: false,


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    init() {

        if (this.initialized) {
            return;
        }


        this.setupNavigation();

        this.setupGlobalButtons();

        this.setupModalEvents();

        this.setupDataChangeEvents();

        this.setupKeyboardShortcuts();

        this.loadInitialSection();


        this.initialized = true;


        console.log(
            "StudySathi initialized successfully."
        );

    },


    /* =====================================================
       NAVIGATION
    ===================================================== */

    setupNavigation() {

        const navigation =
            document.querySelector(
                "[data-navigation]"
            );


        /*
         * If the navigation container does not
         * exist, fall back to the whole document.
         */

        const container =
            navigation || document;


        container.addEventListener(
            "click",
            event => {

                const link =
                    event.target.closest(
                        "[data-section]"
                    );


                if (!link) {
                    return;
                }


                event.preventDefault();


                const section =
                    link.dataset.section;


                if (!section) {
                    return;
                }


                this.showSection(
                    section
                );

            }
        );

    },


    /* =====================================================
       SHOW SECTION
    ====================================================== */

    showSection(section) {

    const target = document.getElementById(section);

    if (!target) {
        console.warn(
            `Section "${section}" not found.`
        );
        return;
    }


    /*
     * Hide all application sections
     */
    const sections = document.querySelectorAll(
        "[data-app-section]"
    );


    sections.forEach(element => {

        element.classList.remove("active");

        element.classList.add("hidden-section");

        element.hidden = true;

        element.setAttribute(
            "aria-hidden",
            "true"
        );

    });


    /*
     * Show selected section
     */
    target.classList.remove("hidden-section");

    target.classList.add("active");

    target.hidden = false;

    target.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
     * Update current section
     */
    this.currentSection = section;


    /*
     * Update navigation state
     */
    this.updateNavigationState(section);


    /*
     * Refresh dashboard when opened
     */
    if (
        section === "dashboard" &&
        typeof DashboardManager !== "undefined"
    ) {

        if (
            typeof DashboardManager.refresh ===
            "function"
        ) {
            DashboardManager.refresh();
        }

    }


    /*
     * Scroll to top
     */
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /*
     * Update browser URL
     */
    try {

        history.replaceState(
            null,
            "",
            `#${section}`
        );

    }
    catch (error) {

        console.warn(
            "Could not update URL.",
            error
        );

    }

},


    /* =====================================================
       NAVIGATION STATE
    ====================================================== */

    updateNavigationState(
        section
    ) {

        const links =
            document.querySelectorAll(
                "[data-section]"
            );


        links.forEach(
            link => {

                const isActive =
                    link.dataset.section ===
                    section;


                link.classList.toggle(
                    "active",
                    isActive
                );


                link.setAttribute(
                    "aria-current",
                    isActive
                        ? "page"
                        : "false"
                );

            }
        );

    },


    /* =====================================================
       INITIAL SECTION
    ====================================================== */

    loadInitialSection() {

        const hash =
            window.location.hash
                .replace(
                    "#",
                    ""
                );


        if (
            hash &&
            document.getElementById(
                hash
            )
        ) {

            this.showSection(
                hash
            );

            return;

        }


        /*
         * Default to dashboard.
         */

        if (
            document.getElementById(
                "dashboard"
            )
        ) {

            this.showSection(
                "dashboard"
            );

        }

    },


    /* =====================================================
       GLOBAL BUTTONS
    ====================================================== */

    setupGlobalButtons() {

        /*
         * Add Task buttons
         */

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action='add-task']"
                    );


                if (!button) {
                    return;
                }


                event.preventDefault();


                this.openTaskModal();

            }
        );


        /*
         * Add Note buttons
         */

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action='add-note']"
                    );


                if (!button) {
                    return;
                }


                event.preventDefault();


                this.openNoteModal();

            }
        );


        /*
         * Add Subject buttons
         */

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action='add-subject']"
                    );


                if (!button) {
                    return;
                }


                event.preventDefault();


                this.openSubjectModal();

            }
        );


        /*
         * Clear completed tasks
         */

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action='clear-completed']"
                    );


                if (!button) {
                    return;
                }


                event.preventDefault();


                if (
                    typeof TasksManager !==
                    "undefined"
                ) {

                    TasksManager.clearCompleted();

                }

            }
        );

    },


    /* =====================================================
       TASK MODAL
    ====================================================== */

    openTaskModal() {

        this.showSection(
            "tasks"
        );


        if (
            typeof UI !==
            "undefined" &&
            typeof UI.openModal ===
            "function"
        ) {

            UI.openModal(
                "taskModal"
            );

        }

    },


    /* =====================================================
       NOTE MODAL
    ====================================================== */

    openNoteModal() {

        this.showSection(
            "notes"
        );


        if (
            typeof NotesManager !==
            "undefined"
        ) {

            if (
                typeof NotesManager.resetForm ===
                "function"
            ) {

                NotesManager.resetForm();

            }

        }


        if (
            typeof UI !==
            "undefined" &&
            typeof UI.openModal ===
            "function"
        ) {

            UI.openModal(
                "noteModal"
            );

        }

    },


    /* =====================================================
       SUBJECT MODAL
    ====================================================== */

    openSubjectModal() {

        this.showSection(
            "subjects"
        );


        if (
            typeof UI !==
            "undefined" &&
            typeof UI.openModal ===
            "function"
        ) {

            UI.openModal(
                "subjectModal"
            );

        }

    },


    /* =====================================================
       MODAL EVENTS
    ====================================================== */

    setupModalEvents() {

        /*
         * Close modal buttons
         */

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-close-modal]"
                    );


                if (!button) {
                    return;
                }


                const modalId =
                    button.dataset.closeModal;


                if (
                    typeof UI !==
                    "undefined" &&
                    typeof UI.closeModal ===
                    "function"
                ) {

                    UI.closeModal(
                        modalId
                    );

                }

            }
        );


        /*
         * Close modal when clicking
         * outside the modal content.
         */

        document.addEventListener(
            "click",
            event => {

                const modal =
                    event.target.closest(
                        ".modal"
                    );


                if (!modal) {
                    return;
                }


                if (
                    event.target !==
                    modal
                ) {

                    return;

                }


                const modalId =
                    modal.id;


                if (
                    typeof UI !==
                    "undefined" &&
                    typeof UI.closeModal ===
                    "function"
                ) {

                    UI.closeModal(
                        modalId
                    );

                }

            }
        );

    },


    /* =====================================================
       DATA CHANGE EVENTS
    ====================================================== */

    setupDataChangeEvents() {

        /*
         * Listen for custom data-change
         * events from individual modules.
         */

        document.addEventListener(
            "studySathi:dataChanged",
            event => {

                const detail =
                    event.detail || {};


                console.log(
                    "StudySathi data changed:",
                    detail
                );


                /*
                 * Refresh dashboard.
                 */

                if (
                    typeof DashboardManager !==
                    "undefined"
                ) {

                    DashboardManager.refresh();

                }


                /*
                 * Refresh subject-related
                 * UI if available.
                 */

                if (
                    typeof SubjectsManager !==
                    "undefined" &&
                    typeof SubjectsManager.render ===
                    "function"
                ) {

                    SubjectsManager.render();

                }

            }
        );

    },


    /* =====================================================
       DISPATCH DATA CHANGE EVENT
    ====================================================== */

    notifyDataChanged(
        type
    ) {

        document.dispatchEvent(
            new CustomEvent(
                "studySathi:dataChanged",
                {

                    detail: {
                        type:
                            type ||
                            "unknown"
                    }

                }
            )
        );

    },


    /* =====================================================
       KEYBOARD SHORTCUTS
    ====================================================== */

    setupKeyboardShortcuts() {

        document.addEventListener(
            "keydown",
            event => {

                /*
                 * Ignore shortcuts while typing.
                 */

                const tag =
                    event.target.tagName;


                const isTyping =
                    tag === "INPUT" ||
                    tag === "TEXTAREA" ||
                    tag === "SELECT";


                if (isTyping) {
                    return;
                }


                /*
                 * D → Dashboard
                 */

                if (
                    event.key.toLowerCase() ===
                    "d"
                ) {

                    this.showSection(
                        "dashboard"
                    );

                }


                /*
                 * T → Tasks
                 */

                if (
                    event.key.toLowerCase() ===
                    "t"
                ) {

                    this.showSection(
                        "tasks"
                    );

                }


                /*
                 * N → Notes
                 */

                if (
                    event.key.toLowerCase() ===
                    "n"
                ) {

                    this.showSection(
                        "notes"
                    );

                }


                /*
                 * S → Subjects
                 */

                if (
                    event.key.toLowerCase() ===
                    "s"
                ) {

                    this.showSection(
                        "subjects"
                    );

                }


                /*
                 * P → Pomodoro / Timer
                 */

                if (
                    event.key.toLowerCase() ===
                    "p"
                ) {

                    this.showSection(
                        "timer"
                    );

                }


                /*
                 * Escape → close modal
                 */

                if (
                    event.key ===
                    "Escape"
                ) {

                    this.closeAllModals();

                }

            }
        );

    },


    /* =====================================================
       CLOSE ALL MODALS
    ====================================================== */

    closeAllModals() {

        const modals =
            document.querySelectorAll(
                ".modal"
            );


        modals.forEach(
            modal => {

                if (
                    typeof UI !==
                    "undefined" &&
                    typeof UI.closeModal ===
                    "function"
                ) {

                    UI.closeModal(
                        modal.id
                    );

                }

                else {

                    modal.classList.remove(
                        "active"
                    );

                }

            }
        );

    },


    /* =====================================================
       APPLICATION RESET
    ====================================================== */

    resetApplication() {

        const confirmed =
            window.confirm(
                "This will permanently delete all StudySathi data. Continue?"
            );


        if (!confirmed) {
            return;
        }


        StorageManager.clear();


        window.location.reload();

    },


    /* =====================================================
       EXPORT APPLICATION DATA
    ====================================================== */

    exportData() {

        const data = {

            tasks:
                StorageManager.get(
                    "tasks",
                    []
                ),

            subjects:
                StorageManager.get(
                    "subjects",
                    []
                ),

            notes:
                StorageManager.get(
                    "notes",
                    []
                ),

            studySessions:
                StorageManager.get(
                    "studySessions",
                    []
                ),

            timerData:
                StorageManager.get(
                    "timerData",
                    {}
                ),

            exportedAt:
                new Date().toISOString(),

            application:
                "StudySathi"

        };


        const json =
            JSON.stringify(
                data,
                null,
                2
            );


        const blob =
            new Blob(
                [
                    json
                ],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            `studysathi-backup-${
                new Date()
                    .toISOString()
                    .split("T")[0]
            }.json`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


        if (
            typeof UI !==
            "undefined" &&
            typeof UI.showToast ===
            "function"
        ) {

            UI.showToast(
                "StudySathi data exported successfully.",
                "success"
            );

        }

    },


    /* =====================================================
       IMPORT APPLICATION DATA
    ====================================================== */

    importData(
        file
    ) {

        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                try {

                    const data =
                        JSON.parse(
                            event.target.result
                        );


                    if (
                        !data ||
                        typeof data !==
                        "object"
                    ) {

                        throw new Error(
                            "Invalid backup file."
                        );

                    }


                    /*
                     * Import supported data.
                     */

                    if (
                        Array.isArray(
                            data.tasks
                        )
                    ) {

                        StorageManager.save(
                            "tasks",
                            data.tasks
                        );

                    }


                    if (
                        Array.isArray(
                            data.subjects
                        )
                    ) {

                        StorageManager.save(
                            "subjects",
                            data.subjects
                        );

                    }


                    if (
                        Array.isArray(
                            data.notes
                        )
                    ) {

                        StorageManager.save(
                            "notes",
                            data.notes
                        );

                    }


                    if (
                        Array.isArray(
                            data.studySessions
                        )
                    ) {

                        StorageManager.save(
                            "studySessions",
                            data.studySessions
                        );

                    }


                    if (
                        data.timerData &&
                        typeof data.timerData ===
                        "object"
                    ) {

                        StorageManager.save(
                            "timerData",
                            data.timerData
                        );

                    }


                    /*
                     * Refresh application.
                     */

                    this.notifyDataChanged(
                        "import"
                    );


                    if (
                        typeof UI !==
                        "undefined" &&
                        typeof UI.showToast ===
                        "function"
                    ) {

                        UI.showToast(
                            "StudySathi data imported successfully.",
                            "success"
                        );

                    }


                    setTimeout(
                        () => {

                            window.location.reload();

                        },
                        800
                    );

                }

                catch (error) {

                    console.error(
                        "Import failed:",
                        error
                    );


                    if (
                        typeof UI !==
                        "undefined" &&
                        typeof UI.showToast ===
                        "function"
                    ) {

                        UI.showToast(
                            "Invalid StudySathi backup file.",
                            "error"
                        );

                    }

                }

            };


        reader.readAsText(
            file
        );

    },


    /* =====================================================
       APPLICATION INFO
    ====================================================== */

    getInfo() {

        return {

            name:
                "StudySathi",

            version:
                "1.0.0",

            currentSection:
                this.currentSection,

            initialized:
                this.initialized

        };

    }

};


/* =========================================================
   Global Import File Handler
========================================================= */

document.addEventListener(
    "change",
    event => {

        const input =
            event.target;


        if (
            input.id !==
            "importData"
        ) {

            return;

        }


        const file =
            input.files?.[0];


        if (file) {

            StudySathiApp.importData(
                file
            );

        }


        input.value =
            "";

    }
);


/* =========================================================
   Initialize Application
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        StudySathiApp.init();

    }
);


/* =========================================================
   Handle Browser Back/Forward
========================================================= */

window.addEventListener(
    "hashchange",
    () => {

        const section =
            window.location.hash
                .replace(
                    "#",
                    ""
                );


        if (
            section &&
            document.getElementById(
                section
            )
        ) {

            StudySathiApp.showSection(
                section
            );

        }

    }
);