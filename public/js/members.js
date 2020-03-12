$(document).ready(function () {

  let memberList = $(".member-list");
  let newBookSection = $(".new-book-section");
<<<<<<< HEAD
  let userBooks = $(".user-saved-books");
=======
  let userBooks = $(".savedBooksList");
  let usersWork = $(".savedWorkList");
>>>>>>> eac471a12368fc0fe72b950cb3f41dc24c9252fd
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
<<<<<<< HEAD
      userBooks.append("<li class= 'list-group books-list-item'>" + data[e].title + "<br> <div class= 'btn-group'><button class= 'btn-primary btn-savedBooksRead' name= '"+ data[e].id+"' value= 'false'> Read</button><button class= 'btn-primary btn-savedBooksDelete'> Delete</button></div>");
    }
  });

  $(".user-saved-books").on('click','.btn-savedBooksRead',function(){
    let id = $(this).attr('name');
    console.log(id);
    let userBookStatus = "true";
    if ($(this).attr('value') == true) {
      userBookStatus = "false";
    } 
    $.ajax("/api/changeread/" + id, {
      type: "PUT",
      data: userBookStatus
    }).then(function(){
      console.log("book status es: "+ userBookStatus);
    })
   

    console.log(userBookStatus);
    //console.log($(this).attr('name'));
  })

=======
      userBooks.append("<h5><b>" + data[e].title + "</h5></b>" + " By " + data[e].author + "<br></br>");
    }
  });


//---------Get users saved work-------------------------------------------------
  $.get("/api/published_works").then(function (data) {
    for (var i = 0; i < data.length; i++) {
      usersWork.append("<a target='_blank' href='" + data[i].path + "'><h5><b>" + data[i].title + "</h5></b><a/>" + " By " + data[i].author + "<br><br>");
    }
  });

//------Add new book to saved book list / google books api ajax call-----------
>>>>>>> eac471a12368fc0fe72b950cb3f41dc24c9252fd
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

//----------Publish work-------------------------------------------------------
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

//----------Add chapter--------------------------------------------------------
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

//----------Add user works cover image-----------------------------------------
  $(".coverImage").click(function () {
    console.log("Sdffs");
    var blobFile = $('.coverImage').files[0];
    var formData = new FormData();
    formData.append("fileToUpload", blobFile);
    console.log(blobFile);
    console.log(formData);
    console.log("sfsdf");
    alert("sdfsfg");
    $.ajax({
      url: "/api/cover",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        // .. do something
      },
      error: function (jqXHR, textStatus, errorMessage) {
        console.log(errorMessage); // Optional
      }
    });
  })


//----------Posts--------------------------------------------------------------
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


});
