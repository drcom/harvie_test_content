function clearLocalStorage() {
	if (window.localStorage == null)
		return;
	var pattern = "drcom:" + drcom.config.framework.presentationName;
	for ( var name in localStorage) {
		if (name.indexOf(pattern) != -1) {
			localStorage.removeItem(name);
		}
	}
}
clearLocalStorage();