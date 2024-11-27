const User = require("../models/user_model");
const Contact = require("../models/userContacts_model");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/nodemailer.js");

const handleUserSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!name || !email || !password) {
      return res.json({ msg: "all fields are required" });
    }
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    if (user) {
      const { _id, name } = user;
      const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.json({ msg: "Succesfully Signed Up", token: token });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ msg: "all fields are required" });
    }
    const user = await User.findOne({
      email: email,
    });
    const { _id, name } = user;
    if (user) {
      const validated = await bcrypt.compare(password, user.password);
      if (validated) {
        const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        return res.json({ msg: "successfully login", token: token });
      } else {
        return res.json({ msg: "email or password is incorrect" });
      }
    } else {
      return res.json({ msg: "email or password is incorrect" });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

const handleAddContact = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const { _id } = verify;

  const user = await Contact.find({ userId: _id });

  if (user.length !== 0) {
    const { contactInfo } = req.body;

    const userContact = await Contact.findOneAndUpdate(
      { userId: _id },
      { $push: { contactInfo: contactInfo } },
      { new: true } // Return the updated document
    );
    return res.json({ msg: "CONGRATS! USER FOUND", data: userContact });
  } else {
    const { contactInfo } = req.body;

    const userContact = await Contact.create({
      userId: _id,
      contactInfo: contactInfo,
    });

    return res.json({ msg: "Success", data: userContact });
  }
};

const handleEditProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const { _id } = verify;

  const { dateOfBirth, profession, socialMedia, name } = req.body;
  const profilePicLocalPath = req.files?.profilePic[0]?.path;
  console.log(profilePicLocalPath);
  const profilePic = await uploadOnCloudinary(profilePicLocalPath);

  const user = await User.findByIdAndUpdate(
    { _id: _id },
    {
      dateOfBirth: dateOfBirth,
      profession: profession,
      socialMedia: socialMedia,
      profilePic: profilePic.url,
      name: name,
    },
    { new: true }
  );

  res.json({ data: user });
};

const handleEditContacts = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const { _id } = verify;
  console.log(req.body);
  try {
    // Find the user by userId and update the specific contactInfo by _id
    const result = await Contact.findOneAndUpdate(
      { userId: _id, "contactInfo._id": req.body.ContactID }, // Find the user and the specific contactInfo by _id
      {
        $set: {
          "contactInfo.$.category": req.body.category, // Update category
          "contactInfo.$.email": req.body.email, // Update name
          "contactInfo.$.contactNumber": req.body.contactNumber, // Update contactNumber
          "contactInfo.$.recurring.recurringTime": req.body.recurring, // Update contactNumber
        },
      },
      { new: true } // Return the updated document
    );

    if (!result) {
      throw new Error("User or Contact Info not found");
    }

    res.status(200).json({ message: "Successful" });
  } catch (error) {
    console.error("Error updating contact info:", error.message);
    res.status(404).json({ message: "Failed" });
  }
};

const handleViewProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const { _id } = verify;

  const user = await User.findById({
    _id: _id,
  });

  res.json({ data: user });
};

