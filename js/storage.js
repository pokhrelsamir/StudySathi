/* =========================================================
   StudySathi — Local Storage Manager
========================================================= */

const StorageManager = {

    prefix: "studysathi_",

    /* -----------------------------------------------------
       Save Data
    ----------------------------------------------------- */

    save(key, data) {

        try {

            localStorage.setItem(
                this.prefix + key,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error(
                "StudySathi Storage Error:",
                error
            );

            return false;
        }
    },


    /* -----------------------------------------------------
       Get Data
    ----------------------------------------------------- */

    get(key, defaultValue = null) {

        try {

            const data = localStorage.getItem(
                this.prefix + key
            );

            if (data === null) {
                return defaultValue;
            }

            return JSON.parse(data);

        } catch (error) {

            console.error(
                "StudySathi Storage Error:",
                error
            );

            return defaultValue;
        }
    },


    /* -----------------------------------------------------
       Remove Data
    ----------------------------------------------------- */

    remove(key) {

        try {

            localStorage.removeItem(
                this.prefix + key
            );

            return true;

        } catch (error) {

            console.error(
                "StudySathi Storage Error:",
                error
            );

            return false;
        }
    },


    /* -----------------------------------------------------
       Clear StudySathi Data
    ----------------------------------------------------- */

    clearAll() {

        try {

            const keys = Object.keys(localStorage);

            keys.forEach(key => {

                if (key.startsWith(this.prefix)) {

                    localStorage.removeItem(key);

                }

            });

            return true;

        } catch (error) {

            console.error(
                "StudySathi Storage Error:",
                error
            );

            return false;
        }
    },


    /* -----------------------------------------------------
       Check Existing Data
    ----------------------------------------------------- */

    has(key) {

        return localStorage.getItem(
            this.prefix + key
        ) !== null;
    },


    /* -----------------------------------------------------
       Get All StudySathi Data
    ----------------------------------------------------- */

    getAll() {

        const data = {};

        Object.keys(localStorage).forEach(key => {

            if (key.startsWith(this.prefix)) {

                const cleanKey =
                    key.replace(this.prefix, "");

                try {

                    data[cleanKey] =
                        JSON.parse(
                            localStorage.getItem(key)
                        );

                } catch {

                    data[cleanKey] =
                        localStorage.getItem(key);

                }

            }

        });

        return data;
    }

};


/* =========================================================
   Default Application Data
========================================================= */

const DEFAULT_DATA = {

    tasks: [],

    notes: [],

    goals: [],

    studySessions: [],

    recentActivity: [],

    settings: {

        darkMode: false,

        notifications: true,

        sound: true

    }

};


/* =========================================================
   Initialize Storage
========================================================= */

function initializeStorage() {

    if (!StorageManager.has("tasks")) {

        StorageManager.save(
            "tasks",
            DEFAULT_DATA.tasks
        );

    }

    if (!StorageManager.has("notes")) {

        StorageManager.save(
            "notes",
            DEFAULT_DATA.notes
        );

    }

    if (!StorageManager.has("goals")) {

        StorageManager.save(
            "goals",
            DEFAULT_DATA.goals
        );

    }

    if (!StorageManager.has("studySessions")) {

        StorageManager.save(
            "studySessions",
            DEFAULT_DATA.studySessions
        );

    }

    if (!StorageManager.has("recentActivity")) {

        StorageManager.save(
            "recentActivity",
            DEFAULT_DATA.recentActivity
        );

    }

    if (!StorageManager.has("settings")) {

        StorageManager.save(
            "settings",
            DEFAULT_DATA.settings
        );

    }

}


/* =========================================================
   Activity Helper
========================================================= */

function addActivity(
    title,
    description,
    icon = "📚"
) {

    const activities =
        StorageManager.get(
            "recentActivity",
            []
        );

    activities.unshift({

        id: Date.now(),

        title,

        description,

        icon,

        timestamp:
            new Date().toISOString()

    });

    /*
       Keep only the latest 10 activities.
    */

    const limitedActivities =
        activities.slice(0, 10);

    StorageManager.save(
        "recentActivity",
        limitedActivities
    );

}


/* =========================================================
   Activity Time Formatter
========================================================= */

function formatActivityTime(timestamp) {

    const date =
        new Date(timestamp);

    const now =
        new Date();

    const difference =
        Math.floor(
            (now - date) / 1000
        );


    if (difference < 60) {

        return "Just now";

    }


    if (difference < 3600) {

        const minutes =
            Math.floor(
                difference / 60
            );

        return `${minutes} min ago`;

    }


    if (difference < 86400) {

        const hours =
            Math.floor(
                difference / 3600
            );

        return `${hours} hr ago`;

    }


    const days =
        Math.floor(
            difference / 86400
        );

    if (days === 1) {

        return "Yesterday";

    }


    if (days < 7) {

        return `${days} days ago`;

    }


    return date.toLocaleDateString();

}


/* =========================================================
   Generate Unique ID
========================================================= */

function generateId(prefix = "item") {

    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

}


/* =========================================================
   Date Helpers
========================================================= */

function getTodayDate() {

    const date = new Date();

    return date.toISOString()
        .split("T")[0];

}


function getFormattedDate(
    date = new Date()
) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================================
   Application Startup
========================================================= */

initializeStorage();