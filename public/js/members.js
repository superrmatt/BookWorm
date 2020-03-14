$(document).ready(function () {

  /**
   * JQuery variables used to hold reference throughout this code.
   */
  let memberList = $(".member-list"),
      newBookSection = $(".new-book-section"),
      userBooks = $(".user-saved-books"),
      usersWork = $(".savedWorkList");

  /**
   * Variables to track values for EPUB.
   * Counter for chapter count
   * Body for text as string with HTML formatting, and further foramtted into an object when needed.
   * Chapters, array of body object (body is manipulated into an object in the publish and add-chapter listeners).
   */
  let counter = 1, //this variable will track how many chapters for each book.
      body,
      chapters = [];

  /**
   * Get user's name to display on members page.
   * Also obtains other user data, which at this point is not used on this page, but can be useful in the future and used in back end.
   */
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.userName + "!");
  });

  /**
   * Get logged in user's saved books and updates HTML.
   */
  $.get("/api/user_books").then(function (data) {
    for (let i = 0; i < data.length; i++) {
      let statusTitle = "Read",
          statusValue = "false";
      if (data[i].isRead === true) {
        statusTitle = "Unread"
        statusValue = "true"
      }
      userBooks.append("<li class= 'list-group books-list-item'><b>" + data[i].title + "</b>By " + data[i].author + "<br><div class= 'btn-group'><button class= 'btn-primary btn-savedBooksRead' name= " + data[i].id + " value= " + statusValue + ">" + statusTitle + " <i class='fas fa-book-open'></i></button><button class= 'btn-savedBooksDelete' name= " + data[i].id + "><i class='fas fa-trash-alt'></i> </button></div>");
    }
  });

  /**
   * Get publsihed works from DB and update HTML to show list.
   */
  $.get("/api/published_works").then(function (data) {
    for (let i = 0; i < data.length; i++) {
      let path = data[i].path.substring(11);
      usersWork.append("<li class= 'published-work-list'><a target='_blank' href='" + path + "'><h5><b>" + data[i].title + "</h5></b><a/>" + " By " + data[i].author);
    }
  });

  /**
   * Click event for changing a saved books status to 'Read' or 'Unread'.
   */
  $(".user-saved-books").on('click', '.btn-savedBooksRead', function () {
    let id = $(this).attr('name'),
      userBookStatus = "true";
    if ($(this).attr('value') === "true") {
      userBookStatus = "false";
    }
    $.ajax("/api/changeread/" + id, {
      type: "PUT",
      data: { 
        isRead: userBookStatus 
      }
    }).then(function (result) {
      location.reload()
    });
  });

  /**
   * Click event for deleteing a saved book.
   */
  $(".user-saved-books").on('click', '.btn-savedBooksDelete', function () {
    let id = $(this).attr('name');
    $.ajax("/api/delete/" + id, {
      type: "DELETE",
    }).then(function (result) {
      location.reload()
    });
  });

  /**
   * Click event for adding a new book from the search.
   * Sends AJAX get request to a google books API.
   * No API key required.
   */
  $(".add-new").click(function () {
    memberList.empty();
    $(".update-database").remove();
    let title = $("#book-name").val();

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
          let newTitle = $("input:checked").val(),
              author = data.items[thisBookIndex].volumeInfo.authors[0];
          addBook(newTitle, author);

          $("#addAlert").html("<div class=\"alert alert-success\" role=\"alert\">Added Successfully!</div>");
        });
      }
    });
  });

  /**
   * Click event for publishing EPUB work.
   */
  $(".publish").click(function () {
    console.log("1");
    let title = $(".pubTitle").val(),
        author = $(".pubAuthor").val();
    //if the counter is 1, it means no chapters have been added, meaning we publish entire body as chapter 1.
    console.log("2");
    if (counter === 1) {
      body = {
        title: title,
        author: author,
        data: $(".pubBody").val()
      };
      console.log("3");
      //parse body string to start with paragraph, replace all isntances of 'enter;' with a new paragraph block and end with end paragraph block
      body.body = "<p>" + body.body;
      body.body = body.body.replace(/(?:\r\n|\r|\n)/g, '</p><p>');
      body.body = body.body + "</p>";
      chapters.push(body);
    }
    body = chapters;

    console.log("4")
    publish(title, author, body);
    console.log("5");
    $("#pubAlert").html("<div class=\"alert alert-success\" role=\"alert\">Published Successfully!</div>");
  });

  /**
   * Click event for adding a chapter to publsihed works.
   * Parses string and obtains necessary values via jquery.
   * Similiar to above listener.
   */
  $(".addChapter").click(function () {
    // obtain chapter information and parse
    body = $(".pubBody").val();
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

  /**
   * used to add a new book to db via API post call
   * @param title book title as string
   * @param author book author as string 
   */
  function addBook(title, author) {
    $.post("/api/addnew", {
      title: title,
      author: author
    });
    location.reload();
  }

  /**
   * used to run API post call to publish a new book to database and create epub File.
   * @param title: book title as string
   * @param author: book author as string 
   * @param body: book body as [{}] 
   */
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
