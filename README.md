# BookWorm

Application that allows user to view books like an online library. <br>
Also allows users to publish books of their own in electronic reading format to be read on Kindle or Nook. <br>
Under construction. <br>

Deployed to: https://bookwormlibrary.herokuapp.com/

## Table of Contents
1. [Concept](https://github.com/superrmatt/BookWorm#concept)
2. [Walkthrough](https://github.com/superrmatt/BookWorm#walkthrough)
3. [Problems](https://github.com/superrmatt/BookWorm#problems)
4. [Technologies](https://github.com/superrmatt/BookWorm#technologies)
4. [Contributors](https://github.com/superrmatt/BookWorm#contributors)

### Concept

 &nbsp;&nbsp;&nbsp;&nbsp;The concept is simple, avid readers often have a long list of books they wish to read after completion of their current. These lists can quickly become daunting and difficult to keep track. Writing it down can result in losing the list. BookWorm aims to solve that problem by giving the user access to an online database of books to read, and books read. This way readers can not only abandon their mental or written lists, but can also keep track of what has already been read. For Amazon Kindle or Barnes & Noble Nook users, BookWorm also has a functionality that allows users to create e-book files to then be stored and shared on their favorite electronic reading device.

### Walkthrough

BookWorm is an easy application to use. Either clone this repository or head to the link where the application is hosted on Heroku, read on below for more.

1. After download, open terminal and run <code>node ./server.js</code>
2. Navigate to the localhost port that is now in use by the application.
    - Alternatively, navigate to https://bookwormlibrary.herokuapp.com/.
3. Signup/login to access the application.
4. A book can be added to user wishlist by the search functionality. Books can be marked read by user.
5. Functionality in progress: publishing one's own work. Upates to come as functionality appears.

### Problems

Issues are mostly seen with publishing of books. Book titles must be lowercase at this time, book titles cannot contain any special characters. the file will compile properly, but viewing and reading the published book may not work.


### Technologies

- HTML/CSS
    - Bootstrap
    - HTML5
- Javascript
    - Node.js
    - NPM
    - Sequelize
    - Passport
    - Ajax
    - JQuery
    - Express
    - BcryptJS
    - epub-gen
- MySQL
    - JawsDB
    - Microsoft SQL Server

### Contributors
- Shelby Palumbo (https://github.com/shelbypalumbo) 
- Matt Dambra (https://github.com/superrmatt)
- Liliana Kendrick (https://github.com/LilianaKendrick)
- Luis Gomez (https://github.com/Lmgom875)