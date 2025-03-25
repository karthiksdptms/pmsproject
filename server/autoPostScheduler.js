import cron from "node-cron";
import QpModel from "./models/QpModel.js";
import StudentModel from "./models/StudentModel.js";
import moment from "moment";


const autoPostScheduler = async () => {
  console.log(`Auto Post Job Running at ${moment().format("YYYY-MM-DD HH:mm:ss")}`);

  try {
    const currentDate = moment().utc().format("YYYY-MM-DD");
    const currentTime = moment().utc().format("HH:mm");

   
    const questionPapers = await QpModel.find({
      autoPost: true,
      examDate: currentDate,
      startTime: currentTime,
    });

    for (const paper of questionPapers) {
      const { department, batch } = paper;

    
      const students = await StudentModel.find(
        { department, batch },
        "registration_number exams"
      );

      if (students.length > 0) {
        const bulkOps = [];

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
              negativeMarking: paper.negativeMarking,
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

            bulkOps.push({
              updateOne: {
                filter: { _id: student._id },
                update: { $set: { exams: student.exams } },
              },
            });
          }
        }

        if (bulkOps.length > 0) {
          await StudentModel.bulkWrite(bulkOps);
          console.log(`Auto posted to ${bulkOps.length} students.`);
        }
      } else {
        console.log(`No Students Found for ${department} - ${batch}`);
      }
    }
  } catch (error) {
    console.error("Auto Post Scheduler Error:", error);
  }
};


const autoDeleteScheduler = async () => {
  console.log(`Auto Delete Job Running at ${moment().format("YYYY-MM-DD HH:mm:ss")}`);

  try {
    const currentTime = moment().utc();

 
    const students = await StudentModel.find({}, "registration_number exams");

    const bulkOps = [];

    for (const student of students) {
      const updatedExams = student.exams.filter((exam) => {
        const examEndTime = moment.utc(
          `${exam.examDate} ${exam.endTime}`,
          "YYYY-MM-DD HH:mm"
        );

       
        const deleteTime = examEndTime.add(10, "minutes");

       
        return currentTime.isBefore(deleteTime);
      });

     
      if (updatedExams.length !== student.exams.length) {
        bulkOps.push({
          updateOne: {
            filter: { _id: student._id },
            update: { $set: { exams: updatedExams } },
          },
        });

        console.log(
          `Deleted expired exams for student: ${student.registration_number}`
        );
      }
    }

 
    if (bulkOps.length > 0) {
      await StudentModel.bulkWrite(bulkOps);
      console.log(`Deleted expired exams for ${bulkOps.length} students.`);
    }
  } catch (error) {
    console.error("Auto Delete Scheduler Error:", error);
  }
};

cron.schedule("* * * * *", autoPostScheduler);

cron.schedule("* * * * *", autoDeleteScheduler);

export { autoPostScheduler, autoDeleteScheduler };
