const mysql = require("mysql2"); 
const express = require("express"); 
const cors = require("cors"); 
const path = require("path"); 
const bcrypt = require("bcryptjs"); 
const nodemailer = require("nodemailer"); 
const crypto = require("crypto"); 
const session = require("express-session"); 
const passport = require("passport"); 
const GoogleStrategy = require("passport-google-oauth20").Strategy; 
const bodyParser = require("body-parser"); 
require("dotenv").config(); 
const routes = require("./routes"); 
const multer = require("multer"); 
const { exec } = require("child_process"); 
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');




// Initialize Express application
const app = express();
const port = process.env.PORT || 3000;

  
// Setup connection to filess.io MySQL database
const db = mysql.createConnection({
  host: "fo7ydn.h.filess.io",
  user: "evisa_lunchwargo",
  password: "2b694e204b5c38de4bcf4ff8de7d732751bd7bd4",
  database: "evisa_lunchwargo",
  port: 3307,
});


// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("✅ Connected to e-visa project database");
});


// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set("view engine", "ejs"); // Set EJS as the templating engine
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(express.static(path.join(__dirname, "Frontend"))); // Serve Frontend directory
app.use('/pdfs', express.static(path.join(__dirname, "Frontend/pdfs")));
app.use('/universities/details', express.static(path.join(__dirname, 'public/universities/details')));
app.use('/scholarships/details', express.static(path.join(__dirname, 'public/scholarships/details')));
app.use('/accommodations/details', express.static(path.join(__dirname, 'public/accommodations/details')));



// Configure session management
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);


app.use("/", routes);



//***************Group  chat feature ********************* */

app.get('/chat', (req, res) => {
  db.query('SELECT * FROM chat_messages ORDER BY timestamp', (err, results) => {
    if (err) {
      console.error('Fetch error:', err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    res.json(results);
  });
});


// Save a new chat message
app.post('/chat', (req, res) => {
  const { id, sender, text, timestamp, userName, advisorName, advisorRegion } = req.body;

  const sql = `
    INSERT INTO chat_messages (id, sender, text, timestamp, userName, advisorName, advisorRegion)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [id, sender, text, timestamp, userName, advisorName, advisorRegion];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ error: 'Failed to save message' });
    }
    res.json({ success: true, insertedId: id });
  });
});



//=========================== GOOGLE AUTHENTICATION =======================
// Configure Google login strategy using Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    (req, token, tokenSecret, profile, done) => {
      const returnUrl = req.session.returnTo || "/";
      req.session.returnTo = null;

      // Check if user already exists in database
      const query = "SELECT * FROM users WHERE email = ?";
      db.query(query, [profile.emails[0].value], (err, result) => {
        if (err) return done(err);

        // If user exists, return user
        if (result.length > 0) {
          return done(null, { ...result[0], returnUrl });
        } else {
          // Otherwise, create new user
          const insertQuery =
            "INSERT INTO users (name, email, google_id, password, is_verified) VALUES (?, ?, ?, ?, ?)";
          db.query(
            insertQuery,
            [profile.displayName, profile.emails[0].value, profile.id, '', true],
            (err, result) => {
              if (err) return done(err);
              return done(null, {
                google_id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
              });
            }
          );
        }
      });
    }
  )
);

// Configure Passport serialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import JSON Web Token library
const jwt = require("jsonwebtoken");

// Route to start Google OAuth authentication (dynamic callback URL)
app.get("/auth/google", (req, res, next) => {
  const host = req.get("host");
  const protocol = req.protocol;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    callbackURL: `${protocol}://${host}/auth/google/callback`
  })(req, res, next);
});

// Callback route after Google authentication
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req, res) => {
    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      { userId: req.user.google_id,  email: req.user.email, name: req.user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Check if user has already set a password
    const query = "SELECT password FROM users WHERE google_id = ?";
    db.query(query, [req.user.google_id], (err, result) => {
      if (err) {
        return res.redirect("/signin");
      }

      // Redirect to home or set-password page based on password existence
      if (result[0].password) {
        res.redirect(`/home?token=${token}`);
      } else {
        res.redirect(`/set-password?token=${token}`);
      }
    });
  }
);

// Route to render set-password page
app.get("/set-password", (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.redirect("/signin");
  }

  // Verify JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("/signin");
    }
    res.render("set-password", { token });
  });
});

// Handle form submission for setting password
app.post("/set-password", (req, res) => {
  const { password, token } = req.body;

  // Verify token again
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("/signin");
    }

    const userId = decoded.userId;
    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the new password

    // Update user password and mark as verified
    const query =
      "UPDATE users SET password = ?, is_verified = ? WHERE google_id = ?";
    db.query(query, [hashedPassword, true, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error saving password" });
      }

      // Generate a fresh token and redirect to home
      const newToken = jwt.sign(
        { userId, name: decoded.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.redirect(`/home?token=${newToken}`);
    });
  });
});

// Logout route to end session
app.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Successfully logged out! We hope to see you again soon!",
  });
});


//=========================== EMAIL VERIFICATION ========================


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Signup route
app.get("/verify", (req, res) => {
  const { token } = req.query; // Extract token from URL

  // SQL query to update user status to verified
  const query = "UPDATE users SET is_verified = true WHERE verification_token = ?";

  db.query(query, [token], (err, result) => {
    if (err) {
      console.error("Error verifying email:", err);
      return res.status(500).send("Error verifying email");
    }

    // If no rows were updated, token is invalid or expired
    if (result.affectedRows === 0) {
      return res.status(400).send("Invalid or expired token");
    }

    // On success, show a styled HTML message and redirect to sign-in page
    res.send(`
      <html>
        <head>
          <!-- Auto redirect to /signin after 3 seconds -->
          <meta http-equiv="refresh" content="3;url=/signin" />
          <style>
            body {
              font-family: 'Poppins', sans-serif;
              background: linear-gradient(135deg, #6A0DAD, #D4AF37);
              color: #F8F8F8;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .message-container {
              text-align: center;
              background-color: #333333;
              padding: 20px 40px;
              border-radius: 20px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            }
            .message-container p {
              font-size: 1.2rem;
              line-height: 1.5;
              margin: 0;
            }
            .highlight {
              color: #D4AF37;
            }
          </style>
        </head>
        <body>
          <div class="message-container">
            <p>Email verified successfully!</p>
            <p>You will be redirected to the <span class="highlight">sign-in page</span> shortly...</p>
          </div>
        </body>
      </html>
    `);
  });
});


