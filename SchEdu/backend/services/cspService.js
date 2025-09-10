const { Timetable, Leave, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Reassign leave for a given leaveId:
 * - Find affected timetable entries during leave period.
 * - Find substitute teachers following constraints.
 * - Update timetable schedule JSONB with new assignments.
 * - Update leave status and processing time.
 */
async function reassignLeave(leaveId) {
  const leave = await Leave.findByPk(leaveId);
  if (!leave) throw new Error('Leave not found');

  const startTime = Date.now();

  // Find all timetables for classes the teacher teaches during leave period.
  // This example assumes you have logic to find affected timetables and periods.
  // You'll need to adapt to your exact timetable schedule structure.

  const affectedTimetables = await Timetable.findAll({
    where: {
      // Example condition: timetable active and overlaps with leave academic year or dates
      is_active: true,
      // Add date range or academic year/semester filters based on your model
    },
  });

  // Fetch all teachers except the leaving teacher for substitution
  const substituteTeachers = await User.findAll({
    where: {
      id: { [Op.ne]: leave.teacher_id },
      role: 'teacher',
      is_active: true,
    },
  });

  // Pseudocode for substitution logic:
  for (const timetable of affectedTimetables) {
    // Parse schedule JSONB
    const schedule = timetable.schedule;

    // Traverse schedule to find sessions assigned to the leaving teacher during leave
    // Replace with substitute teacher obeying constraints like same subject, department, availability

    // This logic will vary based on your timetable.schedule structure
    // For each affected session, assign a suitable substitute from substituteTeachers

    // Example (very simplified):
    // for (const day in schedule) {
    //   schedule[day].forEach(session => {
    //     if (session.teacherId === leave.teacher_id && session.time >= leave.start_date && session.time <= leave.end_date) {
    //       const substitute = chooseSubstituteTeacher(substituteTeachers, session);
    //       session.teacherId = substitute.id;
    //     }
    //   });
    // }

    // Update timetable schedule JSONB
    await timetable.update({ schedule });
  }

  leave.status = 'processed';
  leave.csp_processing_time = Date.now() - startTime;
  await leave.save();

  return leave;
}

/**
 * Stub function to choose substitute teacher obeying constraints.
 * To be implemented according to your CSP rules like same department etc.
 */
function chooseSubstituteTeacher(substituteTeachers, session) {
  // Implement your constraint solving logic here

  // Example: pick first available substitute
  return substituteTeachers[0];
}

module.exports = { reassignLeave };
