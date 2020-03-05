/* eslint-disable prettier/prettier */
$(document).ready(function() {

  var memberList = $(".member-list");
  var newBookSection = $(".new-book-section");

  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });

  $(".add-new").click(function() {
    var title = $("#book-name").val();
    console.log("query = https://www.googleapis.com/books/v1/volumes?q=" + title);

    $.ajax({
      url: "https://www.googleapis.com/books/v1/volumes?q=" + title,
      method: "GET",
      success: function(data) {
        for (var i = 0; i < data.items.length; i++) {
          memberList.append("<input type=\"radio\" id=\"title\"" + i + "><label for=\"title\"" + i + "\">" + data.items[i].volumeInfo.title + "</label><br>");
        }
        newBookSection.append("<button class=\"update-database\">Add Selected</button>");

      },
      error: function(jqXHR, textStatus, errorThrown) {
        $(".errorBox").text(textStatus + ": " + errorThrown);
      }
    });
  });
});