// Email verification route
app.get("/verify", (req, res) => {
  const { token } = req.query; // Extract token from URL

  // SQL query to update user status to verified
  const query = "UPDATE users SET is_verified = true WHERE verification_token = ?";

  db.query(query, [token], (err, result) => {
    if (err) {
      console.error("Error verifying email:", err);
      return res.status(500).send("Error verifying email");
    }

    // If no rows were updated, token is invalid or expired
    if (result.affectedRows === 0) {
      return res.status(400).send("Invalid or expired token");
    }

    // On success, show a styled HTML message and redirect to sign-in page
    res.send(`
      <html>
        <head>
          <!-- Auto redirect to /signin after 3 seconds -->
          <meta http-equiv="refresh" content="3;url=/signin" />
          <style>
            body {
              font-family: 'Poppins', sans-serif;
              background: linear-gradient(135deg, #6A0DAD, #D4AF37);
              color: #F8F8F8;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .message-container {
              text-align: center;
              background-color: #333333;
              padding: 20px 40px;
              border-radius: 20px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            }
            .message-container p {
              font-size: 1.2rem;
              line-height: 1.5;
              margin: 0;
            }
            .highlight {
              color: #D4AF37;
            }
          </style>
        </head>
        <body>
          <div class="message-container">
            <p>Email verified successfully!</p>
            <p>You will be redirected to the <span class="highlight">sign-in page</span> shortly...</p>
          </div>
        </body>
      </html>
    `);
  });
});


