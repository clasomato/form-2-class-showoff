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
      <button @click="signOut" style="position: absolute; top:0; left:0; width:20%; border:none">Signout</button>
      <h1>Welcome</h1>
      <div class="addAnItem">
        <input type="text" placeholder="Name (of work)" id="userWorkName"> <br>
        <input type="text" placeholder="imageURL" id="imageURL"> <br>
        <input type="text" placeholder="Author" id="author"> <br>
        <input type="text" placeholder="Link To Site/Portfolio" id="portfolioLink"> <br>
        <button @click="addItem">Add Item</button>
      </div>

      <div class="items">
        <ul id="example-1">
          <li v-for="item in items" :key="item.message">
            <div class="showItem">
              <!-- {{ item.id }} -->
              {{ item.userWorkName }} <br>
              <img alt="" v-bind:src="item.userImageURL" width="20%"> <br>
              {{ item.userAuthor }} <br>
              <a v-bind:href="item.userPortfolioLink" target="_blank">View Portfolio</a>
            </div>
          </li>
        </ul>
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
// var firebaseConfig = {
//   apiKey: 'AIzaSyCaQXgylYy5KGT4o7GS-RaW_TAHQItns1Q',
//   authDomain: 'form2-showoff.firebaseapp.com',
//   databaseURL: 'https://form2-showoff.firebaseio.com',
//   projectId: 'form2-showoff',
//   storageBucket: 'form2-showoff.appspot.com',
//   messagingSenderId: '714780095107',
//   appId: '1:714780095107:web:aaca9357f34b288eefa1b6'
// }
// firebase.initializeApp(firebaseConfig)

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
      errorMessage: '',
      items: false
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
    },
    addItem: function () {
      var nameOfWork = document.getElementById('userWorkName').value
      var imageURL = document.getElementById('imageURL').value
      var author = document.getElementById('author').value
      var portfolioLink = document.getElementById('portfolioLink').value

      function getRandomInt (max) {
        return Math.floor(Math.random() * Math.floor(max))
      }

      var id = getRandomInt(1000)
      var docoId = id.toString()

      // Add a new document in collection "cities"
      db.collection('showoff').doc(docoId).set({
        id: docoId,
        userWorkName: nameOfWork,
        userImageURL: imageURL,
        userAuthor: author,
        userPortfolioLink: portfolioLink
      })
        .then(function () {
          console.log('Document successfully written!')
          location.reload()
        })
        .catch(function (error) {
          console.error('Error writing document: ', error)
        })
    }
  },
  mounted () {
    const v = this
    var data = []
    if (localStorage.getItem('signedIn') === 'true') {
      console.log('swap to content')
      v.isSignedIn = true
      v.swapToContent()
    } else {
      toastr.warning('Please Signin To Continue')
    }

    db.collection('showoff').onSnapshot(function (pets) {
      // pets is the data response or collection - we use a forEach
      // loop to loop through and then list
      pets.forEach(function (doc) {
        // eachDoc is a js object representing each document in the collection
        var eachDoc = doc.data()
        // logging eachDoc to the console
        // console.log(eachDoc)
        data.push(eachDoc)
        v.items = data
        console.log(v.items)
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
* {
  box-sizing: border-box;
}
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

.showItem {
  background-color: #fa695f;
  width: 100%;
  padding: 5%;
  border-radius: 0.25em;
}

input {
  border-radius: 0px;
  border: 1px solid darkgrey;
  padding: 1% 2%;
  margin: 0.5%;
  font-size: 1.2em;
  width: 40%;
}

button {
  background-color: white;
  border-radius: 0px;
  border: 1px solid darkgrey;
  cursor: pointer;
  font-size: 1.2em;
  padding: 1% 2%;
  margin: 0.25%;
  width: 40%;
}
</style>
