import React, { useContext } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import MyContext from './state/MyContext'
import Login from './views/Login'
import Home from './views/Home'

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const context = useContext(MyContext)
  return (
    <Route
      {...restOfProps}
      render={(props) =>
        context.authorized ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  )
}

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
    </Switch>
  </main>
)

export default Main
