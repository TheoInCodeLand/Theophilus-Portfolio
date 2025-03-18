const express = require("express");
const path = require("path");
const db = require('./database/portfolio.db');

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Import routes
const aboutRoute = require("./routes/about");
const servicesRoute = require("./routes/services");
const portfolioRoute = require("./routes/portfolio");
const contactRoute = require("./routes/contact");
const blogRoute = require("./routes/blog");

// Use routes
app.get('/', (req, res)=>{
    res.render('Home')
})
app.use("/about", aboutRoute);
app.use("/services", servicesRoute);
app.use("/portfolio", portfolioRoute);
app.use("/contact", contactRoute);
app.use("/blog", blogRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
