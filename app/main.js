import _ from 'lodash'
import rotyduck from './rotyduck'

import 'pdfjs-dist'

PDFJS.getDocument('./ColinKinloch.pdf')
.then((pdf) => {
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
})

/*
let thing = () => {
  let content = document.querySelector('.content')
  switch (window.location.hash) {
    case '#cv/pdf': {
      require('bundle!./pdf.js')((hi) => {
        hi(content)
      })
      break
    }
    default: {
      while (content.firstChild) content.firstChild.remove()
    }
  }
}
*/
// window.addEventListener('hashchange', thing)
// thing()
/*
let createLink = (text, href) => {
  console.log(text)
  let li = document.createElement('li')
  let a = document.createElement('a')
  a.setAttribute('href', href)
  a.innerHTML = text
  li.appendChild(a)
  return li
}

let repoUrl = 'https://api.github.com/users/ColinKinloch/repos'
let repoString = sessionStorage.getItem(repoUrl)
let fillDom = (repos) => {
  let elCont = document.querySelector('.gh-list')
  while (elCont.firstChild) elCont.firstChild.remove()
  let h = document.createElement('h1')
  h.innerHTML = 'My Projects:'
  elCont.appendChild(h)
  let ul = document.createElement('ol')
  elCont.appendChild(ul)
  for (let repo of repos) {
    ul.appendChild(createLink(repo.name, repo.homepage || repo.html_url))
    console.log(repo)
  }
}

if (repoString === null) {
  fetch(repoUrl)
  .then((res) => {
    return res.json()
  })
  .then((rawRepos) => {
    let repos = _(rawRepos)
    .reject((r) => {
      return r.fork
      // r.stargazers_count <= 0
    })
    .sortBy((r) => {
      return Date.parse(r.updated_at)
    })
    .sortBy('stargazers_count')
    .reverse()
    .splice(0, 10)
    .value()

    console.log('hey babby')

    sessionStorage.setItem(repoUrl, JSON.stringify(repos))

    fillDom(repos)
  })
  .catch((err) => {
    console.log('Failed to get repos:', err)
  })
} else {
  console.log('STORED')
  let repos = JSON.parse(repoString)
  fillDom(repos)
}

sessionStorage.removeItem(repoUrl)
*/
rotyduck()
