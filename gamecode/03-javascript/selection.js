Macro.add("selection", {
	tags: ["pick"],
	handler: function () {
		const len = this.payload.length;
		let replace = this.payload[0].args.includes("replace");
		let event = this.payload[0].args.includes("event");

		if (len === 1) {
			return this.error("no selection specified");
		}

		for (let i = 1; i < len; i++) {
			if (this.payload[i].args.length === 0) {
				return this.error(`no value(s) specified for <<${this.payload[i].name}>> (#${i})`);
			}
			if (this.payload[i].args.length > 3) {
				return this.error("a maxinum of 3 values can be set.");
			}
		}

		const debugView = this.debugView;
		if (game.debug) {
			debugView.modes({
				nonvoid: false,
				hidden: true,
			});
		}

		let output = "";

		for (let i = 1; i < len; i++) {
			if (game.debug) {
				this.createDebugView(this.payload[i].name, this.payload[i].source).modes({ nonvoid: false });
				console.log(this.payload[i]);
			}

			let { args, contents } = this.payload[i];

			let sid = i;

			const stack = `<<run game.Stack.push('selection args:${args}')>>`;

			for (let k = 0; k < args.length; k++) {
				if (typeof args[k] === "number") {
					//替换id
					sid = args[k];
					args.splice(k, 1);
				}
			}

			if (event) {
				let txt;
				if (Story.has(`${T.passage}:s${sid}`)) {
					txt = Story.get(`${T.passage + ":s" + sid}`).text;
				}
				contents = `<<set $event.sp to ${sid}>><<set $event.phase to 0>><<if $mode !== 'history'>>${
					txt ? txt.replace("\n", "") : ""
				}${contents}<</if>>`;
				V.event.lastPhase = V.event.phase - 1;
			}

			if (replace) {
				output += `<div class='selection'><<linkreplace ${args[0]}>>${stack}
                    <<set $selectId to ${sid}>>
                    ${contents}
                    <<if _onselect>><<unset _onselect>><</if>>
                <</linkreplace>></div>`;
			} else {
				output += `<div class='selection'><<link '${args[0]}' ${args[1] ? `'${args[1]}'` : "$passage"}>>${stack}
                    <<set $selectId to ${sid}>>
                    ${contents}
                <</link>></div>`;
			}
		}

		let html = `<div id='selectzone'>
        ${output}
        </div>`;

		if (game.debug) console.log(output);

		jQuery(this.output).wiki(html);
	},
});

Macro.add("selects", {
	tags: null,
	handler: function () {
		let { contents, args } = this.payload[0];
		let replace = args.includes("replace");
		let event = args.includes("event");

		if (args.length === 0) {
			return this.error("no selection text specified");
		}

		let sid, output;

		for (let i = 0; i < args.length; i++) {
			if (typeof args[i] === "number") sid = args[i];

			if (args[i] === "replace" || args[i] === "event" || typeof args[i] === "number") {
				args.splice(i, 1);
				i = 0;
			}
		}

		if (event) {
			let txt;
			if (Story.has(`${T.passage}:s${sid}`)) {
				txt = Story.get(`${T.passage + ":s" + sid}`).text;
			}
			contents = `<<set $event.sp to ${sid}>><<set $event.phase to 0>><<if $mode !== 'history'>>${
				txt ? txt.replace("\n", "") : ""
			}${contents}<</if>>`;
			V.event.lastPhase = V.event.phase - 1;
		}

		let style = "neutrallink";

		if (replace) {
			output = `<div class='selection'><<linkreplace ${args[0]}>>
            <<set $selectId to ${sid}>>${contents}<</linkreplace>></div>`;
		} else {
			output = `<div class='selection'><<link '${args[0]}' ${
				args[1] ? `${args[1]}` : "$passage"
			}>>${contents}<</link>>
            </div>`;
		}

		console.log(output);
		jQuery(this.output).wiki(output);
	},
});

Macro.add("eventSelect", {
	tags: ["select"],
	handler: function () {
		const len = this.payload.length;
		if (len === 1) return this.error("no selection specified");

		for (let i = 1; i < len; i++) {
			if (this.payload[i].args.length === 0) {
				return this.error(`no value(s) specified for <<${this.payload[i].name}>> (#${i})`);
			}
			if (this.payload[i].args.length > 2) {
				return this.error("a maxinum of 2 values can be set.");
			}
		}

		const debugView = this.debugView;
		if (game.debug) {
			debugView.modes({
				nonvoid: false,
				hidden: true,
			});
		}

		let output = "";

		if (!T.selectcount) T.selectcount = 0;
		T.selectcount++;

		for (let i = 1; i < len; i++) {
			if (game.debug) {
				this.createDebugView(this.payload[i].name, this.payload[i].source).modes({ nonvoid: false });
				console.log(this.payload[i]);
			}

			let { args, contents } = this.payload[i];
			let style = args.includes("cursed") ? "cursedlink" : "selectlink";

			output += `<div id='${style}'><<link '${args[0]}'>><<replace #selectzone_${
				T.selectcount
			} transition>>${contents}<</replace>><<run delete $event.selectwait; $event.afterselect = true ;msg_end.scrollIntoView()>><<replace #next>><<eventnext>><</replace>><</link>>${
				args.includes("nobr") ? "<br>" : "　　"
			}</div>`;
		}

		let html = `<div id='selectzone_${T.selectcount}'>${output}</div>`;

		if (game.debug) console.log(output);

		jQuery(this.output).wiki(html);
	},
});
