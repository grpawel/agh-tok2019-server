$("#select-all").change(function(){
    $(".form-check-input").prop('checked', $(this).prop("checked"));
});

$('.form-check-input').change(function(){
    if(false === $(this).prop("checked")){
        $("#select-all").prop('checked', false);
    }
    if ($('.form-check-input:checked').length === $('.form-check-input').length ){
        $("#select-all").prop('checked', true);
    }
});
