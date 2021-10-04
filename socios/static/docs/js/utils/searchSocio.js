
document.addEventListener ("DOMContentLoaded", main );

function main(){

    $("#searchInput").change(function(){
        let searchInput = $("#searchInput")[0];
        let nSocio = searchInput.value.split(" ")[0];
        let href = $("#hrefSocio")[0];
        href.setAttribute("href", `/socio?nSocio=${nSocio}`);
    })

}
