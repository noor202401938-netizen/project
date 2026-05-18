const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, WidthType, BorderStyle, ShadingType, HeadingLevel, PageBreak, LevelFormat } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerBg = "4472C4";
const lightBg = "E7E6E6";

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        run: { size: 32, bold: true, font: "Calibri", color: "FFFFFF" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        run: { size: 28, bold: true, font: "Calibri", color: "2E5090" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        run: { size: 26, bold: true, font: "Calibri", color: "44546A" },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // Title
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: { top: border, bottom: border, left: border, right: border },
                shading: { fill: headerBg, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 120, right: 120 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "MS Access Database Assignment",
                        bold: true,
                        size: 32,
                        color: "FFFFFF"
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Step-by-Step Guide for Beginners",
                        size: 26,
                        color: "FFFFFF"
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),
      new Paragraph({ text: "" }),

      // Introduction
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Introduction")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun("This guide will teach you how to create a complete database assignment in Microsoft Access from zero knowledge. We'll build a "),
          new TextRun({ text: "University Management System", bold: true }),
          new TextRun(" with 3 related tables, sample data, and all required SQL queries.")
        ]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "Timeline: 3-5 hours if you follow this guide completely", italic: true })]
      }),

      // Part 1
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Part 1: Understanding the Basics")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("What is a Database?")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("A database is an organized collection of related information")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("MS Access stores this data in Tables")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Each table has Rows (records) and Columns (fields)")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Tables can connect to each other using Relationships")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("What is a Table?")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun("Think of a table like an Excel spreadsheet:\n"),
          new TextRun({ text: "• Columns", bold: true }),
          new TextRun(" = Field Names (StudentID, StudentName, Email)\n"),
          new TextRun({ text: "• Rows", bold: true }),
          new TextRun(" = Records (each student is one row)\n"),
          new TextRun({ text: "• Cell", bold: true }),
          new TextRun(" = Data value (the actual information stored")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("What is a Primary Key?")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun("A unique identifier for each row. Example: StudentID = 1, 2, 3... Each student gets a unique number. No two students can have the same StudentID.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("What is a Foreign Key?")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun("A field in one table that points to a Primary Key in another table. This creates a connection between tables.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("What is a Relationship?")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun("A connection between two tables. Example: One Student can take many Courses. One Course can have many Students. This is called a "),
          new TextRun({ text: "Many-to-Many Relationship", bold: true }),
          new TextRun(". We need a middle table (Enrollments) to manage this.")
        ]
      }),

      // Part 2
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Part 2: Database Design")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Our Database Structure")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun("We'll create 3 tables that work together:\n"),
          new TextRun({ text: "1. Students", bold: true }),
          new TextRun(" - stores student information\n"),
          new TextRun({ text: "2. Courses", bold: true }),
          new TextRun(" - stores course information\n"),
          new TextRun({ text: "3. Enrollments", bold: true }),
          new TextRun(" - connects students to courses and stores marks")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Table 1: Students")]
      }),
      createFieldTable([
        ["StudentID", "AutoNumber", "Unique ID for each student (Primary Key)"],
        ["StudentName", "Short Text", "Student's full name"],
        ["Department", "Short Text", "What program they're in (SE, CS, IT)"],
        ["Semester", "Number", "Which semester (1-8)"],
        ["Email", "Short Text", "Student email address"]
      ]),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Table 2: Courses")]
      }),
      createFieldTable([
        ["CourseID", "AutoNumber", "Unique ID for each course (Primary Key)"],
        ["CourseName", "Short Text", "Course name (Database Systems, etc)"],
        ["CreditHours", "Number", "How many credit hours"],
        ["TeacherName", "Short Text", "Professor's name"]
      ]),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Table 3: Enrollments")]
      }),
      createFieldTable([
        ["EnrollmentID", "AutoNumber", "Unique ID for enrollment (Primary Key)"],
        ["StudentID", "Number", "Link to Students table (Foreign Key)"],
        ["CourseID", "Number", "Link to Courses table (Foreign Key)"],
        ["Marks", "Number", "Marks obtained (0-100)"]
      ]),

      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({ text: "Why 3 tables?", bold: true, size: 24 }),
          new TextRun(" A student can take many courses, and a course can have many students. Enrollments table joins them together.")
        ]
      }),

      // Part 3
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Part 3: Step-by-Step Implementation")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Step 1: Create a New Database")]
      }),
      createStepList([
        "Open Microsoft Access",
        'Click "Blank Database"',
        'Name it "UniversityDB"',
        'Click Create'
      ]),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Step 2: Create Table 1 - Students")]
      }),
      createStepList([
        'Go to Home tab → Click "Table Design"',
        'Create your first table with these fields:',
        '   • StudentID (AutoNumber) ← This becomes Primary Key',
        '   • StudentName (Short Text)',
        '   • Department (Short Text)',
        '   • Semester (Number)',
        '   • Email (Short Text)',
        'Right-click StudentID field → Select "Primary Key"',
        'Save the table as "Students"'
      ]),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Step 3: Create Table 2 - Courses")]
      }),
      createStepList([
        'Click "Table Design" again',
        'Create fields:',
        '   • CourseID (AutoNumber) ← Primary Key',
        '   • CourseName (Short Text)',
        '   • CreditHours (Number)',
        '   • TeacherName (Short Text)',
        'Mark CourseID as Primary Key',
        'Save as "Courses"'
      ]),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Step 4: Create Table 3 - Enrollments")]
      }),
      createStepList([
        'Click "Table Design" again',
        'Create fields:',
        '   • EnrollmentID (AutoNumber) ← Primary Key',
        '   • StudentID (Number)',
        '   • CourseID (Number)',
        '   • Marks (Number)',
        'Mark EnrollmentID as Primary Key',
        'Save as "Enrollments"'
      ]),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Step 5: Create Relationships")]
      }),
      createStepList([
        'Go to Database Tools tab',
        'Click "Relationships"',
        'You should see all 3 tables listed',
        'Drag StudentID from Students to StudentID in Enrollments',
        'Drag CourseID from Courses to CourseID in Enrollments',
        'Check "Enforce Referential Integrity" for both',
        'Click "Create" for each relationship',
        'Close the Relationships window'
      ]),

      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({ text: "IMPORTANT:", bold: true, color: "C65911" }),
          new TextRun(" Never forget Step 5! Relationships are what make the database work properly.")
        ]
      }),

      // Part 4
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Part 4: Adding Sample Data")]
      }),

      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("Now we'll add 10 sample records to each table. This is just test data for your assignment.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Students Data")]
      }),
      createDataTable([
        ["1", "Ali", "Software Engineering", "4", "ali@gmail.com"],
        ["2", "Ahmed", "CS", "3", "ahmed@gmail.com"],
        ["3", "Sara", "IT", "2", "sara@gmail.com"],
        ["4", "Ayesha", "SE", "5", "ayesha@gmail.com"],
        ["5", "Bilal", "CS", "1", "bilal@gmail.com"],
        ["6", "Zain", "IT", "6", "zain@gmail.com"],
        ["7", "Hina", "SE", "7", "hina@gmail.com"],
        ["8", "Hamza", "CS", "2", "hamza@gmail.com"],
        ["9", "Noor", "IT", "4", "noor@gmail.com"],
        ["10", "Daniyal", "SE", "8", "daniyal@gmail.com"]
      ], ["ID", "Name", "Department", "Semester", "Email"]),

      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("Steps: Open Students table → Click in blank row → Type data → Tab to next field")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Courses Data")]
      }),
      createDataTable([
        ["1", "Database Systems", "3", "Sir Usman"],
        ["2", "Operating Systems", "4", "Sir Ali"],
        ["3", "Networking", "3", "Sir Hamid"],
        ["4", "AI", "3", "Sir Salman"],
        ["5", "Web Development", "2", "Sir Umar"],
        ["6", "Cyber Security", "3", "Sir Hassan"],
        ["7", "DSA", "4", "Sir Ahmed"],
        ["8", "Cloud Computing", "3", "Sir Adeel"],
        ["9", "Mobile App Dev", "2", "Sir Danish"],
        ["10", "Software Testing", "3", "Sir Fahad"]
      ], ["ID", "Name", "Credit Hours", "Teacher"]),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Enrollments Data")]
      }),
      createDataTable([
        ["1", "1", "1", "85"],
        ["2", "2", "2", "78"],
        ["3", "3", "3", "90"],
        ["4", "4", "4", "88"],
        ["5", "5", "5", "67"],
        ["6", "6", "6", "92"],
        ["7", "7", "7", "75"],
        ["8", "8", "8", "81"],
        ["9", "9", "9", "69"],
        ["10", "10", "10", "95"]
      ], ["ID", "StudentID", "CourseID", "Marks"]),

      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [new TextRun({ text: "After adding data, save all tables. Your database is now ready!", bold: true })]
      }),

      // Part 5
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Part 5: Running SQL Queries")]
      }),

      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("SQL (Structured Query Language) is used to ask questions of your database. We'll run all the queries your teacher expects.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("How to Run Queries")]
      }),
      createStepList([
        'Click Create tab',
        'Click "Query Design"',
        'Click "SQL View" (important!)',
        'Copy and paste a query from below',
        'Click "Run" (the red exclamation mark)',
        'Screenshot the results',
        'Save the query with a name'
      ]),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Basic SQL Queries")]
      }),

      createQueryBox("Query 1: Select All Students", 
        "SELECT * FROM Students;"),

      createQueryBox("Query 2: Select Specific Columns", 
        "SELECT StudentName, Department FROM Students;"),

      createQueryBox("Query 3: WHERE Condition", 
        "SELECT * FROM Students\nWHERE Semester > 4;"),

      createQueryBox("Query 4: ORDER BY (Sorting)", 
        "SELECT * FROM Students\nORDER BY StudentName ASC;"),

      createQueryBox("Query 5: DISTINCT (Unique Values)", 
        "SELECT DISTINCT Department FROM Students;"),

      createQueryBox("Query 6: AND Condition", 
        "SELECT * FROM Students\nWHERE Department='CS' AND Semester=3;"),

      createQueryBox("Query 7: OR Condition", 
        "SELECT * FROM Students\nWHERE Department='SE' OR Department='IT';"),

      createQueryBox("Query 8: LIKE (Pattern Matching)", 
        "SELECT * FROM Students\nWHERE StudentName LIKE 'A%';"),

      createQueryBox("Query 9: BETWEEN", 
        "SELECT * FROM Enrollments\nWHERE Marks BETWEEN 70 AND 90;"),

      createQueryBox("Query 10: Average (AVG)", 
        "SELECT AVG(Marks) AS AverageMarks\nFROM Enrollments;"),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Aggregate Functions (Counting, Adding, etc)")]
      }),

      createQueryBox("Query 11: Count Total Students", 
        "SELECT COUNT(*) AS TotalStudents\nFROM Students;"),

      createQueryBox("Query 12: Highest Marks", 
        "SELECT MAX(Marks) AS HighestMarks\nFROM Enrollments;"),

      createQueryBox("Query 13: Lowest Marks", 
        "SELECT MIN(Marks) AS LowestMarks\nFROM Enrollments;"),

      createQueryBox("Query 14: Total/Sum Marks", 
        "SELECT SUM(Marks) AS TotalMarks\nFROM Enrollments;"),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("INSERT Query (Adding Data)")]
      }),

      createQueryBox("Query 15: Insert New Student", 
        "INSERT INTO Students\n(StudentName, Department, Semester, Email)\nVALUES\n('Kashan', 'CS', 5, 'kashan@gmail.com');"),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("UPDATE Query (Changing Data)")]
      }),

      createQueryBox("Query 16: Update Student", 
        "UPDATE Students\nSET Semester = 6\nWHERE StudentID = 1;"),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("DELETE Query (Removing Data)")]
      }),

      createQueryBox("Query 17: Delete Record", 
        "DELETE FROM Students\nWHERE StudentID = 10;"),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("GROUP BY & HAVING")]
      }),

      createQueryBox("Query 18: Count Students Per Department", 
        "SELECT Department, COUNT(*) AS Total\nFROM Students\nGROUP BY Department;"),

      createQueryBox("Query 19: Department with More Than 2 Students", 
        "SELECT Department, COUNT(*) AS Total\nFROM Students\nGROUP BY Department\nHAVING COUNT(*) > 2;"),

      // Join Queries
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Part 6: JOIN Queries (MOST IMPORTANT)")]
      }),

      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("JOINs combine data from multiple tables. This is the most important part of your assignment!")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("INNER JOIN")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "Shows only matching records from both tables", italic: true })]
      }),

      createQueryBox("Query 20: INNER JOIN - Show Student Names with Their Courses and Marks", 
        "SELECT Students.StudentName, Courses.CourseName, Enrollments.Marks\nFROM (Students\nINNER JOIN Enrollments\nON Students.StudentID = Enrollments.StudentID)\nINNER JOIN Courses\nON Enrollments.CourseID = Courses.CourseID;"),

      createQueryBox("Query 21: INNER JOIN with WHERE", 
        "SELECT Students.StudentName, Courses.CourseName, Enrollments.Marks\nFROM (Students\nINNER JOIN Enrollments\nON Students.StudentID = Enrollments.StudentID)\nINNER JOIN Courses\nON Enrollments.CourseID = Courses.CourseID\nWHERE Enrollments.Marks > 80;"),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("LEFT JOIN")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "Shows all records from left table, even if no match in right table", italic: true })]
      }),

      createQueryBox("Query 22: LEFT JOIN", 
        "SELECT Students.StudentName, Enrollments.Marks\nFROM Students\nLEFT JOIN Enrollments\nON Students.StudentID = Enrollments.StudentID;"),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("RIGHT JOIN")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "Shows all records from right table, even if no match in left table", italic: true })]
      }),

      createQueryBox("Query 23: RIGHT JOIN", 
        "SELECT Courses.CourseName, Enrollments.Marks\nFROM Enrollments\nRIGHT JOIN Courses\nON Enrollments.CourseID = Courses.CourseID;"),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("CROSS JOIN")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "Combines every record from first table with every record from second table", italic: true })]
      }),

      createQueryBox("Query 24: CROSS JOIN", 
        "SELECT Students.StudentName, Courses.CourseName\nFROM Students, Courses;"),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("JOIN with GROUP BY")]
      }),

      createQueryBox("Query 25: Count Students Per Course", 
        "SELECT Courses.CourseName, COUNT(Enrollments.StudentID) AS TotalStudents\nFROM Courses\nINNER JOIN Enrollments\nON Courses.CourseID = Enrollments.CourseID\nGROUP BY Courses.CourseName;"),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("JOIN with Aggregate Functions")]
      }),

      createQueryBox("Query 26: Average Marks Per Course", 
        "SELECT Courses.CourseName, AVG(Enrollments.Marks) AS AverageMarks\nFROM Courses\nINNER JOIN Enrollments\nON Courses.CourseID = Enrollments.CourseID\nGROUP BY Courses.CourseName;"),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Nested Query")]
      }),

      createQueryBox("Query 27: Students with Marks Greater Than 80", 
        "SELECT StudentName\nFROM Students\nWHERE StudentID IN\n(\n    SELECT StudentID\n    FROM Enrollments\n    WHERE Marks > 80\n);"),

      // Part 7
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Part 7: Submission Checklist")]
      }),

      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("Before you submit, make sure you have:")]
      }),

      createChecklistTable([
        ["Database Structure", "3 tables created (Students, Courses, Enrollments)"],
        ["Field Types", "Correct data types (AutoNumber, Text, Number)"],
        ["Primary Keys", "Set on StudentID, CourseID, EnrollmentID"],
        ["Relationships", "Created and Referential Integrity enforced"],
        ["Sample Data", "10 rows in each table"],
        ["Basic Queries", "At least 10 SELECT queries with different conditions"],
        ["Aggregate Functions", "COUNT, AVG, MAX, MIN, SUM queries"],
        ["INSERT Query", "Show how to add new data"],
        ["UPDATE Query", "Show how to modify existing data"],
        ["DELETE Query", "Show how to delete data"],
        ["INNER JOIN", "Multiple JOIN queries showing relationships"],
        ["LEFT JOIN", "At least one LEFT JOIN"],
        ["RIGHT JOIN", "At least one RIGHT JOIN"],
        ["CROSS JOIN", "Show CROSS JOIN example"],
        ["GROUP BY & HAVING", "Grouping and filtering examples"],
        ["Screenshots", "All query results should have screenshots"],
        ["Word Document", "Submit as a .docx file with all details"]
      ]),

      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [new TextRun("Total queries needed: 25-27 different queries (you have all of them above!)")]
      }),

      // Part 8
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Part 8: Common Mistakes to Avoid")]
      }),

      createMistakesTable([
        ["Wrong data type for Foreign Keys", "Use Number, not Text"],
        ["Forgetting to set Primary Keys", "Always set AutoNumber fields as Primary Key"],
        ["Not enforcing Referential Integrity", "Check this box when creating relationships"],
        ["Spaces in field names", "Use StudentID not 'Student ID'"],
        ["Not creating relationships", "Students and Enrollments won't connect properly"],
        ["Using FULL OUTER JOIN", "MS Access doesn't support this - use LEFT/RIGHT JOIN instead"],
        ["Wrong SQL syntax", "Always use semicolon at end"],
        ["Not taking screenshots", "Your teacher needs to see the results"],
        ["Not saving queries", "Name each query so teacher can see them"]
      ]),

      // Part 9
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Part 9: Step-by-Step Work Timeline")]
      }),

      createTimelineTable([
        ["Day 1 - Morning (1 hour)", "Learn basic concepts + open Access + create 3 tables"],
        ["Day 1 - Afternoon (1.5 hours)", "Set Primary Keys, create relationships, add sample data"],
        ["Day 2 - Morning (1.5 hours)", "Run basic queries (1-14) and take screenshots"],
        ["Day 2 - Afternoon (1 hour)", "Run INSERT, UPDATE, DELETE queries"],
        ["Day 3 - Morning (1.5 hours)", "Run all JOIN queries (20-26) and take screenshots"],
        ["Day 3 - Afternoon (30 minutes)", "Run nested query, verify all 27 queries work"],
        ["Day 3 - Evening (30 minutes)", "Create Word document, organize screenshots, submit"]
      ]),

      // Final Tips
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Final Tips for Success")]
      }),

      new Paragraph({
        spacing: { after: 100 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Save frequently!", bold: true }), new TextRun(" Save your database file every 10 minutes")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Keep a backup.", bold: true }), new TextRun(" Copy your database file to another folder")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Test each query.", bold: true }), new TextRun(" Run every query and make sure it works")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Take screenshots of everything.", bold: true }), new TextRun(" Your teacher needs to see all results")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Document your work.", bold: true }), new TextRun(" Write what each query does before the screenshot")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Don't memorize queries.", bold: true }), new TextRun(" Understand what each part means")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Ask for help if stuck.", bold: true }), new TextRun(" Show your database to a friend and ask them to test it")]
      }),

      // Conclusion
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: "You now have everything you need to complete your database assignment! Follow this guide step-by-step, and you'll have a professional, complete submission. Good luck! 🎓",
            bold: true,
            size: 24
          })
        ]
      })
    ]
  }]
});