// ======================== SIGNUP ROUTE ========================

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  // Hash the user's password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ success: false, message: "Error processing the password" });
    }

    const verificationToken = crypto.randomBytes(20).toString("hex"); // Generate email verification token

    // Insert new user into database with unverified status
    const query = "INSERT INTO users (name, email, password, verification_token, is_verified) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [name, email, hashedPassword, verificationToken, false], (err, result) => {
      if (err) {
        console.error("Error inserting data into database:", err);
        return res.status(500).json({ success: false, message: "Error saving data to the database" });
      }

      // Inform user to verify their email
      res.json({
        success: true,
        message: "Signup successful! Please check your email to verify your account.",
      });

      // Send verification email
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Email Verification",
        html: `<html>
            <body style="font-family: 'Poppins', sans-serif; background-color: #f8f8f8; margin: 0; padding: 0;">
              <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center; color: #5D1049D;">Email Verification</h2>
                <p style="font-size: 1rem; color: #333;">Hello,</p>
                <p style="font-size: 1rem; color: #333;">Thank you for signing up. Please click the button below to verify your email address:</p>
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${process.env.BASE_URL}/verify?token=${verificationToken}" style="background-color: #5D1049; color: #ffffff; text-decoration: none; padding: 10px 20px; font-size: 1rem; border-radius: 5px; display: inline-block; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">Verify Email</a>
                </div>
                <p style="font-size: 1rem; color: #333;">If you didn’t sign up for this account, you can ignore this email.</p>
                <p style="font-size: 1rem; color: #333;">Regards,<br>Your Team</p>
              </div>
            </body>
          </html>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        }
      });
    });
  });
});

// ======================== EMAIL VERIFICATION ROUTE ========================

app.get("/verify", (req, res) => {
  const { token } = req.query;

  // Mark user as verified in DB if token matches
  const query = "UPDATE users SET is_verified = true WHERE verification_token = ?";
  db.query(query, [token], (err, result) => {
    if (err) {
      console.error("Error verifying email:", err);
      return res.status(500).send("Error verifying email");
    }

    if (result.affectedRows === 0) {
      return res.status(400).send("Invalid or expired token");
    }

    // Show success message and redirect to sign-in page
    res.send(`...`); // HTML success message with redirect
  });
});

// ======================== LOGIN ROUTE ========================

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Check if the user is the fixed admin
const adminEmail = "raosumeet@gmail.com";
const adminPassword = "Sumeet123@";

const advisorCredentials = [
  { email: "germany@gmail.com", role: "advisor" },
  { email: "france@gmail.com", role: "advisor" },
  { email: "spain@gmail.com", role: "advisor" },
]; 

if (email === adminEmail && password === adminPassword) {
  req.session.userId = "admin";
  return res.json({
    message: "Admin login successful",
    email: adminEmail,
    token: "admin-token"
  });
}

// Check advisor credentials
const advisor = advisorCredentials.find(user => user.email === email && password === "Huzaifa123@");

if (advisor) {
  req.session.userId = advisor.role;
  return res.json({
    message: `${advisor.role.charAt(0).toUpperCase() + advisor.role.slice(1)} login successful`,
    email: advisor.email,
    token: `${advisor.role}-token`
  });
}


  // Check if user exists in the database for non-admin users
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching data from database:", err);
      return res.status(500).json({ error: "Error fetching data from database" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({ error: "Please verify your email first" });
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ error: "Error comparing passwords" });
      }

      // If valid, create session
      if (isMatch) {
        req.session.userId = user.id;

        // Create a token (optional — or use session only)
        const fakeToken = "user-token-" + user.id;

        res.json({
          message: "Login successful",
          email: user.email,
          name: user.name,
          token: fakeToken
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    });
  });
});

// ======================== LOGOUT ROUTE ========================

app.post("/logout", (req, res) => {
  // Destroy user session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

// ======================== SESSION CHECK MIDDLEWARE ========================

function checkSession(req, res, next) {
  // Only proceed if session exists
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// ======================== FORGOT PASSWORD ROUTE ========================

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString("hex"); // Generate reset token

  // Check if email exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save reset token in database
    db.query("UPDATE users SET verification_token = ? WHERE email = ?", [token, email], (err) => {
      if (err) throw err;

      // Send reset email
      const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
      const mailOptions = {
        to: email,
        subject: "Password Reset Request",
        html: `<html>
        <body style="font-family: 'Poppins', sans-serif; background-color: #f8f8f8; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center; color: #5D1049;">Password Reset Request</h2>
                <p style="font-size: 1rem; color: #333;">Hello,</p>
                <p style="font-size: 1rem; color: #333;">We received a request to reset your password. Please click the button below to reset your password:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetLink}" style="background-color: #5D1049; color: #ffffff; text-decoration: none; padding: 10px 20px; font-size: 1rem; border-radius: 5px; display: inline-block; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">Reset Password</a>
                </div>
                <p style="font-size: 1rem; color: #333;">If you didn’t request a password reset, please ignore this email.</p>
                <p style="font-size: 1rem; color: #333;">Regards,<br>Your Team</p>
            </div>
        </body>
    </html>` // Password reset email HTML content
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) throw err;
        res.json({ message: "Password reset link sent to your email" });
      });
    });
  });
});


// GET Reset Password Form (Token-based route)
app.get("/reset-password/:token", (req, res) => {
  const { token } = req.params;

  // Check if token is valid
  db.query(
    "SELECT * FROM users WHERE verification_token = ?",
    [token],
    (err, results) => {
      if (err) throw err;

      if (results.length === 0)
        return res.status(400).send("Invalid or expired token");

      // Show reset password form with matching token
      res.send(`<html>
              <head>
                  <title>Reset Password</title>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          height: 100vh;
                          margin: 0;
                          background-color: #F4F1DE; /* Light Beige */
                      }
                      .container {
                          background: #fff;
                          padding: 30px;
                          border-radius: 8px;
                          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                          width: 300px;
                          text-align: center;
                      }
                      h2 {
                          color: #5D1049; /* Deep Purple */
                      }
                      input[type="password"] {
                          width: 100%;
                          padding: 10px;
                          margin: 10px 0;
                          border: 1px solid #ccc;
                          border-radius: 4px;
                          font-size: 14px;
                      }
                      button {
                          width: 100%;
                          padding: 10px;
                          background-color: #F4C542; /* Gold */
                          color: #5D1049; /* Deep Purple */
                          border: none;
                          border-radius: 4px;
                          font-size: 16px;
                          font-weight: bold;
                      }
                      button:hover {
                          background-color: #e0a800;
                      }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <h2>Reset Password</h2>
                      <form action="/reset-password/${token}" method="POST">
                          <input type="password" name="newPassword" placeholder="New Password" required>
                           <input type="password" name="confirmPassword" placeholder="Confirm Password" required>
                          <button type="submit">Reset Password</button>
                      </form>
                  </div>
              </body>
          </html>`);
    }
  );
});

// POST Reset Password Logic
app.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Validate token again before updating password
  db.query(
    "SELECT * FROM users WHERE verification_token = ?",
    [token],
    (err, results) => {
      if (err) throw err;

      if (results.length === 0)
        return res.status(400).send("Invalid or expired token");

      if (!newPassword) {
        return res.status(400).send("New password is required");
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10); // Encrypt the new password

      // Update password and remove token
      db.query(
        "UPDATE users SET password = ?, verification_token = NULL WHERE verification_token = ?",
        [hashedPassword, token],
        (err) => {
          if (err) throw err;

          // Password reset successful message
          res.send(`<html>
                  <head>
                      <title>Password Reset Successful</title>
                      <style>
                          body {
                              font-family: Arial, sans-serif;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              height: 100vh;
                              margin: 0;
                              background-color: #F4F1DE; /* Light Beige */
                          }
                          .container {
                              background: #fff;
                              padding: 30px;
                              border-radius: 8px;
                              box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                              width: 300px;
                              text-align: center;
                          }
                          h2 {
                              color: #5D1049; /* Deep Purple */
                          }
                          p {
                              color: #333;
                              font-size: 16px;
                          }
                          a {
                              display: inline-block;
                              margin-top: 20px;
                              padding: 10px 20px;
                              background-color: #F4C542; /* Gold */
                              color: #5D1049; /* Deep Purple */
                              text-decoration: none;
                              border-radius: 4px;
                              font-weight: bold;
                          }
                          a:hover {
                              background-color: #e0a800;
                          }
                      </style>
                  </head>
                  <body>
                      <div class="container">
                          <h2>Password Reset Successful</h2>
                          <p>You can now login with your new password.</p>
                          <a href="/signin">Go to Login</a>
                      </div>
                  </body>
              </html>`);
        }
      );
    }
  );
});


// ======================== Iets ENDPOINTS ========================

app.get("/api/study-guides", (req, res) => {
  const query = "SELECT * FROM study_guides";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch study guides." });
    res.json(results);
  });
});
// edit

app.get("/api/study-guides/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM study_guides WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch guide." });
    if (results.length === 0) return res.status(404).json({ error: "Guide not found." });
    res.json(results[0]);
  });
});

/* CREATE */
app.post('/api/study-guides', (req, res) => {
  const { title, description, icon, pdf_file } = req.body;
  const sql = 'INSERT INTO study_guides (title, description, icon, pdf_file) VALUES (?,?,?,?)';
  db.query(sql, [title, description, icon, pdf_file], (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert failed', err });
    res.json({ id: result.insertId, message: 'Created' });
  });
});

/* UPDATE */
app.put('/api/study-guides/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, icon, pdf_file } = req.body;
  const sql = 'UPDATE study_guides SET title=?, description=?, icon=?, pdf_file=? WHERE id=?';
  db.query(sql, [title, description, icon, pdf_file, id], (err) => {
    if (err) return res.status(500).json({ error: 'Update failed', err });
    res.json({ message: 'Updated' });
  });
});

/* DELETE */
app.delete('/api/study-guides/:id', (req, res) => {
  db.query('DELETE FROM study_guides WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Delete failed', err });
    res.json({ message: 'Deleted' });
  });
});

// Route: Download PDF
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "frontend", "pdfs", filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("File send error:", err);
      res.status(404).send("File not found.");
    }
  });
});


/* ======================================================
   REQUIRED DOCUMENTS  (table: required_documents)
   ====================================================== */


function query(sql, params = []) {
  return new Promise((res, rej) => {
    db.query(sql, params, (err, rows) => (err ? rej(err) : res(rows)));
  });
}


// GET all
app.get("/api/required-documents", async (_, res) => {
  const rows = await query("SELECT * FROM required_documents");
  // convert item1..4 → items[]
  rows.forEach(r => {
    r.items = [r.item1, r.item2, r.item3, r.item4].filter(Boolean);
  });
  res.json(rows);
});

// POST new
app.post("/api/required-documents", async (req, res) => {
  const { category, icon_class, items = [], portal_link } = req.body;
  const [i1,i2,i3,i4] = [...items, null, null, null, null]; // pad to 4
  await query(
    `INSERT INTO required_documents
     (category,icon_class,item1,item2,item3,item4,portal_link)
     VALUES (?,?,?,?,?,?,?)`,
    [category,icon_class,i1,i2,i3,i4,portal_link]
  );
  res.json({ message:"inserted" });
});

// PUT update
app.put("/api/required-documents/:id", async (req,res) => {
  const { category, icon_class, items = [], portal_link } = req.body;
  const [i1,i2,i3,i4] = [...items, null, null, null, null];
  await query(
    `UPDATE required_documents
     SET category=?, icon_class=?, item1=?, item2=?, item3=?, item4=?, portal_link=?
     WHERE id=?`,
    [category,icon_class,i1,i2,i3,i4,portal_link,req.params.id]
  );
  res.json({ message:"updated" });
});

// DELETE
app.delete("/api/required-documents/:id", async (req,res) => {
  await query("DELETE FROM required_documents WHERE id=?", [req.params.id]);
  res.json({ message:"deleted" });
});


/* ======================================================
   VISA APPOINTMENTS  (table: visa_appointments)
   ====================================================== */
app.get("/api/visa-appointments", async (_, res) => {
  res.json(await query("SELECT * FROM visa_appointments"));
});
app.post("/api/visa-appointments", async (req,res) => {
  const { country, icon_class, description, booking_link } = req.body;
  await query(
    `INSERT INTO visa_appointments (country,icon_class,description,booking_link)
     VALUES (?,?,?,?)`,
    [country,icon_class,description,booking_link]
  );
  res.json({ message:"inserted" });
});
app.put("/api/visa-appointments/:id", async (req,res) => {
  const { country, icon_class, description, booking_link } = req.body;
  await query(
    `UPDATE visa_appointments
     SET country=?,icon_class=?,description=?,booking_link=? WHERE id=?`,
    [country,icon_class,description,booking_link,req.params.id]
  );
  res.json({ message:"updated" });
});
app.delete("/api/visa-appointments/:id", async (req,res) => {
  await query("DELETE FROM visa_appointments WHERE id=?", [req.params.id]);
  res.json({ message:"deleted" });
});


/* ======================================================
   VIDEO TUTORIALS  (table: video_tutorials)
   ====================================================== */
app.get("/api/video-tutorials", async (_, res) => {
  res.json(await query("SELECT * FROM video_tutorials"));
});
app.post("/api/video-tutorials", async (req,res) => {
  const { video_id,title,description,duration,thumbnail } = req.body;
  await query(
    `INSERT INTO video_tutorials
     (video_id,title,description,duration,thumbnail)
     VALUES (?,?,?,?,?)`,
    [video_id,title,description,duration,thumbnail]
  );
  res.json({ message:"inserted" });
});
app.put("/api/video-tutorials/:id", async (req,res) => {
  const { video_id,title,description,duration,thumbnail } = req.body;
  await query(
    `UPDATE video_tutorials
     SET video_id=?,title=?,description=?,duration=?,thumbnail=? WHERE id=?`,
    [video_id,title,description,duration,thumbnail,req.params.id]
  );
  res.json({ message:"updated" });
});
app.delete("/api/video-tutorials/:id", async (req,res) => {
  await query("DELETE FROM video_tutorials WHERE id=?", [req.params.id]);
  res.json({ message:"deleted" });
});

//============Testimonial=====================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image' && req.path === '/submit') {
      // Sirf testimonial images backend root folder me save hongi
      cb(null, __dirname);  // backend file ke folder me
    } else if (file.fieldname === 'university_image') {
      cb(null, path.join(__dirname, 'uploads/universities'));
    } else if (file.fieldname === 'image') {
      cb(null, path.join(__dirname, 'uploads/accommodations'));
    } else {
      cb(null, path.join(__dirname, 'uploads/misc'));
    }
  },
  filename: (req, file, cb) => {
    const prefix = (file.fieldname === 'image' && req.path === '/submit') ? 'testimonial_' :
                   file.fieldname === 'university_image' ? 'uni_' : 'acc_';
    cb(null, prefix + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Static serve sirf testimonial images ke liye backend root folder se
app.use('/testimonial_images', express.static(__dirname));

// Testimonial save route
app.post('/submit', upload.single('image'), (req, res) => {
  const { name, quote, rating } = req.body;
  const image = req.file ? req.file.filename : null;

  const sql = "INSERT INTO testimonials (name, quote, rating, image) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, quote, rating, image], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });

    res.json({
  id: result.insertId,
  name,
  quote,
  rating,
  imageUrl: image ? `/testimonial_images/${image}` : null
});
  });
});

// Get all testimonials route
app.get('/testimonials', (req, res) => {
  db.query("SELECT * FROM testimonials ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });

    const testimonialsWithUrls = results.map(t => ({
      ...t,
      imageUrl: t.image ? `/testimonial_images/${t.image}` : null
    }));

    res.json(testimonialsWithUrls);
  });
});



// ======================== Save CV Data Endpoint ========================

app.post("/cv-data", (req, res) => {
  const {
    fullName,
    title,
    email,
    phone,
    about,
    photo,
    experiences,
    education,
    skills,
  } = req.body;

  // Validate required fields
  if (
    !fullName ||
    !title ||
    !email ||
    !phone ||
    !about ||
    !photo ||
    !experiences ||
    !education ||
    !skills
  ) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Insert data into cv_data table
  const query = `
    INSERT INTO cv_data (full_name, title, email, phone, about, photo, experiences, education, skills)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      fullName,
      title,
      email,
      phone,
      about,
      photo,
      JSON.stringify(experiences), // Convert to JSON string for DB
      JSON.stringify(education),
      JSON.stringify(skills),
    ],
    (err, result) => {
      if (err) {
        console.error("Error saving data:", err);
        return res.status(500).json({ error: "Error saving data to the database" });
      }
      res.status(200).json({ id: result.insertId, message: "Data saved successfully" });
    }
  );
});

