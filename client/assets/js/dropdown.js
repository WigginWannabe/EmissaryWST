function toggleDropdown() {
	document.getElementById("dropdown").style.display="block";
}

window.onclick = function(event) {
	if (!event.target.matches('.menu-trigger') && !event.target.matches('.entypo-menu')) {
		document.getElementById("dropdown").style.display = "none";
	}

}