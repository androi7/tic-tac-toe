const fireBase = {
  firebaseConfig: {
    apiKey: "AIzaSyCkqVpCzOLx1ZI_rnPEUcANG6W8yVnMEgY",
    authDomain: "tic-tac-toe-39e7e.firebaseapp.com",
    databaseURL: "https://tic-tac-toe-39e7e.firebaseio.com",
    projectId: "tic-tac-toe-39e7e",
    storageBucket: "tic-tac-toe-39e7e.appspot.com",
    messagingSenderId: "772758314779",
    appId: "1:772758314779:web:d3ce5d13d93e999eb93dbe",
    measurementId: "G-049R41BPHQ"
  },
  // Initialize Firebase
  init: function() {
    firebase.initializeApp(this.firebaseConfig),
    firebase.analytics();
  },

  writeData: function(path, data) {
      firebase.database().ref(path).set(data);
  },

  listenToChanges: function(path) {
    firebase.database().ref(path).on('value', function(data) {
      console.log('listen', data.val());
    });
  },

  readData: function(path) {
    firebase.database().ref(path).once('value').then(function(data) {
      return data;
    });
  }

}

fireBase.init();
