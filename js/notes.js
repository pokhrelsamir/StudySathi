/* =========================================================
   StudySathi — Notes Manager
   Handles creating, editing, searching and deleting notes
========================================================= */

const NotesManager = {

    /* -----------------------------------------------------
       State
    ----------------------------------------------------- */

    notes: [],

    searchQuery: "",

    editingNoteId: null,


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    init() {

        this.loadNotes();

        this.setupForm();

        this.setupSearch();

        this.setupNoteEvents();

        this.render();

    },


    /* =====================================================
       LOAD NOTES
    ===================================================== */

    loadNotes() {

        this.notes =
            StorageManager.get(
                "notes",
                []
            );

    },


    /* =====================================================
       SAVE NOTES
    ===================================================== */

    saveNotes() {

        StorageManager.save(
            "notes",
            this.notes
        );

    },


    /* =====================================================
       FORM SETUP
    ===================================================== */

    setupForm() {

        const form =
            document.getElementById(
                "noteForm"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                this.saveNote();

            }
        );

    },


    /* =====================================================
       SEARCH SETUP
    ===================================================== */

    setupSearch() {

        const searchInput =
            document.getElementById(
                "noteSearch"
            );


        if (!searchInput) {
            return;
        }


        searchInput.addEventListener(
            "input",
            event => {

                this.searchQuery =
                    event.target.value
                        .trim()
                        .toLowerCase();


                this.render();

            }
        );

    },


    /* =====================================================
       SAVE NOTE
    ===================================================== */

    saveNote() {

        const title =
            document
                .getElementById(
                    "noteTitle"
                )
                ?.value
                .trim();


        const content =
            document
                .getElementById(
                    "noteContent"
                )
                ?.value
                .trim();


        const subject =
            document
                .getElementById(
                    "noteSubject"
                )
                ?.value
                .trim() ||
            "";


        if (!title) {

            UI.showToast(
                "Please enter a note title.",
                "warning"
            );

            return;

        }


        if (!content) {

            UI.showToast(
                "Please enter some note content.",
                "warning"
            );

            return;

        }


        /* -------------------------------------------------
           EDIT EXISTING NOTE
        ------------------------------------------------- */

        if (
            this.editingNoteId
        ) {

            const note =
                this.notes.find(
                    item =>
                        item.id ===
                        this.editingNoteId
                );


            if (note) {

                note.title =
                    title;

                note.content =
                    content;

                note.subject =
                    subject;

                note.updatedAt =
                    new Date().toISOString();

            }


            this.saveNotes();

            this.render();

            this.resetForm();

            UI.closeModal(
                "noteModal"
            );


            UI.showToast(
                "Note updated successfully.",
                "success"
            );


            this.editingNoteId =
                null;


            return;

        }


        /* -------------------------------------------------
           CREATE NEW NOTE
        ------------------------------------------------- */

        const note = {

            id:
                generateId(
                    "note"
                ),

            title,

            content,

            subject,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        };


        this.notes.unshift(
            note
        );


        this.saveNotes();

        this.render();

        this.resetForm();

        UI.closeModal(
            "noteModal"
        );


        UI.showToast(
            "Note created successfully.",
            "success"
        );


        UI.addNotification(
            "New Note",
            `"${title}" has been created.`,
            "📝"
        );

    },


    /* =====================================================
       RESET FORM
    ===================================================== */

    resetForm() {

        const form =
            document.getElementById(
                "noteForm"
            );


        if (form) {

            form.reset();

        }


        this.editingNoteId =
            null;


        const modalTitle =
            document.getElementById(
                "noteModalTitle"
            );


        if (modalTitle) {

            modalTitle.textContent =
                "Create Note";

        }


        const submitButton =
            document.querySelector(
                "#noteForm button[type='submit']"
            );


        if (submitButton) {

            submitButton.textContent =
                "Save Note";

        }

    },


    /* =====================================================
       GET FILTERED NOTES
    ====================================================== */

    getFilteredNotes() {

        if (!this.searchQuery) {

            return [
                ...this.notes
            ];

        }


        return this.notes.filter(
            note => {

                const searchableText =
                    `
                    ${note.title}
                    ${note.content}
                    ${note.subject}
                    `.toLowerCase();


                return searchableText.includes(
                    this.searchQuery
                );

            }
        );

    },


    /* =====================================================
       RENDER NOTES
    ====================================================== */

    render() {

        const container =
            document.getElementById(
                "notesGrid"
            );


        if (!container) {
            return;
        }


        const notes =
            this.getFilteredNotes();


        if (
            notes.length === 0
        ) {

            container.innerHTML =
                this.emptyState();

            return;

        }


        container.innerHTML =
            notes
                .map(
                    note =>
                        this.createNoteHTML(
                            note
                        )
                )
                .join("");

    },


    /* =====================================================
       NOTE CARD
    ====================================================== */

    createNoteHTML(
        note
    ) {

        const preview =
            this.getPreview(
                note.content
            );


        return `

            <article
                class="note-card"
                data-note-id="${note.id}"
            >

                <div class="note-card-header">

                    <div class="note-icon">
                        📝
                    </div>


                    <div class="note-actions">

                        <button
                            type="button"
                            class="note-edit"
                            data-action="edit"
                            data-id="${note.id}"
                            title="Edit note"
                            aria-label="Edit note"
                        >
                            ✏️
                        </button>


                        <button
                            type="button"
                            class="note-delete"
                            data-action="delete"
                            data-id="${note.id}"
                            title="Delete note"
                            aria-label="Delete note"
                        >
                            🗑️
                        </button>

                    </div>

                </div>


                <div class="note-card-body">

                    <h3>
                        ${UI.escapeHTML(
                            note.title
                        )}
                    </h3>


                    ${
                        note.subject
                            ? `
                                <span class="note-subject">
                                    📚
                                    ${UI.escapeHTML(
                                        note.subject
                                    )}
                                </span>
                              `
                            : ""
                    }


                    <p>
                        ${UI.escapeHTML(
                            preview
                        )}
                    </p>

                </div>


                <div class="note-card-footer">

                    <span>
                        ${this.formatDate(
                            note.updatedAt ||
                            note.createdAt
                        )}
                    </span>

                </div>

            </article>

        `;

    },


    /* =====================================================
       NOTE EVENTS
    ====================================================== */

    setupNoteEvents() {

        const container =
            document.getElementById(
                "notesGrid"
            );


        if (!container) {
            return;
        }


        container.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );


                if (!button) {
                    return;
                }


                const action =
                    button.dataset.action;


                const id =
                    button.dataset.id;


                if (!id) {
                    return;
                }


                if (
                    action === "edit"
                ) {

                    this.editNote(id);

                }


                if (
                    action === "delete"
                ) {

                    this.deleteNote(id);

                }

            }
        );

    },


    /* =====================================================
       EDIT NOTE
    ====================================================== */

    editNote(id) {

        const note =
            this.notes.find(
                item =>
                    item.id === id
            );


        if (!note) {
            return;
        }


        const titleInput =
            document.getElementById(
                "noteTitle"
            );


        const contentInput =
            document.getElementById(
                "noteContent"
            );


        const subjectInput =
            document.getElementById(
                "noteSubject"
            );


        if (titleInput) {

            titleInput.value =
                note.title;

        }


        if (contentInput) {

            contentInput.value =
                note.content;

        }


        if (subjectInput) {

            subjectInput.value =
                note.subject || "";

        }


        this.editingNoteId =
            id;


        const modalTitle =
            document.getElementById(
                "noteModalTitle"
            );


        if (modalTitle) {

            modalTitle.textContent =
                "Edit Note";

        }


        const submitButton =
            document.querySelector(
                "#noteForm button[type='submit']"
            );


        if (submitButton) {

            submitButton.textContent =
                "Update Note";

        }


        UI.openModal(
            "noteModal"
        );

    },


    /* =====================================================
       DELETE NOTE
    ====================================================== */

    deleteNote(id) {

        const note =
            this.notes.find(
                item =>
                    item.id === id
            );


        if (!note) {
            return;
        }


        const confirmed =
            window.confirm(
                `Delete "${note.title}"?`
            );


        if (!confirmed) {
            return;
        }


        this.notes =
            this.notes.filter(
                item =>
                    item.id !== id
            );


        this.saveNotes();

        this.render();


        UI.showToast(
            "Note deleted successfully.",
            "success"
        );

    },


    /* =====================================================
       EMPTY STATE
    ====================================================== */

    emptyState() {

        if (
            this.searchQuery
        ) {

            return `

                <div class="empty-state">

                    <span>
                        🔍
                    </span>

                    <h3>
                        No notes found
                    </h3>

                    <p>
                        Try a different search term.
                    </p>

                </div>

            `;

        }


        return `

            <div class="empty-state">

                <span>
                    📝
                </span>

                <h3>
                    No notes yet
                </h3>

                <p>
                    Create your first study note.
                </p>

            </div>

        `;

    },


    /* =====================================================
       CONTENT PREVIEW
    ====================================================== */

    getPreview(
        content,
        length = 140
    ) {

        const cleanContent =
            String(
                content || ""
            )
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();


        if (
            cleanContent.length <=
            length
        ) {

            return cleanContent;

        }


        return (
            cleanContent.substring(
                0,
                length
            ) +
            "..."
        );

    },


    /* =====================================================
       DATE FORMAT
    ====================================================== */

    formatDate(
        date
    ) {

        if (!date) {

            return "";

        }


        const parsed =
            new Date(date);


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {

            return "";

        }


        return parsed.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    },


    /* =====================================================
       PUBLIC HELPERS
    ====================================================== */

    getAll() {

        return [
            ...this.notes
        ];

    },


    getById(id) {

        return this.notes.find(
            note =>
                note.id === id
        );

    },


    getCount() {

        return this.notes.length;

    }

};


/* =========================================================
   Initialize Notes Manager
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        NotesManager.init();

    }
);