const isEmpty = (value) => value === undefined || value === null || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;

// "use strict";

// const User = require("../../models/user");

// exports.verifyEmail = async (req, res) => {
//   const { key } = req.params;

//   try {
//     const user = await User.query().patch({ verified: 1 }).where("key", key);

//     res.status(200).json({ status: "success", message: "Email verified" });
//   } catch (verifyEmailError) {
//     console.log("Error verifying email", verifyEmailError);

//     res.json({ status: "failed", message: verifyEmailError.message });
//   }
// };
