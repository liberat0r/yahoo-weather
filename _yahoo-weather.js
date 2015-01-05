/**
 * Yahoo weather
 *
 * Get yql results from a web service query
 * set self.weatherQuery to the location you would
 * like to query with
 *
 * .js-yahoo-weather will be filled with the weather details
 * .js-weather-icon the svg icon that describes current weather
 * .js-date-container client date updated with a timer
 *
 */

if (typeof globals === 'undefined') {
	var globals = {};
}

if (typeof globals.assetsDirectory === 'undefined') {
	globals.assetsDirectory = '/';
}

(function() {
	"use strict";

	function YahooWeatherService() {

		var self = this;

		self.$weatherContrainer = $(".js-yahoo-weather");
		self.$dateContainer = $(".js-date-container"); // will be updated after html is printed
		self.$weatherIcon = $(".js-weather-icon"); // will be updated after html is printed

		self.weatherQuery = 'Athens';

		// Init
		self.start = function() {

			if (self.$weatherContrainer.length > 0) {

				// Get weather query from wordpress
				if (globals.weatherQuery !== 'undefined' && globals.weatherQuery !== '') {
					self.weatherQuery = globals.weatherQuery;
				}

				// Get from yql query more on this: https://developer.yahoo.com/weather/
				$.get("https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20weather.bylocation%20WHERE%20location%3D'" +
				self.weatherQuery +
				"'%20AND%20unit%3D%22c%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", function(data) {

					var currentCondition = data.query.results.weather.rss.channel.item.condition;
					var outputHTML = null;

					if (typeof currentCondition !== 'undefined') {
						outputHTML = '<div class="weather">' +
							'<div class="weather__inner">' +
								/*'<div class="weather__row js-date-container"></div>' +*/
							'<div class="weather__image-wrapper js-weather-icon"></div>' +
							'<div class="weather__text">' + currentCondition.text + ' <span class="weather__temp">' + currentCondition.temp + '&deg;C</span>' + '</div>' +
							'</div>' +
							'</div>';

						self.$weatherContrainer.html(outputHTML);
						self.$dateContainer = $(".js-date-container"); // updated
						self.$weatherIcon = $(".js-weather-icon"); // updated

						if (self.$weatherIcon.length > 0) {
							self.$weatherIcon.html('<img class="weather__image" src="' + globals.assetsDirectory + 'img/weather/svg/' + currentCondition.code + '.svg" alt="' + currentCondition.text + '" />');
						}

						if (self.$dateContainer.length > 0) {
							self.updateDate();
						}
					} else {
						outputHTML = '<div class="weather">' +
							'<div class="weather__inner">' +
							'<div class="weather__text">' + data.query.results.weather.rss.channel.title + '</div>' +
							'</div>' +
							'</div>';

						self.$weatherContrainer.html(outputHTML);
					}

				});

			}
		};


		// Get and update date
		self.updateDate = function() {
			var now = new Date(),
				time = now.getHours() + ':' + now.getMinutes(),
				date = [now.getDate(),
					now.getMonth() + 1,
					now.getFullYear()].join('.');

			self.$dateContainer.html([self.weatherQuery + ',', date, time].join(' '));

			setTimeout(self.updateDate, 1000);
		};

	}

	var _YahooWeatherService = new YahooWeatherService();

	$(function() {
		_YahooWeatherService.start();
	});

})();