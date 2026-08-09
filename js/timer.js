/* =========================================================
   StudySathi — Study Timer
   Pomodoro-style study and break timer
========================================================= */

const StudyTimer = {

    /* -----------------------------------------------------
       Timer Configuration
    ----------------------------------------------------- */

    modes: {

        focus: {
            label: "Focus",
            duration: 25 * 60
        },

        shortBreak: {
            label: "Short Break",
            duration: 5 * 60
        },

        longBreak: {
            label: "Long Break",
            duration: 15 * 60
        }

    },


    /* -----------------------------------------------------
       State
    ----------------------------------------------------- */

    currentMode: "focus",

    remainingSeconds: 25 * 60,

    isRunning: false,

    interval: null,

    completedFocusSessions: 0,

    totalFocusSeconds: 0,


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    init() {

        this.loadSessionData();

        this.setupControls();

        this.setupModeButtons();

        this.updateDisplay();

        this.updateModeUI();

        this.updateSessionCounter();

    },


    /* =====================================================
       LOAD SAVED SESSION DATA
    ===================================================== */

    loadSessionData() {

        const data =
            StorageManager.get(
                "timerData",
                {}
            );


        this.completedFocusSessions =
            Number(
                data.completedFocusSessions || 0
            );


        this.totalFocusSeconds =
            Number(
                data.totalFocusSeconds || 0
            );

    },


    /* =====================================================
       SAVE SESSION DATA
    ===================================================== */

    saveSessionData() {

        StorageManager.save(
            "timerData",
            {

                completedFocusSessions:
                    this.completedFocusSessions,

                totalFocusSeconds:
                    this.totalFocusSeconds

            }
        );

    },


    /* =====================================================
       TIMER CONTROLS
    ===================================================== */

    setupControls() {

        const startButton =
            document.getElementById(
                "timerStart"
            );


        const pauseButton =
            document.getElementById(
                "timerPause"
            );


        const resetButton =
            document.getElementById(
                "timerReset"
            );


        const skipButton =
            document.getElementById(
                "timerSkip"
            );


        if (startButton) {

            startButton.addEventListener(
                "click",
                () => {

                    this.start();

                }
            );

        }


        if (pauseButton) {

            pauseButton.addEventListener(
                "click",
                () => {

                    this.pause();

                }
            );

        }


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                () => {

                    this.reset();

                }
            );

        }


        if (skipButton) {

            skipButton.addEventListener(
                "click",
                () => {

                    this.skip();

                }
            );

        }

    },


    /* =====================================================
       MODE BUTTONS
    ====================================================== */

    setupModeButtons() {

        const buttons =
            document.querySelectorAll(
                "[data-timer-mode]"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const mode =
                        button.dataset.timerMode;


                    if (
                        !this.modes[mode]
                    ) {

                        return;

                    }


                    this.changeMode(
                        mode
                    );

                }
            );

        });

    },


    /* =====================================================
       START TIMER
    ====================================================== */

    start() {

        if (this.isRunning) {
            return;
        }


        this.isRunning = true;


        this.updateControls();


        this.interval =
            setInterval(
                () => {

                    this.tick();

                },
                1000
            );


        document.body.classList.add(
            "timer-running"
        );

    },


    /* =====================================================
       TIMER TICK
    ====================================================== */

    tick() {

        if (
            this.remainingSeconds <= 0
        ) {

            this.completeSession();

            return;

        }


        this.remainingSeconds--;


        /* Track study time only during focus */

        if (
            this.currentMode ===
            "focus"
        ) {

            this.totalFocusSeconds++;

        }


        this.updateDisplay();

    },


    /* =====================================================
       PAUSE TIMER
    ====================================================== */

    pause() {

        if (!this.isRunning) {
            return;
        }


        this.isRunning = false;


        clearInterval(
            this.interval
        );


        this.interval = null;


        this.updateControls();


        document.body.classList.remove(
            "timer-running"
        );

    },


    /* =====================================================
       RESET TIMER
    ====================================================== */

    reset() {

        this.pause();


        this.remainingSeconds =
            this.modes[
                this.currentMode
            ].duration;


        this.updateDisplay();

        this.updateControls();

    },


    /* =====================================================
       SKIP SESSION
    ====================================================== */

    skip() {

        this.pause();


        this.moveToNextMode();

    },


    /* =====================================================
       CHANGE MODE
    ====================================================== */

    changeMode(mode) {

        if (
            !this.modes[mode]
        ) {

            return;

        }


        this.pause();


        this.currentMode =
            mode;


        this.remainingSeconds =
            this.modes[
                mode
            ].duration;


        this.updateModeUI();

        this.updateDisplay();

        this.updateControls();

    },


    /* =====================================================
       COMPLETE SESSION
    ====================================================== */

    completeSession() {

        this.pause();


        const mode =
            this.modes[
                this.currentMode
            ];


        /* Focus session completed */

        if (
            this.currentMode ===
            "focus"
        ) {

            this.completedFocusSessions++;


            this.saveStudySession(
                mode.duration
            );


            this.saveSessionData();


            UI.showToast(
                "Focus session completed! Great work.",
                "success"
            );


            UI.addNotification(
                "Focus Session Complete",
                "You completed a focused study session.",
                "🎉"
            );

        }


        else {

            UI.showToast(
                `${mode.label} completed.`,
                "info"
            );

        }


        this.updateSessionCounter();


        this.moveToNextMode();

    },


    /* =====================================================
       NEXT MODE
    ====================================================== */

    moveToNextMode() {

        if (
            this.currentMode ===
            "focus"
        ) {

            /*
             * Every fourth focus session
             * leads to a long break.
             */

            if (
                this.completedFocusSessions > 0 &&
                this.completedFocusSessions % 4 === 0
            ) {

                this.currentMode =
                    "longBreak";

            }

            else {

                this.currentMode =
                    "shortBreak";

            }

        }

        else {

            this.currentMode =
                "focus";

        }


        this.remainingSeconds =
            this.modes[
                this.currentMode
            ].duration;


        this.updateModeUI();

        this.updateDisplay();

        this.updateControls();

    },


    /* =====================================================
       SAVE STUDY SESSION
    ====================================================== */

    saveStudySession(
        duration
    ) {

        const sessions =
            StorageManager.get(
                "studySessions",
                []
            );


        const session = {

            id: generateId(
                "session"
            ),

            type: "focus",

            duration,

            completedAt:
                new Date().toISOString()

        };


        sessions.unshift(
            session
        );


        StorageManager.save(
            "studySessions",
            sessions.slice(0, 100)
        );

    },


    /* =====================================================
       DISPLAY
    ====================================================== */

    updateDisplay() {

        const minutes =
            Math.floor(
                this.remainingSeconds /
                60
            );


        const seconds =
            this.remainingSeconds %
            60;


        const formattedMinutes =
            String(
                minutes
            ).padStart(
                2,
                "0"
            );


        const formattedSeconds =
            String(
                seconds
            ).padStart(
                2,
                "0"
            );


        const display =
            document.getElementById(
                "timerDisplay"
            );


        if (display) {

            display.textContent =
                `${formattedMinutes}:${formattedSeconds}`;

        }


        /* Browser tab title */

        if (
            this.isRunning
        ) {

            document.title =
                `${formattedMinutes}:${formattedSeconds} — StudySathi`;

        }

        else {

            document.title =
                "StudySathi";

        }


        this.updateProgress();

    },


    /* =====================================================
       TIMER PROGRESS
    ====================================================== */

    updateProgress() {

        const progress =
            document.getElementById(
                "timerProgress"
            );


        if (!progress) {
            return;
        }


        const total =
            this.modes[
                this.currentMode
            ].duration;


        const elapsed =
            total -
            this.remainingSeconds;


        const percentage =
            total > 0
                ? (
                    elapsed /
                    total
                ) * 100
                : 0;


        progress.style.setProperty(
            "--timer-progress",
            `${percentage}%`
        );


        /*
         * Also support SVG circular
         * progress indicators.
         */

        const circle =
            document.querySelector(
                ".timer-progress-circle"
            );


        if (circle) {

            const radius =
                Number(
                    circle.dataset.radius ||
                    100
                );


            const circumference =
                2 *
                Math.PI *
                radius;


            const offset =
                circumference *
                (
                    1 -
                    percentage / 100
                );


            circle.style.strokeDasharray =
                circumference;


            circle.style.strokeDashoffset =
                offset;

        }

    },


    /* =====================================================
       MODE UI
    ====================================================== */

    updateModeUI() {

        const mode =
            this.modes[
                this.currentMode
            ];


        const modeLabel =
            document.getElementById(
                "timerModeLabel"
            );


        if (modeLabel) {

            modeLabel.textContent =
                mode.label;

        }


        const buttons =
            document.querySelectorAll(
                "[data-timer-mode]"
            );


        buttons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.timerMode ===
                this.currentMode
            );

        });


        document.body.dataset.timerMode =
            this.currentMode;

    },


    /* =====================================================
       BUTTON UI
    ====================================================== */

    updateControls() {

        const startButton =
            document.getElementById(
                "timerStart"
            );


        const pauseButton =
            document.getElementById(
                "timerPause"
            );


        if (startButton) {

            startButton.disabled =
                this.isRunning;

        }


        if (pauseButton) {

            pauseButton.disabled =
                !this.isRunning;

        }

    },


    /* =====================================================
       SESSION COUNTER
    ====================================================== */

    updateSessionCounter() {

        const counter =
            document.getElementById(
                "timerSessionCount"
            );


        if (counter) {

            counter.textContent =
                this.completedFocusSessions;

        }


        const totalTime =
            document.getElementById(
                "totalStudyTime"
            );


        if (totalTime) {

            totalTime.textContent =
                this.formatDuration(
                    this.totalFocusSeconds
                );

        }

    },


    /* =====================================================
       FORMAT DURATION
    ====================================================== */

    formatDuration(
        seconds
    ) {

        const totalMinutes =
            Math.floor(
                seconds / 60
            );


        if (
            totalMinutes < 60
        ) {

            return `${totalMinutes} min`;

        }


        const hours =
            Math.floor(
                totalMinutes / 60
            );


        const minutes =
            totalMinutes % 60;


        if (minutes === 0) {

            return `${hours} hr`;

        }


        return `${hours} hr ${minutes} min`;

    },


    /* =====================================================
       PUBLIC STATS
    ====================================================== */

    getStats() {

        return {

            currentMode:
                this.currentMode,

            isRunning:
                this.isRunning,

            remainingSeconds:
                this.remainingSeconds,

            completedFocusSessions:
                this.completedFocusSessions,

            totalFocusSeconds:
                this.totalFocusSeconds

        };

    }

};


/* =========================================================
   Initialize Timer
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        StudyTimer.init();

    }
);