const handleFilterContact = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const { inputDate } = req.body;

    const contacts = await Contact.find({ userId: _id });
    const { contactInfo } = contacts[0];

    // One Month
    // urgent today
    const data = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 1) {
        const { date } = recurring;
        let addThirtyDays = new Date(date);
        addThirtyDays.setTime(
          addThirtyDays.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        let newDate = addThirtyDays.toISOString().split("T")[0];

        if (inputDate === newDate) {
          return contact;
        }
      }
    });

    // upcoming
    const data2 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 1) {
        const { date } = recurring;
        let addThirtyDays = new Date(date);
        addThirtyDays.setTime(
          addThirtyDays.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        let newDate = addThirtyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds < newDateInMilliseconds) {
          return contact;
        }
      }
    });

    // over due
    const data3 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 1) {
        const { date } = recurring;
        let addThirtyDays = new Date(date);
        addThirtyDays.setTime(
          addThirtyDays.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        let newDate = addThirtyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds > newDateInMilliseconds) {
          return contact;
        }
      }
    });

    const todayData = data.filter((item) => item != null);
    const upcomingData = data2.filter((item) => item != null);
    const overDueData = data3.filter((item) => item != null);

    // Two Month
    // Urgent Today
    const data4 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 2) {
        const { date } = recurring;
        let addSixtyDays = new Date(date);
        addSixtyDays.setTime(addSixtyDays.getTime() + 60 * 24 * 60 * 60 * 1000);

        let newDate = addSixtyDays.toISOString().split("T")[0];

        if (inputDate === newDate) {
          return contact;
        }
      }
    });

    // upcoming
    const data5 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 2) {
        const { date } = recurring;
        let addSixtyDays = new Date(date);
        addSixtyDays.setTime(addSixtyDays.getTime() + 60 * 24 * 60 * 60 * 1000);

        let newDate = addSixtyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds < newDateInMilliseconds) {
          return contact;
        }
      }
    });

    // over due
    const data6 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 2) {
        const { date } = recurring;
        let addSixtyDays = new Date(date);
        addSixtyDays.setTime(addSixtyDays.getTime() + 60 * 24 * 60 * 60 * 1000);

        let newDate = addSixtyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds > newDateInMilliseconds) {
          return contact;
        }
      }
    });

    const twoMonthTodayData = data4.filter((item) => item != null);
    const twoMonthUpcomingData = data5.filter((item) => item != null);
    const twoMonthOverDueData = data6.filter((item) => item != null);

    // Three Month
    // Urgent Today
    const data7 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 3) {
        const { date } = recurring;
        let addNinetyDays = new Date(date);
        addNinetyDays.setTime(
          addNinetyDays.getTime() + 90 * 24 * 60 * 60 * 1000
        );

        let newDate = addNinetyDays.toISOString().split("T")[0];

        if (inputDate === newDate) {
          return contact;
        }
      }
    });

    // upcoming
    const data8 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 3) {
        const { date } = recurring;
        let addNinetyDays = new Date(date);
        addNinetyDays.setTime(
          addNinetyDays.getTime() + 90 * 24 * 60 * 60 * 1000
        );

        let newDate = addNinetyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds < newDateInMilliseconds) {
          return contact;
        }
      }
    });

    // over due
    const data9 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 3) {
        const { date } = recurring;
        let addNinetyDays = new Date(date);
        addNinetyDays.setTime(
          addNinetyDays.getTime() + 90 * 24 * 60 * 60 * 1000
        );

        let newDate = addNinetyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds > newDateInMilliseconds) {
          return contact;
        }
      }
    });

    const threeMonthTodayData = data7.filter((item) => item != null);
    const threeMonthUpcomingData = data8.filter((item) => item != null);
    const threeMonthOverDueData = data9.filter((item) => item != null);

    return res.json({
      OneMonth: {
        "Urgent Today": todayData,
        "Upcoming data": upcomingData,
        "Over Due": overDueData,
      },
      TwoMonth: {
        "Urgent Today": twoMonthTodayData,
        "Upcoming data": twoMonthUpcomingData,
        "Over Due": twoMonthOverDueData,
      },
      ThreeMonth: {
        "Urgent Today": threeMonthTodayData,
        "Upcoming data": threeMonthUpcomingData,
        "Over Due": threeMonthOverDueData,
      },
    });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const user = await Contact.find({ userId: _id });
    const { contactInfo } = user[0];

    res.json(contactInfo);
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const handleMarkAsDone = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const { id } = req.params;
    const inputDate = Date.now();

    const result = await Contact.updateOne(
      { userId: _id, "contactInfo._id": id },
      {
        $set: { "contactInfo.$.recurring.date": inputDate },
        $push: { "contactInfo.$.lastContacted": inputDate },
      }
    );

    res.json(await levelIncrease(_id)); // Await the promise to log the resolved value
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const handleExtendDate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const { inputDate } = req.body;
    const { id } = req.params;

    const result = await Contact.updateOne(
      { userId: _id, "contactInfo._id": id },
      {
        $set: { "contactInfo.$.recurring.date": inputDate },
      }
    );

    res.json({ msg: "success" });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const sendSupportEmail = async (req, res) => {
  try {
    const message = req.body;
    sendMail("Reminder App Support Mail", message.message);
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;
    const { inputId } = req.body;

    const user = await Contact.findOne({ userId: _id });
    if (!user) {
      return res.json({ status: "failed", msg: "User not found" });
    }

    const { contactInfo } = user;

    // Check if contact exists
    const contactExists = contactInfo.some(
      (item) => item._id.toString() === inputId
    );

    if (contactExists) {
      await Contact.updateOne(
        { userId: _id },
        { $pull: { contactInfo: { _id: inputId } } }
      );
      return res.json({ status: "success", msg: "deleted successfully" });
    } else {
      return res.json({ status: "failed", msg: "Contact not found" });
    }
  } catch (error) {
    return res.json({ status: "failed", msg: error.message });
  }
};

