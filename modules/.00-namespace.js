/**
 * @namespace
 * @name scEra
 * @description
 * The scEra namespace is the root namespace for all of the scEra modules.
 * All the variables and functions names must follow this rules:
 * 1. All the variables and functions names must be in camelCase.
 * 2. All the variables and functions names must be in English.
 * 3. If need to use number in the name, it must be like this: name_1, name_2.
 * 4. If the name is a abbreviation, it must be all in upper case.
 */
window.scEra = {
	/**
	 * @namespace
	 * @name scEra.loadOrder
	 * @description
	 * The scEra.loadOrder namespace is the root namespace for all of the scEra core load order modules.
	 */
	loadOrder: {},

	/**
	 * @namespace
	 * @name scEra.settings
	 * @description
	 * The scEra.settings namespace is the root namespace for all of the variables data that are used to configure the system and games.
	 * @see {@link scEra.settings}
	 */
	settings: {},

	/**
	 * @namespace
	 * @name scEra.data
	 * @description
	 * The scEra.data namespace is the root namespace for all of the data that is used to configure the main system and games.
	 * @see {@link scEra.data}
	 */
	data: {},

	/**
	 * @namespace
	 * @name scEra.database
	 * @description
	 * The scEra.database namespace is the root namespace for all games data that is used to the game modules.
	 * @see {@link scEra.database}
	 */
	database: {},

	/**
	 * @namespace
	 * @name scEra.utils
	 * @description
	 * The scEra.utils namespace is the root namespace for all the utils functions that are hard to categorize.
	 * @see {@link scEra.utils}
	 */
	utils: {},

	/**
	 * @namespace
	 * @name scEra.documentGenerator
	 * @description
	 * The scEra.documentGenerator namespace is the root namespace for all the functions that are used to generate the text/html...any document.
	 * @see {@link scEra.documentGenerator}
	 */
	documentGenerator: {},

	/**
	 * @namespace
	 * @name scEra.modules
	 * @description
	 * The scEra.modules namespace is the root namespace for all the game modules.
	 * @see {@link scEra.modules}
	 */
	modules: {},

	/**
	 * @namespace
	 * @name scEra.config
	 * @description
	 * The scEra.config namespace is the root namespace for configuration data that is used to configure the system and games.
	 * @see {@link scEra.config}
	 */
	config: {},

	/**
	 * @namespace
	 * @name scEra.UIControl
	 * @description
	 * The scEra.UI namespace is the root namespace for all UI controls. These are the controls that are used to build the UI or change the UI.
	 * @see {@link scEra.data}
	 */
	UIControl: {},

	/**
	 * @namespace
	 * @name scEra.conditions
	 * @description
	 * The scEra.conditions namespace is the root namespace for all the game conditions short cuts.
	 * @see {@link scEra.conditions}
	 */
	conditions: {},

	/**
	 * @namespace
	 * @name scEra.fixer
	 * @description
	 * The scEra.fixer namespace is the root namespace for all the fixer functions.
	 * @see {@link scEra.fixer}
	 */
	fixer: {},

	/**
	 * @namespace
	 * @name scEra.language
	 * @description
	 * The scEra.language namespace is the root namespace for all the language data and functions.
	 * @see {@link scEra.language}
	 */
	language: {},

	/**
	 * @namespace
	 * @name scEra.initialization
	 * @description
	 * The scEra.initialization namespace is the root namespace for all the initialization functions should initialize at the beginning of the game.
	 */
	initialization: {},

	/**
	 * @namespace
	 * @name scEra.game
	 * @description
	 * The scEra.game namespace is the root namespace for game variables.
	 * @see {@link scEra.game}
	 */
	game: {},
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

defineGlobalNamespaces(scEra);
console.log("scEra", scEra);

//------------------------------------------------------------------------------
//
//   Shortcuts
//
//------------------------------------------------------------------------------

window.defineGlobalShortcuts = (shortcuts) => {
	Object.entries(shortcuts).forEach(([name, shortcutObject]) => {
		try {
			if (window[name] && window[name] !== shortcutObject) {
				console.warn(
					`Attempted to set ${name} in the global namespace, but it's already in use. Skipping this assignment. Existing Object:`,
					window[name]
				);
			} else {
				/* make a short cut getter for the object */
				Object.defineProperty(window, name, {
					get: () => shortcutObject,
					writeable: false,
				});
			}
		} catch (e) {
			if (window[name] !== shortcutObject) {
				console.error(`Failed to setup global shortcut object ${name}. Attempting to continue. Source Error:`, e);
			}
		}
	});
};

// defineGlobalShortCuts
// use a self excuting function to define the shortcuts, prevents the shortcuts from being overwritten.
(() => {
	const shortcuts = {
		D: scEra.data,
		Db: scEra.database,
		F: scEra.utils,
		L: scEra.language,
		M: scEra.modules,
		P: scEra.documentGenerator,
		Cond: scEra.conditions,
		Fix: scEra.fixer,
		Init: scEra.initialization,
		Ui: scEra.UIControl,
	};

	defineGlobalShortcuts(shortcuts);
})();

//------------------------------------------------------------------------------
//
//   scEra.regist
//
//------------------------------------------------------------------------------
window.registModule = function (modules) {
	//check if the module is already loaded before registering it
	if (window.scEra.modules[modules.name]) {
		console.warn(`Module ${modules.name} is already loaded. Skipping this registration.`);
		return false;
	}

	//register the module
	const { name, data, classObj, functions, config, version, des } = modules;

	window.scEra.modules[name] = {
		info: {
			name,
			version,
			des,
		},
		data: data,
	};

	//ensure the class at the top level
	Object.keys(classObj).forEach((key) => {
		window.scEra.modules[name][key] = classObj[key];
	});

	//ensure the functions at the top level
	if (functions) {
		Object.keys(functions).forEach((key) => {
			window.scEra.modules[name][key] = functions[key];
		});
	}

	//check the config
	if (config?.globalfunction) {
		Object.keys(functions).forEach((key) => {
			Object.defineProperty(window, key, {
				get: () => window.scEra.modules[name][key],
			});
		});
	}

	if (config?.globaldata) {
		Object.keys(data).forEach((key) => {
			Object.defineProperty(window, key.toUpperFirst() + "Data", {
				get: () => window.scEra.modules[name].data[key],
			});
		});
	}

	//make the class available at the top level
	Object.keys(classObj).forEach((key) => {
		Object.defineProperty(window, key, {
			get: () => window.scEra.modules[name][key],
		});
	});

	return true;
};