function createFieldTable(data) {
  const cols = [3120, 3120, 3120];
  const header = ["Field Name", "Data Type", "Description"];
  
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({
        children: header.map((h, i) => new TableCell({
          borders,
          width: { size: cols[i], type: WidthType.DXA },
          shading: { fill: lightBg, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text: h, bold: true })]
          })]
        }))
      }),
      ...data.map(row => new TableRow({
        children: row.map((cell, i) => new TableCell({
          borders,
          width: { size: cols[i], type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun(cell)] })]
        }))
      }))
    ]
  });
}

function createDataTable(data, header) {
  const cols = Array(header.length).fill(9360 / header.length);
  
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({
        children: header.map((h, i) => new TableCell({
          borders,
          width: { size: cols[i], type: WidthType.DXA },
          shading: { fill: lightBg, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text: h, bold: true })]
          })]
        }))
      }),
      ...data.map(row => new TableRow({
        children: row.map((cell, i) => new TableCell({
          borders,
          width: { size: cols[i], type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun(cell)] })]
        }))
      }))
    ]
  });
}

function createStepList(steps) {
  const items = [];
  steps.forEach(step => {
    items.push(
      new Paragraph({
        spacing: { after: 80 },
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun(step)]
      })
    );
  });
  items.push(new Paragraph({ text: "" }));
  return items;
}

