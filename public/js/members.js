$(document).ready(function() {

  var memberList = $(".member-list");
  var newBookSection = $(".new-book-section");

  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });

  $(".add-new").click(function() {
    memberList.empty();
    $(".update-database").remove();
    var title = $("#book-name").val();
    console.log("query = https://www.googleapis.com/books/v1/volumes?q=" + title);

    $.ajax({
      url: "https://www.googleapis.com/books/v1/volumes?q=" + title,
      method: "GET",
      success: function(data) {
        for (var i = 0; i < data.items.length; i++) {
          memberList.append("<input value=\"" + data.items[i].volumeInfo.title + "\" type=\"radio\" name=\"book\" id=\"title" + i + "\"><label id=\"title" + i + "\" for=\"title" + i + "\" value=\"" + data.items[i].volumeInfo.title + "\">" + data.items[i].volumeInfo.title + "</label><br>");
        }
        newBookSection.append("<button class=\"update-database\">Add Selected</button>");

        $(document).delegate(".update-database","click", function(e) {
          e.preventDefault();
          var thisBookIndex = $("input:Checked").attr("id");
          thisBookIndex = thisBookIndex.replace(/\D/g,''); //parse to return just the number
          var newTitle = $("input:checked").val();
          var author = data.items[thisBookIndex].volumeInfo.authors[0];

          console.log("---------------NEW BOOK!!---------------")
          console.log("thisBookIndex = " + thisBookIndex);
          console.log("newTitle = " + newTitle);
          console.log("author = " + author);
          
          
          addBook(newTitle, author);
          $("#title" + thisBookIndex).remove() //now remove those html elements
          $("#title" + thisBookIndex).remove() //for whatever reason we need to call it twice in order to remove both elements. else it just removes the first instance, aka the input tag
        });
      }
    });
  });

  function addBook(title, author){
    $.post("/api/addnew", {
      title: title,
      author: author
    })
      .then(function() {
        //show some alert that books were added??? idk man
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  }
});
