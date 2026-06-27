/**
 * sortOverdueDate - sorts a task by its expiration date starting
 * from the one closest to expiration date
 * @arr: The given array containning task
 *
 * Return: A sorted Array by expiration dates
 */

export const sortOverdueDate = (arr) => {
  const arrCopy = [...arr];
  return [
    arr.filter((d) => d.status === "pending")
  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
  arr
];
}