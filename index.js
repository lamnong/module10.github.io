const inquirer = require("inquirer");
const fs = require("fs");

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

// GLOBAL VARIABLES FOR DATA
let MANAGER; // Class Manager
let ENGINEERS = []; // ARRAY of Class Engineer
let INTERNS = []; // ARRAY of Class Intern
// let RESPONSEDONE;

function promptManager() {
  inquirer.prompt([
    {
      type: "input",
      name: "managerName",
      message: "What is the manager's name?: "
    },
    {
      type: "input",
      name: "managerId",
      message: "Enter the manager's ID: "
    },
    {
      type: "input",
      name: "managerEmail",
      message: "Enter the manager's email address: "
    },
    {
      type: "input",
      name: "managerOfficeNumber",
      message: "Enter the manager's office number: "
    },
  ]).then(({ managerName, managerEmail, managerId, managerOfficeNumber }) => {
    // Store manager info into Manager class
    MANAGER = new Manager(managerName, managerId, managerEmail, managerOfficeNumber)
    console.log(MANAGER)

    // Ask engineer or intern
    promptEngineerOrIntern()
  });
}

function promptEngineerOrIntern() {
  inquirer.prompt([
    {
      type: "list",
      name: "employeeType",
      message: "Employee type: ",
      choices: ["Engineer", "Intern"],
    },
  ]).then(({ employeeType }) => {
    if (employeeType === "Engineer") {
      promptEngineer()
    } else {
      promptIntern()
    }
  })
}

function promptEngineer() {
  inquirer.prompt([
    {type: "input",
    name: "engineerName",
    message: "What is the engineer's name?:"
    },
    {
      type: "input",
      name: "engineerId",
      message: "Enter the engineer's ID: "
    },
    {
      type: "input",
      name: "engineerEmail",
      message: "Enter the engineer's email address: "
    },
    {
      type: "input",
      name: "engineerGithub",
      message: "Enter the engineer's github username: "
    },
  ]).then(({engineerName, engineerId, engineerEmail, engineerGithub}) => {
    // Create Engineer class instance 
    const newEngineer = new Engineer(engineerName, engineerId, engineerEmail, engineerGithub)
    
    // Save into ENGINEERS array
    ENGINEERS.push(newEngineer)
    console.log(ENGINEERS)

    promptContinueOrFinish()
  })
 }

function promptIntern() {
  inquirer.prompt([
    {
      type: "input",
      name: "internName",
      message: "What is the intern's name?:"
    },
    {
      type: "input",
      name: "internId",
      message: "Enter the intern's ID: "
    },
    {
      type: "input",
      name: "internEmail",
      message: "Enter the intern's email address: "
    },
    {
      type: "input",
      name: "internSchool",
      message: "Enter the intern's school name: "
    },
  ]).then(({internName, internId, internEmail, internSchool}) => {
    // Create Inter class instance 
    const newIntern = new Intern(internName, internId, internEmail, internSchool)
    
    // Save into INTERNS array
    INTERNS.push(newIntern)
    console.log(INTERNS)

    promptContinueOrFinish()
  })
 }

function promptContinueOrFinish() {
  inquirer.prompt([  
    { 
      type: "list",
      name: "continuePrompt", // Don't use "continue" for variable name
      message: "Do you want to continue?: ",
      choices: ["Yes", "No"]
    },
  ]).then(({ continuePrompt }) => {
    if (continuePrompt === "Yes") {
      promptEngineerOrIntern()
    } else {
      // Generate the HTML file
      generateHtml()
    }
  })
}

function generateHtml() {
  const htmlName = 'index.html'

  let content = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Manager System</title>
      <link href="https://fonts.googleapis.com/css?family=Bungee+Inline|Bungee+Shade&display=swap" rel="stylesheet">
      <link rel="stylesheet" type="text/css" href="style.css"/>
      
  </head>
  <body>
    <div class=header>
    <h1>My Team</h1></div>

    <section class="employee">
      <span>${MANAGER.getName()}</span>
      <span class="fa-solid fa-mug">${MANAGER.getRole()}</span>
      <div>ID: ${MANAGER.getId()}</div>
      <a href="mailto:${MANAGER.getEmail()}">Email:  ${MANAGER.getEmail()}</a>
      <div>Office number: ${MANAGER.getOfficeNumber()}</div>
    </section>
  `

  // Render Engineers
  for (const engineer of ENGINEERS) {
    content += `
    <section class="employee">
      <span>${engineer.getName()}</span>
      <span>${engineer.getRole()}</span>
      <div>ID: ${engineer.getId()}</div>
      <a href="mailto:${engineer.getEmail()}">Email: ${engineer.getEmail()}</a>
      <a href="https://github.com/${engineer.getGithub() }">
        https://github.com/${engineer.getGithub()}</a>
    </section>
    `
  }

  // Render Interns
  for (const intern of INTERNS) {
    content += `
    <section class="employee">
      <span>${intern.getName()}</span>
      <span>${intern.getRole()}</span>
      <div>${intern.getId()}</div>
      <a href="mailto:${intern.getEmail()}">Email: ${intern.getEmail()}</a>
      <div>${intern.getSchool()}</div>
    </section>
    `
  }

  content += `
  </body>
  </html>
  `


  fs.writeFile(`dist/${htmlName}`, content, (err) => 
    err ? console.log(err) : console.log('Success!'))
}


// RUN
promptManager()