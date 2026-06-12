import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class FindDuplicates {
    public static List<Integer> findDuplicates(int[] array) {
        Set<Integer> seen = new HashSet<>();
        Set<Integer> duplicateSet = new HashSet<>();
        List<Integer> duplicates = new ArrayList<>();

        for (int value : array) {
            if (seen.contains(value) && !duplicateSet.contains(value)) {
                duplicateSet.add(value);
                duplicates.add(value);
            } else {
                seen.add(value);
            }
        }

        return duplicates;
    }

    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 2, 4, 5, 1, 6, 3};
        System.out.println("Duplicates: " + findDuplicates(numbers));
    }
}
