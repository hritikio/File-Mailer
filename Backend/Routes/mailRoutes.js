const express = require("express");
const upload = require("../Middleware/fileupload");
const SendEmail = require("../Services/mailServices");
const log = require("../Models/log");
const authMiddleware = require("../Middleware/authMiddleware");
const router = express.Router();

router.post(
  "/send",
  authMiddleware,
  upload.array("files", 5),
  async (req, res) => {
    const { email } = req.body;
    console.log(req.body);
    console.log("req files", req.files);
    const files = req.files;

    // Check if user is authenticated (either admin or regular user)
    if (!req.userId && !req.isAdmin) {
      return res.status(401).json({
        message: "User authentication required for sending emails",
      });
    }

    // Admin cannot send emails, only users can
    if (req.isAdmin) {
      return res.status(403).json({
        message: "Admin cannot send emails. Please login as a user.",
      });
    }

    const userId = req.userId;

    if (!email || !files || files.length === 0) {
      return res.status(404).json({
        message: "Email and File Are required\n",
      });
    }

    if (files.length > 5) {
      return res.status(400).json({ message: "Max 5 files allowed" });
    }

    try {
      const logs = files.map((file) => ({
        //map the object in ()
        userId,
        email,
        filename: file.originalname,
        filesize: file.size,
        status: "SUCCESS",
      }));

      console.log("logs", logs);

      //throw new Error("created error by hriti,k")

      await SendEmail(email, files); //send files to mail using nodemailer

      await log.insertMany(logs); //stores logs of file in mongoDb

      // await log.create({
      //     email,
      //     filename:file.originalname,
      //     filesize:file.size,
      //     status:"SUCCESS",

      // })

      res.json({
        success: true,
        message: "saved details in database",
      });
    } catch (err) {
      console.log("error is ", err);

      const logs = (files || []).map((file) => ({
        userId,
        email,
        filename: file.originalname,
        filesize: file.size,
        status: "FAILED",
        err,
      }));

      // await Log.create({
      //     email,
      //     fileName: file?.originalname || "unknown",
      //     fileSize: file?.size || 0,
      //     status: "FAILED",
      // });

      if (logs.length) {
        await log.insertMany(logs);
      }

      res.status(500).json({
        message: "Failed to     send email",
        error: err.message,
      });
    }
  },
);

function istTime(createdAt) {
  return new Date(createdAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
}

router.get("/5logs", authMiddleware, async (req, res) => {
  try {
    // If admin, show all logs; if user, show only their logs
    const filter = req.isAdmin ? {} : { userId: req.userId };
    const recent_log = await log
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    console.log("recentlogs", recent_log);

    recent_log.forEach((log) => (log.createdAt = istTime(log.createdAt)));
    console.log("newtimelogs", recent_log);

    const mapped_log = recent_log.map((log) => ({
      _id: log._id,
      email: log.email,
      filename: log.filename,
      filesize: (log.filesize / 1024).toFixed(2) + " KB",
      status: log.status,
      createdAt: log.createdAt,
    }));
    console.log("mappedlogs", mapped_log);

    res.json({
      msg: "last 5 logs",
      mapped_log,
    });
  } catch (err) {
    console.log("error in fetching logs", err);
    res.status(400).json({
      msg: "error in fetching logs",
      error: err.message,
    });
  }
});

router.get("/alllogs", authMiddleware, async (req, res) => {
  try {
    // If admin, show all logs; if user, show only their logs
    const filter = req.isAdmin ? {} : { userId: req.userId };
    const allLogs = await log.find(filter).sort({ createdAt: -1 }).lean();

    allLogs.forEach((Log) => (Log.createdAt = istTime(Log.createdAt)));

    const mappedAllLogs = allLogs.map((Log) => ({
      email: Log.email,
      filename: Log.filename,
      filesize: (Log.filesize / 1024).toFixed(2) + "KB",
      status: Log.status,
      createdAt: Log.createdAt,
    }));

    // console.log("mappedAllLogs",mappedAllLogs);

    res.json({
      message: "all Logs: ",
      mappedAllLogs,
    });
  } catch (err) {
    console.log("error in fetching all logs", err);
    res.status(400).json({
      message: "error in fetching all logs",
      error: err.message,
    });
  }
});

module.exports = router;
