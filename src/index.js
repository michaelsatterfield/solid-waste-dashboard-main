import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import firebase from 'firebase/app'
require('firebase/firestore')

let firebaseConfig = {
  apiKey: 'AIzaSyA4oVqvuuzGpb9AhlIoicj_EaSY3iXhkt0',
  authDomain: 'solid-waste-search.firebaseapp.com',
  projectId: 'solid-waste-search',
  storageBucket: 'solid-waste-search.appspot.com',
  messagingSenderId: '16635686285',
  appId: '1:16635686285:web:b313b43f1b8e320181e1c4',
  measurementId: 'G-PS2PMJYR1S',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
