function setLanguage(language) {
    if (language == 'vn') return;
     
    $.getJSON(`/js/languages/${language}.json`, function(data) {
        $("[data-translate]").each(function() {
            const key = $(this).data("translate");
            if ($(this).attr("placeholder") !== undefined) {
                $(this).attr("placeholder", data[key]);
            } else {
                $(this).text(data[key]);
            }
        });
    });
}