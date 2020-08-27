'<template>
  <div class="hello">
    <div id="signUp" class="form-group">
      <p>{{ errorMessage }}</p>
      <div class="container-fluid d-flex justify-content-center">
        <div class="">
          <input class="form-control" type="email" v-model="userEmail" placeholder="Email"> <br>
          <input class="form-control" type="password" v-model="userPw" placeholder="Password"> <br>
        </div>
      </div>
        <div class=" d-flex justify-content-center">
          <button class="btn btn-primary" @click="auth">Sign Up</button>
          <button class="btn btn-secondary" @click="swapToGuestLogin">Guest Login</button> <br>
          <button class="btn btn-dark" @click="swapToSignIn">Already Have an account?</button>
        </div>
    </div>

    <div id="login" class="form-group">
      <p>{{ errorMessage }}</p>
      <div class="container-fluid d-flex justify-content-center">
        <div class="">
          <input class="form-control" type="email" v-model="userEmailLogin" placeholder="Email"> <br>
          <input class="form-control" type="password" v-model="userPwLogin" placeholder="Password"> <br>
          <button class="btn btn-primary" @click="authLogin">Login</button> <br>
          <button class="btn btn-secondary" @click="swapToSignUp">Create an account</button>
        </div>
      </div>
    </div>

    <div id="content">
      <button class="btn btn-primary" @click="signOut" style="position: absolute; top:0; left:0; width:20%; border:none" v-if="isSignedIn === true">Signout</button>
      <button class="btn btn-primary"  @click="swapToSignIn" style="position: absolute; top:0; left:0; width:20%; border:none" v-if="isSignedIn === false">Signin</button>
      <h1>Welcome</h1>
      <div class="addAnItem form-group container-fluid d-flex justify-content-center" v-if="isSignedIn === true">
        <div class="">
          <input class="form-control" type="text" placeholder="Name (of work)" id="userWorkName"> <br>
          <input type="file" placeholder="imageURL" @change="previewFiles" id="imageURL"> <br>
          <input class="form-control" type="text" placeholder="Author" id="author"> <br>
          <input class="form-control" type="url" placeholder="Link To Site/Portfolio" id="portfolioLink"> <br>
          <button class="btn btn-primary" @click="addItem">Add Item</button>
        </div>
      </div>

      <div class="items">
        <ul class="" id="example-1">
          <li v-for="item in items" :key="item.message">
            <div class="showItem">
              <img class="thumbnail-image" lass alt="" v-bind:src="item.userImageURL" width="100%"> <br>
              <h5 style="margin:0; padding-top: 10px;">{{ item.userWorkName }}</h5>
              {{ item.userAuthor }} <br>
              <a v-bind:href="item.userPortfolioLink" target="_blank">View Portfolio</a> <br>
              <!-- <button >Edit Item</button> -->
              <div class="d-flex justify-content-between">
                <div class="">
                  <span @click="likeItem(item.id, item.likes++)"><i class="fas fa-heart fa-lg" style="color: red; margin-top: 13px; margin-left: 20px;"></i></span><a style="color: white"> {{ item.likes }}</a>
                </div>
                <div style="padding-right: 10px;" class="">
                  <button class="btn btn-secondary" type="button" name="button" @click="showEditItem(item.id, item.userWorkName, item.userImageURL, item.userAuthor, item.userPortfolioLink)" v-if="isSignedIn === true">Edit</button>
                  <button class="btn btn-danger" type="button" name="button" @click='deleteItem(item.id)'>Delete</button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="editItems form-control" id="editItem">
        <div class="container-fluid d-flex justify-content-center">
          <div class="">
            <input class="form-control" type="text" placeholder="Name (of work)" id="userWorkNameReplace"> <br>
            <input class="form-control" type="url" placeholder="imageURL" id="imageURLReplace"> <br>
            <input class="form-control" type="text" placeholder="Author" id="authorReplace"> <br>
            <input class="form-control" type="url" placeholder="Link To Site/Portfolio" id="portfolioLinkReplace"> <br>
            <button class="btn btn-primary" @click="editItem">Edit Item</button>
          </div>
        </div>
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
import bootstrap from 'bootstrap'
import fontawesome from 'fontawesome'
require('firebase/auth')

// Console log to satisfy linter
console.log(db + Vue)
console.log(bootstrap)
console.log(fontawesome)
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
      editObj: false,
      imageUpload: false
    }
  },
  // Issue with error message remaining on "Have an Account page"
  methods: {
    // Create User
    auth: function () {
      const v = this
      firebase.auth().createUserWithEmailAndPassword(v.userEmail, v.userPw).then(function () {
        v.swapToSignIn()
      }).catch(function (error) {
        // Handle Errors here.
        console.error(error.code)
        console.error(error.message)
        // v.errorMessage = error.message
        toastr.error('Sign up Unsuccessful')
        // ...
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
        toastr.error('Login Unsuccessful')
        // ...
      })
    }, // Signin ENDS
    // Transitions & hide/shows
    // Issue with setInterval specified delay not working
    swapToSignIn: function () {
      $('#signUp').hide(100)
      $('#login').show(100)
      $('#content').hide(100)
      toastr.info('Please Login to Continue')
      // setInterval(function () { toastr.clear() }, 3000)
    },
    swapToSignUp: function () {
      $('#signUp').show(100)
      $('#login').hide(100)
      toastr.info('Please Sign up to Continue')
    },
    swapToContent: function () {
      $('#signUp').hide()
      $('#login').hide()
      $('#content').show(100)
      toastr.success('User Login Successful')
    },
    swapToGuestLogin: function () {
      $('#signUp').hide()
      $('#login').hide()
      $('#content').show(100)
      toastr.success('Guest Login Successful')
    }, // Transitions ENDS
    // Signout method
    signOut: function () {
      localStorage.setItem('signedIn', 'false')
      location.reload()
    }, // Signout ENDS
    // Add item
    addItem: function () {
      const v = this
      // Grabbing data from the DOM
      var nameOfWork = document.getElementById('userWorkName').value
      var imageURL = v.imageUpload
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
    }, // Like item ENDS

    // Delete item
    deleteItem: function (id) {
      console.log(id)
      db.collection('showoff').doc(id).delete().then(function () {
        console.log('Document successfully deleted!')
        // Refresh page after deleting item
        location.reload()
      }).catch(function (error) {
        console.error('Error removing document: ', error)
      })
    },
    previewFiles (event) {
      var v = this
      console.log(event.target.files[0])
      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })

      async function Main () {
        console.log(await toBase64(event.target.files[0]))
        v.imageUpload = await toBase64(event.target.files[0])
        console.log(v.imageUpload)
      }

      Main()
    }

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
      toastr.success('User Login Successful')
    } else {
      toastr.info('Please Sign up to Continue')
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
  width: 240px;
}
a {
  color: #42b983;
}
#login, #content {
  display: none;
}
.btn {
  margin: 5px;
}
.showItem {
  background-color: lightgrey;
  width: 100%;
  padding-bottom: 10px;
  border-radius: 0.45em;
  margin-top: 20px;
}
.thumbnail-image {
    width: 240px; /* You can set the dimensions to whatever you want */
    height: 240px;
    object-fit: cover;
    border-top-left-radius: 0.45em;
    border-top-right-radius: 0.45em;
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
.items {
  width: 80%;
  margin: auto;
}
@import'~bootstrap/dist/css/bootstrap.css'
</style>