// Get CV Data by ID
app.get("/fetch-data/:id", (req, res) => {
  const userId = req.params.id;

  // Fetch user CV data by ID
  const query = `SELECT * FROM cv_data WHERE id = ?`;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      if (result.length > 0) {
        res.status(200).json(result[0]); // Return the first match
      } else {
        res.status(404).json({ error: "User not found" });
      }
    }
  });
});



// ======================== Admin Panel Routes ========================

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching users from the database' });
    }
    res.json(results);
  });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user from the database' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results[0]);
  });
});

// Create a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  // Simple validation
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const query = 'INSERT INTO users (name, email, password, is_verified) VALUES (?, ?, ?, false)';
  db.query(query, [name, email, ''], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating user' });
    }
    res.status(201).json({
      user_id: result.insertId, // Return the newly created user ID
      name,
      email
    });
  });
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const { name, email } = req.body;
  const userId = req.params.id;

  const query = 'UPDATE users SET name = ?, email = ? WHERE user_id = ?';
  db.query(query, [name, email, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating user' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM users WHERE user_id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting user' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});


const router = express.Router();

// Delete a scholarship by ID
router.delete('/scholarshipsapi/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM scholarships WHERE scholarship_id = ?';
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    res.status(200).json({ message: 'Scholarship deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting scholarship' });
  }
});


