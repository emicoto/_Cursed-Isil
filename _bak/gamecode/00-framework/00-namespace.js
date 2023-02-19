/**
 *
 * All the global shortcuts are defined here.
 * You can extend any variable or function by adding it to the list below.
 * Don't try to edit any variable under the window.scEra namespace.
 *
 */

const list = ["Base", "Stats", "Palam", "Source", "Sup", "Cflag", "Tsv", "Exp", "Juel", "Using", "Liquid", "Skin"];

Object.defineProperties(window.game, {
	State: { value: State },
	setup: { value: setup },
});

Object.defineProperties(window.scEra, {
	Story: { get: () => Story },
	Wikifier: { get: () => Wikifier },
	Errors: { value: {} },
	Perflog: { value: {} },
});

list.forEach((name) => {
	window.game[name] = {};
});

defineGlobalNamespaces(window.game);

const shortcuts = {
	S: setup,
	V: State.variables,
	T: State.temporary,
	Story: Story,
	Wikifier: Wikifier,

	Errors: window.scEra.Errors,
	Perflog: window.scEra.Perflog,
};

defineGlobalShortcuts(shortcuts);

// those properties are not defined at this point, so we just define them as empty objects
Object.defineProperties(window, {
	C: { get: () => State.variables.chara },
	Flag: {
		get: () => State.variables.flag,
	},
	tc: { get: () => State.variables.tc, set: (v) => (State.variables.tc = v) },
	pc: {
		get: () => State.variables.pc,
		set: (v) => (State.variables.pc = v),
	},
	player: {
		get: () => State.variables.chara[pc],
	},
	target: {
		get: () => State.variables.chara[tc],
	},
});
