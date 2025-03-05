import cron from "node-cron";
import QpModel from "./models/QpModel.js";
import StudentModel from "./models/StudentModel.js";
import moment from "moment";

const autoPostScheduler = async () => {
  console.log("✅ Auto Posting Scheduler Running Every 1 Minute");

  try {
    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm");
    console.log(`🔍 Checking at ${currentDate} ${currentTime}`);

    const questionPapers = await QpModel.find({ autoPost: true });

    for (const paper of questionPapers) {
      const paperDate = moment(paper.examDate).format("YYYY-MM-DD");
      const paperTime = moment(paper.startTime, "HH:mm").format("HH:mm");

      console.log(`
📄 Paper: ${paper.qpcode}
Date: ${paperDate}
Time: ${paperTime}
`);

      if (paperDate === currentDate && paperTime === currentTime) {
        console.log(`🔥 Auto Posting Paper: ${paper.qpcode}`);

        const { department, batch } = paper;

        const students = await StudentModel.find({ department, batch });

        if (students.length > 0) {
          for (const student of students) {
            const alreadyPosted = student.exams.some(
              (exam) => exam.qpcode === paper.qpcode
            );

            if (!alreadyPosted) {
              student.exams.push({
                qpcode: paper.qpcode,
                title: paper.title,
                academicYear: paper.academicYear,
                department: paper.department,
                batch: paper.batch,
                examDate: paper.examDate,
                startTime: paper.startTime,
                endTime: paper.endTime,
                semesterType: paper.semesterType,
                questions: paper.questions.map(({ question, options, marks }) => ({
                  question,
                  options,
                  marks,
                })),
              });

              await student.save();
              console.log(`✅ Auto Posted to Student: ${student.registration_number}`);
            }
          }
        } else {
          console.log(`🚫 No Students Found for ${department} - ${batch}`);
        }
      }
    }
  } catch (error) {
    console.error("🚨 Auto Post Scheduler Error:", error);
  }
};

cron.schedule("* * * * *", autoPostScheduler);

export { autoPostScheduler };
