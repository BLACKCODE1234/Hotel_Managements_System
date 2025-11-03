/**
 * A utility function to conditionally join class names together.
 * @param {...any} classes - Class names to be joined.
 * @returns {string} - A single string of joined class names.
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