const changePassword = async (req, res) => {
  console.log(req.body);
  try {
    // 1. Extract the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    // 4. Extract passwords from request body
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required" });
    }

    // 5. Fetch the user from the database
    const user = await User.findOne({ _id: _id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // 6. Compare the old password with the stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password); // Adjust the field name as needed

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // 7. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 8. Update the user's password in the database
    user.password = hashedPassword; // Adjust the field name as needed
    await user.save();

    // 9. Respond with success message
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const levelIncrease = async (_id) => {
  console.log(_id);
  try {
    const userContact = await User.findOneAndUpdate(
      { _id: _id }, // Find the user by userId
      { $inc: { unburnedLog: 1 } }, // Increment unburnedLog by 1
      { new: true } // Return the updated document
    );

    if (userContact) {
      console.log("Updated User:", userContact);
      return { success: true, user: userContact };
    } else {
      console.log("User not found.");
      return { success: false, msg: "User not found." };
    }
  } catch (error) {
    console.error("Error updating user:", error.message);
    return { success: false, msg: error.message };
  }
};

const burnedLogDone = async (req, res) => {
  try {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, msg: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    // Perform aggregation pipeline update
    const userContact = await User.findOneAndUpdate(
      { _id: _id }, // Find user by ID
      [
        {
          $set: {
            burnedLog: {
              $cond: {
                if: {
                  $and: [
                    { $lt: ["$burnedLog", 7] },
                    { $gt: ["$unburnedLog", 0] },
                  ],
                },
                then: { $add: ["$burnedLog", 1] },
                else: {
                  $cond: {
                    if: { $eq: ["$burnedLog", 7] },
                    then: 0, // Set burnedLog to 0 when unburnedLog is 8
                    else: "$burnedLog",
                  },
                },
              },
            },
            unburnedLog: {
              $cond: {
                if: {
                  $and: [
                    { $lt: ["$burnedLog", 8] },
                    { $gt: ["$unburnedLog", 0] },
                  ],
                },
                then: { $subtract: ["$unburnedLog", 1] },
                else: "$unburnedLog",
              },
            },

            level: {
              $cond: {
                if: { $eq: ["$burnedLog", 7] },
                then: { $add: ["$level", 1] },
                else: "$level",
              },
            },
          },
        },
      ],
      { new: true } // Return the updated document
    );

    // Handle response
    if (userContact) {
      res.status(200).json({
        success: true,
        msg: "User updated successfully",
        user: userContact,
      });
    } else {
      console.log("User not found.");
      res.status(404).json({ success: false, msg: "User not found." });
    }
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  handleUserSignUp,
  handleUserLogin,
  handleAddContact,
  handleEditProfile,
  handleViewProfile,
  handleFilterContact,
  handleMarkAsDone,
  handleExtendDate,
  getAllContacts,
  sendSupportEmail,
  deleteContact,
  changePassword,
  handleEditContacts,
  burnedLogDone,
};
