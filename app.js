// Environment Configuration
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Suppress deprecation warnings
process.noDeprecation = true;

// Core Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");

// Middleware Dependencies
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const helmet = require("helmet");

// Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Utilities
const cloudinary = require("./cloudinary");
const sanitizeV5 = require("./utils/mongoSanitizeV5");
const ExpressError = require("./utils/ExpressError");
const { error } = require("console");

// Route Imports
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

const { MongoStore } = require("connect-mongo");

// Express App Configuration
const app = express();
const port = process.env.PORT || 3000;
app.set("query parser", "extended");
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Database Connection
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

// Middleware Configuration
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(sanitizeV5({ replaceWith: "_" }));


// Session Configuration
const sessionConfig = {
    name: "state",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600 // lazy session update
    }),
    cookie: {
        httpOnly: true,
        secure: false, // Set to false for now to test
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: true }));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://code.jquery.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net"
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/"
];

const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/"
];
const fontSrcUrls = [
    "https://fonts.gstatic.com/",
    "https://kit-free.fontawesome.com/"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", "https://unpkg.com/", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
                "https://images.unsplash.com"
            ],
            fontSrc: ["'self'", ...fontSrcUrls]
        }
    })

);
// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

//ROUTES
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);


app.get("/", (req, res) => { //Home route
    res.render("home");
})

app.all(/(.*)/, (req, res, next) => { //404 Error
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => { //Error Handler
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No!Something went wrong!";
    res.status(statusCode).render("error", { err });
})

app.listen(port, () => { //Listening
    console.log(`Serving on port ${port}`);
})
