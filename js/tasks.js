/* =========================================================
   StudySathi — Task Manager
   Handles task creation, rendering, filtering and completion
========================================================= */

const TaskManager = {

    /* -----------------------------------------------------
       State
    ----------------------------------------------------- */

    tasks: [],

    currentFilter: "all",


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    init() {

        this.loadTasks();

        this.setupForm();

        this.setupFilters();

        this.setupTaskEvents();

        this.render();

    },


    /* =====================================================
       LOAD TASKS
    ===================================================== */

    loadTasks() {

        this.tasks = StorageManager.get(
            "tasks",
            []
        );

    },


    /* =====================================================
       SAVE TASKS
    ===================================================== */

    saveTasks() {

        StorageManager.save(
            "tasks",
            this.tasks
        );

    },


    /* =====================================================
       FORM
    ===================================================== */

    setupForm() {

        const form =
            document.getElementById(
                "taskForm"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                this.addTask();

            }
        );

    },


    /* =====================================================
       ADD TASK
    ===================================================== */

    addTask() {

        const title =
            document
                .getElementById("taskTitle")
                ?.value
                .trim();


        const subject =
            document
                .getElementById("taskSubject")
                ?.value
                .trim();


        const priority =
            document
                .getElementById("taskPriority")
                ?.value ||
            "medium";


        const dueDate =
            document
                .getElementById("taskDueDate")
                ?.value ||
            "";


        if (!title) {

            UI.showToast(
                "Please enter a task title.",
                "warning"
            );

            return;

        }


        const task = {

            id: generateId("task"),

            title,

            subject,

            priority,

            dueDate,

            completed: false,

            createdAt:
                new Date().toISOString(),

            completedAt: null

        };


        this.tasks.unshift(
            task
        );


        this.saveTasks();

        this.render();

        this.resetForm();

        UI.closeModal(
            "taskModal"
        );


        UI.showToast(
            "Task added successfully.",
            "success"
        );


        UI.addNotification(
            "New Task",
            `"${title}" was added to your tasks.`,
            "✅"
        );


        this.updateDashboard();

    },


    /* =====================================================
       RESET FORM
    ===================================================== */

    resetForm() {

        const form =
            document.getElementById(
                "taskForm"
            );


        if (form) {

            form.reset();

        }


        const priority =
            document.getElementById(
                "taskPriority"
            );


        if (priority) {

            priority.value =
                "medium";

        }

    },


    /* =====================================================
       FILTERS
    ===================================================== */

    setupFilters() {

        const buttons =
            document.querySelectorAll(
                ".filter-button"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    this.currentFilter =
                        button.dataset.filter ||
                        "all";


                    this.render();

                }
            );

        });

    },


    /* =====================================================
       FILTER TASKS
    ===================================================== */

    getFilteredTasks() {

        switch (
            this.currentFilter
        ) {

            case "pending":

                return this.tasks.filter(
                    task =>
                        !task.completed
                );


            case "completed":

                return this.tasks.filter(
                    task =>
                        task.completed
                );


            default:

                return [
                    ...this.tasks
                ];

        }

    },


    /* =====================================================
       RENDER
    ===================================================== */

    render() {

        const container =
            document.getElementById(
                "tasksList"
            );


        if (!container) {
            return;
        }


        const tasks =
            this.getFilteredTasks();


        if (tasks.length === 0) {

            container.innerHTML = this.emptyState();

            return;

        }


        container.innerHTML =
            tasks
                .map(
                    task =>
                        this.createTaskHTML(
                            task
                        )
                )
                .join("");


        this.updateTaskCount();

    },


    /* =====================================================
       TASK HTML
    ===================================================== */

    createTaskHTML(task) {

        const priorityClass =
            this.getPriorityClass(
                task.priority
            );


        const priorityLabel =
            this.getPriorityLabel(
                task.priority
            );


        const dueDate =
            this.formatDueDate(
                task.dueDate
            );


        const completedClass =
            task.completed
                ? "completed"
                : "";


        const checked =
            task.completed
                ? "checked"
                : "";


        return `

            <article
                class="task-card ${completedClass}"
                data-task-id="${task.id}"
            >

                <div class="task-checkbox-wrapper">

                    <input
                        type="checkbox"
                        class="task-checkbox"
                        data-action="toggle"
                        data-id="${task.id}"
                        ${checked}
                        aria-label="Mark task as completed"
                    >

                </div>


                <div class="task-content">

                    <h3 class="task-title">

                        ${UI.escapeHTML(
                            task.title
                        )}

                    </h3>


                    <div class="task-meta">

                        ${
                            task.subject
                                ? `
                                    <span class="task-subject">
                                        📚
                                        ${UI.escapeHTML(
                                            task.subject
                                        )}
                                    </span>
                                  `
                                : ""
                        }


                        ${
                            dueDate
                                ? `
                                    <span class="task-due">
                                        📅
                                        ${dueDate}
                                    </span>
                                  `
                                : ""
                        }

                    </div>

                </div>


                <div class="task-right">

                    <span
                        class="priority-badge ${priorityClass}"
                    >

                        ${priorityLabel}

                    </span>


                    <button
                        class="task-delete"
                        data-action="delete"
                        data-id="${task.id}"
                        aria-label="Delete task"
                        title="Delete task"
                    >

                        🗑️

                    </button>

                </div>

            </article>

        `;

    },


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    emptyState() {

        const messages = {

            all: {
                icon: "✅",
                title: "No tasks yet",
                text: "Create your first study task."
            },

            pending: {
                icon: "🎉",
                title: "You're all caught up!",
                text: "There are no pending tasks."
            },

            completed: {
                icon: "📋",
                title: "No completed tasks",
                text: "Completed tasks will appear here."
            }

        };


        const state =
            messages[
                this.currentFilter
            ] ||
            messages.all;


        return `

            <div class="empty-state">

                <span>
                    ${state.icon}
                </span>

                <h3>
                    ${state.title}
                </h3>

                <p>
                    ${state.text}
                </p>

            </div>

        `;

    },


    /* =====================================================
       TASK EVENTS
    ===================================================== */

    setupTaskEvents() {

        const container =
            document.getElementById(
                "tasksList"
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
                    action === "delete"
                ) {

                    this.deleteTask(id);

                }

            }
        );


        container.addEventListener(
            "change",
            event => {

                const checkbox =
                    event.target.closest(
                        '[data-action="toggle"]'
                    );


                if (!checkbox) {
                    return;
                }


                this.toggleTask(
                    checkbox.dataset.id
                );

            }
        );

    },


    /* =====================================================
       TOGGLE TASK
    ===================================================== */

    toggleTask(id) {

        const task =
            this.tasks.find(
                item =>
                    item.id === id
            );


        if (!task) {
            return;
        }


        task.completed =
            !task.completed;


        task.completedAt =
            task.completed
                ? new Date().toISOString()
                : null;


        this.saveTasks();

        this.render();


        if (task.completed) {

            UI.showToast(
                "Great job! Task completed.",
                "success"
            );


            UI.addNotification(
                "Task Completed",
                `"${task.title}" has been completed.`,
                "🎉"
            );

        } else {

            UI.showToast(
                "Task marked as pending.",
                "info"
            );

        }


        this.updateDashboard();

    },


    /* =====================================================
       DELETE TASK
    ===================================================== */

    deleteTask(id) {

        const task =
            this.tasks.find(
                item =>
                    item.id === id
            );


        if (!task) {
            return;
        }


        const confirmed =
            window.confirm(
                `Delete "${task.title}"?`
            );


        if (!confirmed) {
            return;
        }


        this.tasks =
            this.tasks.filter(
                item =>
                    item.id !== id
            );


        this.saveTasks();

        this.render();


        UI.showToast(
            "Task deleted.",
            "success"
        );


        this.updateDashboard();

    },


    /* =====================================================
       PRIORITY
    ===================================================== */

    getPriorityClass(
        priority
    ) {

        const classes = {

            low: "priority-low",

            medium: "priority-medium",

            high: "priority-high"

        };


        return (
            classes[priority] ||
            "priority-medium"
        );

    },


    getPriorityLabel(
        priority
    ) {

        const labels = {

            low: "Low",

            medium: "Medium",

            high: "High"

        };


        return (
            labels[priority] ||
            "Medium"
        );

    },


    /* =====================================================
       DATE
    ===================================================== */

    formatDueDate(
        date
    ) {

        if (!date) {
            return "";
        }


        const due =
            new Date(
                `${date}T00:00:00`
            );


        if (
            Number.isNaN(
                due.getTime()
            )
        ) {

            return "";

        }


        const today =
            new Date();


        today.setHours(
            0,
            0,
            0,
            0
        );


        const tomorrow =
            new Date(
                today
            );


        tomorrow.setDate(
            tomorrow.getDate() + 1
        );


        if (
            due.getTime() ===
            today.getTime()
        ) {

            return "Today";

        }


        if (
            due.getTime() ===
            tomorrow.getTime()
        ) {

            return "Tomorrow";

        }


        if (
            due < today
        ) {

            return `Overdue · ${
                due.toLocaleDateString(
                    undefined,
                    {
                        month: "short",
                        day: "numeric"
                    }
                )
            }`;

        }


        return due.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    },


    /* =====================================================
       STATISTICS
    ===================================================== */

    getStats() {

        const total =
            this.tasks.length;


        const completed =
            this.tasks.filter(
                task =>
                    task.completed
            ).length;


        const pending =
            total - completed;


        const completionRate =
            total > 0
                ? Math.round(
                    (completed / total) * 100
                )
                : 0;


        return {

            total,

            completed,

            pending,

            completionRate

        };

    },


    /* =====================================================
       DASHBOARD UPDATE
    ===================================================== */

    updateDashboard() {

        const stats =
            this.getStats();


        /* Update task count in dashboard */
        const taskCountElement =
            document.getElementById(
                "taskCount"
            );


        if (taskCountElement) {

            taskCountElement.textContent =
                stats.pending;

        }


        /* Update overall progress */
        const overallProgressElement =
            document.getElementById(
                "overallProgress"
            );


        if (overallProgressElement) {

            overallProgressElement.textContent =
                `${stats.completionRate}%`;

        }


        /* Circular progress */
        const progressCircle =
            document.querySelector(
                ".circular-progress"
            );


        if (progressCircle) {

            progressCircle.style.setProperty(
                "--progress",
                `${stats.completionRate}%`
            );

        }


        /* Update goal percentage */
        const goalPercentage =
            document.getElementById(
                "goalPercentage"
            );


        if (goalPercentage) {

            goalPercentage.textContent =
                `${stats.completionRate}%`;

        }

    },


    /* =====================================================
       TASK COUNT
    ===================================================== */

    updateTaskCount() {

        const stats =
            this.getStats();


        const heading =
            document.querySelector(
                "#tasks .section-page-header h1"
            );


        if (heading) {

            heading.textContent =
                `My Tasks`;

        }

    }

};


/* =========================================================
   Initialize Task Manager
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        TaskManager.init();

    }
);