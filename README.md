# BarcodeEncoder

BarcodeEncoder is a simple module for creating Code128-B barcodes from bit strings. It uses a run-length encoding with repition.

##### Build status


| Release | Develop |
----------|----------
| ![Release build status](https://img.shields.io/shippable/55e613951895ca4474115df8/develop.svg) | ![Develop build status](https://img.shields.io/shippable/55e613951895ca4474115df8/develop.svg) |


### Example

Given an input string `001001001001001` the algorithm will create a sequence of 3-tuple for `(repetitions, # of 'false', # of 'true')` together with the length. In this simple case the encoding will be `[15,5,2,1]`. The array is then ASCII encoded using a rainbow table for allowed values in the Code128 standard.
