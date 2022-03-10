const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const mysqlStore = require("express-mysql-session");
const passport = require("passport");

const { database } = require("./keys");

// Initializations
const app = express();
require("./lib/passport");

// Settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));

const hdb = handlebars.create({
	defaultLayout: "main",
	layoutsDir: path.join(app.get("views"), "layouts"),
	partialsDir: path.join(app.get("views"), "partials"),
	extname: ".hbs",
	helpers: require("./lib/handlebars"),
});

app.engine(".hbs", hdb.engine);

app.set("view engine", ".hbs");

// Middleware
app.use(
	session({
		secret: "mysqlSession",
		resave: false,
		saveUninitialized: false,
		store: new mysqlStore(database),
	})
);
app.use(flash());
app.use(morgan("dev"));
// Accept the data that the user sends from the form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
	app.locals.success = req.flash("success");
	app.locals.message = req.flash("message");
	app.locals.user = req.user;
	next();
});

// Routes
app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use("/links", require("./routes/links"));

// Public
app.use(express.static(path.join(__dirname + "/public")));

// Starting server
app.listen(app.get("port"), () => {
	console.log("Server on port", app.get("port"));
});
