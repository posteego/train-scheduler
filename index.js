// Initialize Firebase
var config = {
  apiKey: "AIzaSyBltPazTXHT9oEkJd4xmrTnBKCEpJ4GcHw",
  authDomain: "train-scheduler-f49a0.firebaseapp.com",
  databaseURL: "https://train-scheduler-f49a0.firebaseio.com",
  projectId: "train-scheduler-f49a0",
  storageBucket: "train-scheduler-f49a0.appspot.com",
  messagingSenderId: "807560698399"
};

firebase.initializeApp(config);

var trains = firebase.database();

$('#add-train-btn').on('click', function () {
  // inputs
  var trainName = $('#train-name-input').val().trim();
  var destination = $('#destination-input').val().trim();
  var firstTrain = $('#first-train-input').val().trim();
  var frequency = $('#frequency-input').val().trim();

  // new train object
  var train = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // add train data to db
  trains.ref().push(train);

  // clear inputs
  $('#train-name-input').val('');
  $('#destination-input').val('');
  $('#first-train-input').val('');
  $('#frequency-input').val('');
});

trains.ref().on('child_added', function (childSnapshot, prevChildKey) {
  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var frequency = childSnapshot.val().frequency;
  var first = childSnapshot.val().firstTrain;

  var timeArr = first.split(":");
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  var maxTime = moment.max(moment(), trainTime);
  var minutes;
  var arrival;

  if (maxTime === trainTime) {
    arrival = trainTime.format('hh:mm A');
    minutes = trainTime.diff(moment(), "minutes");
  } else {
    var difference = moment().diff(trainTime, "minutes");
    var remainder = difference % frequency;
    minutes = frequency - remainder;
    arrival = moment().add(minutes, "m").format("hh:mm A");
  }

  $(".train-table > tbody").append("<tr><td>" +
    name + "</td><td>" + destination + "</td><td>" +
    frequency + "</td><td>" + arrival + "</td><td>" +
    minutes + "</td></tr>");
});