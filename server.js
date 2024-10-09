const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
const port = 3000;
const fs = require("fs");
const csv = require("csv-parser");

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the views directory (optional if using the default "views" folder)
app.set("views", "./views");

// Middleware to parse JSON
app.use(express.json());

// Serve static files like CSS, JS, images from 'assets', 'css', and 'js' folders
app.use(express.static("assets"));
app.use(express.static("css"));
app.use(express.static("js"));

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

// Middleware setup
app.use(express.urlencoded({extended: true}));
app.use(
    session({
        secret: "ron",
        resave: false,
        saveUninitialized: false,
        cookie: {secure: false}, // Use true in production with HTTPS
    })
);

// Middleware to protect routes
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    next();
}

// Open (connect) to the SQLite3 database
const db = new sqlite3.Database("./db/db.sqlite3", (err) => {
    if (err) {
        console.error("Failed to connect to the SQLite database:", err.message);
        return;
    }
    console.log("Connected to the SQLite database.");
});

// Render index page using EJS
app.get("/", requireLogin, (req, res) => {
    res.render("index", {title: "Home Page"});
});

// Render newform page using EJS
app.get("/newform", requireLogin, (req, res) => {
    res.render("newform", {title: "New Form"});
});

// Render home page using EJS
app.get("/home", requireLogin, (req, res) => {
    res.render("home", {title: "Home"});
});

app.get("/login", (req, res) => {
    res.render("login", {title: "Login"});
});

app.post("/loginuser", (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).send("All fields are required");
    }

    // Check if user exists in the database
    const query = `SELECT * FROM auth_user WHERE username = ? OR email = ?`;
    db.get(query, [username, username], async (err, user) => {
        if (err) {
            return res.status(500).send("Error logging in");
        }

        if (!user) {
            return res.status(400).send("Invalid username or email");
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid password");
        }

        // User authenticated, save user ID in session
        req.session.userId = user.id;
        res.redirect("/"); // Redirect to a protected page after login
    });
});

app.get("/signup", (req, res) => {
    res.render("signup", {title: "Signup"});
});

app.post("/register", async (req, res) => {
    const {fnln, username, email, password, confirm_password} = req.body;

    // Basic validation
    if (!fnln || !username || !email || !password || !confirm_password) {
        return res.status(400).send("All fields are required");
    }

    if (password !== confirm_password) {
        return res.status(400).send("Passwords do not match");
    }

    try {
        // Split the full name into first and last name
        const [first_name, last_name] = fnln.split(" ");

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const query = `INSERT INTO auth_user (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)`;
        db.run(
            query,
            [first_name, last_name, username, email, hashedPassword],
            function (err) {
                if (err) {
                    return res.status(500).send("Error registering user");
                }
                res.send("Registration successful");
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error logging out");
        }
        res.redirect("/login");
    });
});

// Render form page using EJS
app.get("/form", requireLogin, (req, res) => {
    const sql = `SELECT id, obligation_number, primary_environmental_mechanism, due_date, status, environmental_aspect FROM dashboard_obligation`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Database query error.");
        }

        res.render("forms", {obligations: rows, title: "Form Page"}); // Pass the data to the EJS template
    });
});

// Render responsible page using EJS
app.get("/responsible", requireLogin, (req, res) => {
    res.render("responsible", {title: "Responsible Page"});
});

// Render single obligation page using EJS
app.get("/singlepage", requireLogin, (req, res) => {
    res.render("singleobligation", {title: "Single Obligation"});
});

app.get("/updateform/:id", (req, res) => {
    res.render("updateform", {title: "updateform"});
});

