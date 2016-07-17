(function ($, undefined) {

    if (!$) {
        console.log('jQuery failed to load');
        return;
    }
    //Initially hide loader
    $('#loader').hide();

    $(function () {
        $('#search').on('keyup', function (e) {
            //User hit enter
            if (e.keyCode === 13) {

                $('#loader').show();
                $("#results").html("");

                var parameters = {search: $(this).val()};
                //Fetch Data
                $.get('/search', parameters, function (results) {
                    $('#loader').hide();
                    if (results.length > 0) {
                        $("#results").append("<p> This are the top 10 results found for : <b>" + search.value + "</b></p>");
                        $.each(results, function (idx, data) {
                            $("#results").append("<div class='card'><h2>" + data.name + "</h2><p>" + data.description + "</p><small><a href=" + data.source + ">" + data.source + "</small></div>");
                        });
                    } else {
                        $("#results").append("<div class='card'><p> Sorry No Results Found For :<b>" + search.value + "</b></p></div>");
                    }
                })
            }
        });
    });
})(window.jQuery);