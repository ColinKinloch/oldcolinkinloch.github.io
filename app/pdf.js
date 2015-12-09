let pdf = (el) => {
  while (el.firstChild) el.firstChild.remove()
  let file = 'ColinKinloch.pdf'
  let pdf = document.createElement('object')
  pdf.setAttribute('data', file)
  pdf.setAttribute('type', 'application/pdf')
  let link = document.createElement('a')
  link.setAttribute('href', file)
  pdf.appendChild(link)
  el.appendChild(pdf)
}
export default pdf
