const Timetable = require('../models/Timetable');
const Teacher = require('../models/User');
const Class = require('../models/Class'); // Ensure model exists
const Subject = require('../models/Subject'); // Ensure model exists
const Leave = require('../models/Leave');
const { Op } = require('sequelize');

const MAX_LEAVES_PER_MONTH = 4; // example limit

function isTeacherAvailable(teacherId, timeSlot, timetableAssignments) {
  return !timetableAssignments.some(
    (entry) => entry.teacherId === teacherId && entry.timeSlot === timeSlot
  );
}

async function countLeavesThisMonth(teacherId) {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const count = await Leave.count({
    where: {
      teacherId,
      fromDate: { [Op.gte]: startOfMonth },
      status: 'Approved',
    },
  });
  return count;
}

async function generateTimetable() {
  const teachers = await Teacher.findAll();
  const classes = await Class.findAll({ include: Subject });
  const leaves = await Leave.findAll({ where: { status: 'Approved' } });

  const timetableAssignments = [];
  const teacherLeaves = {};

  leaves.forEach((leave) => {
    if (!teacherLeaves[leave.teacherId]) teacherLeaves[leave.teacherId] = [];
    teacherLeaves[leave.teacherId].push({ fromDate: leave.fromDate, toDate: leave.toDate });
  });

  async function backtrack(index) {
    if (index >= classes.length) return true;

    const currentClass = classes[index];
    const timeSlot = currentClass.timeSlot; // Make sure this field exists
    const subjectId = currentClass.Subject.id;

    const qualifiedTeachers = teachers.filter(
      (t) => t.subjectIds && t.subjectIds.includes(subjectId)
    );

    for (const teacher of qualifiedTeachers) {
      const leavesForTeacher = teacherLeaves[teacher.id] || [];
      const onLeave = leavesForTeacher.some((l) => {
        const from = new Date(l.fromDate);
        const to = new Date(l.toDate);
        const slotDate = new Date(timeSlot);
        return slotDate >= from && slotDate <= to;
      });

      if (onLeave) continue;

      const leaveCount = await countLeavesThisMonth(teacher.id);
      if (leaveCount >= MAX_LEAVES_PER_MONTH) continue;

      if (!isTeacherAvailable(teacher.id, timeSlot, timetableAssignments)) continue;

      timetableAssignments.push({
        classId: currentClass.id,
        teacherId: teacher.id,
        timeSlot,
      });

      if (await backtrack(index + 1)) return true;

      timetableAssignments.pop();
    }

    return false;
  }

  const success = await backtrack(0);
  if (!success) throw new Error('Failed to generate a valid timetable with given constraints.');

  return timetableAssignments;
}

module.exports = { generateTimetable };
