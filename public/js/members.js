$(document).ready(function () {

  let memberList = $(".member-list");
  let newBookSection = $(".new-book-section");
  let userBooks = $(".savedBooksList");
  let usersWork = $(".savedWorkList");
  let counter = 1; //this variable will track how many chapters for each book.
  let body;
  let chapters = [];

//--------------Get user name for members page-----------------------------------
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.userName + "!");
  });

//--------------Get users saved books--------------------------------------------
  $.get("/api/user_books").then(function (data) {
    for (var e = 0; e < data.length; e++) {
      userBooks.append("<b>" + data[e].title + "</b>" + " By " + data[e].author + "<br></br>");
    }
  });


//--------------Get users saved work----------------------------------------------
  $.get("api/publish").then(function (data) {
    for (var i = 0; i < data.length; i++) {
      usersWork.append("<li>" + data[i].title + "</li><li>" + data[i].author + "</li><li>" + data[i].path + "</li>");
    }
  });

//-------------------Add new book to saved book list / google books api ajax call----------------------------------
  $(".add-new").click(function () {
    memberList.empty();
    $(".update-database").remove();
    let title = $("#book-name").val();
    console.log("query = https://www.googleapis.com/books/v1/volumes?q=" + title);

    $.ajax({
      url: "https://www.googleapis.com/books/v1/volumes?q=" + title,
      method: "GET",
      success: function (data) {
        for (let i = 0; i < data.items.length; i++) {
          memberList.append("<input value=\"" + data.items[i].volumeInfo.title + "\" type=\"radio\" name=\"book\" id=\"title" + i + "\"><label id=\"title" + i + "\" for=\"title" + i + "\" value=\"" + data.items[i].volumeInfo.title + "\">" + data.items[i].volumeInfo.title + "</label><br>");
        }
        newBookSection.append("<button class=\"update-database\" onclick=\"setTimeout(addTimeout, 3000)\">Add Selected</button>");

        $(document).delegate(".update-database", "click", function (e) {
          e.preventDefault();
          let thisBookIndex = $("input:Checked").attr("id");
          thisBookIndex = thisBookIndex.replace(/\D/g, ''); //parse to return just the number
          let newTitle = $("input:checked").val();
          let author = data.items[thisBookIndex].volumeInfo.authors[0];
          let image = data.items[thisBookIndex].volumeInfo.imageLinks.smallThumbnail;
          console.log(image);

          addBook(newTitle, author, image);
          $("#title" + thisBookIndex).remove() //now remove those html elements
          $("#title" + thisBookIndex).remove() //for whatever reason we need to call it twice in order to remove both elements. else it just removes the first instance, aka the input tag

          $("#addAlert").html("<div class=\"alert alert-success\" role=\"alert\">Added Successfully!</div>");
        });
      }
    });
  });

//---------Publish work-------------------------------------------------
  $(".publish").click(function () {

    let title = $(".pubTitle").val();
    let author = $(".pubAuthor").val();

    //if the counter is 0, it means no chapters have been added, meaning we publish entire body as chapter 1.
    if (counter === 0) {
      let body = $(".pubBody").val();

      //parse body string to start with paragraph, replace all instances of 'enter;' with a new paragraph block and end with end paragraph block
      body = "<p>" + body;
      body = body.replace(/(?:\r\n|\r|\n)/g, '</p><p>');
      body = body + "</p>";
    } else {
      body = chapters;
    }
    
    publish(title, author, body);
    
    $("#pubAlert").html("<div class=\"alert alert-success\" role=\"alert\">Published Successfully!</div>");
  });

//---------Add chapter---------------------------------------------------
  $(".addChapter").click(function () {

    // obtain chapter information and parse
    let body = $(".pubBody").val();
    body = "<p>" + body;
    body = body.replace(/(?:\r\n|\r|\n)/g, '</p><p>');
    body = body + "</p>";

    //add info to the chapters array
    let chapter = {
      title: $(".chapTitle").val(),
      author: $(".chapAuthor").val(),
      data: body
    }
    chapters.push(chapter);

    //alert user
    $("#pubAlert").html("<div class=\"alert alert-success\" role=\"alert\">Chapter Added! You may safely clear the body field.</div>");

    //lastly, increment chapter count
    counter = counter + 1;

  });


  
  function addBook(title, author, image) {
    $.post("/api/addnew", {
      title: title,
      author: author, 
      image: image
    });
    location.reload();
  }

  function publish(title, author, body) {
    $.post("api/publish", {
      title: title,
      author: author,
      body: body,
      chapterCount: counter
    });
    // clear chapters array
    chapters = [];
    location.reload();
  }


  function addUserWork(title, author, filePath) {
    $.post("/api/addnew", {
      title: title,
      author: author, 
      path: filePath
    });
    location.reload();
  }

});
