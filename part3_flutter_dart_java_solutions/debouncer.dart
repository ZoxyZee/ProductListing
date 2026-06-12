import 'dart:async';

class Debouncer {
  final Duration delay;
  Timer? _timer;

  Debouncer({required this.delay});

  void run(void Function() action) {
    _timer?.cancel();
    _timer = Timer(delay, action);
  }

  void dispose() {
    _timer?.cancel();
  }
}

/*
Example usage inside a Flutter search TextField:

final debouncer = Debouncer(delay: const Duration(milliseconds: 300));

TextField(
  onChanged: (value) {
    debouncer.run(() {
      print('Search API call for: $value');
    });
  },
)
*/
