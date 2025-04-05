document.addEventListener("DOMContentLoaded", function () {
    let subjects = [];
    let faculties = [];
    let maxHours = {};
    let facultyUnavailable = {};
    let weeklyAssignedHours = {};

    function createSubjectInputs() {
        subjects = [];
        faculties = [];
        maxHours = {};
        facultyUnavailable = {};
        weeklyAssignedHours = {};

        const count = parseInt(document.getElementById('subjectCount').value);
        const container = document.getElementById('subjectInputs');
        container.innerHTML = '';

        for (let i = 0; i < count; i++) {
            container.innerHTML += `
              <div class="subject-input">
                <input type="text" placeholder="Subject ${i + 1}" id="sub${i}">
                <input type="text" placeholder="Faculty ${i + 1}" id="fac${i}">
                <input type="number" placeholder="Max Hours" id="max${i}" min="1">
              </div>
            `;
        }
        container.innerHTML += createFacultyAvailabilitySection(count);
        document.getElementById('generateBtn').style.display = 'inline-block';
    }

    function createFacultyAvailabilitySection(count) {
        let section = '<h3>Faculty Unavailability</h3>';
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        for (let i = 0; i < count; i++) {
            section += `<div><strong>Faculty ${i + 1}:</strong>`;
            days.forEach((day, dIndex) => {
                section += `<div>${day}: `;
                for (let h = 0; h < 8; h++) {
                    section += `<label><input type="checkbox" class="unavailable" data-faculty="${i}" data-day="${dIndex}" data-hour="${h}"> P${h + 1}</label> `;
                }
                section += `</div>`;
            });
            section += '</div>';
        }
        return section;
    }

    function generateTimetable() {
        subjects = [];
        faculties = [];
        maxHours = {};
        facultyUnavailable = {};
        weeklyAssignedHours = {};

        const count = parseInt(document.getElementById('subjectCount').value);
        for (let i = 0; i < count; i++) {
            subjects.push(document.getElementById(`sub${i}`).value);
            faculties.push(document.getElementById(`fac${i}`).value);
            maxHours[subjects[i]] = parseInt(document.getElementById(`max${i}`).value);
            weeklyAssignedHours[subjects[i]] = 0;  // Track assigned hours per subject
        }

        document.querySelectorAll('.unavailable').forEach(checkbox => {
            if (checkbox.checked) {
                const facIndex = checkbox.dataset.faculty;
                const dayIndex = checkbox.dataset.day;
                const hourIndex = checkbox.dataset.hour;
                if (!facultyUnavailable[faculties[facIndex]]) {
                    facultyUnavailable[faculties[facIndex]] = {};
                }
                if (!facultyUnavailable[faculties[facIndex]][dayIndex]) {
                    facultyUnavailable[faculties[facIndex]][dayIndex] = [];
                }
                facultyUnavailable[faculties[facIndex]][dayIndex].push(hourIndex);
            }
        });

        let timetable = generateWeeklyTimetable();
        document.getElementById('timetableOutput').innerHTML = timetable;
        document.getElementById('downloadBtn').style.display = 'inline-block';
    }

    function generateWeeklyTimetable() {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let weeklySchedule = {};

        days.forEach((day, index) => {
            weeklySchedule[day] = generateDaySchedule(index);
        });

        let output = `<h2 style="text-align:center;">Weekly Timetable</h2>`;
        output += `<table><tr><th>Period</th>`;
        days.forEach(day => output += `<th>${day}</th>`);
        output += `</tr>`;

        for (let i = 0; i < 8; i++) {
            output += `<tr><td>Period ${i + 1}</td>`;
            days.forEach(day => {
                output += `<td>${weeklySchedule[day][i] || "Break"}</td>`;
            });
            output += `</tr>`;
        }
        output += `</table>`;

        let facultyDetails = `<h3>Faculty Assignments</h3>`;
        faculties.forEach((faculty, index) => {
            facultyDetails += `<p>${faculty} - ${subjects[index]}</p>`;
        });

        document.getElementById('facultyDetails').innerHTML = facultyDetails;
        return output;
    }

    function generateDaySchedule(dayIndex) {
        let schedule = [];
        let availableSubjects = subjects.filter(sub => weeklyAssignedHours[sub] < maxHours[sub]);

        // Track the number of times a subject is allocated to a day
        let subjectCountPerDay = {};

        for (let i = 0; i < 8; i++) {
            availableSubjects = subjects.filter(sub => weeklyAssignedHours[sub] < maxHours[sub]);
            if (availableSubjects.length === 0) {
                schedule.push("Break");
                continue;
            }

            // Randomly select a subject from the available ones
            let randomSub = availableSubjects[Math.floor(Math.random() * availableSubjects.length)];
            let faculty = faculties[subjects.indexOf(randomSub)];

            // Ensure that no subject is assigned more than 2 periods per day
            if (!subjectCountPerDay[randomSub]) {
                subjectCountPerDay[randomSub] = 0;
            }

            // Check if the subject has already been assigned 2 periods for the day
            if (subjectCountPerDay[randomSub] < 2) {
                // Check if the faculty is unavailable at this period
                if (facultyUnavailable[faculty] && facultyUnavailable[faculty][dayIndex] && facultyUnavailable[faculty][dayIndex].includes(i.toString())) {
                    // Skip assigning this subject for this period, and treat it as a "Break"
                    schedule.push("Break");
                    continue;
                }

                // Assign the subject to the period
                schedule.push(randomSub);
                weeklyAssignedHours[randomSub]++;
                subjectCountPerDay[randomSub]++;  // Increment the count of assigned periods for this subject
            } else {
                // If the subject has already been assigned 2 periods, assign a "Break"
                schedule.push("Break");
            }
        }
        return schedule;
    }

    function downloadPDF() {
        const element = document.getElementById('timetableOutput');
        html2pdf().from(element).save();
    }

    window.createSubjectInputs = createSubjectInputs;
    window.generateTimetable = generateTimetable;
    window.downloadPDF = downloadPDF;
});
