import { Task } from "../../models/tasks/index.js";
import { assert } from "../../utils/error.js";

export function taskService() {
  return {
    // Create a task
    async create(userId, data) {
      return Task.create({
        ...data,
        user: userId,
      });
    },

    // Get all tasks of logged-in user
    async getAll(userId) {
      return Task.find({ user: userId }).sort({ createdAt: -1 });
    },

    // Get one task
    async getOne(userId, taskId) {
      const task = await Task.findOne({
        _id: taskId,
        user: userId,
      });

      assert(task, 404, "Task not found");

      return task;
    },

    // Update a task
    async update(userId, taskId, data) {
      const task = await Task.findOneAndUpdate(
        { _id: taskId, user: userId },
        { $set: data },
        { new: true, runValidators: true },
      );

      assert(task, 404, "Task not found");

      return task;
    },

    // Delete a task
    async remove(userId, taskId) {
      const task = await Task.findOneAndDelete({
        _id: taskId,
        user: userId,
      });

      assert(task, 404, "Task not found");

      return { message: "Task deleted successfully" };
    },
  };
}
