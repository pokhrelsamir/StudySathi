/* =========================================================
   StudySathi — Subject Manager
   Handles subjects, colors, statistics and task association
========================================================= */

const SubjectManager = {

    /* -----------------------------------------------------
       State
    ----------------------------------------------------- */

    subjects: [],


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    init() {

        this.loadSubjects();

        this.setupForm();

        this.render();

        this.updateTaskSubjectDropdown();

    },


    /* =====================================================
       LOAD SUBJECTS
    ===================================================== */

    loadSubjects() {

        this.subjects =
            StorageManager.get(
                "subjects",
                []
            );

    },


    /* =====================================================
       SAVE SUBJECTS
    ===================================================== */

    saveSubjects() {

        StorageManager.save(
            "subjects",
            this.subjects
        );

    },


    /* =====================================================
       FORM SETUP
    ===================================================== */

    setupForm() {

        const form =
            document.getElementById(
                "subjectForm"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                this.addSubject();

            }
        );

    },


    /* =====================================================
       ADD SUBJECT
    ===================================================== */

    addSubject() {

        const name =
            document
                .getElementById(
                    "subjectName"
                )
                ?.value
                .trim();


        const color =
            document
                .getElementById(
                    "subjectColor"
                )
                ?.value ||
            "#6366f1";


        if (!name) {

            UI.showToast(
                "Please enter a subject name.",
                "warning"
            );

            return;

        }


        /* Prevent duplicate subjects */

        const duplicate =
            this.subjects.some(
                subject =>
                    subject.name
                        .toLowerCase() ===
                    name.toLowerCase()
            );


        if (duplicate) {

            UI.showToast(
                "This subject already exists.",
                "warning"
            );

            return;

        }


        const subject = {

            id: generateId(
                "subject"
            ),

            name,

            color,

            createdAt:
                new Date().toISOString()

        };


        this.subjects.unshift(
            subject
        );


        this.saveSubjects();

        this.render();

        this.updateTaskSubjectDropdown();

        this.resetForm();

        UI.closeModal(
            "subjectModal"
        );


        UI.showToast(
            "Subject added successfully.",
            "success"
        );


        UI.addNotification(
            "New Subject",
            `"${name}" has been added.`,
            "📚"
        );


        this.updateDashboard();

    },


    /* =====================================================
       RESET FORM
    ===================================================== */

    resetForm() {

        const form =
            document.getElementById(
                "subjectForm"
            );


        if (form) {

            form.reset();

        }


        const color =
            document.getElementById(
                "subjectColor"
            );


        if (color) {

            color.value =
                "#6366f1";

        }

    },


    /* =====================================================
       RENDER SUBJECTS
    ===================================================== */

    render() {

        const container =
            document.getElementById(
                "subjectsGrid"
            );


        if (!container) {
            return;
        }


        if (
            this.subjects.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-state">

                    <span>
                        📚
                    </span>

                    <h3>
                        No subjects yet
                    </h3>

                    <p>
                        Add a subject to organize your studies.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            this.subjects
                .map(
                    subject =>
                        this.createSubjectHTML(
                            subject
                        )
                )
                .join("");

    },


    /* =====================================================
       SUBJECT CARD
    ===================================================== */

    createSubjectHTML(
        subject
    ) {

        const stats =
            this.getSubjectStats(
                subject.id
            );


        return `

            <article
                class="subject-card"
                data-subject-id="${subject.id}"
                style="--subject-color: ${subject.color};"
            >

                <div
                    class="subject-color-bar"
                    style="background: ${subject.color};"
                ></div>


                <div class="subject-card-header">

                    <div
                        class="subject-icon"
                        style="
                            background: ${subject.color}20;
                            color: ${subject.color};
                        "
                    >

                        📚

                    </div>


                    <button
                        class="subject-delete"
                        data-action="delete"
                        data-id="${subject.id}"
                        aria-label="Delete subject"
                        title="Delete subject"
                    >

                        🗑️

                    </button>

                </div>


                <div class="subject-card-content">

                    <h3>
                        ${UI.escapeHTML(
                            subject.name
                        )}
                    </h3>

                    <p>
                        Created
                        ${this.formatCreatedDate(
                            subject.createdAt
                        )}
                    </p>

                </div>


                <div class="subject-statistics">

                    <div class="subject-stat">

                        <strong>
                            ${stats.totalTasks}
                        </strong>

                        <span>
                            Tasks
                        </span>

                    </div>


                    <div class="subject-stat">

                        <strong>
                            ${stats.completedTasks}
                        </strong>

                        <span>
                            Completed
                        </span>

                    </div>


                    <div class="subject-stat">

                        <strong>
                            ${stats.completionRate}%
                        </strong>

                        <span>
                            Progress
                        </span>

                    </div>

                </div>


                <div class="subject-progress">

                    <div class="subject-progress-track">

                        <div
                            class="subject-progress-fill"
                            style="
                                width: ${stats.completionRate}%;
                                background: ${subject.color};
                            "
                        ></div>

                    </div>

                </div>

            </article>

        `;

    },


    /* =====================================================
       DELETE SUBJECT
    ===================================================== */

    setupDeleteEvents() {

        const container =
            document.getElementById(
                "subjectsGrid"
            );


        if (!container) {
            return;
        }


        container.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        '[data-action="delete"]'
                    );


                if (!button) {
                    return;
                }


                const id =
                    button.dataset.id;


                this.deleteSubject(
                    id
                );

            }
        );

    },


    deleteSubject(id) {

        const subject =
            this.subjects.find(
                item =>
                    item.id === id
            );


        if (!subject) {
            return;
        }


        const relatedTasks =
            this.getTasksForSubject(
                subject.name
            );


        let message =
            `Delete "${subject.name}"?`;


        if (
            relatedTasks.length > 0
        ) {

            message +=
                `\n\n${relatedTasks.length} task(s) are associated with this subject. Their subject association will be removed.`;

        }


        const confirmed =
            window.confirm(
                message
            );


        if (!confirmed) {
            return;
        }


        this.subjects =
            this.subjects.filter(
                item =>
                    item.id !== id
            );


        this.saveSubjects();


        /* Remove subject from related tasks */

        if (
            relatedTasks.length > 0
        ) {

            const tasks =
                StorageManager.get(
                    "tasks",
                    []
                );


            tasks.forEach(task => {

                if (
                    task.subject ===
                    subject.name
                ) {

                    task.subject = "";

                }

            });


            StorageManager.save(
                "tasks",
                tasks
            );

        }


        this.render();

        this.updateTaskSubjectDropdown();


        UI.showToast(
            "Subject deleted successfully.",
            "success"
        );


        this.updateDashboard();

    },


    /* =====================================================
       GET TASKS FOR SUBJECT
    ===================================================== */

    getTasksForSubject(
        subjectName
    ) {

        const tasks =
            StorageManager.get(
                "tasks",
                []
            );


        return tasks.filter(
            task =>
                task.subject ===
                subjectName
        );

    },


    /* =====================================================
       SUBJECT STATISTICS
    ===================================================== */

    getSubjectStats(
        subjectId
    ) {

        const subject =
            this.subjects.find(
                item =>
                    item.id === subjectId
            );


        if (!subject) {

            return {

                totalTasks: 0,

                completedTasks: 0,

                pendingTasks: 0,

                completionRate: 0

            };

        }


        const tasks =
            this.getTasksForSubject(
                subject.name
            );


        const totalTasks =
            tasks.length;


        const completedTasks =
            tasks.filter(
                task =>
                    task.completed
            ).length;


        const pendingTasks =
            totalTasks -
            completedTasks;


        const completionRate =
            totalTasks > 0
                ? Math.round(
                    (
                        completedTasks /
                        totalTasks
                    ) * 100
                )
                : 0;


        return {

            totalTasks,

            completedTasks,

            pendingTasks,

            completionRate

        };

    },


    /* =====================================================
       TASK SUBJECT DROPDOWN
    ===================================================== */

    updateTaskSubjectDropdown() {

        const select =
            document.getElementById(
                "taskSubject"
            );


        if (!select) {
            return;
        }


        const currentValue =
            select.value;


        select.innerHTML = `

            <option value="">
                Select subject
            </option>

        `;


        this.subjects.forEach(
            subject => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    subject.name;


                option.textContent =
                    subject.name;


                option.dataset.color =
                    subject.color;


                select.appendChild(
                    option
                );

            }
        );


        /* Restore previous value if available */

        if (
            this.subjects.some(
                subject =>
                    subject.name ===
                    currentValue
            )
        ) {

            select.value =
                currentValue;

        }

    },


    /* =====================================================
       DATE FORMAT
    ===================================================== */

    formatCreatedDate(
        date
    ) {

        if (!date) {
            return "recently";
        }


        const created =
            new Date(date);


        if (
            Number.isNaN(
                created.getTime()
            )
        ) {

            return "recently";

        }


        return created.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    },


    /* =====================================================
       DASHBOARD UPDATE
    ===================================================== */

    updateDashboard() {

        const totalSubjects =
            document.getElementById(
                "totalSubjects"
            );


        if (totalSubjects) {

            totalSubjects.textContent =
                this.subjects.length;

        }

    },


    /* =====================================================
       PUBLIC HELPERS
    ===================================================== */

    getAll() {

        return [
            ...this.subjects
        ];

    },


    getById(id) {

        return this.subjects.find(
            subject =>
                subject.id === id
        );

    },


    getByName(name) {

        return this.subjects.find(
            subject =>
                subject.name
                    .toLowerCase() ===
                name.toLowerCase()
        );

    }

};


/* =========================================================
   Initialize Subject Manager
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        SubjectManager.setupDeleteEvents();

        SubjectManager.init();

    }
);