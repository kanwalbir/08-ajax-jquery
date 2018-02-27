var id = 3;

$(document).ready(() => {

  /****** submit section  *******/

  $('#submitFav').on('click', () => {
    $('.subForm').slideToggle(400);
  })

  $('form').submit(e => {
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
    $('.subForm').slideUp('slow');
    $('.subForm').trigger('reset');
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
})