function formatDate(date) {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function formatDatetime(date) {
    const pad = (num) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
    )}`;
}

app.post("/submitupdateform", (req, res) => {
    const {
        id,
        obligation_number,
        date_granted,
        environmental_aspect,
        project_phase,
        primary_environmental_mechanism,
        accountability,
        obligation,
        obligation_type,
        recurring_obligation,
        recurring_frequency,
        recurring_status,
        compliance_comments,
        noncompliance_comments,
        audit,
        due_date,
        completion_date,
        status,
        supporting_information,
        evidence,
        inspections,
        inspection_frequency,
        modified_by_id, // Assuming this is sent in the request body
    } = req.body;

    // Get current datetime for modified_on
    const modified_on = formatDatetime(new Date()); // Use your existing formatDatetime function

    // Perform the update query
    const query = `
    UPDATE dashboard_obligation
    SET date_granted = ?,
      environmental_aspect = ?,
      project_phase = ?,
      primary_environmental_mechanism = ?,
      accountability = ?,
      obligation = ?,
      obligation_type = ?,
      recurring_obligation = ?,
      recurring_frequency = ?,
      recurring_status = ?,
      compliance_comments = ?,
      noncompliance_comments = ?,
      audit = ?,
      due_date = ?,
      completion_date = ?,
      status = ?,
      supporting_information = ?,
      evidence = ?,
      inspections = ?,
      inspection_frequency = ?,
      modified_by_id = ?,        
      modified_on = ?         
    WHERE obligation_number = ?`; // Ensure obligation_number is unique

    const values = [
        date_granted,
        environmental_aspect,
        project_phase,
        primary_environmental_mechanism,
        accountability,
        obligation,
        obligation_type,
        recurring_obligation,
        recurring_frequency,
        recurring_status,
        compliance_comments,
        noncompliance_comments,
        audit,
        due_date,
        completion_date,
        status,
        supporting_information,
        evidence,
        inspections,
        inspection_frequency,
        modified_by_id,
        modified_on,
        obligation_number,
    ];

    db.run(query, values, function (error) {
        if (error) {
            console.error("Error updating record:", error);
            return res.status(500).send("Error updating record.");
        }
        // Send a response indicating success
        res.status(200).json({message: "Update successful!"});
    });
});

app.post("/deleteform", (req, res) => {
    const obligationIds = req.body.obligationIds;

    if (!Array.isArray(obligationIds)) {
        return res.status(400).send("Invalid request");
    }

    const placeholders = obligationIds.map(() => "?").join(",");
    const query = `DELETE FROM dashboard_obligation WHERE id IN (${placeholders})`;

    db.run(query, obligationIds, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting obligations");
        }

        res.send({success: true});
    });
});

app.get("/obligation/:checkId", (req, res) => {
    const checkId = req.params.checkId;

    const query = `SELECT * FROM dashboard_obligation WHERE id = ?`;
    db.get(query, [checkId], (err, row) => {
        if (err) {
            return res.status(500).send("Error retrieving data");
        }
        // Send the data back to the frontend
        res.json(row);
    });
});

// Fetch choices from the database and send to frontend as JSON
app.get("/choices", (req, res) => {
    let globalChoices = [];
    const fields = [
        "PRIMARY_ENVIRONMENTAL_MECHANISM_CHOICES",
        "ACCOUNTABILITY_CHOICES",
        "STATUS_CHOICES",
        "ENVIRONMENTAL_ASPECT_CHOICES",
        "INSPECTION_FREQUENCY_CHOICES",
        "OBLIGATION_TYPE_CHOICES",
        "PROJECT_PHASE_CHOICES",
        "RECURRING_FREQUENCY_CHOICES",
        "AUDIT_CHOICES",
        "RECURRING_STATUS_CHOICES",
    ];

    const promises = fields.map((field) => {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT ${field} FROM choices WHERE ${field} IS NOT NULL`,
                [],
                (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    globalChoices.push({
                        field: field,
                        choices: rows.map((row) => row[field]),
                    });
                    resolve();
                }
            );
        });
    });

    Promise.all(promises)
        .then(() => {
            res.json(globalChoices); // Send the merged choices as JSON
        })
        .catch((err) => {
            res.status(500).send(err.message); // Handle any errors
        });
});

// Serve chart data as JSON
app.get("/api/chart-data", (req, res) => {
    const sql = `SELECT Environmental_Aspect, COUNT(*) as count FROM obligations GROUP BY Environmental_Aspect`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({data: rows});
    });
});

// Serve environmental aspect options as JSON
app.get("/api/env_asp", (req, res) => {
    const sql = `SELECT DISTINCT Environmental_Aspect FROM obligations`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: "An error occurred while fetching environmental aspects.",
                details: err.message,
            });
        }
        res.json({options: rows});
    });
});

