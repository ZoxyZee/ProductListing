import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class PaginatedProduct {
  final int id;
  final String title;
  final double price;

  PaginatedProduct({
    required this.id,
    required this.title,
    required this.price,
  });

  factory PaginatedProduct.fromJson(Map<String, dynamic> json) {
    return PaginatedProduct(
      id: json['id'] as int,
      title: json['title'] as String,
      price: (json['price'] as num).toDouble(),
    );
  }
}

class PaginationScreen extends StatefulWidget {
  const PaginationScreen({super.key});

  @override
  State<PaginationScreen> createState() => _PaginationScreenState();
}

class _PaginationScreenState extends State<PaginationScreen> {
  final ScrollController _scrollController = ScrollController();
  final List<PaginatedProduct> _products = [];

  static const int _limit = 10;
  int _skip = 0;
  int _total = 0;
  bool _isLoading = false;
  bool _hasError = false;

  @override
  void initState() {
    super.initState();
    _fetchNextPage();

    _scrollController.addListener(() {
      final isNearBottom = _scrollController.position.pixels >=
          _scrollController.position.maxScrollExtent - 200;

      if (isNearBottom && !_isLoading && _products.length < _total) {
        _fetchNextPage();
      }
    });
  }

  Future<void> _fetchNextPage() async {
    setState(() {
      _isLoading = true;
      _hasError = false;
    });

    try {
      final uri = Uri.parse(
        'https://dummyjson.com/products?limit=$_limit&skip=$_skip',
      );
      final response = await http.get(uri);

      if (response.statusCode != 200) {
        throw Exception('Failed to load products');
      }

      final decoded = jsonDecode(response.body) as Map<String, dynamic>;
      final productJson = decoded['products'] as List<dynamic>;
      final nextProducts = productJson
          .map((item) => PaginatedProduct.fromJson(item as Map<String, dynamic>))
          .toList();

      setState(() {
        _products.addAll(nextProducts);
        _total = decoded['total'] as int;
        _skip += _limit;
      });
    } catch (_) {
      setState(() {
        _hasError = true;
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Paginated Products')),
      body: ListView.builder(
        controller: _scrollController,
        itemCount: _products.length + 1,
        itemBuilder: (context, index) {
          if (index == _products.length) {
            if (_hasError) {
              return Padding(
                padding: const EdgeInsets.all(16),
                child: ElevatedButton(
                  onPressed: _fetchNextPage,
                  child: const Text('Retry'),
                ),
              );
            }

            if (_isLoading) {
              return const Padding(
                padding: EdgeInsets.all(16),
                child: Center(child: CircularProgressIndicator()),
              );
            }

            return const SizedBox.shrink();
          }

          final product = _products[index];

          return ListTile(
            title: Text(product.title),
            subtitle: Text('\$${product.price.toStringAsFixed(2)}'),
          );
        },
      ),
    );
  }
}
