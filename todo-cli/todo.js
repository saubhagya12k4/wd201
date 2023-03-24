/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };
  const overdue = () => {
    return all.filter((item) => item.dueDate < today);
  };
  const dueToday = () => {
    return all.filter((item) => item.dueDate == today);
  };
  const dueLater = () => {
    return all.filter((item) => item.dueDate > today);
  };
  const toDisplayableList = (list) => {
    return list.map((item) => `${item.completed ? '[x]':'[ ]'} ${item.title} ${item.dueDate == today ? '' : item.dueDate}`).join('\n');
  };
  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};
const today = new Date().toISOString().split('T')[0];
module.exports = todoList;
