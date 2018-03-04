// var id = 3;

$(document).ready(() => {
  // alert("Hi!!")
  /****** submit section  *******/

  $('#submitFav').on('click', () => {
    $('.sub-form').slideToggle(400);
  })

  // $('#sign-up').on('click', () => {
  //   $('.sign-up-form').slideToggle(400);
  // })

  // $('#sign-in').on('click', () => {
  //   // $('.sign-in-form').slideToggle(400);

  // })


  //   <span class="del">
  //   <i class="fas fa-times"></i>
  // </span>

  $('form.sub-form').submit(e => {

    console.log("list item added!!")
    e.preventDefault();
    let $title = $('#title').val();
    //let $url = $('#url').val().replace(/^\/\/|^.*?:(\/\/)?(www\.)?/, '').replace(/^www\./, '');
    let $url = $('#url').val();
    let $author = $('#author').val();

    createStory($title, $url, $author);
  })

  /********* toggle between favorites and all ********/

  $('#my-stories').on('click', e => {

    $('.stories').hide();
    $('.user-stories').show();
    let userName = localStorage.getItem("username")

    // Gen favorites
    getUser(userName).then(data => {
      let stories = data.data.stories;
      for (let story of stories)
        genUserStories(story)
    })
  });

  function genUserStories(story) {

    // console.log(userObj);
    // debugger;
    let $id = story.storyId;
    let $title = story.title;
    let $url = story.url;
    $('ol.user-stories').append(
      `
      <li id=${$id}>
        <span class="fav">
          <i class="foo far fa-star"></i>
        </span>
        <span class="del">
          <i class="fas fa-times"></i>
        </span>
        <a href="${$url}" class="smallSite" target="_blank">
          <span class="list-text">${$title}</span>
        </a>
        <span class="smallSite">
          <a href="#" class="smallSite">(${$url})</a>
        </span>
      </li>
      `
    );
  }


  $('#favs').on('click', e => {

    $('.stories').hide();
    $('.favorites').show();
    let userName = localStorage.getItem("username")

    // Gen favorites
    getUser(userName).then(data => {
      let favorites = data.data.favorites;
      for (let story of favorites)
        genFavorite(story)
    })
  });

  function genFavorite(story) {

    // console.log(userObj);
    // debugger;
    let $id = story.storyId;
    let $title = story.title;
    let $url = story.url;
    $('ol.favorites').append(
      `
      <li id=${$id}>
        <span class="fav">
          <i class="foo fas fa-star"></i>
        </span>
        <a href="${$url}" class="smallSite" target="_blank">
        <span class="list-text">${$title}</span>
        </a>
        <span class="smallSite">
          <a href="#" class="smallSite">(${$url})</a>
        </span>
      </li>
      `
    );
  }

  function getUser(username) {
    let token = localStorage.getItem("token")
    let userPromise = $.ajax({
      // return $.ajax({
      url: `https://hack-or-snooze.herokuapp.com/users/${username}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    // let userObj = Promise.resolve(userPromise).then(function (data) {
    //   return data;
    // })
    // return userObj;
    return userPromise;
  }


  // $('#all').on('click', e => {
  //   $('#favs, #all').toggle();
  //   $("li").show()
  //   $('ol').removeClass("active")
  // })


  $('.stories').on('click', 'span.fav', e => {
    let fav = $(e.currentTarget).children().first();
    let icon_fa_prefix = $(e.currentTarget).children().first().attr('data-prefix');
    let clicked = $(e.currentTarget)
    let storyId = clicked.parent().attr('id') //$(e.currentTarget).parent().attr('id')
    console.log(storyId)

    //$(e.currentTarget).parent().toggleClass("favorited");
    clicked.parent().toggleClass("favorited");

    if (icon_fa_prefix === "fas") {
      removeFavorites(storyId)
      clicked.children().first().attr('data-prefix', 'far'); //$(e.currentTarget).children().first().attr('data-prefix', 'far');

    } else {
      addFavorites(storyId)
      clicked.parent().addClass("favorited"); //$(e.currentTarget).parent().addClass("favorited");
      clicked.children().first().attr('data-prefix', 'fas'); //$(e.currentTarget).children().first().attr('data-prefix', 'fas');
    }
  });


  // fav icon
  $('.favorites').on('click', 'span.fav', e => {
    let fav = $(e.currentTarget).children().first();
    let icon_fa_prefix = $(e.currentTarget).children().first().attr('data-prefix');
    let clicked = $(e.currentTarget)
    let storyId = clicked.parent().attr('id') //$(e.currentTarget).parent().attr('id')
    console.log(storyId)

    //$(e.currentTarget).parent().toggleClass("favorited");
    clicked.parent().toggleClass("favorited");

    if (icon_fa_prefix === "fas") {
      removeFavorites(storyId)
      clicked.children().first().attr('data-prefix', 'far'); //$(e.currentTarget).children().first().attr('data-prefix', 'far');
      clicked.parent().remove()

    } else {
      addFavorites(storyId)
      clicked.parent().addClass("favorited"); //$(e.currentTarget).parent().addClass("favorited");
      clicked.children().first().attr('data-prefix', 'fas'); //$(e.currentTarget).children().first().attr('data-prefix', 'fas');
    }
  });

  // del icon
  $('.user-stories').on('click', 'span.del', e => {
    let clicked = $(e.currentTarget);
    let storyId = clicked.parent().attr('id');
    clicked.parent().remove()
    removeStory(storyId);
  });

  /*******************     API        ***************************/

  /*******************     Top Ten    ***************************/

  function topTen() {
    $.ajax({
      url: "https://hack-or-snooze.herokuapp.com/stories",
      method: "GET",
    }).then(function (data) {
      let stories = data["data"];
      var sorted = stories.sort((a, b) => {
        a = new Date(a.createdAt);
        b = new Date(b.createdAt);
        return a > b ? -1 : a < b ? 1 : 0;
      })
      for (let i = 0; i < 10; i++) {
        addStory(sorted[i]);
      }
    });
  }

  function addStory(obj) {
    let $id = obj.storyId;
    let $title = obj.title;
    let $url = obj.url;

    // let $smallUrl = $url.replace(/^\/\/|^.*?:(\/\/)?(www\.)?/, '').replace(/^www\./, '');
    $('ol.stories').append(
      `
        <li id=${$id}>
          <span class="fav">
            <i class="foo far fa-star"></i>
          </span>
          <a href="${$url}" class="smallSite" target="_blank">
          <span class="list-text">${$title}</span>
          </a>
          <span class="smallSite">
            <a href="#" class="smallSite">(${$url})</a>
          </span>
        </li>
        `
    );
  }

  /******************    Sign Up      *************************/

  $('form.sign-up-form').submit(e => {
    e.preventDefault();
    let $name = $('#name-sign-up').val();
    let $username = $('#username-sign-up').val();
    let $password = $('#password-sign-up').val();

    signUp($name, $username, $password);
    location.href = 'index.html';
  })

  function signUp(name, username, password) {

    $.ajax({
      method: "POST",
      url: "https://hack-or-snooze.herokuapp.com/users",
      headers: {
        Accept: 'application/json'
      },
      data: {
        data: {
          name,
          username,
          password
        }
      }
    }).then(function (val) {
      return genToken(username, password);
    }).then(function (token) {
      storeToken(token);
    });
  }
  /*********************  Generate Token   *************************/

  function genToken(username, password) {
    return $.ajax({
      method: "POST",
      url: "https://hack-or-snooze.herokuapp.com/auth",
      data: {
        data: {
          username,
          password
        }
      }
    });
  }

  /*********************  Parse & Set Token   *************************/

  function storeToken(data) {

    let token = data.data.token;
    let parseUser = JSON.parse(atob(token.split(".")[1]));

    localStorage.setItem("token", token); // TOKEN STORED
    localStorage.setItem("username", parseUser.username); // USERNAME STORED
    $('#test').text("Welcome " + parseUser.username);

  }

  /*********************  Log In         *************************/

  $('form.sign-in-form').submit(e => {
    e.preventDefault();
    let $username = $('#username-sign-in').val();
    let $password = $('#password-sign-in').val();

    genToken($username, $password).then(function (token) {

      location.href = 'index.html';
      // $('#login-link').load('./index.html').hide();
      // $('#logout-link').load('./index.html').show();
      // $('.logs').prepend(
      //   `${$username}`
      // )
      storeToken(token);
    }).catch(function (data) {
      if (data.status === 404 || data.status === 401) {
        $('body').prepend("Bad Login. <br><br>")
      } else alert("Bad login.")
    })

  })


  /************          Log Out            *******************************/

  $('#logout-link').on('click', () => {
    localStorage.clear();
    location.href = 'index.html';
  })

  /**********    addFavorites             ****************/

  function addFavorites(storyId) {

    let username = localStorage.getItem("username")
    let token = localStorage.getItem("token")
    console.log(username, token, storyId)

    $.ajax({
      method: "POST",
      url: `https://hack-or-snooze.herokuapp.com/users/${username}/favorites/${storyId}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(function (data) {
      console.log(data['data']['favorites']);
      // console.log(data)
      // localStorage.set
    })

  }

  /**********    removeFavorites             ****************/

  function removeFavorites(storyId) {

    let username = localStorage.getItem("username")
    let token = localStorage.getItem("token")
    console.log(username, token, storyId)

    $.ajax({
      method: "DELETE",
      url: `https://hack-or-snooze.herokuapp.com/users/${username}/favorites/${storyId}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(function (data) {
      // console.log(data['data']['favorites']);
    })

  }

  /**********    createStory             ****************/

  function createStory(title, url, author) {

    let username = localStorage.getItem("username")
    let token = localStorage.getItem("token")

    return $.ajax({
      method: "POST",
      url: "https://hack-or-snooze.herokuapp.com/stories",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        data: {
          username,
          author,
          title,
          url,
        }
      }
    }).then(response => {
      location.href = 'index.html'
      console.log("damn");
      debugger;
    }).catch(function () {
      alert("damn some shit went down");
    });
  }

  /**********    removeStory             ****************/

  function removeStory(storyId) {

    let username = localStorage.getItem("username")
    let token = localStorage.getItem("token")

    return $.ajax({
      method: "DELETE",
      url: `https://hack-or-snooze.herokuapp.com/stories/${storyId}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
    }).then(function (response) {
      // console.log(response['data']);
    })
  }

  /**********    getUser             ****************/

  $('#test').on('click', () => {
    let localToken = localStorage.getItem("token");
    let localUser = localStorage.getItem("username");

    // if (isLoggin()) 
    getUser(localUser).then(function (data) {

    })
    // $("#reg-stories").hide();
    // $("#user-stories").show();

    $("#user-stories, #reg-stories").toggle();
  })

  $("#user-profile").on('click', () => {

  })

  function isLoggedIn() {
    if (localStorage.getItem("token") !== null) {
      let $username = localStorage.getItem("username")
      $('#login-link').hide();
      $('#logout-link').show();
      $('.logs').prepend(
        `<span id="user-profile">
        ${$username} | 
        </span>`

      )
    }
  }


  // function signIn(username, password) {

  // }

  /*********************  Function Calls  *******************************/

  topTen()
  isLoggedIn()
})