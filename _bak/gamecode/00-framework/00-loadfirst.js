setup.Path = "./public/"; // Running in a browser
setup.ImagePath = setup.Path + "image/";
setup.SoundPath = setup.Path + "sound/";
setup.savePath = setup.Path + "save/";

// volume slider, by chapel; for sugarcube 2
// version 1.1 - modified by HiEv for SugarCube v2.28.0+
// For custom CSS for slider use: http://danielstern.ca/range.css/#/

// create namespace
setup.vol = {};

// options object
setup.vol.options = {
	current: 5,
	rangeMax: 10,
	step: 1,
};

setup.vol.last = setup.vol.options.current;
setup.vol.start = setup.vol.last / setup.vol.options.rangeMax;

postdisplay["volume-task"] = function (taskName) {
	delete postdisplay[taskName];
	SimpleAudio.volume(setup.vol.start);
};

!(function () {
	$(document).on("input", "input[name=volume]", function () {
		// grab new volume from input
		var volRef = setup.vol.options;
		var change = $("input[name=volume]").val();
		var newVol = change / volRef.rangeMax;
		volRef.current = newVol.toFixed(2);
		// change volume; set slider position
		SimpleAudio.volume(newVol);
		setup.vol.last = change;
	});
})(); // jshint ignore:line

Macro.add("volume", {
	handler: function () {
		// set up variables
		var $wrapper = $(document.createElement("span"));
		var $slider = $(document.createElement("input"));
		var volRef = setup.vol.options;
		// create range input
		$slider
			.attr({
				id: "volume-control",
				type: "range",
				name: "volume",
				min: "0",
				max: volRef.rangeMax,
				step: volRef.step,
				value: setup.vol.last,
			})
			.addClass("VolumeSlider");
		// class '.macro-volume' and id '#volume-control' for styling
		// output
		$wrapper.append($slider).appendTo(this.output);
	},
});

window.saveToFile = function (slot) {
	const savedata = Save.serialize(V);
	fs.writeFileSync(setup.savePath + `save${slot}.sav`, savedata);
};

window.SaveGame = function (slot, meta) {};

window.test = async function () {
	try {
		const dir = await fs.opendirSync("./");
		for await (const dirent of dir) console.log(dirent.name);
	} catch (err) {
		console.error(err);
	}
};