function createQueryBox(title, query) {
  return [
    new Paragraph({
      spacing: { before: 120, after: 80 },
      children: [new TextRun({ text: title, bold: true, color: "2E5090" })]
    }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders,
              shading: { fill: "F2F2F2", type: ShadingType.CLEAR },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: query,
                      font: "Courier New",
                      size: 20
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    }),
    new Paragraph({ text: "" })
  ];
}

function createChecklistTable(data) {
  const cols = [2340, 6840];
  
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({
        children: ["Item", "Description"].map((h, i) => new TableCell({
          borders,
          width: { size: cols[i], type: WidthType.DXA },
          shading: { fill: lightBg, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text: h, bold: true })]
          })]
        }))
      }),
      ...data.map(row => new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: cols[0], type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true })] })]
          }),
          new TableCell({
            borders,
            width: { size: cols[1], type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun(row[1])] })]
          })
        ]
      }))
    ]
  });
}

function createMistakesTable(data) {
  const cols = [2500, 6860];
  
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({
        children: ["Mistake", "Solution"].map((h, i) => new TableCell({
          borders,
          width: { size: cols[i], type: WidthType.DXA },
          shading: { fill: "FFE6E6", type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text: h, bold: true })]
          })]
        }))
      }),
      ...data.map(row => new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: cols[0], type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun(row[0])] })]
          }),
          new TableCell({
            borders,
            width: { size: cols[1], type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun(row[1])] })]
          })
        ]
      }))
    ]
  });
}

function createTimelineTable(data) {
  const cols = [3000, 6360];
  
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({
        children: ["Timeline", "Task"].map((h, i) => new TableCell({
          borders,
          width: { size: cols[i], type: WidthType.DXA },
          shading: { fill: "D5E8F7", type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text: h, bold: true })]
          })]
        }))
      }),
      ...data.map(row => new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: cols[0], type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun(row[0])] })]
          }),
          new TableCell({
            borders,
            width: { size: cols[1], type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun(row[1])] })]
          })
        ]
      }))
    ]
  });
}

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/workspaces/project/MS_Access_Database_Assignment_Guide.docx", buffer);
  console.log("Document created successfully!");
});