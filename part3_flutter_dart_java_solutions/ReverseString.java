public class ReverseString {
    public static String reverseString(String input) {
        if (input == null) {
            return null;
        }

        char[] characters = input.toCharArray();
        int left = 0;
        int right = characters.length - 1;

        while (left < right) {
            char temp = characters[left];
            characters[left] = characters[right];
            characters[right] = temp;

            left++;
            right--;
        }

        return new String(characters);
    }

    public static void main(String[] args) {
        String input = "interview";
        System.out.println("Original: " + input);
        System.out.println("Reversed: " + reverseString(input));
    }
}
