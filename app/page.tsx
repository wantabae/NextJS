"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";


const TodoApp = () => {
  const [tasks, setTasks] = useState<
    {
      name: string;
      dueDate: Date | null;
      dueTime: string | null;
      isCompleted: boolean;
    }[]
  >([]);
  const [task, setTask] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueTime, setDueTime] = useState<string | null>(null);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (
          task.dueDate &&
          task.dueTime &&
          !task.isCompleted &&
          task.dueDate.toDateString() === now.toDateString()
        ) {
          const [dueHours, dueMinutes] = task.dueTime
            .split(":")
            .map((str) => parseInt(str, 10));
          const dueDateWithTime = new Date(
            task.dueDate.getFullYear(),
            task.dueDate.getMonth(),
            task.dueDate.getDate(),
            dueHours,
            dueMinutes
          );

          if (now >= dueDateWithTime) {
            // Show Notification
            new Notification("Reminder", {
              body: `Task "${task.name}" is due now!`,
            });

            // Play Sound
            const audio = new Audio("reminder.mp3");
            audio.play();
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">To-Do List</h1>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
          className="border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-2">Due Date</label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              className="border border-gray-300 rounded-lg w-full p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select due date"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-2">Due Time</label>
            <TimePicker
              value={dueTime}
              onChange={(time) => setDueTime(time)}
              clockIcon={null}
              clearIcon={null}
              format="h:mm a"
              className="border border-gray-300 rounded-lg w-full p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (task.trim()) {
              setTasks([
                ...tasks,
                { name: task, dueDate: dueDate, dueTime: dueTime, isCompleted: false },
              ]);
              setTask("");
              setDueDate(null);
              setDueTime(null);
            }
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-4">
        {tasks.map((t, index) => (
          <li
            key={index}
            className={`flex justify-between items-center p-4 rounded-lg shadow-sm ${
              t.isCompleted ? "bg-gray-200 line-through text-gray-500" : "bg-gray-50"
            }`}
          >
            <div>
              <span className="font-medium text-lg">{t.name}</span>
              {t.dueDate && (
                <span className="text-sm text-gray-600 ml-2">
                  (Due: {t.dueDate.toLocaleDateString()} at {t.dueTime})
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const updatedTasks = [...tasks];
                  updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
                  setTasks(updatedTasks);
                }}
                className="text-green-500 hover:text-green-600 transition duration-200"
              >
                {t.isCompleted ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() => {
                  setTask(t.name);
                  setDueDate(t.dueDate);
                  setDueTime(t.dueTime);
                  setTasks(tasks.filter((_, i) => i !== index));
                }}
                className="text-blue-500 hover:text-blue-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
