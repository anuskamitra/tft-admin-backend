const mongoose = require("mongoose");

const samplePaperSchema =
  ({
    CollegeID: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    Semester: {
      type: Number,
      required: true,
    },
    DepartmentID: {type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    SubjectName: {
      type: String,
      required: true,
    },
    PDF: {
      type: String,
    },
  }
  );

const SamplePaper = new mongoose.model("SamplePaper", samplePaperSchema);
module.exports = SamplePaper;
