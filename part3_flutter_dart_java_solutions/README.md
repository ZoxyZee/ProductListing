# Part 3: Practical Coding Questions

This folder contains separate Flutter, Dart, and Java solutions for the original assignment questions shown in the image.

## Files

- `flutter_api_list_screen.dart` - Calls an API and displays data in a Flutter list.
- `flutter_pagination_screen.dart` - Implements paginated list loading in Flutter.
- `debouncer.dart` - Debounces user input in Dart.
- `ReverseString.java` - Reverses a string without built-in reverse methods.
- `FindDuplicates.java` - Finds duplicate elements in an integer array.

## Notes

- Flutter examples use `http`, so add this dependency to `pubspec.yaml` if running them:

```yaml
dependencies:
  http: ^1.2.2
```

- The Java examples can be compiled directly:

```bash
javac ReverseString.java FindDuplicates.java
java ReverseString
java FindDuplicates
```
