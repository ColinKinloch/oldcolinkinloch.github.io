import React from 'react'
import ReactDom from 'react-dom'

let cv = () => {
  let pdfUrl = 'ColinKinloch.pdf'
  ReactDom.render(
    React.createElement('object', {className: 'cv-pdf', data: pdfUrl, type: 'application/pdf'},
      React.createElement('a', {href: pdfUrl}, 'Click here for CV')
    ),
    document.querySelector('main'))
}

export default cv
