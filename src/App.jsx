import { useEffect, useState } from 'react'
import './App.css'

function UserBadge({ userData }) {
  return (
    <div>
      {userData !== undefined && (
        <ol>
          <img src={userData?.avatar_url}></img>
          <li>{userData?.name === null ? userData?.login : userData?.name}</li>
          <li>Followers: {userData?.followers}</li>
          <li>Following: {userData?.following}</li>
        </ol>
      )}
    </div>
  )
}

function RepoList({ userRepos, handleSetUserRepos }) {
  return (
    <div>
      {userRepos &&
        userRepos.map(repo => {
          return (
            <div key={repo.id + repo.name}>
              <ol key={repo.id}>
                <li>Name: {repo.name}</li>
                <li>
                  Description:{' '}
                  {repo.description === null
                    ? 'There is no description for this repo'
                    : repo.description}{' '}
                </li>
                <li>Git URL: {repo.git_url} </li>
                <li>Number of Stars: {repo.stargazers_count} </li>
                <li>Forks Count: {repo.forks_count} </li>
                <li>Number of open issues: {repo.open_issues} </li>
                <li>Repository Size: {repo.size} </li>
              </ol>
              <button key={repo.name} onClick={() => handleSetUserRepos(repo)}>
                Delete Repository
              </button>
            </div>
          )
        })}
    </div>
  )
}

export default function App() {
  const [input, setInput] = useState('')
  const [userData, setUserData] = useState(undefined)
  const [userRepos, setUserRepos] = useState(undefined)
  //https://api.github.com/users/{username}

  const handleSetUserRepos = data => {
    const newRepos = userRepos.reduce(
      (prev, curr) => (curr.id !== data.id ? [...prev, curr] : [...prev]),
      []
    )
    setUserRepos(newRepos)
  }

  useEffect(() => {
    if (userData) {
      fetch(`https://api.github.com/users/${userData.login}/repos`)
        .then(response => response.json())
        .then(data => setUserRepos(data))
    }
  }, [userData])

  const handleSubmit = e => {
    e.preventDefault()
    fetch(`https://api.github.com/users/${input}`)
      .then(response => response.json())
      .then(data => setUserData(data))
    setInput('')
  }

  return (
    <div className="App">
      <form>
        <label htmlFor="input">Insert GitHub username</label>
        <input
          type="text"
          id="input"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </form>
      <UserBadge userData={userData} />
      {userData !== undefined && (
        <RepoList
          userRepos={userRepos}
          handleSetUserRepos={handleSetUserRepos}
        />
      )}
    </div>
  )
}
