#!/usr/bin/env node
import * as fs from "node:fs";

const file = "Tasks.json";

// Ensure file exists
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, JSON.stringify({ tasks: [] }, null, 2));
}

// Load tasks
const data = JSON.parse(fs.readFileSync(file, "utf-8"));
const tasks = data.tasks;

// Get CLI arguments
const [,, command, ...args] = process.argv;

// Helper: Save tasks
function save() {
  fs.writeFileSync(file, JSON.stringify({ tasks }, null, 2));
}

// Helper: Find task by ID
function getTask(id) {
  return tasks.find(t => t.id === id);
}

switch (command) {
  case "add": {
    const text = args.join(" ");
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = { id: newId, text, status: "todo" };
    tasks.push(newTask);
    save();
    console.log(`✅ Task added successfully (ID: ${newTask.id})`);
    break;
  }

  case "update": {
    const id = parseInt(args[0]);
    const text = args.slice(1).join(" ");
    const task = getTask(id);
    if (!task) {
      console.log(`❌ Task with ID ${id} not found`);
    } else {
      task.text = text;
      save();
      console.log(`✏️ Task ${id} updated successfully`);
    }
    break;
  }

  case "delete": {
    const id = parseInt(args[0]);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      console.log(`❌ Task with ID ${id} not found`);
    } else {
      tasks.splice(index, 1);
      save();
      console.log(`🗑️ Task ${id} deleted successfully`);
    }
    break;
  }

  case "mark-in-progress": {
    const id = parseInt(args[0]);
    const task = getTask(id);
    if (!task) {
      console.log(`❌ Task with ID ${id} not found`);
    } else {
      task.status = "in-progress";
      save();
      console.log(`🚧 Task ${id} marked as In Progress`);
    }
    break;
  }

  case "mark-done": {
    const id = parseInt(args[0]);
    const task = getTask(id);
    if (!task) {
      console.log(`❌ Task with ID ${id} not found`);
    } else {
      task.status = "done";
      save();
      console.log(`✅ Task ${id} marked as Done`);
    }
    break;
  }

  case "list": {
    const filter = args[0]; // optional: done | todo | in-progress
    let filtered = tasks;
    if (filter) {
      filtered = tasks.filter(t => t.status === filter);
    }

    if (filtered.length === 0) {
      console.log("📭 No tasks found.");
    } else {
      console.log("📋 Tasks:");
      filtered.forEach(t => {
        console.log(`${t.id}. [${t.status}] ${t.text}`);
      });
    }
    break;
  }

  default:
    console.log(`
❓ Unknown command: ${command}

Available commands:
  task-cli add "task description"
  task-cli update <id> "new description"
  task-cli delete <id>
  task-cli mark-in-progress <id>
  task-cli mark-done <id>
  task-cli list [status]

Statuses: todo | in-progress | done
    `);
}
