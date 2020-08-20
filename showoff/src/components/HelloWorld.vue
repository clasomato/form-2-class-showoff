<template>
  <div class="hello">
    <div id="signUp">
      <p>{{ errorMessage }}</p>
      <input type="email" v-model="userEmail" placeholder="Email"> <br>
      <input type="password" v-model="userPw" placeholder="Password"> <br>
      <button @click="auth">Sign Up</button> <br>
      <button @click="swapToSignIn">Already Have an account?</button>
    </div>

    <div id="login">
      <p>{{ errorMessage }}</p>
      <input type="email" v-model="userEmailLogin" placeholder="Email"> <br>
      <input type="password" v-model="userPwLogin" placeholder="Password"> <br>
      <button @click="authLogin">Login</button> <br>
      <button @click="swapToSignUp">Create an account</button>
    </div>

    <div id="content">
      <button @click="signOut">Signout</button>
      <h1>Welcome</h1>
      <div class="addAnItem">
        <input type="text" placeholder="Name (of work)">
        <input type="text" placeholder="imageURL">
        <input type="text" placeholder="Author">
        <input type="text" placeholder="Link To Site/Portfolio">
      </div>
    </div>
  </div>
</template>

<script>
// Jquery Setup
import db from '../firebase.js'
// var db = firebase
import firebase from 'firebase'
import toastr from 'toastr'
require('firebase/auth')
var firebaseConfig = {
  apiKey: 'AIzaSyCaQXgylYy5KGT4o7GS-RaW_TAHQItns1Q',
  authDomain: 'form2-showoff.firebaseapp.com',
  databaseURL: 'https://form2-showoff.firebaseio.com',
  projectId: 'form2-showoff',
  storageBucket: 'form2-showoff.appspot.com',
  messagingSenderId: '714780095107',
  appId: '1:714780095107:web:aaca9357f34b288eefa1b6'
}
firebase.initializeApp(firebaseConfig)

console.log(db)

var $ = require('jquery')

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      userEmail: '',
      userPw: '',
      userEmailLogin: '',
      userPwLogin: '',
      isSignedIn: false,
      errorMessage: ''
    }
  },
  methods: {
    auth: function () {
      const v = this
      firebase.auth().createUserWithEmailAndPassword(v.userEmail, v.userPw).then(function () {
        v.swapToSignIn()
      }).catch(function (error) {
        console.error(error.code)
        console.error(error.message)
        v.errorMessage = error.message
      })
    },
    authLogin: function () {
      const v = this
      firebase.auth().signInWithEmailAndPassword(v.userEmailLogin, v.userPwLogin).then(function () {
        console.log('guess whart le login works')
        localStorage.setItem('signedIn', 'true')
        v.isSignedIn = true
        if (v.isSignedIn === true) {
          v.swapToContent()
        }
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code
        console.log(errorCode)
        // ...
      })
    },
    swapToSignIn: function () {
      $('#signUp').hide(100)
      $('#login').show(100)
    },
    swapToSignUp: function () {
      $('#signUp').show(100)
      $('#login').hide(100)
    },
    swapToContent: function () {
      $('#signUp').hide()
      $('#login').hide()
      $('#content').show(100)
    },
    signOut: function () {
      localStorage.setItem('signedIn', 'false')
      location.reload()
    }
  },
  mounted () {
    const v = this
    if (localStorage.getItem('signedIn') === 'true') {
      console.log('swap to content')
      v.isSignedIn = true
      v.swapToContent()
    } else {
      toastr.warning('Please Signin To Continue')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// @import "../toastr/build/toastr.css";
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#login, #content {
  display: none;
}
</style>
