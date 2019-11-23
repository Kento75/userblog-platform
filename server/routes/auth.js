const express = require("express");
const router = express.Router();
const {
    signup,
    signin,
    signout,
    requireSiginin
} = require("../controllers/auth.js");

// validator middleware
const {
    runValidation
} = require("../validators");
// auth validator
const {
    userSignupValidator,
    userSigninValidator
} = require("../validators/auth.js");


router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/signout", signout);

//test
// router.get("/secret", requireSiginin, (req, res) => {
//     res.json({
//         user: req.user
//     });
// });

module.exports = router;