// Get application data 
app.get('/applications', (req, res) => {
  const query = 'SELECT * FROM applications ORDER BY id DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching applications:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.json(results);
  });
});



//========================= Accommodations API ========================

function genHtmlFromTemplate(tplPath, dataObj, outPath) {
  let html = fs.readFileSync(tplPath, 'utf8');
  Object.entries(dataObj).forEach(([k, v]) => {
    html = html.replaceAll(`{{${k}}}`, v ?? '');
  });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
}

/* -------------  GET – list ------------- */
app.get('/api/accommodations', (req, res) => {
  const q = `
    SELECT accommodation_id, name, location, price_weekly, price_monthly,
           available, city, rating, type, image, details_url, bookingUrl
    FROM accommodations
    ORDER BY accommodation_id ASC`;
  db.query(q, (e, rows) =>
    e ? res.status(500).json({ error: e.message }) : res.json(rows));
});


/* -------------  POST – add ------------- */
app.post('/api/accommodations', upload.single('image'), (req, res) => {
  const {
    accommodation_id,
    name, location, price_weekly, price_monthly,
    available, city, rating = null, type = null
  } = req.body;

  /* ✅ string "true"/"false" ko 1 / 0 me badlo */
  const availableNum = (available === 'true' || available === true) ? 1 : 0;

  const imagePath = req.file ? '/uploads/accommodations/' + req.file.filename : null;

  const sql = accommodation_id
    ? `INSERT INTO accommodations
         (accommodation_id,name,location,price_weekly,price_monthly,
          available,city,rating,type,image,details_url)
       VALUES (?,?,?,?,?,?,?,?,?,?,NULL)`
    : `INSERT INTO accommodations
         (name,location,price_weekly,price_monthly,
          available,city,rating,type,image,details_url)
       VALUES (?,?,?,?,?,?,?,?,?,NULL)`;

  const params = accommodation_id
    ? [accommodation_id,name,location,price_weekly,price_monthly,availableNum,
       city,rating,type,imagePath]
    : [name,location,price_weekly,price_monthly,availableNum,
       city,rating,type,imagePath];

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message:'DB insert failed', err });

    const accId = accommodation_id || result.insertId;

    /* static page + details_url same as pehle */
    const tpl   = path.join(__dirname,'templates/accommodation_template.html');
    const page  = `${accId}.html`;
    const out   = path.join(__dirname,'public/accommodations/details',page);
    const url   = `/accommodations/details/${page}`;

    genHtmlFromTemplate(tpl,{ name,location,price_weekly,price_monthly,
                              available:availableNum,city,rating,type,image:imagePath },out);

    db.query('UPDATE accommodations SET details_url=? WHERE accommodation_id=?',
             [url,accId], () => res.json({ message:'added', details_url:url }));
  });
});


