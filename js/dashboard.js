/* =========================================================
   StudySathi — Dashboard Manager
   Aggregates statistics and manages dashboard display
========================================================= */

const DashboardManager = {

    /* =====================================================
       INITIALIZATION
    ===================================================== */

    init() {

        this.refresh();

        this.setupQuickLinks();

    },


    /* =====================================================
       REFRESH DASHBOARD
    ===================================================== */

    refresh() {

        this.updateStatistics();

        this.updateTodayTasks();

        this.updateRecentActivity();

    },


    /* =====================================================
       UPDATE STATISTICS
    ===================================================== */

    updateStatistics() {

        /* Subject count */
        const subjects =
            StorageManager.get(
                "subjects",
                []
            );


        const subjectCountElement =
            document.getElementById(
                "subjectCount"
            );


        if (subjectCountElement) {

            subjectCountElement.textContent =
                subjects.length;

        }


        /* Task count */
        const tasks =
            StorageManager.get(
                "tasks",
                []
            );


        const pendingTasks =
            tasks.filter(
                task =>
                    !task.completed
            );


        const taskCountElement =
            document.getElementById(
                "taskCount"
            );


        if (taskCountElement) {

            taskCountElement.textContent =
                pendingTasks.length;

        }


        /* Overall progress */
        const totalTasks =
            tasks.length;


        const completedTasks =
            tasks.filter(
                task =>
                    task.completed
            ).length;


        const completionRate =
            totalTasks > 0
                ? Math.round(
                    (completedTasks / totalTasks) * 100
                )
                : 0;


        const overallProgressElement =
            document.getElementById(
                "overallProgress"
            );


        if (overallProgressElement) {

            overallProgressElement.textContent =
                `${completionRate}%`;

        }


        /* Study time */
        const studySessions =
            StorageManager.get(
                "studySessions",
                []
            );


        const thisWeekStart =
            new Date();


        thisWeekStart.setDate(
            thisWeekStart.getDate() -
            thisWeekStart.getDay()
        );


        thisWeekStart.setHours(
            0,
            0,
            0,
            0
        );


        const thisWeekSessions =
            studySessions.filter(
                session => {

                    const sessionDate =
                        new Date(
                            session.createdAt
                        );


                    return (
                        sessionDate >= thisWeekStart
                    );

                }
            );


        const totalMinutes =
            thisWeekSessions.reduce(
                (sum, session) =>
                    sum + (session.duration || 0),
                0
            );


        const hours =
            Math.floor(
                totalMinutes / 60
            );


        const minutes =
            totalMinutes % 60;


        const studyTimeElement =
            document.getElementById(
                "studyTime"
            );


        if (studyTimeElement) {

            if (hours > 0) {

                studyTimeElement.textContent =
                    minutes > 0
                        ? `${hours}h ${minutes}m`
                        : `${hours}h`;

            }

            else {

                studyTimeElement.textContent =
                    minutes > 0
                        ? `${minutes}m`
                        : "0h";

            }

        }

    },


    /* =====================================================
       UPDATE TODAY'S TASKS
    ===================================================== */

    updateTodayTasks() {

        const container =
            document.getElementById(
                "todayTaskList"
            );


        if (!container) {
            return;
        }


        const tasks =
            StorageManager.get(
                "tasks",
                []
            );


        const today =
            getTodayDate();


        const todayTasks =
            tasks
                .filter(
                    task =>
                        task.dueDate === today &&
                        !task.completed
                )
                .slice(0, 3);


        if (
            todayTasks.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-state-small">

                    <span>
                        ✅
                    </span>

                    <p>
                        No tasks due today
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            todayTasks
                .map(
                    task =>
                        this.createTaskItemHTML(
                            task
                        )
                )
                .join("");

    },


    /* =====================================================
       CREATE TASK ITEM HTML
    ===================================================== */

    createTaskItemHTML(
        task
    ) {

        const priorityClass =
            this.getPriorityClass(
                task.priority
            );


        const priorityLabel =
            task.priority ||
            "medium";


        return `

            <div class="task-item">

                <label class="task-checkbox">

                    <input
                        type="checkbox"
                        class="task-check"
                        data-task-id="${task.id}"
                    >

                    <span></span>

                </label>


                <div class="task-info">

                    <strong>
                        ${UI.escapeHTML(
                            task.title
                        )}
                    </strong>

                    ${
                        task.subject
                            ? `
                                <span>
                                    📚
                                    ${UI.escapeHTML(
                                        task.subject
                                    )}
                                </span>
                              `
                            : ""
                    }

                </div>


                <span class="task-priority ${priorityClass}">
                    ${this.capitalize(
                        priorityLabel
                    )}
                </span>

            </div>

        `;

    },


    /* =====================================================
       PRIORITY CLASS
    ===================================================== */

    getPriorityClass(
        priority
    ) {

        const classes = {

            low: "low",

            medium: "medium",

            high: "high"

        };


        return (
            classes[priority] ||
            "medium"
        );

    },


    /* =====================================================
       CAPITALIZE
    ===================================================== */

    capitalize(
        text
    ) {

        if (
            !text ||
            typeof text !== "string"
        ) {

            return "";

        }


        return (
            text.charAt(0).toUpperCase() +
            text.slice(1).toLowerCase()
        );

    },


    /* =====================================================
       UPDATE RECENT ACTIVITY
    ===================================================== */

    updateRecentActivity() {

        const container =
            document.querySelector(
                ".activity-list"
            );


        if (!container) {
            return;
        }


        const activities =
            StorageManager.get(
                "recentActivity",
                []
            );


        if (
            activities.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-state-small">

                    <span>
                        📋
                    </span>

                    <p>
                        No recent activity
                    </p>

                </div>

            `;

            return;

        }


        const recentActivities =
            activities.slice(0, 3);


        container.innerHTML =
            recentActivities
                .map(
                    activity => `

                    <div class="activity-item">

                        <div class="activity-icon purple">
                            ${activity.icon}
                        </div>

                        <div>

                            <strong>
                                ${UI.escapeHTML(
                                    activity.title
                                )}
                            </strong>

                            <span>
                                ${formatActivityTime(
                                    activity.timestamp
                                )}
                            </span>

                        </div>

                    </div>

                `
                )
                .join("");

    },


    /* =====================================================
       SETUP QUICK LINKS
    ===================================================== */

    setupQuickLinks() {

        const viewAllButton =
            document.getElementById(
                "viewAllTasks"
            );


        if (viewAllButton) {

            viewAllButton.addEventListener(
                "click",
                () => {

                    if (
                        typeof StudySathiApp !==
                        "undefined"
                    ) {

                        StudySathiApp.showSection(
                            "tasks"
                        );

                    }

                }
            );

        }

    }

};


/* =========================================================
   Initialize Dashboard Manager
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        DashboardManager.init();

    }
);