// Submit form data to database
app.post("/submitnewform", (req, res) => {
    // Form data processing functions

    const convertToBoolean = (value) => (value === "true" ? 1 : 0);

    const obligation_number = req.body.obligation_number.replace(/'/g, "''");
    const date_granted = req.body.date_granted.replace(/'/g, "''");
    const environmental_aspect = req.body.environmental_aspect.replace(
        /'/g,
        "''"
    );
    const project_phase = req.body.project_phase.replace(/'/g, "''");
    const primary_environmental_mechanism =
        req.body.primary_environmental_mechanism.replace(/'/g, "''");
    const accountability = req.body.accountability.replace(/'/g, "''");
    const obligation = req.body.obligation.replace(/'/g, "''");
    const obligation_type = req.body.obligation_type.replace(/'/g, "''");
    const recurring_obligation = convertToBoolean(req.body.recurring_obligation);
    const recurring_frequency = req.body.recurring_frequency.replace(/'/g, "''");
    const recurring_status = req.body.recurring_status.replace(/'/g, "''");
    const compliance_comments = req.body.compliance_comments.replace(/'/g, "''");
    const noncompliance_comments = req.body.noncompliance_comments.replace(
        /'/g,
        "''"
    );
    const audit = req.body.audit.replace(/'/g, "''");
    const due_date = req.body.due_date.replace(/'/g, "''");
    const completion_date = req.body.completion_date.replace(/'/g, "''");
    const status = req.body.status.replace(/'/g, "''");
    const supporting_information = req.body.supporting_information.replace(
        /'/g,
        "''"
    );
    const evidence = req.body.evidence.replace(/'/g, "''");
    const inspections = convertToBoolean(req.body.inspections);
    const inspection_frequency = req.body.inspection_frequency.replace(
        /'/g,
        "''"
    );
    const recurring_forecast_date = formatDate(new Date());
    const created_on = formatDate(new Date());
    const created_by_id = 2;
    const created_by_delegate_id = 1;
    const modified_by_id = 1;
    const modified_on = formatDatetime(new Date());
    const record_created_on = formatDatetime(new Date());

    const sqlQuery = `INSERT INTO dashboard_obligation 
  (obligation_number, date_granted, environmental_aspect, project_phase, responsibility_id,
   primary_environmental_mechanism, accountability, obligation, obligation_type, recurring_obligation, recurring_frequency,
   recurring_status, compliance_comments, noncompliance_comments, audit, due_date, completion_date, status, supporting_information,
   evidence, inspections, inspection_frequency, recurring_forecast_date, created_on, created_by_id, created_by_delegate_id, modified_by_id, modified_on, record_created_on) 
  VALUES (
    '${obligation_number}', '${date_granted}', '${environmental_aspect}', '${project_phase}', 2, '${primary_environmental_mechanism}',
    '${accountability}', '${obligation}', '${obligation_type}', ${recurring_obligation}, '${recurring_frequency}', '${recurring_status}', 
    '${compliance_comments}', '${noncompliance_comments}', '${audit}', '${due_date}', '${completion_date}', '${status}', 
    '${supporting_information}', '${evidence}', ${inspections}, '${inspection_frequency}', '${recurring_forecast_date}', '${created_on}', 
    ${created_by_id}, ${created_by_delegate_id}, ${modified_by_id}, '${modified_on}', '${record_created_on}'
  );`;

    db.run(sqlQuery, function (err) {
        if (err) {
            console.error("SQL Error: ", err.message);
            res.status(500).send("Error inserting data into the database.");
        } else {
            const sql = `SELECT id, obligation_number, primary_environmental_mechanism, due_date, status, environmental_aspect FROM dashboard_obligation`;

            db.all(sql, [], (err, rows) => {
                if (err) {
                    return res.status(500).send("Database query error.");
                }

                res.render("forms", {
                    obligations: rows,
                    title: "Form Page",
                    successMessage: "Form submitted successfully!",
                }); // Pass the data to the EJS template
            });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
