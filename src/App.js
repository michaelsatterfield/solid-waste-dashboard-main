import './App.css'
import Main from './Main'
import MyProvider from './state/MyProvider'

function App() {
  return (
    <div>
      <MyProvider>
        <Main />
      </MyProvider>
    </div>
  )
}

export default App