/* -------------  GET single ------------- */
app.get('/api/accommodations/:id', (req, res) => {
  db.query(
    `SELECT * FROM accommodations WHERE accommodation_id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err)    return res.status(500).json({ message: 'DB error' });
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      res.json(rows[0]);
    });
});

/* -------------  PUT – update (page regen) ------------- */
app.put('/api/accommodations/:id', upload.single('image'), (req,res)=>{
  const { name,location,price_weekly,price_monthly,
          available,city,rating=null,type=null } = req.body;

  const availableNum = (available === 'true' || available === true) ? 1 : 0;
  const imagePath    = req.file ? '/uploads/accommodations/' + req.file.filename : null;

  let sql = `UPDATE accommodations SET
               name=?,location=?,price_weekly=?,price_monthly=?,
               available=?,city=?,rating=?,type=?`;
  const params = [name,location,price_weekly,price_monthly,
                  availableNum,city,rating,type];

  if (imagePath) { sql += ', image=?'; params.push(imagePath); }

  sql += ' WHERE accommodation_id=?'; params.push(req.params.id);

  db.query(sql,params,(err,r)=>{
    if (err) return res.status(500).json({message:'DB update failed'});
    if (!r.affectedRows) return res.status(404).json({message:'Not found'});

    /* page re-generate */
    const tpl  = path.join(__dirname,'templates/accommodation_template.html');
    const page = `${req.params.id}.html`;
    const out  = path.join(__dirname,'public/accommodations/details',page);
    genHtmlFromTemplate(tpl,{ name,location,price_weekly,price_monthly,
                              available:availableNum,city,rating,type,
                              image:imagePath || '' },out);
    res.json({message:'updated'});
  });
});


/* -------------  DELETE ------------- */
app.delete('/api/accommodations/:id', (req, res) => {
  db.query('DELETE FROM accommodations WHERE accommodation_id=?',
    [req.params.id],
    (err, r) => {
      if (err)  return res.status(500).json({ message: 'DB delete failed' });
      if (!r.affectedRows) return res.status(404).json({ message: 'Not found' });

      /* also remove static page (optional) */
      const file = path.join(__dirname, 'public/accommodations/details', `${req.params.id}.html`);
      if (fs.existsSync(file)) fs.unlinkSync(file);

      res.json({ message: 'deleted' });
    });
});


// ======================== Universities API ========================

// Get Universities Data
app.get("/universitiesapi", (req, res) => {
  const query = `
    SELECT 
      universities.university_id, 
      universities.image, 
      universities.name AS university_name, 
      country.name AS country_name, 
      universities.programs, 
      universities.program, 
      universities.degree,
      universities.details_link   -- ✅ Link bhi include kar diya
    FROM universities 
    JOIN country ON universities.country_id = country.country_id
    ORDER BY 
      CASE 
        WHEN university_id IN (3, 4) THEN 0
        WHEN university_id >= 16 THEN 1
        WHEN university_id IN (11, 12, 14) THEN 2
        ELSE 3
      END,
      university_id ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from database:", err);
      res.status(500).send("Error fetching data from database");
      return;
    }

    // Convert programs from comma string to array
    const formattedResults = results.map((uni) => ({
      ...uni,
      programs: uni.programs ? uni.programs.split(",") : [],
    }));

    res.json(formattedResults);
  });
});



app.get('/universitiesapi/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    'SELECT * FROM universities WHERE university_id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Error fetching universities:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Universities not found' });
      }

      res.json(results[0]);
    }
  );
});



// API endpoint to delete a university
app.delete("/universitiesapi/:id", (req, res) => {
  const universityId = req.params.id;

  const query = `DELETE FROM universities WHERE university_id = ?`;

  db.query(query, [universityId], (err, result) => {
    if (err) {
      console.error("Error deleting university:", err);
      res.status(500).json({ message: 'Error deleting university' });
      return;
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'University not found' });
    }

    res.status(200).json({ message: 'University deleted successfully' });
  });
});

