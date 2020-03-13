$(document).ready(function () {

  let memberList = $(".member-list");
  let newBookSection = $(".new-book-section");
  let userBooks = $(".user-saved-books");
  let usersWork = $(".savedWorkList");
  let counter = 0; //this variable will track how many chapters for each book.
  let body;
  let chapters = [];

  //---------Get users name to display on members page----------------------------
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.userName + "!");
  });

  //---------Get users saved books------------------------------------------------
  $.get("/api/user_books").then(function (data) {
    for (var e = 0; e < data.length; e++) {
      let statusTitle = "Read";
      let statusValue = "false";
      if (data[e].isRead === true) {
        statusTitle = "Unread"
        statusValue = "true"
      }
      userBooks.append("<li class= 'list-group books-list-item'><b>" + data[e].title + "</b>By " + data[e].author + "<br><div class= 'btn-group'><button class= 'btn-primary btn-savedBooksRead' name= " + data[e].id + " value= " + statusValue + ">" + statusTitle + " <i class='fas fa-book-open'></i></button><button class= 'btn-savedBooksDelete' name= " + data[e].id + "><i class='fas fa-trash-alt'></i> </button></div>");

    }
  });

  //---------Get users saved work-------------------------------------------------
  $.get("/api/published_works").then(function (data) {
    for (var i = 0; i < data.length; i++) {
      let path = data[i].path.substring(11);
      usersWork.append("<li class= 'published-work-list'><a target='_blank' href='" + path + "'><h5><b>" + data[i].title + "</h5></b><a/>" + " By " + data[i].author);
    }
  });

  //---------Click event for changing a saved books status to 'Read' or 'Unread-----
  $(".user-saved-books").on('click', '.btn-savedBooksRead', function () {
    let id = $(this).attr('name')
    let userBookStatus = "true";
    if ($(this).attr('value') === "true") {
      userBookStatus = "false";
    }
    $.ajax("/api/changeread/" + id, {
      type: "PUT",
      data: { isRead: userBookStatus }
    }).then(function (result) {
      
      location.reload()
    });
  });

  //--------Click event for deleteing a saved book-----------------------------------
  $(".user-saved-books").on('click', '.btn-savedBooksDelete', function () {
    let id = $(this).attr('name')
    $.ajax("/api/delete/" + id, {
      type: "DELETE",
    }).then(function (result) {
      location.reload()
    });
  });

  //-----Click event for adding a new book from the search----------------------------
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
          addBook(newTitle, author);
          $("#title" + thisBookIndex).remove() //now remove those html elements
          $("#title" + thisBookIndex).remove() //for whatever reason we need to call it twice in order to remove both elements. else it just removes the first instance, aka the input tag

          $("#addAlert").html("<div class=\"alert alert-success\" role=\"alert\">Added Successfully!</div>");
        });
      }
    });
  });

  //-----Click event for publishing EPUB work-----------------------------------------
  $(".publish").click(function () {

    let title = $(".pubTitle").val();
    let author = $(".pubAuthor").val();

    let body = chapters;
    //if the counter is 0, it means no chapters have been added, meaning we publish entire body as chapter 1.
    if (counter === 1) {
      body = $(".pubBody").val();

      //parse body string to start with paragraph, replace all isntances of 'enter;' with a new paragraph block and end with end paragraph block
      body = "<p>" + body;
      body = body.replace(/(?:\r\n|\r|\n)/g, '</p><p>');
      body = body + "</p>";
    }
    console.log(title);
    console.log(author);
    console.log(body);

    publish(title, author, body);
    $("#pubAlert").html("<div class=\"alert alert-success\" role=\"alert\">Published Successfully!</div>");
  });

  //----Click event for adding a chapter from EPUB work--------------------------------
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

  function addBook(title, author) {
    $.post("/api/addnew", {
      title: title,
      author: author
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
});
