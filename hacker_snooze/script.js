var id = 3;

$(document).ready(() => {

  /****** submit section  *******/

  $('#submitFav').on('click', () => {
    $('.sub-form').slideToggle(400);
  })

  $('#sign-up').on('click', () => {
    $('.sign-up-form').slideToggle(400);
  })

  $('#sign-in').on('click', () => {
    $('.sign-in-form').slideToggle(400);
  })

  $('form.sub-form').submit(e => {
    console.log("list item added!!")
    e.preventDefault();
    let $title = $('#title').val();
    //let $url = $('#url').val().replace(/^\/\/|^.*?:(\/\/)?(www\.)?/, '').replace(/^www\./, '');
    let $url = $('#url').val();
    createStory($title, $url)
    id++;
    // add story
    $('ol.stories').append(
      `
        <li id=${id}>
          <span class="fav">
            <i class="foo far fa-star"></i>
          </span>
          <span class="list-text">${$title}</span>
          <span class="smallSite">
            <a href="#" class="smallSite">(${$url})</a>
          </span>
        </li>
        `
    );
    $('.sub-form').slideUp('slow');
    $('.sub-form').trigger('reset');
  })

  /********* toggle between favorites and all ********/

  $('#favs').on('click', e => {
    $('#favs, #all').toggle();
    $("li:not(.favorited)").hide()
    $('ol').addClass("active")
  })

  $('#all').on('click', e => {
    $('#favs, #all').toggle();
    $("li").show()
    $('ol').removeClass("active")
  })

  // fav icon
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

  // del icon
  $('.stories').on('click', 'span.del', e => {
    let clicked = $(e.currentTarget);
    let storyId = clicked.parent().attr('id');
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

    $('ol.stories').append(
      `
        <li id=${$id}>
          <span class="fav">
            <i class="foo far fa-star"></i>
          </span>
          <span class="del">
            <i class="fas fa-times"></i>
          </span>
          <span class="list-text">${$title}</span>
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

    $('.sign-up-form').slideUp('slow');
    $('.sign-up-form').trigger('reset');
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

    // genToken creates promise that requires resolution
    return genToken($username, $password).then(function (token) {
      storeToken(token);
    })

    $('.sign-in-form').slideUp('slow');
    $('.sign-in-form').trigger('reset');
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
      console.log(data['data']['favorites']);
    })

  }

  /**********    createStory             ****************/

  function createStory(title, url) {

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
          author: 'Sunny Hunter',
          title,
          url,
        }
      }
    }).then(function (response) {
      console.log(response['data']);
    })
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
      console.log(response['data']);
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

  function getUser(username) {
    let token = localStorage.getItem("token")
    return $.ajax({
      url: `https://hack-or-snooze.herokuapp.com/users/${username}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  function isLoggedIn() {
    return localStorage.getItem("token") !== null;
  }


  // function signIn(username, password) {

  // }

  /*********************  Function Calls  *******************************/

  topTen()
})