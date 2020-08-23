<template>
  <div class="hello">
    <div id="signUp">
      <p>{{ errorMessage }}</p>
      <input type="email" v-model="userEmail" placeholder="Email"> <br>
      <input type="password" v-model="userPw" placeholder="Password"> <br>
      <button @click="auth">Sign Up</button> <br>
      <button @click="swapToSignIn">Already Have an account?</button>
      <button @click="swapToGuestLogin">Guest Login</button>
    </div>

    <div id="login">
      <p>{{ errorMessage }}</p>
      <input type="email" v-model="userEmailLogin" placeholder="Email"> <br>
      <input type="password" v-model="userPwLogin" placeholder="Password"> <br>
      <button @click="authLogin">Login</button> <br>
      <button @click="swapToSignUp">Create an account</button>
    </div>

    <div id="content">
      <button @click="signOut" style="position: absolute; top:0; left:0; width:20%; border:none" v-if="isSignedIn === true">Signout</button>
      <button @click="swapToSignIn" style="position: absolute; top:0; left:0; width:20%; border:none" v-if="isSignedIn === false">Signin</button>
      <h1>Welcome</h1>
      <div class="addAnItem" v-if="isSignedIn === true">
        <input type="text" placeholder="Name (of work)" id="userWorkName"> <br>
        <input type="url" placeholder="imageURL" id="imageURL"> <br>
        <input type="text" placeholder="Author" id="author"> <br>
        <input type="url" placeholder="Link To Site/Portfolio" id="portfolioLink"> <br>
        <button @click="addItem">Add Item</button>
      </div>

      <div class="items">
        <ul id="example-1">
          <li v-for="item in items" :key="item.message">
            <div class="showItem">
              <h3 style="margin:0; padding:0;">{{ item.userWorkName }}</h3> <br>
              <img alt="" v-bind:src="item.userImageURL" width="90%"> <br>
              {{ item.userAuthor }} <br>
              <a v-bind:href="item.userPortfolioLink" target="_blank">View Portfolio</a> <br>
              <!-- <button >Edit Item</button> -->
              <img src="../assets/edit-solid.svg" alt="" width="5%" @click="showEditItem(item.id, item.userWorkName, item.userImageURL, item.userAuthor, item.userPortfolioLink)" v-if="isSignedIn === true" style="color:white">
              <img src="../assets/heart-regular.svg" alt="" width="4%" @click="likeItem(item.id, item.likes++)"> <a>{{ item.likes }}</a>
            </div>
          </li>
        </ul>
      </div>

      <div class="editItems" id="editItem">
        <input type="text" placeholder="Name (of work)" id="userWorkNameReplace"> <br>
        <input type="url" placeholder="imageURL" id="imageURLReplace"> <br>
        <input type="text" placeholder="Author" id="authorReplace"> <br>
        <input type="url" placeholder="Link To Site/Portfolio" id="portfolioLinkReplace"> <br>
        <button @click="editItem">Edit Item</button>
      </div>
    </div>
  </div>
</template>

<script>
// Imports
import Vue from 'vue'
import db from '../firebase.js'
import firebase from 'firebase'
import toastr from 'toastr'
require('firebase/auth')

// Console log to satisfy linter
console.log(db + Vue)

// setting jquery to $ var
var $ = require('jquery')