app.post('/universitiesapi', (req, res) => {
  const {
    university_id,
    university_name,
    country_id,
    programs,
    degree,
    image,
    website
  } = req.body;

  

  if (!university_id || !university_name || !country_id || !programs || !degree || !image || !website) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let programsString = '';
  if (Array.isArray(programs)) {
    programsString = programs.join(',').trim();
  } else if (typeof programs === 'string') {
    programsString = programs.trim();
  } else {
    return res.status(400).json({ message: 'Invalid programs format' });
  }

  const query = `
    INSERT INTO universities (university_id, name, country_id, programs, degree, image, website)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [university_id, university_name, country_id, programsString, degree, image, website];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding university:', err);
      return res.status(500).json({ message: 'Error adding university' });
    }

    res.status(201).json({ message: 'University added successfully' });
  });
});


app.put('/universitiesapi/:id', (req, res) => {
  const universityId = req.params.id;
  const {
    university_name,
    country_id,
    programs,
    degree,
    image,
    website
  } = req.body;



  // Validation
  if (!university_name || !country_id || !programs || !degree || !image || !website) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Programs formatting
  let programsString = '';
  if (Array.isArray(programs)) {
    programsString = programs.join(',').trim();
  } else if (typeof programs === 'string') {
    programsString = programs.trim();
  } else {
    return res.status(400).json({ message: 'Invalid programs format' });
  }

  // Correct UPDATE query
  const query = `
    UPDATE universities
    SET name = ?, country_id = ?, programs = ?, degree = ?, image = ?, website = ?
    WHERE university_id = ?
  `;

  const values = [university_name, country_id, programsString, degree, image, website, universityId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating university:', err);
      return res.status(500).json({ message: 'Error updating university' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'University not found' });
    }

    res.status(200).json({ message: 'University updated successfully' });
  });
});




//===================== University Details =====================


const uploadDir = path.join(__dirname, 'uploads/universities');
fs.mkdirSync(uploadDir, { recursive:true });
app.use('/uploads/universities', express.static(uploadDir));


/* ===== helper ===== */
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );
}

/* =====================================================
   ROUTES
   ===================================================== */

   function generateHTMLPageFromTemplate(templatePath, dataObj, outputPath) {
  let html = fs.readFileSync(templatePath, 'utf8');
  for (const key in dataObj) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), dataObj[key] || '');
  }
  fs.writeFileSync(outputPath, html, 'utf8');
}


/* ---------- GET list (unchanged) ---------- */
app.get('/api/details', async (_, res) => {
  const rows = await runQuery(`
    SELECT ud.detail_id, ud.university_id, ud.country_id, ud.world_ranking,
           ud.top_programs, ud.application_deadlines,
           ud.undergraduate_application_link, ud.masters_application_link,
           ud.guidance,
           u.name   AS university_name,  c.name AS country_name,
           u.programs, u.degree, u.image AS university_image, u.details_link
    FROM university_details ud
    JOIN universities u ON ud.university_id = u.university_id
    JOIN country      c ON ud.country_id     = c.country_id
    ORDER BY ud.detail_id ASC`);
  res.json(rows);
});

/* ---------- GET single (unchanged except programs stay comma string) ---------- */
app.get('/api/details/:id', async (req, res) => {
  const [row] = await runQuery(`
    SELECT ud.*, u.name AS university_name, c.name AS country_name,
           u.programs, u.degree, u.image AS university_image, u.details_link
    FROM university_details ud
    JOIN universities u ON ud.university_id = u.university_id
    JOIN country      c ON ud.country_id     = c.country_id
    WHERE ud.university_id = ?`, [req.params.id]);

  if (!row) return res.status(404).json({ message: 'Not found' });
  res.json(row);
});

/* ---------- ADD / EDIT helper ---------- */
async function saveUniversity(req, res, isNew) {
  const b = req.body;
  const imagePath =
    req.file ? `/uploads/universities/${req.file.filename}` : b.university_image || null;

  const uniParams = [
    b.university_id, b.country_id, b.university_name, b.degree,
    b.programs, imagePath, b.website || null            // 7 params
  ];

  const detParams = [
    b.university_id, b.country_id, b.world_ranking || null, b.top_programs || null,
    b.application_deadlines || null, b.undergraduate_application_link || null,
    b.masters_application_link  || null, b.guidance || null
  ];

  try {
    await runQuery('START TRANSACTION');

    /* universities upsert */
    await runQuery(`
      INSERT INTO universities
        (university_id,country_id,name,degree,programs,image,website)
      VALUES (?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        country_id=VALUES(country_id), name=VALUES(name), degree=VALUES(degree),
        programs=VALUES(programs), image=VALUES(image), website=VALUES(website)
    `, uniParams);

    /* details upsert */
    await runQuery(`
      INSERT INTO university_details
        (university_id,country_id,world_ranking,top_programs,
         application_deadlines,undergraduate_application_link,
         masters_application_link,guidance)
      VALUES (?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        country_id=VALUES(country_id), world_ranking=VALUES(world_ranking),
        top_programs=VALUES(top_programs), application_deadlines=VALUES(application_deadlines),
        undergraduate_application_link=VALUES(undergraduate_application_link),
        masters_application_link=VALUES(masters_application_link), guidance=VALUES(guidance)
    `, detParams);

    /* ---------- AUTO-GENERATE DETAIL PAGE ---------- */
    const templatePath = path.join(__dirname, 'templates/university_template.html');
    const outputDir    = path.join(__dirname, 'public/universities/details');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const pageName = `${b.university_id}.html`;
    const outputPath = path.join(outputDir, pageName);
    const pageURL    = `/universities/details/${pageName}`;

    /* country name chahiye toh ek quick query */
    const [{ name: country_name = '' }] =
      await runQuery('SELECT name FROM country WHERE country_id = ?', [b.country_id]);

    generateHTMLPageFromTemplate(templatePath, {
  university_name: b.university_name,
  country_name,
  programs: b.programs,
  top_programs: b.top_programs,
  world_ranking: b.world_ranking,
  application_deadlines: b.application_deadlines,
  undergraduate_application_link: b.undergraduate_application_link,
  masters_application_link: b.masters_application_link,
  university_image: imagePath, // ✅ Add this line
  guidance: b.guidance || ''
}, outputPath);

    /* link save karo */
    await runQuery(
      'UPDATE universities SET details_link = ? WHERE university_id = ?',
      [pageURL, b.university_id]
    );

    await runQuery('COMMIT');
    res.json({ message: isNew ? 'added' : 'updated', details_link: pageURL });
  } catch (e) {
    await runQuery('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'DB fail', details: e.message });
  }
}


/* ---------- ADD & EDIT endpoints ---------- */
app.post('/api/details', upload.single('university_image'),
  (req, res) => saveUniversity(req, res, true));

app.put('/api/details/:id', upload.single('university_image'),
  (req, res) => {
    req.body.university_id = Number(req.params.id);
    saveUniversity(req, res, false);
  });

/* ---------- DELETE (unchanged) ---------- */
app.delete('/api/details/:id', async (req, res) => {
  try {
    await runQuery('START TRANSACTION');
    await runQuery('DELETE FROM university_details WHERE university_id = ?', [req.params.id]);
    await runQuery('DELETE FROM universities       WHERE university_id = ?', [req.params.id]);
    await runQuery('COMMIT');
    res.json({ message: 'deleted' });
  } catch (e) {
    await runQuery('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'DB error' });
  }
});



//=========================Scxholarships=========================

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );
}
function generateHTMLPageFromTemplate(templatePath, dataObj, outputPath) {
  let html = fs.readFileSync(templatePath, 'utf8');
  Object.entries(dataObj).forEach(([key, val]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(regex, val ?? '');
  });
  fs.writeFileSync(outputPath, html, 'utf8');
}

// Get Scholarships Data
app.get("/scholarshipsapi", (req, res) => {
  const query = `
    SELECT scholarship_id, title, degrees, DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline, DATE_FORMAT(deadlineSecond, '%Y-%m-%d') AS deadlineSecond, amount, type,apply_link,
    country.name AS country_name, universities.name AS university_name 
    FROM scholarships 
    JOIN country ON scholarships.country_id = country.country_id 
    JOIN universities ON scholarships.university_id = universities.university_id
    ORDER BY scholarship_id ASC`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching scholarship data from database:", err);
      res.status(500).send("Error fetching scholarship data from database");
      return;
    }

    // Format degrees into array
    const formattedResults = results.map((scholarship) => ({
      ...scholarship,
      degrees: scholarship.degrees ? scholarship.degrees.split(",") : [],
    }));

    res.json(formattedResults);
  });
});

app.get('/scholarshipsapi/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    'SELECT * FROM scholarships WHERE scholarship_id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Error fetching scholarships:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Scholarships not found' });
      }

      res.json(results[0]);
    }
  );
});



app.post('/scholarshipsapi', async (req, res) => {
  const {
    scholarship_id, title, university_id,
    degrees = [], deadline, deadlineSecond,
    amount, country_id, type
  } = req.body;

  try {
    await runQuery('START TRANSACTION');

    /* ---------- main insert ---------- */
    await runQuery(`
      INSERT INTO scholarships
        (scholarship_id,title,university_id,degrees,deadline,deadlineSecond,amount,country_id,type)
      VALUES (?,?,?,?,?,?,?, ?,?)
    `, [
      scholarship_id, title, university_id,
      Array.isArray(degrees) ? degrees.join(',') : degrees,
      deadline, deadlineSecond, amount, country_id, type
    ]);

    /* ---------- build / write detail page ---------- */
    const templatePath = path.join(__dirname, 'templates/scholarship_template.html');
    const outDir       = path.join(__dirname, 'public/scholarships/details');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const fileName = `${scholarship_id}.html`;
    const outPath  = path.join(outDir, fileName);
    const pageURL  = `/scholarships/details/${fileName}`;

    /* university & country lookup */
    const [{ name: university_name = '' }] =
      await runQuery('SELECT name FROM universities WHERE university_id=?', [university_id]);
    const [{ name: country_name = '' }] =
      await runQuery('SELECT name FROM country WHERE country_id=?',     [country_id]);

    generateHTMLPageFromTemplate(templatePath, {
      title,
      university_name,
      country_name,
      degrees,
      deadline,
      amount,
      type
    }, outPath);

    /* URL ko table me store karo */
    await runQuery('UPDATE scholarships SET apply_link=? WHERE scholarship_id=?',
                   [pageURL, scholarship_id]);

    await runQuery('COMMIT');
    res.json({ message: 'Scholarship added', apply_link: pageURL });
  } catch (e) {
    await runQuery('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'DB error', details: e.message });
  }
});



// Update Scholarship 
app.put('/scholarshipsapi/:id', async (req, res) => {
  const id = req.params.id;
  const {
    title, university_id,
    degrees = [], deadline, deadlineSecond,
    amount, country_id, type
  } = req.body;

  try {
    await runQuery('START TRANSACTION');

    /* update row */
    await runQuery(`
      UPDATE scholarships
      SET title=?, university_id=?, degrees=?, deadline=?, deadlineSecond=?,
          amount=?, country_id=?, type=?
      WHERE scholarship_id=?
    `, [
      title, university_id,
      Array.isArray(degrees) ? degrees.join(',') : degrees,
      deadline, deadlineSecond,
      amount, country_id, type, id
    ]);

    /* regenerate detail page (same logic as POST) */
    const templatePath = path.join(__dirname, 'templates/scholarship_template.html');
    const outDir = path.join(__dirname, 'public/scholarships/details');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const fileName = `${id}.html`;
    const outPath  = path.join(outDir, fileName);
    const pageURL  = `/scholarships/details/${fileName}`;

    const [{ name: university_name = '' }] =
      await runQuery('SELECT name FROM universities WHERE university_id=?', [university_id]);
    const [{ name: country_name = '' }] =
      await runQuery('SELECT name FROM country WHERE country_id=?', [country_id]);

    generateHTMLPageFromTemplate(templatePath, {
      title,
      university_name,
      country_name,
      degrees,
      deadline,
      amount,
      type
    }, outPath);

    await runQuery('UPDATE scholarships SET apply_link=? WHERE scholarship_id=?',
                   [pageURL, id]);

    await runQuery('COMMIT');
    res.json({ message: 'Scholarship updated', apply_link: pageURL });
  } catch (e) {
    await runQuery('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'DB error', details: e.message });
  }
});

// Delete Scholarship (DELETE)
app.delete("/scholarshipsapi/:id", (req, res) => {
  const scholarshipId = req.params.id;

  const query = "DELETE FROM scholarships WHERE scholarship_id = ?";
  db.query(query, [scholarshipId], (err, result) => {
    if (err) {
      console.error("Error deleting scholarship:", err);
      return res.status(500).send("Error deleting scholarship");
    }
    res.status(200).json({ message: "Scholarship deleted successfully" });
  });
});




//=====================applications=======================
app.post('/api/apply', async (req, res) => {
  const { name, email, university_name, program_type } = req.body;

  if (!name || !email || !university_name) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const sql = `
    INSERT INTO applications (name, email, university_name, program_type, applied_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  try {
    await query(sql, [name, email, university_name, program_type]);
    res.json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Database insert error:", error);
    res.status(500).json({ message: "Failed to submit application." });
  }
});



//========================visa details======================

app.get('/api/visa-details', async (req, res) => {
  try {
    // Query the database and return the results directly
    db.query('SELECT * FROM visa_details', (err, results) => {
      if (err) {
        console.error('Error fetching visa details:', err);
        return res.status(500).json({ message: 'Error fetching visa details' });
      }
      res.json(results);  // Return the fetched data as JSON
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Start the Express server
app.listen(port, () => {
  console.log(`📡 Server running on port ${port}`);
});
