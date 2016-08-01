# din-6771
Draw DIN 6771 frame to PDFKit document

```javascript
const PDFDocument = require('pdfkit');
const din6771 = require('din-6771');

var doc = new PDFDocument({
    layout: 'landscape',
    size: 'A3'
});

din6771(doc).draw();

doc.save().end();
```

# Output example

![A3 example](A3-example.png)

# Installation

```shell
npm install spreecode/node-din-6771
```
