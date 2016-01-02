/* global PDFJS */
import 'pdfjs-dist'

let cvRoute = () => {
  PDFJS.getDocument('./ColinKinloch.pdf')
  .then(function (pdfDocument) {
  // Document loaded, retrieving the page.
  return pdfDocument.getPage(1).then(function (pdfPage) {
    // Creating the page view with default parameters.
    var pdfPageView = new PDFJS.PDFPageView({
      container: document.querySelector('#pdf-canvas'),
      id: 1,
      scale: 1.0,
      defaultViewport: pdfPage.getViewport(1.0),
      // We can enable text/annotations layers, if needed
      // textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
      // annotationLayerFactory: new PDFJS.DefaultAnnotationLayerFactory()
    });
    // Associates the actual page with the view, and drawing it
    pdfPageView.setPdfPage(pdfPage);
    return pdfPageView.draw();
  });
})
  /*.then((pdf) => {
    console.log(pdf)
    return pdf.getPage(1)
    .then((page) => {
      let scale = 1.5
      let viewport = page.getViewport(scale)

      let canvas = document.querySelector('#pdf-canvas')
      let context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width

      let renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      page.render(renderContext)
      console.log(page)
    })
  })*/
}

export default cvRoute
