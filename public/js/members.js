$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });

  //this is a test of ajax to google books. it should not be here, instead we run an ajax GET upon searching for a new book to add to list
  $.ajax({
    url: "https://www.googleapis.com/books/v1/volumes?q=Tom_Sawyer",
    method: "GET",
    success: function(data) {
      $(".member-list").text(data.items[0].volumeInfo.title);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $(".errorBox").text(textStatus + ": " + errorThrown);
    }
  });
});
