// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};
// The provided learner obj data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(course, ag, submissions) {
  try {
    if (ag.course_id !== course.id) {
      throw new Error("You are not part of this assignment group");
    }
  } catch (error) {
    console.error(error);
  }

  const result = [];
  const learnerArr = [];

  submissions.forEach((obj) => {
    const assignment = ag.assignments.find((a) => a.id === obj.assignment_id);
    console.log(assignment);

    //const currentDate = "2024-08-10" I used hardcoded date, but I found out that is a bad practice and I changed it to New Date (so it is automatically updated and converts the strings in the data to objects depending on timezone time standards ect.. )
    const currentDate = new Date();
    const dueDate = new Date(assignment.due_at);
    const subDate = new Date(obj.submission.submitted_at);
    // console.log(currentDate, dueDate, subDate);

    if (dueDate > currentDate) return; // if dueDate is grater than earlier date will not be displayed

    let score = obj.submission.score;

    function lateSubmission(score, points) {
      try {
        if (score <= 0) {
          throw new Error("Invalid score value. Please try again!");
        }
        return score - points / 10;
      } catch (error) {
        console.error(error.message);
        return null;
      }
    }

    switch (true) {
      case subDate > dueDate:
        score = lateSubmission(score, assignment.points_possible);
        break;
      default:
        break;
    }

    const scorePercentage = score / assignment.points_possible;

    !learnerArr[obj.learner_id]
      ? (learnerArr[obj.learner_id] = {
          id: obj.learner_id,
          scoreTotal: 0,
          pointsMax: 0,
          assignments: {},
        })
      : null;
    // console.log(learnerArr[obj.learner_id]);

    const learner = learnerArr[obj.learner_id];
    // console.log(learner);
    learner.assignments[assignment.id] =
      Math.round(scorePercentage * 1000) / 1000;
    learner.scoreTotal += score;
    learner.pointsMax += assignment.points_possible;
  });

  learnerArr.filter((learner) => {
    // console.log(Object.values(learnerArr));
    const avgScore = learner.scoreTotal / learner.pointsMax;

    result.push({
      id: learner.id,
      avg: avgScore,
      ...learner.assignments,
    });
  });

  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
