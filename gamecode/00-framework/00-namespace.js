/**
 * As part of my various refactors, I ended up introducing a bunch of
 * global namespace-esk variables.
 *
 * Having a single spot to document them makes sense. By convention,
 * if you need to make a new top-level namespace, declare it here.
 */

/**
 * Declare everything in a root namespace, so that things can still be found
 * if shadowed, and for "documentation" purposes
 */

window.game = {
	// In pseudo-load order
	/**
	 * Mini application reporter app
	 * helps get detailed error messages to devs
	 * {@link 01-error.js errors}
	 */
	Errors: {},
	Perflog: {},

	/** Patch to make javascript execution more consistent (see comment below) */
	State: State,
	/** Patch to make javascript execution more consistent (see comment below) */
	setup: setup,
	/** Patch to make javascript execution more consistent (see comment below) */
	Wikifier: Wikifier,
	version: "0.0.0",
	debug: false,
};
/* Make each of these namespaces available at the top level as well */
window.defineGlobalNamespaces = (namespaces) => {
	Object.entries(namespaces).forEach(([name, namespaceObject]) => {
		try {
			if (window[name] && window[name] !== namespaceObject) {
				console.warn(
					`Attempted to set ${name} in the global namespace, but it's already in use. Skipping this assignment. Existing Object:`,
					window[name]
				);
			} else {
				/* Make it more difficult to shadow/overwrite things (users can still Object.defineProperty if they really mean it) */
				Object.defineProperty(window, name, { value: namespaceObject, writeable: false });
			}
		} catch (e) {
			if (window[name] !== namespaceObject) {
				console.error(`Failed to setup global namespace object ${name}. Attempting to continue. Source Error:`, e);
			}
		}
	});
};
defineGlobalNamespaces(game);
