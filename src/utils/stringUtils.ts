export function reverseString(str: string): string {
  let reversed = '';

  for (let index = str.length - 1; index >= 0; index -= 1) {
    reversed += str[index];
  }

  return reversed;
}
