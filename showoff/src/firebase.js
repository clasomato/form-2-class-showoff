var firebase = require('firebase')

var firebaseObj = {
  firebaseConfig: {
    apiKey: 'AIzaSyCaQXgylYy5KGT4o7GS-RaW_TAHQItns1Q',
    authDomain: 'form2-showoff.firebaseapp.com',
    databaseURL: 'https://form2-showoff.firebaseio.com',
    projectId: 'form2-showoff',
    storageBucket: 'form2-showoff.appspot.com',
    messagingSenderId: '714780095107',
    appId: '1:714780095107:web:aaca9357f34b288eefa1b6'
  },
  getDb: function () {
    const firebaseApp = firebase.initializeApp(firebaseObj.firebaseConfig)
    const db = firebaseApp.firestore()
    return db
  }
}
module.exports = firebaseObj.getDb()
