LInit(30, "mylegend", 400, 600, main);

var dataList = {};

function main () {
	LGlobal.aspectRatio = PORTRAIT;

	LGlobal.setDebug(false);

	var b = document.body;
	b.style.margin = "0px";
	b.style.padding = "0px";
	b.style.backgroundColor = "black";

	if (LGlobal.mobile) {
		LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
	}
	LGlobal.screen(LGlobal.FULL_SCREEN);

	loadGame();
}

function loadGame () {
	var loadData = [
		[
			{path : "./js/ytPreloader.js"},

			{name : "preloader_bar", path : "./img/preloader_bar.jpg"},
			{name : "preloader_bar_background", path : "./img/preloader_bar_background.jpg"},
			{name : "preloader_background", path : "./img/preloader_background.jpg"}
		],
		[
			{path : "./js/ytButton.js"},
			{path : "./js/ytMenuLayer.js"},
			{path : "./js/ytOptionLayer.js"},
			{path : "./js/ytGameLayer.js"},
			{path : "./js/ytBackground.js"},
			{path : "./js/ytStreetView.js"},
			{path : "./js/ytCar.js"},
			{path : "./js/ytCarLayer.js"},
			{path : "./js/ytExplosion.js"},
			{path : "./js/ytPoint.js"},
			{path : "./js/ytResultBox.js"},
			{path : "./js/ytHelpLayer.js"},
			{path : "./js/ytAboutLayer.js"},

			{name : "button_sheet", path : "./img/button_sheet.jpg"},
			{name : "menu_car_icons", path : "./img/menu_car_icons.png"},
			{name : "explosion", path : "./img/explosion.png"},
			{name : "cars_atlas", path : "./img/cars_atlas.png"},
			{name : "button_pause_sheet", path : "./img/button_pause_sheet.png"},
			{name : "default_menu_background", path : "./img/default_menu_background.jpg"},
			{name : "misc_atlas", path : "./img/misc_atlas.png"},
			{name : "numbers", path : "./img/numbers.png"},
			{name : "street_canyon", path : "./img/street_canyon.jpg"},
			{name : "street_city", path : "./img/street_city.jpg"},
			{name : "street_desert", path : "./img/street_desert.jpg"},
			{name : "street_grass", path : "./img/street_grass.jpg"},
			{name : "street_snow", path : "./img/street_snow.jpg"},
			{name : "street_water", path : "./img/street_water.jpg"},
			{name : "help", path : "./img/help.jpg"}
		]
	];

	LLoadManage.load(
		loadData[0],
		null,
		function (r) {
			updateDataList(r);

			var preloader = new ytPreloader();
			addChild(preloader);

			LLoadManage.load(
				loadData[1],
				function (p) {
					preloader.setProgress(p);
				},
				function (r) {
					updateDataList(r);

					preloader.remove();

					addMenuInterface();
				}
			);
		}
	);
}

function updateDataList (r) {
	for (var k in r) {
		var o = r[k];

		if (o instanceof Image) {
			dataList[k] = new LBitmapData(o);
		} else {
			dataList[k] = o;
		}
	}
}

function addMenuInterface () {
	var menuInterface = new ytMenuLayer();
	addChild(menuInterface);
}

function addOptionInterface() {
	var optionInterface = new ytOptionLayer();
	addChild(optionInterface);
}

function addGameInterface (car, place) {
	var gameInterface = new ytGameLayer(car, place);
	addChild(gameInterface);
}

function addHelpInterface() {
	var helpInterface = new ytHelpLayer();
	addChild(helpInterface);
}

function addAboutInterface() {
	var aboutInterface = new ytAboutLayer();
	addChild(aboutInterface);
} 
