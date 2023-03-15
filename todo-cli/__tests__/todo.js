/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
const todoList = require('../todo');
const {all, markAsComplete, add, overdue, dueToday, dueLater} = todoList();

describe('todo test suite', () => {
  beforeAll(() => {
    [
      {
        title: 'Complete assignment',
        completed: false,
        dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
      },
      {
        title: 'Go to college',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
      },
      {
        title: 'File check',
        completed: false,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      },
    ].forEach(add);
  });
  test('Add new todo', () => {
    expect(all.length).toEqual(3);
    add({
      title: 'Service Vehicle',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
    });
    expect(all.length).toEqual(4);
  });
  test('Mark as complete', () => {
    expect(all[0].completed).toEqual(false);
    markAsComplete(0);
    expect(all[0].completed).toEqual(true);
  });
  test('Overdue', () => {
    expect(overdue().length).toEqual(1);
  });
  test('Today', () => {
    expect(dueToday().length).toEqual(2);
  });
  test('Due later', () => {
    expect(dueLater().length).toEqual(1);
  });
});