// Setting up the vue instance
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
      items: false,
      editObj: false
    }
  },
  methods: {
    // Create User
    auth: function () {
      const v = this
      firebase.auth().createUserWithEmailAndPassword(v.userEmail, v.userPw).then(function () {
        v.swapToSignIn()
      }).catch(function (error) {
        console.error(error.code)
        console.error(error.message)
        v.errorMessage = error.message
      })
    }, // Create user ENDS
    // Signin
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
    }, // Signin ENDS
    // Transitions & hide/shows
    swapToSignIn: function () {
      $('#signUp').hide(100)
      $('#login').show(100)
      $('#content').hide(100)
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
    swapToGuestLogin: function () {
      $('#signUp').hide()
      $('#login').hide()
      $('#content').show(100)
    }, // Transitions ENDS
    // Signout method
    signOut: function () {
      localStorage.setItem('signedIn', 'false')
      location.reload()
    }, // Signout ENDS
    // Add item
    addItem: function () {
      // Grabbing data from the DOM
      var nameOfWork = document.getElementById('userWorkName').value
      var imageURL = document.getElementById('imageURL').value
      var author = document.getElementById('author').value
      var portfolioLink = document.getElementById('portfolioLink').value

      // Function to create a random id for the document
      function getRandomInt (max) {
        return Math.floor(Math.random() * Math.floor(max))
      }

      // Setting the variable with the function return
      var id = getRandomInt(1000)

      // Converting into a string because document names must be a string
      var docoId = id.toString()

      // Add a new document in collection "showoff"
      db.collection('showoff').doc(docoId).set({
        id: docoId,
        likes: 0,
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
    }, // Add item ENDS
    // Show the edit item div
    showEditItem: function (id, workName, imgURL, author, portfolio) {
      const v = this

      // Sending the item specific data to be stored in the vue instance
      v.editObj = {
        id: id,
        workName: workName,
        imgURL: imgURL,
        author: author,
        portfolio: portfolio
      }

      // Showing the edit item modal
      $('#editItem').show()
    }, // show edit item ENDS
    // Edit item
    editItem: function () {
      // Vue variable
      const v = this

      // Grabbing the item specific data from Vue
      var id = v.editObj.id
      var name = v.editObj.workName
      var imgURL = v.editObj.imgURL
      var author = v.editObj.author
      var portfolio = v.editObj.portfolio

      // Making blank variables to be used later
      var replaceName
      var replaceIMG
      var replaceAuthor
      var replacePortfolio

      console.log(id)

      // Grabbing data from the DOM
      var nameOfWorkReplace = document.getElementById('userWorkNameReplace').value
      var imageURLReplace = document.getElementById('imageURLReplace').value
      var authorReplace = document.getElementById('authorReplace').value
      var portfolioLinkReplace = document.getElementById('portfolioLinkReplace').value

      // Check to see if we need to populate with new or old data
      if (nameOfWorkReplace !== '') {
        replaceName = nameOfWorkReplace
        console.log('named change')
      } else {
        replaceName = name
        console.log('name not chnaged')
      }

      // Check to see if we need to populate with new or old data
      if (imageURLReplace !== '') {
        replaceIMG = imageURLReplace
      } else {
        replaceIMG = imgURL
      }

      // Check to see if we need to populate with new or old data
      if (authorReplace !== '') {
        replaceAuthor = authorReplace
      } else {
        replaceAuthor = author
      }

      // Check to see if we need to populate with new or old data
      if (portfolioLinkReplace !== '') {
        replacePortfolio = portfolioLinkReplace
      } else {
        replacePortfolio = portfolio
      }

      // This is making the linter happy!
      console.log(v + replaceName + replaceIMG + replaceAuthor + replacePortfolio)

      // Setting each individual property
      db.collection('showoff').doc(id).update({ userWorkName: replaceName })
      db.collection('showoff').doc(id).update({ userImageURL: replaceIMG })
      db.collection('showoff').doc(id).update({ userAuthor: replaceAuthor })
      db.collection('showoff').doc(id).update({ userPortfolioLink: replacePortfolio })
    }, // Edit item ENDS
    // Like item
    likeItem: function (id, likes) {
      db.collection('showoff').doc(id).update({ likes: likes })
    } // Like item ENDS
  },
  // When application is loaded it will grab the items from firebase
  mounted () {
    const v = this
    var data = []

    // Checking local storage to see if the user is signed in
    if (localStorage.getItem('signedIn') === 'true') {
      // If user is signed in then it will show the content
      console.log('swap to content')
      v.isSignedIn = true
      v.swapToContent()
    } else {
      // Add a warning that the user should signin
      toastr.warning('Please Signin To Continue')
    }

    db.collection('showoff').onSnapshot(function (pets) {
      // pets is the data response or collection - we use a forEach
      // loop to loop through and then list
      pets.forEach(function (doc) {
        // eachDoc is a js object representing each document in the collection
        var eachDoc = doc.data()
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

.editItems {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba($color: #000000, $alpha: 0.8);
  display: none;
}
</style>
