import _ from 'lodash'

export default new Promise((resolve, reject) => {
  window.addEventListener('WebComponentsReady', () => {
    let GhListElement = document.registerElement('gh-list', {
      prototype: Object.create(
        HTMLElement.prototype,
        {
          urlRoot: { writeable: false, value: 'https://api.github.com/users' },
          urlRepos: { writeable: false, value: 'repos' },
          createdCallback: { writeable: false, value: function () {
            this.user = this.getAttribute('user')
            fetch(`${this.urlRoot}/${this.user}/${this.urlRepos}`)
            .then((res) => {
              return res.json()
            })
            .then((rawRepos) => {
              let repos = _(rawRepos)
              .reject((r) => {
                return r.fork
              })
              .sortBy((r) => {
                return Date.parse(r.updated_at)
              })
              .sortBy('stargazers_count')
              .reverse()
              .splice(0, 10)
              .value()

              let list = document.createElement('ol')
              this.appendChild(list)

              for (let repo of repos) {
                let item = document.createElement('li')
                let link = document.createElement('a')
                link.setAttribute('href', repo.homepage || repo.html_url)
                link.innerHTML = repo.name
                item.appendChild(link)
                list.appendChild(item)
              }
            })
            .catch((err) => {
              console.log('Failed to get repos:', err)
            })
          }}
        }
      )
    })
    resolve(GhListElement)
  })
})
