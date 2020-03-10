$(document).ready(function() {

  let memberList = $(".member-list");
  let newBookSection = $(".new-book-section");

  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.userName + "!");
  });

  $(".add-new").click(function() {
    memberList.empty();
    $(".update-database").remove();
    let title = $("#book-name").val();
    console.log("query = https://www.googleapis.com/books/v1/volumes?q=" + title);

    $.ajax({
      url: "https://www.googleapis.com/books/v1/volumes?q=" + title,
      method: "GET",
      success: function(data) {
        for (let i = 0; i < data.items.length; i++) {
          memberList.append("<input value=\"" + data.items[i].volumeInfo.title + "\" type=\"radio\" name=\"book\" id=\"title" + i + "\"><label id=\"title" + i + "\" for=\"title" + i + "\" value=\"" + data.items[i].volumeInfo.title + "\">" + data.items[i].volumeInfo.title + "</label><br>");
        }
        newBookSection.append("<button class=\"update-database\" onclick=\"setTimeout(addTimeout, 3000)\">Add Selected</button>");

        $(document).delegate(".update-database","click", function(e) {
          e.preventDefault();
          let thisBookIndex = $("input:Checked").attr("id");
          thisBookIndex = thisBookIndex.replace(/\D/g,''); //parse to return just the number
          let newTitle = $("input:checked").val();
          let author = data.items[thisBookIndex].volumeInfo.authors[0];
          
          addBook(newTitle, author);
          $("#title" + thisBookIndex).remove() //now remove those html elements
          $("#title" + thisBookIndex).remove() //for whatever reason we need to call it twice in order to remove both elements. else it just removes the first instance, aka the input tag
          
          $("#addAlert").html("<div class=\"alert alert-success\" role=\"alert\">Added Successfully!</div>");
        });
      }
    });
  });

  $(".publish").click(function(){
    let title = $(".pubTitle").val();
    let author = $(".pubAuthor").val();
    let body = $(".pubBody").val();

    //parse body string to start with paragraph, replace all isntances of 'enter;' with a new paragraph block and end with end paragraph block
    body = "<p>" + body;
    body = body.replace(/(?:\r\n|\r|\n)/g, '</p><p>');
    body = body + "</p>";

    console.log(body);
    publish(title, author, body);
    $("#pubAlert").html("<div class=\"alert alert-success\" role=\"alert\">Published Successfully!</div>");
  });

  function addBook(title, author){
    $.post("/api/addnew", {
      title: title,
      author: author
    });
  }

  function publish(title, author, body){
    $.post("api/publish", {
      title: title,
      author: author,
      body: body
    });
  }
});
