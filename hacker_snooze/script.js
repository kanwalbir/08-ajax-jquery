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
    let $url = $('#url').val().replace(/^\/\/|^.*?:(\/\/)?(www\.)?/, '').replace(/^www\./, '');;
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
    $(e.currentTarget).parent().toggleClass("favorited");
    if (icon_fa_prefix === "fas") {
      $(e.currentTarget).children().first().attr('data-prefix', 'far');

    } else {
      $(e.currentTarget).parent().addClass("favorited");
      $(e.currentTarget).children().first().attr('data-prefix', 'fas');
    }
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
    }).then(function (data) {
      parse_token(data);
    });
  }

  /*********************  Parse Token         *************************/
  function parse_token(data) {

    // localStorage.setItem("token", data.data.token);
    let token = data.data.token;
    localStorage.setItem("token", token);

    let parseUser = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("username", parseUser.username);
    console.log("Welcome" + parseUser.username);
    $('#test').text(`${parseUser.username}`);
    console.log("made it!");

  }

  /*********************  Log In         *************************/

  $('form.sign-in-form').submit(e => {
    e.preventDefault();
    let $username = $('#username-sign-in').val();
    let $password = $('#password-sign-in').val();

    // let token = signIn($username, $password);

    loginUser($username, $password).then(function (data) {
      console.log("This is the data before parsing: " + parsing);
      parse_token(data)
    });

    $('.sign-in-form').slideUp('slow');
    $('.sign-in-form').trigger('reset');
  })

  function loginUser(username, password) {
    let response = $.ajax({
      url: "https://hack-or-snooze.herokuapp.com/auth",
      data: {
        data: {
          username,
          password
        }
      }
    });
    console.log("This is the response: " + response);
    return response;
  }

  function getUser(username) {
    let token = localStorage.getItem("token")
    return $.ajax({
      url: "https://hack-or-snooze.herokuapp.com/users/" + username,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }




  // function signIn(username, password) {

  // }

  /*********************  Function Calls  *******************************/

  topTen()
})