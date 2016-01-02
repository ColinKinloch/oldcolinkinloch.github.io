import _ from 'lodash'
import React from 'react'
import ReactDom from 'react-dom'
import {Router} from 'director'
import rotyduck from './rotyduck'
import cv from './cv'

class GHListItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {title: props.title, link: props.link}
  }
  render () {
    return React.createElement('li', {}, React.createElement('a', {href: this.state.link}, this.state.title))
  }
}

class GHList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {repos: []}
  }
  loadReposFromServer () {
    fetch(`https://api.github.com/users/${this.props.user}/repos`)
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
      this.setState({repos: repos})
    })
  }
  componentDidMount () {
    this.loadReposFromServer()
  }
  render () {
    let RepoNodes = this.state.repos.map((repo) => {
      console.log(repo)
      return React.createElement(GHListItem, {
        key: repo.id,
        title: repo.name,
        link: repo.homepage || repo.html_url
      })
    })
    return React.createElement('ol', {repos: this.state.repos}, RepoNodes)
  }
}
ReactDom.render(React.createElement(GHList, {user: 'ColinKinloch'}), document.querySelector('.gh-list'))

let router = Router({
  '/cv': cv
})

router.init()

rotyduck()
