/**
 * 사이버이메지네이션
 *
 * 웹포넌트 VISUALIZATION PIE
 *
 * @author 신이섭
 */
(function () {

	var productName = 'webPonent CHART 2.0';
	var productId = 'WC2';

	if (typeof WEBPONENT_CHART_LICENSE_KEY === 'undefined') {

		$.ajax({
			url : '/webponent.licenseKey.js',
			dataType : 'script',
			async : false
		});

		if (typeof WEBPONENT_CHART_LICENSE_KEY === 'undefined' || WEBPONENT_CHART_LICENSE_KEY === '') {

			alert(productName + '의 라이센스키를 입력해주세요.');
			return;
		}
	}

	var key = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";

	function decodeStr(coded) {
	    coded = decodeURIComponent(coded);
	    var uncoded = "";
	    var chr;
	    for (var i = coded.length - 1; i >= 0; i--) {
	        chr = coded.charAt(i);
	        uncoded += (chr >= "a" && chr <= "z" || chr >= "A" && chr <= "Z") ?
	            String.fromCharCode(65 + key.indexOf(chr) % 26) :
	            chr;
	    }
	    return uncoded;
	}

	function appendTrialUi (wrapper) {

		wrapper = $(wrapper);

		var trialUiWrapper = $('<div class="WEBPONENT-TRIAL-UI">');

		trialUiWrapper.css({
			'position': 'absolute',
			'top': '0',
			'left': '0',
			'width': '100%',
			'height': '100%',
			'background-image': "url('data:image/png;base64,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')",
			'background-repeat': 'no-repeat',
			'background-position': 'center center',
			'z-index': '1',
			'opacity': '0.3'
		});

		wrapper.prepend(trialUiWrapper);

		wrapper.on('mouseenter', function () {

			trialUiWrapper.stop(true, true);
			trialUiWrapper.hide();
		});

		wrapper.on('mouseleave', function () {

			trialUiWrapper.stop(true, true);
			trialUiWrapper.fadeIn();
		});

		wrapper.data('check-trial-ui', setInterval(function () {

			if (wrapper.find('.WEBPONENT-TRIAL-UI').length === 0) {

				clearInterval(wrapper.data('check-trial-ui'));
				//appendTrialUi(wrapper[0]);
			}
		}, 5000));
	}

	function makeLicenseObject (text) {

		var obj = {};

		var splitedArray = text.split(';');

		obj.product = splitedArray[0];
		obj.customer = splitedArray[2];
		obj.licenseType = splitedArray[3];
		obj.domains = splitedArray[5];
		obj.expireDate = splitedArray[6];

		return obj;
	}

	var TRIAL_UI = false;

	var decodedLicenseKey = decodeStr(WEBPONENT_CHART_LICENSE_KEY);

	var licenseObject = makeLicenseObject(decodedLicenseKey);

	if (licenseObject.licenseType === 'TRIAL') {

        var domain = window.location.host.toUpperCase();
        if(domain.indexOf('LOCALHOST') !== 0) {
            TRIAL_UI = true;
        }

		if (new Date() > new Date(licenseObject.expireDate * 1)) {

			alert(productName + ' ' + licenseObject.licenseType + '버전의 라이센스 유효기간이 지났습니다.');
			return;
		}

	} else if (licenseObject.licenseType === 'DEVELOP') {

		if (new Date() > new Date(licenseObject.expireDate * 1)) {

			TRIAL_UI = true;
		}
	/**
		licenseType ED시리즈 조건 추가(ver.150915 평다진)
	*/
	} else if (licenseObject.licenseType === 'OFFICIAL' || licenseObject.licenseType === "ED001" || licenseObject.licenseType === "ED002" || licenseObject.licenseType === "ED003") {

        var domain = window.location.host.toUpperCase();
        if(domain.indexOf('LOCALHOST') !== 0){
            TRIAL_UI = true;
        }

		var splitedDomain = licenseObject.domains.split(',');

		for (var i = 0; i < splitedDomain.length; i++) {

			var regesteredSite = splitedDomain[i];

			if (domain.indexOf(regesteredSite) > -1) {

				TRIAL_UI = false;
			}
		}
	} else if (licenseObject.product !== productId) {

		TRIAL_UI = true;

	} else {

		alert('유효하지 않은 ' + productName + ' 라이센스입니다.');
		TRIAL_UI = true;
	}

	(function() {

		var self = {};

		var PI = Math.PI;
		var elementType = getElementType();
		var lineError = getLineError();

		/**
		 * 기본으로 설정되어 있는 스타일 반환
		 * @return {defaultStyles} default styles
		 */
		function getDefaultStyles () {

			var defaultStyles = {

				layout : {
					position : {
						x : 0,
						y : 0
					},
					area : {
						color : '#fff',
						opacity : 1
					},
					line : {
						color : '#eaeaea',
						width : 0
					}
				},
				pie : {
					radius : 70,
					area : {
						color : [
							'#28a9a5', '#3db4af', '#5bc4c0', '#82d2cf',
							'#ace1df', '#c8ebea', '#d9f1f0'
						]
					},
					line : {
						color : '#fff',
						width : 3
					},
					animate : {
						use : true,
						step : 80,
						type : 'easeInOutExpo' /* linear | easeInOutExpo | none */
					},
					hover : {
						use : true,
						area : {
							color : '#138b87'
						}
					}
				},
				base : {
					use : false,
					radius : 80,
					area : {
						color : '#fff'
					},
					line : {
						color : '#fff',
						width : 1
					}
				},
				donut : {
					use : false,
					radius : 30,
					area : {
						color : '#fff'
					},
					line : {
						color : '#fff',
						width : 1
					}
				},
				legend : {
					use : true,
					stackedGap : 5,
					type : 'brokenLine',
					zeroLegend : true,
					text: {
						family: 'Nanum Gothic',
						size: 12,
						color: '#fff',
						style: 'normal',    /* normal | italic */
						weight: 'bold',   /* normal | bold */
						opacity: 1
					},
					pin : {
						color : '#fff',
						width : 1,
						length : 20,
						opacity : 1
					},
					pinHead : {
						color : '#fff',
						length : 20,
						width : 1,
						opacity : 1
					}
				},
				legendBox : {
                    use:false,
					visible:true,
                    layout : {
                        paddingTop : 0,
                        paddingBottom : 0,
                        paddingLeft : 0,
                        paddingRight : 0,
                        height:20,
                        width:100
                    },
                    color : ['#fff'],
                    text: {family:  'Nanum Gothic', size: 12, color: '#707070',  style: 'normal'},
                    size : {
                        height:'4px',
                        width : '10px'
                    },
                    gap : '10px'
                }
			};

			return defaultStyles;
		}

		/**
		 * 기본으로 설정되어 있는 옵션 반환
		 * @return {defaultOptions} default options
		 */
		function getDefaultOptions () {
			var defaultOptions = {
				data : {
					data : null,
					url: null,
					type: null,
					reverse: false,
					jsonDepth: 'output.result',
					use : null,
					gubun : null,
					gubunOption : null,
					dataLen: null
				},
				legend : {
					format : null,
					func : null
				},
				toolTip : {
					use : true,
					className : null,
					position : {
						x : 0,
						y : 0
					},
					func : null
				},
				timeSlice : {
					use : false,
					delay : 300,
					animate : {
						type : 'linear', /* linear|>|<|<>|bounce|elastic|backln|backOut|none */
						speed : 150
					},
					slider : null,
					play : null,
					pause : null,
					stop : null,
					data : null
				},
				resize : {
					use : false,
					func : null
				},
				legendBox : {
					use :false,
					position : 'right',
					format : ['범례1','범례2']
				}
			};

			return defaultOptions;
		}

		function cloneSettingModel () {

			/**
			 * PIE 의 세팅 정보를 담고 있다.
			 * @type {Object}
			 */
			var settingModel = {

				/**
				 * 데이터와 관련된 정보를 나타낸다.
				 */
				data : {

					dividedData : null,

					renderedData : null,

					renderedDataIndex : null,

					dataTotalValue : null,

					max : null,

					maxIndex : null
				},

				animation : {

					firstDraw : null,

					timeSlice : null
				},

				legend : {

					tipAttrArray : []
				},

				pie : {

					hover : {

						color : null
					}
				},

				wrapper : {

					width : null
				}
			};

			return settingModel;
		}

		/**
		 * defaultStyles 와 PIE 스타일을 extend 시켜준다.
		 * @param  {Object} style [PIE 스타일]
		 * @return {Object}       [extend 되어진 스타일]
		 */
		function extendStyles (style) {

			var defaultStyles = getDefaultStyles();

			var styles = $.extend(true, defaultStyles, style);

			if( elementType === 'VML') {

				styles.legend.text.family = 'Dotum';
			}

			return styles;
		}

		/**
		 * defaultOptions 와 PIE 옵션을 extend 시켜준다.
		 * @param  {Object} option [PIE 옵션]
		 * @return {Object}        [extend 되어진 옵션]
		 */
		function extendOptions (option) {

			var defaultOptions = getDefaultOptions();

			var options = $.extend(true, defaultOptions, option);


			return options;
		}

		/**
		 * 브라우져 환경에 따라 SVG 인지 VML 인지 구분해준다.
		 * @return {String} ['SVG' or 'VML']
		 */
		function getElementType () {

			var g = {doc: document, win: window};
			var elementType = (g.win.SVGAngle ||
					g.doc.implementation.hasFeature(
						"http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ?
						"SVG" : "VML");

			return elementType;
		}

		/**
		 * SVG 의 경우 line 이 굵게 그려지는 것을 감안 하기 위한 설정.
		 * @return {Number} [라인 굵기의 오차범위를 반환]
		 */
		function getLineError () {

			var lineError = 0;

			if ( elementType == 'SVG' ) {

				lineError = 0.5;
			}

			return lineError;
		}

		/**
		 * AJAX 를 이용하여 데이터를 읽어온다.
		 * @param  {Object} options [PIE 옵션]
		 * @return {Array}         [파싱된 데이터 반환]
		 */
		function loadData (options) {

			var data = [];

			if (options.data.data) {

				data = options.data.data;

			} else {

				$.ajax({
					url : options.data.url,
					async : false,
					dataType : options.data.type,
					jsonp : "callback",
					success : function (resp) {

						if (options.data.type == "json") {

							data = loadJson(resp, options);

						} else if (options.data.type == "text") {

							data = loadText(resp, options);
						}
					},
					error : function(e) {

					}
				});
			}

			if ( options.data.dataLen ){
				if( data.length > options.data.dataLen ) {
					var i = data.length - options.data.dataLen;
                    data.splice(0,i);
                }
			}

			return data;
		}

		/**
		 * 데이터가 json 형식일 경우
		 * options.data.jsonDepth 에 따라 해당 데이터를 반환한다.
		 * @param  {Array} data    [AJAX 에 의해 호출되어진 데이터]
		 * @param  {Object} options [PIE 옵션]
		 * @return {Array}         [PIE 데이터]
		 */
		function loadJson (data, options) {

			var bld_depth = options.data.jsonDepth.split('.');
			var outPut = bld_depth[0];
			var result = bld_depth[1];

			var arr = data;

			for (var i = 0; i < bld_depth.length; i++) {

				arr = arr[bld_depth[i]];
			}

			return arr;
		}

		/**
		  * 데이터가 text 형식일 경우
		  * '|' ,'\n' 을 기준으로 데이터를 파싱한다.
		  * @param  {String} data    [AJAX 에 의해 호출되어진 데이터]
		  * @param  {Object} options [PIE 옵션]
		  * @return {Array}         [PIE 데이터]
		  */
		function loadText (data2, options) {

			var arr = [];
			var data = data2;
			var lineArr = data.split('\n');
			var dataTitles = [];
			var titleCheck = true;

			for ( var i = 0; i < lineArr.length; i++) {

				if (lineArr.length <= 1) {

					continue;
				}

				var objArr = lineArr[i].split('|');

				if (titleCheck) {

					for ( var j = objArr.length; j--;) {

						dataTitles.unshift(trim(objArr[j]));
					}

					titleCheck = false;

				} else {

					var obj = {};

					if (objArr.length <= 1) {

						continue;
					}

					$.each(objArr, function(j, item) {

						obj[dataTitles[j]] = trim(item);
					});

					arr.push(obj);
				}
			}

			return arr;
		}

		/**
		 * 현재 렌더링된 데이터를 가져온다.
		 * @param  {Object} pie 객체
		 */
		function getRenderedData (pie) {

			var options = pie.options;
			var dividedData = pie.settings.data.dividedData;
			var dataLen = dividedData.length;
			var gubun = options.data.gubun;
			var gubunOption = options.data.gubunOption;

			for (var i = dataLen; i--;) {

				var dataI = dividedData[i];

				if (dataI[0][gubun] == gubunOption) {

					pie.settings.data.renderedData = dataI;
					pie.settings.data.renderedDataIndex = i;
				}
			}
		}

		/**
		 * options.data.gubun 을 기준으로 데이터를 나눈다.
		 * @param {Array} data
		 * @param {Array} gubunDataArr options.data.gubun 을 기준으로 나누어진 데이터
		 */
		function setDividedData (data, options) {

			var gubun = options.data.gubun;
			var gubunDataArr = [];
			var arrIndex = 0;
			var index = 0;

			gubunDataArr[0] = [];
			gubunDataArr[0][0] = data[0];

			var dataLen = data.length;

			for (var i = 1; i < dataLen; i ++ ){

				var dataI = data[i];

				if (dataI[gubun] == data[i - 1][gubun]) {

					index += 1;

					gubunDataArr[arrIndex][index] = dataI;

				} else {

					arrIndex += 1;
					index = 0;

					gubunDataArr[arrIndex] = [];

					gubunDataArr[arrIndex][index] = dataI;
				}
			}

			return gubunDataArr;
		}

		var trim = function (str) {

			str = str.replace(/(^\s*)|(\s*$)/gi, "");

			return str;
		};

		// Number Format 1,000
		priceDataFormat = function (txt) {

			if (txt === 0) return 0;

			var reg = /(^[+-]?\d+)(\d{3})/;
			var n = (txt + '');

			while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

			return n;
		};

		// DAY|MONTH Format (0000/00/00 | 0000/00)
		dayDataFormat = function (str){

			var length = String(str).length;
			var data = str = String(str);

			if(length > 6) {

				data = str.substr(0, 4);
				data += "/";
				data += str.substr(4, 2);
				data += "/";
				data += str.substr(6, 2);

			} else if (length > 4) {

				data = str.substr(0, 4);
				data += "/";
				data += str.substr(4, 2);

			} else {

				data = str.substr(0, 2);
				data += "/";
				data += str.substr(2, 2);
			}

			return data;
		};

		// DAY|MONTH Format (0000.00.00 | 0000.00)
		dayDataFormatDot = function (str){

			var length = String(str).length;
			var data = str = String(str);

			if (length > 6) {

				data = str.substr(0, 4);
				data += ".";
				data += str.substr(4, 2);
				data += ".";
				data += str.substr(6, 2);

			} else if (length > 4) {

				data = str.substr(0, 4);
				data += ".";
				data += str.substr(4, 2);

			} else {

				data = str.substr(0, 2);
				data += ".";
				data += str.substr(2, 2);
			}

			return data;
		};

		/**
		 * SVG 를 생성한다.
		 * @param  {Pie} pie [객체]
		 */
		function drawSvg (pie) {

			var styles = pie.styles;
			var svgWidth = Math.floor(pie.wrapper.width()) - lineError;
			var svgHeight = Math.floor(pie.wrapper.height()) - lineError;

			if(pie.options.inside)
				$(pie.wrapper[0]).css('pointer-events', 'none');

			pie.svg = Raphael(pie.wrapper[0], svgWidth, svgHeight);

			pie.svg.canvas.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
		}

		/**
		 * 레이아웃을 그려준다
		 * @param  {Pie} pie [객체]
		 */
		function drawLayout (pie) {

			var styles = pie.styles;
			var width = Math.floor(pie.wrapper.width()) - lineError;
			var height = Math.floor(pie.wrapper.height()) - lineError;

			if (elementType === "VML") {

				width = width - (styles.layout.line.width / 2) - 1.5;
				height = height - (styles.layout.line.width / 2) - 1.5;
			}

			pie.items.layout = pie.svg.rect(0, 0, width, height);

			pie.items.layout.attr({
				fill : styles.layout.area.color,
				opacity: styles.layout.area.opacity,
				stroke : styles.layout.line.color,
				'stroke-width' : styles.layout.line.width
			});
		}

		/**
		 * PIE 를 둘러싸고 있는 base 를 그린다.
		 * @param  {Pie} pie [객체]
		 */
		function drawBasePie (pie) {

			var styles = pie.styles;
			var baseRadius = getPixel(pie, pie.styles.base.radius);
			var base = null;
			base = pie.svg.circle(
				pie.svg.width / 2 + styles.layout.position.x,
				pie.svg.height / 2 + styles.layout.position.y,
				baseRadius
			);

			base.attr({
				fill: colorConstructor(styles.base.area.color),
				stroke : styles.base.line.color,
				"stroke-width": styles.base.line.width
			});

			return base;
		}

		/**
		 * PIE 의 Donut 모양을 그린다.
		 * @param  {Pie} pie [객체]
		 */
		function drawDonuts (pie) {

			var styles = pie.styles;

			if (styles.donut.area.color !== undefined) {

				pie.items.donut = pie.svg.circle(
					pie.svg.width / 2 + styles.layout.position.x,
					pie.svg.height / 2 + styles.layout.position.y,
					getPixel(pie, pie.styles.donut.radius)
				);

				pie.items.donut.attr({
					fill: styles.donut.area.color,
					stroke : styles.donut.line.color,
					'stroke-width': styles.donut.line.width,
					'stroke-opacity': styles.donut.line.opacity
				});
			}
		}

		/**
		 * color 를 랜덤으로 반환
		 * @return {String} [랜덤으로 생성된 color]
		 */
		function getRandomColor() {

			var letters = '0123456789ABCDEF'.split('');
			var color = '#';

			for (var i = 0; i < 6; i++ ) {

				color += letters[Math.round(Math.random() * 15)];
			}

			return color;
		}

		/**
		 * color 에 src 가 있는 경우 src 의 경로를 url('') 의 형태로 바꾼다.
		 * @param  {String or Array} color
		 * @param  {Number} i     color 가 Array 일 경우 index 값
		 * @return {String}       color
		 */
		function colorConstructor (color, i) {

			var option = color;

			if (color.constructor == Array) {

				option = color[i];
			}

			if (option !== undefined) {

				if (option.hasOwnProperty('src')) {

					var img = new Image();

					img.src = option.src;

					option = 'url(' + img.src + ')';
				}

			} else {

				option = getRandomColor();
			}

			return option;
		}

		/**
		 * PIE 에 기본적인 styles 를 적용시킨 후
		 * 데이터가 적용되지 않은 상태를 임시로 그려준다.
		 * @param  {Pie} pie 객체
		 */
		function appendPieElement (pie) {

			var styles = pie.styles;
			var data = pie.settings.data.renderedData;
			var dataLength = data.length;

			pie.items.pie = pie.svg.set();

			for (var i = 0, len = dataLength; i < len; i++) {

				var segment = pie.svg.path();

				var fillColor = colorConstructor(styles.pie.area.color, i);

				segment.attr({
					fill : fillColor,
					stroke : styles.pie.line.color,
					"stroke-width" : styles.pie.line.width,
					"stroke-miterlimit" : 2
				});

				segment.number = i;

				pie.items.pie.push(segment);
			}
		}

		/**
		 * mouse 의 position 을 구한다.
		 * @return {Object}   mouse position
		 */
		function getMousePosition (e) {

			var m = {};

			e = e || window.event;

			if (elementType === 'VML') {

				var target = e.target || e.srcElement,
				rect = target.getBoundingClientRect(),
				parent = target.parentNode,
				parentRect = parent.getBoundingClientRect()

				m.x = e.offsetX + rect.left - parentRect.left;
				m.y = e.offsetY + rect.top - parentRect.top;

				// m.x = Math.round(e.x) + 0.5;
				// m.y = Math.round(e.y) + 0.5;

			} else {

				var appName = navigator.appName.toLowerCase();
				var userAgent = navigator.userAgent.toLowerCase();

				if (userAgent.indexOf('firefox') > - 1) { // FireFox

					m.x = Math.round(e.layerX);
					m.y = Math.round(e.layerY);

				} else if (appName === 'opera') { // Opera

					var target = e.target || e.srcElement,
						rect = target.getBoundingClientRect(),
						parent = target.parentNode,
						parentRect = parent.getBoundingClientRect();

					m.x = e.offsetX + rect.left - parentRect.left;
					m.y = e.offsetY + rect.top - parentRect.top;

				} else { // etc

					m.x = Math.round(e.offsetX);
					m.y = Math.round(e.offsetY);
				}
			}

			return m;
		}

		/**
		 * PIE 가 처음 그려질 때 애니메이션의 type 을 나타낸다.
		 * @type {Object}
		 */
		var animOptions = {

			linear : function (t) {

				return t;
			},

			easeInOutExpo : function (t) {

				var v = t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;

				return (v > 1) ? 1 : v;
			}
		};

		/* animation options */
		function animationOptions (t, styles) {

			var animOption = animOptions[styles.pie.animate.type](t);

			return animOption;
		}

		/**
		 * pie 애니메이션 루프
		 * @param  {Object} pie 객체
		 */
		function animationLoop (pie) {

			var styles = pie.styles;

			var animCount = (styles.pie.animate.use) ? 0 : 1;
			var animFrameAmount = (styles.pie.animate.use ) ? 1 / styles.pie.animate.step : 1;

			pie.settings.animation.firstDraw = setInterval(function () {

				if (animCount >= 1) {

					clearInterval(pie.settings.animation.firstDraw);
				}

				animCount += animFrameAmount;

				var animFunction = animationOptions(animCount, styles);

				setPieAttribute(pie, animFunction);

			}, 10);
		}

		/**
		 * pie 의 조각별 각도를 구한 후 각각의 조각 별로 path 를 설정하여 그린다.
		 * @param {Object} pie              객체
		 */
		function setPieAttribute (pie, animationDecimal) {

			var styles = pie.styles;
			var options = pie.options;
			var data = pie.settings.data.renderedData;
			var dataLen = data.length;
			var totalDataValue = pie.settings.data.dataTotalValue;
			var pieRadius = getPixel(pie, pie.styles.pie.radius);
			var centerX = pie.svg.width / 2 + styles.layout.position.x;
			var centerY = pie.svg.height / 2 + styles.layout.position.y;

			var startAngle = 0;
			var start = 0;

			var use = options.data.use;

			for ( var i = 0; i < dataLen; i++) {

				var angle = animationDecimal * Number(data[i][use]) / totalDataValue * PI * 2;
				var endAngle = startAngle + angle;
				var largeArc = ((endAngle - startAngle) % (PI * 2)) > PI ? 1 : 0;
				var startX = centerX + Math.cos(startAngle) * pieRadius;
				var startY = centerY + Math.sin(startAngle) * pieRadius;
				var endX = centerX + Math.cos(endAngle) * pieRadius;
				var endY = centerY + Math.sin(endAngle) * pieRadius;
				var val = Number(Number(360 / totalDataValue * data[i][use]).toFixed(2));
				var startVal = start + val;

				/*
					데이터가 한개일 경우 파이 한조각의 각도가 360도가 되기 때문에 시작과 끝의 지점이 같아진다.
					따라서 애니메이션이 적용되지 않은 상태에서는 path 가 정상적으로 그려지지 않기 때문에
					파이의 각도를 359.999도 로 변환한다.

					추가 20150619 평다진
					애니메이션이 false이고 하나의 조각만 100% 인경우도 위와 같은 현상이 나타나기 때문에 추가함.
				*/
				if (dataLen == 1 || (styles.pie.animate.use != true && val >= 360)) {

					startVal = 359.99;
				}

				var cmd =
						'M' + startX + ',' + startY +
						'A' + pieRadius + ',' + pieRadius + ',0,' + largeArc + ',1,' + endX + ',' + endY +
						'L' + centerX + ',' + centerY +
						'z';


				pie.items.pie[i].attr({
					path: cmd
				});

				if (animationDecimal >= 1) {
					/*
						start와 startVal 값이 같고 데이터가 0인 경우 IE8에서 영역을 잡지 못하고 0,0 좌표로 그려지는 버그 발생
						0.000000001 만큼 더해주어 영역 확보 처리(ver 20160308 평다진)
					 */
					if(start == startVal && Number(data[i][use]) == 0) {
						startVal -= 0.000000001;
					}

					if(start != startVal){
						/*
						 	start와 startVal이 같으면 다시 변경할 필요가 없으므로 분기처리(ver 20160314 평다진)
						 */

						pie.items.pie[i].attr({
							segment: [centerX, centerY, pieRadius, start, startVal]
						});
					}
				}

				start = startVal;
				startAngle += angle;

				if(pie.options.inside) {
					var a = pie.items.pie[i];
					$(a.node).css('pointer-events', 'auto');
				}
			}

			if (animationDecimal >= 1) {

				setTimeout(function () {

					pie.event.trigger('drawCompleted', [pie]);

				}, 100);
			}
		}

		/**
		 * pie 와 legend 사이를 연결하는 막대사탕 형태를 그려준다.
		 * @param  {Object} pie     객체
		 * @param  {object} tipAttr 	tip 이 그려지기 위한 attr 을 정의
		 */
		function drawLollipop (pie, tipAttr) {

			var styles = pie.styles;
			var options = pie.options;
			var data = pie.settings.data.renderedData;

			var tipAttrArray = pie.settings.legend.tipAttrArray;
			var lollipopGroup = pie.svg.set();

			var tipAttrLen = tipAttrArray.length;

			for (var i = 0; i < tipAttrLen; i++) {

				if (!data[i][options.data.use] && !styles.legend.zeroLegend) {

					continue;
				}

				if (!options.legend.func) {

					if (options.legend.use) {

						if (!data[i][options.legend.use]) {

							continue;
						}

					} else if (options.legend.format) {

						if (!options.legend.format[i]) {

							continue;
						}
					}
				}

				var lollipopElement = pie.svg.circle();

				lollipopElement.attr({
					cx : tipAttrArray[i].lineX,
					cy : tipAttrArray[i].lineY,
					r : Number(styles.legend.pinHead.size),
					fill : styles.legend.pinHead.area.color,
					stroke : styles.legend.pinHead.line.color,
					"stroke-width" : styles.legend.pinHead.line.width
				});

				lollipopGroup.push(lollipopElement);
			}

			pie.items.legend.pinHead = lollipopGroup;
		}

		/**
		 * pie 의 legend 를 그리기 위한 전반적인 설정을 한다.
		 * @param  {Object} pie 객체
		 */
		function drawLegend (pie) {

			var styles = pie.styles;

			getTipAttr(pie);

			pie.items.legend = {};

			if (styles.legend.type == 'insideLegend') {

			} else {

				setTipArrayStacked(pie);

				drawLegendPin(pie);

				if (styles.legend.type == 'brokenLine') {

					drawBrokenTip(pie);

				} else if (styles.legend.type == 'lollipop') {

					drawLollipop(pie);
				}
			}

			appendLegend(pie);
		}

		/**
		 * pie 의 tip 을 그리기 위한 attr 을 설정한다.
		 * @param  {Object} pie 객체
		 */
		function getTipAttr (pie) {

			var styles = pie.styles;
			var options = pie.options;
			var piePositionX = pie.svg.width / 2 + styles.layout.position.x;
			var piePositionY = pie.svg.height / 2 + styles.layout.position.y;
			var dataTotalValue = pie.settings.data.dataTotalValue;
			var pieRadius = getPixel(pie, styles.pie.radius);
			var data = pie.settings.data.renderedData;
			var pinLength = Number(styles.legend.pin.length);
			var tmpAngle = 0;
			var tipArray = [];

			if (styles.legend.type == 'insideLegend') {

				pieRadius = pieRadius * 0.65;
				pinLength = 0;
			}

			var dataLen = data.length;
			var lineW = styles.pie.line.width;
			var use = options.data.use;

			for (var i = 0; i < dataLen; i++) {

				var segmentValue = 360 * (Number(data[i][use]) / dataTotalValue);
				var angle = (tmpAngle + segmentValue / 2) * (PI / 180);

				tipArray[i] = {};

				var tipArrI = tipArray[i];

				tipArrI.moveX = piePositionX + (pieRadius - (lineW) / 2) *
									Math.cos(angle);
				tipArrI.moveY = piePositionY + (pieRadius - (lineW) / 2) *
									Math.sin(angle);
				tipArrI.lineX = piePositionX + (pieRadius + pinLength) *
									Math.cos(angle);
				tipArrI.lineY = piePositionY + (pieRadius + pinLength) *
									Math.sin(angle);

				var _angle = angle * 180 / PI;

				if (_angle < 90) {

					tipArrI.directionX = "right";
					tipArrI.directionY = "bottom";

				} else if (90 <= _angle && _angle < 180) {

					tipArrI.directionX = "left";
					tipArrI.directionY = "bottom";

				} else if (180 <= _angle && _angle < 270) {

					tipArrI.directionX = "left";
					tipArrI.directionY = "top";

				} else if (270 <= _angle) {

					tipArrI.directionX = "right";
					tipArrI.directionY = "top";
				}

				tmpAngle += segmentValue;
			}

			pie.settings.legend.tipAttrArray = tipArray;
		}

		/**
		 * pie 의 legend 가 겹칠 경우 겹치지 않도록 수정한다.
		 * @param {Object} pie 객체
		 */
		function setTipArrayStacked (pie) {

			var array = pie.settings.legend.tipAttrArray;
			var styles = pie.styles;
			var textSize = Number(styles.legend.text.size);
			var arrayLen = array.length;
			var stackedGap = styles.legend.stackedGap;

			if (array[0].lineY - array[arrayLen - 1].lineY < textSize + (stackedGap / 2)) {

				var gap = (textSize - (array[0].lineY - array[arrayLen - 1].lineY)) / 2;

				array[0].lineY = array[0].lineY + gap + (stackedGap / 2);
				array[arrayLen -1].lineY = array[arrayLen -1].lineY - gap - (stackedGap / 2);
			}

			for (var i = 0; i < arrayLen - 1; i++) {

				var arr = array[i];
				var arr2 = array[i + 1];
				var directionX = arr.directionX;
				var directionY = arr.directionY;

				if (directionX === undefined) {

					directionX = 'right';
				}

				if (directionX == 'right' && directionY == 'bottom' &&
						arr2.directionX == 'right' && arr2.directionY == 'bottom') {

					if (arr2.lineY - arr.lineY < textSize + stackedGap) {

						var yInterval = textSize - (arr2.lineY - arr.lineY) + stackedGap;

						arr2.lineY = arr2.lineY + yInterval;
					}

				} else if (directionX == 'left' && directionY == 'top' &&
						arr2.directionX == 'left' && arr2.directionY == 'top') {

					if (arr.lineY - arr2.lineY < textSize  + stackedGap) {

						var yInterval = textSize - (arr.lineY - arr2.lineY) + stackedGap;

						arr2.lineY = arr2.lineY - yInterval;
					}
				}

				if (directionY == 'bottom' && arr2.directionY == 'top') {

					if (arr.lineY - arr2.lineY < textSize + (stackedGap / 2)) {

						var gap = (textSize - (arr.lineY - arr2.lineY)) / 2;

						arr.lineY = arr.lineY + gap + (stackedGap / 2);
						arr2.lineY = arr2.lineY - gap - (stackedGap / 2);
					}
				}
			}

			for (var i = arrayLen; i--;) {

				var arr = array[i];
				var arr2 = array[i - 1];
				var directionX = arr.directionX;
				var directionY = arr.directionY;

				if (directionX === undefined) {

					directionX = 'right';
				}

				if (arr2 === undefined) {

					arr2 = {};
					arr2.directionX = 'right';
				}
				if (directionX == 'right' && directionY == 'top' &&
						arr2.directionX == 'right' && arr2.directionY == 'top') {

					if (arr.lineY - arr2.lineY < textSize  + stackedGap) {

						var yInterval = 0;

						yInterval = textSize - (arr.lineY - arr2.lineY) + stackedGap;
						arr2.lineY = arr2.lineY - yInterval;
					}

				} else if (directionX == 'left' && directionY == 'bottom' &&
						arr2.directionX == 'left' && arr2.directionY == 'bottom') {

					if (arr2.lineY - arr.lineY < textSize + stackedGap) {

						var yInterval = 0;

						yInterval = textSize - (arr2.lineY - arr.lineY) + stackedGap;
						arr2.lineY = arr2.lineY + yInterval;
					}
				}
			}

			for (var i = 0; i < array.length; i++) {

				array[i].lineX = Math.floor(array[i].lineX) - lineError;
				array[i].lineY = Math.floor(array[i].lineY) - lineError;
			}

			return array;
		}

		/**
		 * legend 를 그릴 경우 pie 와 legend 사이에 line 을 그린다 (pie 에 직접 닿는 부분).
		 * @param  {Object} pie     객체
		 */
		function drawLegendPin (pie) {

			var styles = pie.styles;
			var options = pie.options;
			var data = pie.settings.data.renderedData;

			var tipAttr = pie.settings.legend.tipAttrArray;
			var tipElementGroup = pie.svg.set();

			var tipAttrLen = tipAttr.length;

			for ( var i = 0; i < tipAttrLen; i++ ) {

				if (!data[i][options.data.use] && !styles.legend.zeroLegend) {

					continue;
				}

				if (!options.legend.func) {

					if (options.legend.use) {

						if (!data[i][options.legend.use]) {

							continue;
						}

					} else if (options.legend.format) {

						if (!options.legend.format[i]) {

							continue;
						}
					}
				}

				var tipElement = pie.svg.path();
				var tipAttrI = tipAttr[i];

				tipElement.attr({
					"stroke-width" : styles.legend.pin.width,
					"stroke-miterlimit" : 2,
					stroke : styles.legend.pin.color,
					width : styles.legend.pin.width,
					opacity : styles.legend.pin.opacity
				});

				var tipPath = [
					'M', tipAttrI.moveX,  tipAttrI.moveY,
					'L', tipAttrI.lineX,  tipAttrI.lineY,
					'Z'
				];

				tipElement.attr({
					"path" : tipPath.join(' ')
				});

				tipElementGroup.push(tipElement);
			}

			pie.items.legend.pin = tipElementGroup;
		}

		function drawTip (pie, tipAttr, data) {

			var styles = pie.styles;
			var options = pie.options;
			var tipElementGroup = pie.svg.set();

			var dataLen = data.length;

			var pinW = styles.legend.tip.pin.width;
			var pinC = styles.legend.tip.pin.color;
			var pinO = styles.legend.tip.pin.opacity;

			for ( var i = 0; i < dataLen; i++ ) {

				var tipElement = pie.svg.path();
				var tipAttrI = tipAttr[i];

				tipElement.attr({
					"stroke-width" : pinW,
					"stroke-miterlimit" : 2,
					stroke : pinC,
					width : pinW,
					opacity : pinO
				});

				var tipPath = [
					'M', tipAttrI.moveX,  tipAttrI.moveY,
					'L', tipAttrI.lineX,  tipAttrI.lineY,
					'Z'
				];

				tipElement.attr({
					"path" : tipPath.join(' ')
				});

				tipElementGroup.push(tipElement);

			}
			return tipElementGroup;
		}

		/**
		 * legend 를 그릴 경우 pie 와 legend 사이에 꺾인 형태의 line 을 그린다.
		 * @param  {Object} pie     객체
		 * @param  {object} tipAttr 선이 그려질 기준이 정의된 object
		 */
		function drawBrokenTip (pie, tipAttr) {

			var styles = pie.styles;
			var options = pie.options;
			var data = pie.settings.data.renderedData;

			var tipAttr = pie.settings.legend.tipAttrArray;
			var tipAttrLen = tipAttr.length;
			var brokenTipGroup = pie.svg.set();

			var pinHeadL = Number(styles.legend.pinHead.length);
			var pinHeadC = styles.legend.pinHead.color;
			var pinHeadO = styles.legend.pinHead.opacity;
			var pinHeadW = styles.legend.pinHead.width;

			for ( var i = 0; i < tipAttrLen; i++ ) {

				if (!data[i][options.data.use] && !styles.legend.zeroLegend) {

					continue;
				}

				if (!options.legend.func) {

					if (options.legend.use) {

						if (!data[i][options.legend.use]) {

							continue;
						}

					} else if (options.legend.format) {

						if (!options.legend.format[i]) {

							continue;
						}
					}
				}

				var tipAttrI = tipAttr[i];

				if (tipAttrI.directionX == "right") {

					var lineX = tipAttrI.lineX + pinHeadL;

				} else {

					var lineX = tipAttrI.lineX - pinHeadL;
				}

				var lineY = tipAttrI.lineY;
				var brokenTip = pie.svg.path();

				brokenTip.attr({
					path : [
						'M', tipAttrI.lineX, lineY,
						'L', lineX, lineY,
						'Z'
					],
					stroke : pinHeadC,
					opacity : pinHeadO,
					'stroke-width' : pinHeadW
				});

				brokenTipGroup.push(brokenTip);
			}

			pie.items.legend.pinHead = brokenTipGroup;
		}

		/**
		 * legend 를 사용할 경우 legend 전반적인 설정을 해준다.
		 * @param  {Object} pie  객체
		 * @param  {json} data
		 */
		function appendLegend (pie, data) {

			var styles = pie.styles;
			var options = pie.options;
			var legendTextGroup = pie.svg.set();
			var tipAttr = pie.settings.legend.tipAttrArray;
			var tipAttrlen = tipAttr.length;
			var renderedData = pie.settings.data.renderedData;
			var anchor = 'middle';
			var interval = 0;
			var legendUse = pie.options.legend.use;
			var dataUse = pie.options.data.use;
			var legendT = styles.legend.text;

			if (styles.legend.type == 'brokenLine') {

				interval = Number(styles.legend.pinHead.length) + 5;

			} else if (styles.legend.type == 'lollipop') {

				interval = Number(styles.legend.pinHead.size) + 8;
			}

			for (var i = 0; i < tipAttrlen; i++) {

				var tipAttrI = tipAttr[i];
				var x = tipAttrI.lineX;

				if (styles.legend.type != 'insideLegend') {

					if (tipAttrI.directionX == "right") {

						anchor = "start";
						x = x + interval;

					} else {

						anchor = "end";
						x = x - interval;
					}
				}

				var text = renderedData[i][legendUse];

				if (!legendUse) {

					text = renderedData[i][dataUse];
				}

				if (!text && !styles.legend.zeroLegend) {

					continue;
				}

				if (options.legend.format !== null) {

					text = options.legend.format[i];
				}

				var legendText = pie.svg.text();

				legendText.attr({
					x : x,
					y : tipAttrI.lineY,
					text : String(text),
					fill: legendT.color,
					opacity : legendT.opacity,
					'font-family': legendT.family,
					'font-size': legendT.size,
					'font': legendT.size + " '" + legendT.family + "'",
					'font-weight': legendT.weight,
					'font-style': legendT.style,
					"text-anchor": anchor
				});

				legendTextGroup.push(legendText);
			}

			if (options.legend.func !== null) {

				var legendTextArray = options.legend.func(pie);

				if (legendTextArray !== undefined) {

					for (var i = 0; i < legendTextArray.length; i++ ) {

						legendTextGroup[i].attr({
							text : legendTextArray[i]
						});
					}
				}
			}

			pie.items.legend.text = legendTextGroup;
		}

		/**
		 * 툴팁 사용 시 element 를 생성 한다.
		 * @param  {Object} pie 객체
		 */
		function appendToolTip (pie) {

			var options = pie.options;

			pie.items.toolTip = $('<div>');

			if (options.toolTip.className === null) {

				pie.items.toolTip.css({
					"background": "#465866",
					"color": "#fff",
					"padding": "5px 10px",
					"border": "1px solid #fff",
					"border-radius": "2px"
				});

			} else {

				pie.items.toolTip.attr('class', options.toolTip.className);
			}

			pie.items.toolTip.css({
				'position' : "absolute",
				'white-space': 'nowrap',
				'z-index': 100000
			});

			pie.items.toolTip.hide();

			pie.wrapper.append(pie.items.toolTip);

		}

		/**
		 * pie 를 둘러싸고 있는 div 의 width 와 height 를 기준으로
		 * styles 에 정의 된 % 값을 pixel 로 변경
		 * @param  {Object} pie     객체
		 * @param  {number} percent  pixel 로 변경할 % 값
		 * @return {number}   pixel
		 */
		function getPixel (pie, percent) {

			var pixel = 0;
			var pieW = pie.wrapper.width();
			var pieH = pie.wrapper.height();
			var min = pieW;

			if (pieW > pieH) {

				min = pieH;
			}

			pixel = min / 100 * percent / 2;

			return pixel;
		}

		/**
		 * 데이터가 load 되지 않았을 경우
		 * @param  {Object} pie 객체
		 */
		function noData (pie) {

			var x = pie.wrapper.width() / 2;
			var y = pie.wrapper.height() / 2;
			var text = pie.svg.text(x, y, '데이터가 로드되지 않았습니다.');

			text.attr({
				'font-family': 'dotum',
				'font-size': 12,
				fill: '#000'
			});
		}

		/**
		 * object 의 모든 key, value 를 탐색
		 * @param  {object} obj
		 * @param  {key} key
		 * @return {object} objects
		 */
		function getObjects (obj, key) {

			var objects = [];

			for (var i in obj) {

				if (!obj.hasOwnProperty(i)) {

					continue;
				}

				if (typeof obj[i] == 'object') {

					objects = objects.concat(getObjects(obj[i], key));

				} else if (i == key) {

					console.log(obj);
				}
			}

			return objects;
		}

		/**
		 * 데이터에 ',' 가 있을 경우 제거한다.
		 * @param  {Object} pie 객체
		 */
		function removeComma (pie) {

			var options = pie.options;
			var use = options.data.use;
			var data = pie.data;
			var dataLen = data.length;

			for (var i = 0; i < dataLen; i++) {

				var dataI = data[i];

				if (typeof dataI[use] == 'string') {

					dataI[use] = Number(dataI[use].split(',').join(''));

				} else {

					dataI[use] = Number(dataI[use]);
				}
			}
		}

		/**
		 * pie 를 그리기 위한 전반적인 데이터 setting 을 해준다.
		 * @param  {Object} pie 객체
		 */
		function settingData (pie) {

			removeComma(pie);

			if ( pie.options.data.reverse ) {

				pie.data.reverse();
			}

			if (pie.options.data.gubun !== null) {

				pie.settings.data.dividedData = setDividedData(pie.data, pie.options);

				if (pie.options.data.gubunOption !== null) {

					getRenderedData(pie);

				} else {

					pie.settings.data.renderedData =
							pie.settings.data.dividedData[
									pie.settings.data.dividedData.length - 1];

					pie.settings.data.renderedDataIndex =
							pie.settings.data.dividedData.length - 1;
				}

			} else {

				pie.settings.data.dividedData = pie.data;
				pie.settings.data.renderedData = pie.data;
			}

			setDataTotalValue(pie);
			setMaxData(pie);
			setMinData(pie);
		}

		/**
		 * pie 의 데이터 중 최대값을 구한다.
		 * @param {Object} pie 객체
		 */
		function setMaxData (pie) {

			var options = pie.options;
			var renderedData = pie.settings.data.renderedData;
			var use = options.data.use;
			var max = Number(renderedData[0][use]);
			var maxIndex = 0;

			var dataLen = renderedData.length;

			for (var i = 0; i < dataLen; i++) {

				if ( max < Number(renderedData[i][use])) {

					max = Number(renderedData[i][use]);
					maxIndex = i;
				}
			}

			pie.settings.data.max = max;
			pie.settings.data.maxIndex = maxIndex;
		}

		/**
		 * pie 의 데이터 중 최소값을 구한다.
		 * @param {Object} pie 객체
		 */
		function setMinData (pie) {

			var options = pie.options;
			var renderedData = pie.settings.data.renderedData;
			var use = options.data.use;
			var min = Number(renderedData[0][use]);
			var minIndex = 0;

			var dataLen = renderedData.length;

			for (var i = 0; i < dataLen; i++ ) {

				if ( min > Number(renderedData[i][use])) {

					min = Number(renderedData[i][use]);
					minIndex = i;
				}
			}

			pie.settings.data.min = min;
			pie.settings.data.minIndex = minIndex;
		}

		/**
		 * 데이터의 총 합을 구한다.
		 * @param {Object} pie 객체
		 */
		function setDataTotalValue (pie) {

			var dataTotalValue = null;
			var data = pie.settings.data.renderedData;
			var dataLength = pie.settings.data.renderedData.length;
			var use = pie.options.data.use;

			for (var i = dataLength; i--;) {

				dataTotalValue += Number(data[i][use]);
			}

			pie.settings.data.dataTotalValue = dataTotalValue;
		}

		/**
		 * pie 의 시계열 사용 시 slider 를 설정한다.
		 * @param {Object} pie 객체
		 */
		function setTimeSlice (pie) {

			var styles = pie.styles;
			var options = pie.options;
			var timeSlice = options.timeSlice;
			var dividedData = pie.settings.data.dividedData;
			var renderedDataIndex = pie.settings.data.renderedDataIndex;

			if (timeSlice.data !== null) {

				timeSlice.data(dividedData[renderedDataIndex]);
			}

			timeSlice.slider.slider({
				range: 'max',
				min: 0,
				max: dividedData.length - 1,
				value: renderedDataIndex,
				slide: function (event, ui) {

					clearInterval(pie.settings.animation.timeSlice);

					renderedDataIndex = ui.value;

					pie.setData(
						renderedDataIndex,
						timeSlice.animate.use,
						timeSlice.animate.speed,
						timeSlice.animate.type
					);

					if (timeSlice.data !== null) {

						timeSlice.data(dividedData[renderedDataIndex]);
					}
				}
			});

			timeSlice.slider.slider('option', {disabled : true});
		}

		/**
		 * pie hover 이벤트 발생시 해당 pie 의 color 을 바꿔준다.
		 */
		function setHoverColor (e, _this, pie) {

			var hoverColor = colorConstructor(pie.styles.pie.hover.area.color);

			pie.settings.pie.hover.color = _this.attr('fill');

			_this.attr({
				fill : hoverColor
			});
		}

		/**
		 * mouse move event
		 */
		function mouseMoveFunc (e, _this, pie) {

			var styles = pie.styles;
			var options = pie.options;
			var toolTip = pie.items.toolTip;

			var data = pie.settings.data.renderedData[_this.number];
			var dataTotalValue = pie.settings.data.dataTotalValue;
			var mousePosition = getMousePosition(e);

			if (options.toolTip.func !== null) {

				eval(options.toolTip.func)(pie, data, toolTip);

			} else {

				var data = '<span>' +
							Math.round(100 / dataTotalValue * data[options.data.use]) +
							'%</span><br />';

				var tipElement = '<div class="tip_data">'+ data + '</div>';

				toolTip.html(tipElement);
			}

		/*	var toolTipWidth = toolTip.width() / 2;
			var toolTipHeight = toolTip.height();

			toolTip.css({
				top : mousePosition.y - toolTipHeight + options.toolTip.position.y - 30,
				left : mousePosition.x - toolTipWidth + options.toolTip.position.x - 10
			});*/

            var toolTipWidth = toolTip.width() / 2;
            var toolTipHeight = toolTip.height();

            var top = mousePosition.y - toolTipHeight + options.toolTip.position.y -30;
            var left = mousePosition.x - toolTipWidth + options.toolTip.position.x - 10;

            var wrapHeight = pie.svg.height-toolTipHeight;
            var wrapWidth = pie.svg.width-(toolTipWidth*2);

            if(top < 0 ){
                top =  mousePosition.y + toolTipHeight- options.toolTip.position.y - 30;
            }else if(top > wrapHeight){
                top = mousePosition.y - options.toolTip.position.y + (toolTipHeight/2)
            }

            if(left<0){
                left = 0;
            }else if(left>wrapWidth){
                left = wrapWidth;
            }

            toolTip.css({
                top : top,
                left : left
            });
		}

		/**
		 * pie 에 이벤트 발생시
		 * @param  {Object} pie 객체
		 */
		function itemsEvents (pie) {

			var styles = pie.styles;
			var options = pie.options;
			var dividedData = pie.settings.data.dividedData;
			var mouseHover = null;

			if (options.timeSlice.play !== null) {

				options.timeSlice.play.click(function () {

					clearInterval(pie.settings.animation.timeSlice);

					var renderedDataIndex = pie.settings.data.renderedDataIndex;

					if (renderedDataIndex == dividedData.length - 1) {

						renderedDataIndex = 0;

						options.timeSlice.slider.slider(
									"option", "value", renderedDataIndex);

						pie.setData(
							renderedDataIndex,
							options.timeSlice.animate.use,
							options.timeSlice.animate.speed,
							options.timeSlice.animate.type
						);
					}

					pie.settings.animation.timeSlice = setInterval(function () {

						if (renderedDataIndex == dividedData.length - 1) {

							clearInterval(pie.settings.animation.timeSlice);

						} else {

							renderedDataIndex += 1;

							options.timeSlice.slider.slider(
									"option", "value", renderedDataIndex);

							pie.setData(
								renderedDataIndex,
								options.timeSlice.animate.use,
								options.timeSlice.animate.speed,
								options.timeSlice.animate.type
							);

							if (options.timeSlice.data !== null) {

								options.timeSlice.data(
										dividedData[renderedDataIndex]);
							}
						}
					}, options.timeSlice.delay);
				});
			}

			if (options.timeSlice.pause !== null) {

				options.timeSlice.pause.click(function () {

					clearInterval(pie.settings.animation.timeSlice);
				});
			}

			if (options.timeSlice.stop !== null) {

				options.timeSlice.stop.click(function () {

					clearInterval(pie.settings.animation.timeSlice);

					options.timeSlice.slider.slider(
							"option", "value", dividedData.length - 1);

					pie.setData(
						dividedData.length - 1,
						options.timeSlice.animate.use,
						options.timeSlice.animate.speed,
						options.timeSlice.animate.type
					);

					if (options.timeSlice.data !== null) {

						options.timeSlice.data(dividedData[dividedData.length - 1]);
					}
				});
			}

			pie.items.pie.hover( function (e) {

                if(options.onHover)
                    options.onHover(pie.settings.data.renderedData[this.number]);


				if (options.toolTip.use) {

					pie.items.toolTip.show();

					mouseMoveFunc(e, this, pie);

				}

				if (styles.pie.hover.use) {

					setHoverColor(e, this, pie);
				}

			}, function (e) {

                if(options.onHover)
                    $.each(pie.legendInsidArr, function(i, v) {
                    	$(v.node).remove();
					});

				if (options.toolTip.use) {

					pie.items.toolTip.hide();
				}

				if (styles.pie.hover.use) {

					this.attr({
						fill : pie.settings.pie.hover.color
					});
				}
			});

			pie.items.pie.mousemove( function (e) {
                mouseHover = this;
				if (options.toolTip.use) {

					mouseMoveFunc(e, this, pie);
				}

			}).mouseout( function(e){

				if (options.toolTip.use) {

					pie.items.toolTip.hide();
				}
			});

            pie.items.pie.click( function(e) {
                if(options.onClick)
                    options.onClick(pie.settings.data.renderedData[mouseHover.number]);
			});
		}

		/**
		 * pie 의 데이터가 변경 되었을 때 pie 의 attr 을 변경해준다.
		 * @param  {Object} pie          객체
		 * @param  {boolean} usingAnimate 	애니메이션 동작 여부
		 * @param  {number} aniSpeed     애니메이션 속도
		 * @param  {string} aniType      애니메이션 타입
		 */
		function reDrawPie (pie, usingAnimate, aniSpeed, aniType) {

			var styles = pie.styles;
			var options = pie.options;
			var data = pie.settings.data.renderedData;
			var totalDataValue = pie.settings.data.dataTotalValue;
			var pieRadius = getPixel(pie, styles.pie.radius);
			var centerX = pie.svg.width / 2 + styles.layout.position.x;
			var centerY = pie.svg.height / 2 + styles.layout.position.y;
			var speed = 300;
			var type = 'linear';
			var start = 0;
			var use = pie.options.data.use;

			if (aniSpeed !== undefined) {

				speed = aniSpeed;
			}

			if (aniType !== undefined) {

				type = aniType;
			}

			for (var i = 0; i < data.length; i++) {

				var val = 360 / totalDataValue * data[i][use];
				var startVal = start + val;

				/*
					데이터가 한개일 경우 파이 한조각의 각도가 360도가 되기 때문에 시작과 끝의 지점이 같아진다.
					따라서 애니메이션이 적용되지 않은 상태에서는 path 가 정상적으로 그려지지 않기 때문에
					파이의 각도를 359.999도 로 변환한다.
				*/
				if (data.length == 1 || (styles.pie.animate.use != true && val == 360)) {

					startVal = 359.999;
				}

				if (usingAnimate === true && elementType === 'SVG') {

					pie.items.pie[i].animate({
						segment: [centerX, centerY, pieRadius, start, startVal]
					}, speed, aniType);

				} else {

					pie.items.pie[i].attr({
						segment: [centerX, centerY, pieRadius, start, startVal]
					});
				}

				start = startVal;
			}
		}

		function getUniqueID () {

			return Math.random().toString(36).substr(2, 9);
		}

		/**
		 * PIE 에 나타나는 모든것을 그려준다.
		 * @param  {Object} pie 객체
		 */
		function drawItems (pie) {

			var styles = pie.styles;
			var options = pie.options;

			if (styles.base.use) {

				pie.items.basePie = drawBasePie(pie);
			}

			appendPieElement(pie);

			pie.svg.customAttributes.segment = function (x, y, r, a1, a2) {

				var flag = (a2 - a1) > 180;
				var clr = (a2 - a1) / 360;

				a1 = (a1 % 360) * Math.PI / 180;
				a2 = (a2 % 360) * Math.PI / 180;

				var path = [
					["M", x, y],
					["l", r * Math.cos(a1), r * Math.sin(a1)],
					["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)],
					["z"]
				];

				return {

					path: path
				};
			};

			if (styles.pie.animate.use === true && elementType === 'SVG') {

				animationLoop(pie);

			} else {

				setPieAttribute(pie, 1);
			}

			if (styles.donut.use) {

				drawDonuts(pie);
			}

			if (options.toolTip.use) {

				appendToolTip(pie);
			}

			if (styles.legend.use) {

				drawLegend(pie);
			}

			if (options.timeSlice.use) {

				setTimeSlice(pie);
			}
		}
        var remakeChartLayout = function(pie) {

            var legendWidth = pie.styles.legendBox.layout.width + pie.styles.legendBox.layout.paddingLeft+ pie.styles.legendBox.layout.paddingRight;
            var legendHeight = pie.styles.legendBox.layout.height +  pie.styles.legendBox.layout.paddingTop +  pie.styles.legendBox.layout.paddingBottom;

			var position =  (pie.options.legendBox.position==undefined)?'right':pie.options.legendBox.position;
            if (position == 'bottom') {
                pie.styles.layout.position.y = pie.styles.layout.position.y - legendHeight/2;
            } else if (position == 'right') {
                pie.styles.layout.position.x =  pie.styles.layout.position.x - (legendWidth)/2;
            } else if ( position =='left') {
                pie.styles.layout.position.x = pie.styles.layout.position.x + legendWidth/2;
            } else {
                pie.styles.layout.position.y =  pie.styles.layout.position.y + legendHeight/2;
            }
        }
        function drawLegendBox(pie) {
			//legend 전체 감싸는 div
            var legend = $('<div>');

			var legendBoxOptions = pie.options.legendBox;
			var legendBoxStyles = pie.styles.legendBox;
            var legendFormat = legendBoxOptions.format;

            var _legendPosition = (legendBoxOptions.position==undefined)?'right':legendBoxOptions.position;
            var data = pie.data;

            var legendY = legendBoxStyles.layout.paddingTop;
            var legendX =  legendBoxStyles.layout.paddingLeft;
            var legendWidth = legendBoxStyles.layout.width ;
            var legendHeight = legendBoxStyles.layout.height;
            if(_legendPosition=='bottom'||_legendPosition=='top') {
            	legendWidth = pie.wrapper.width() - legendBoxStyles.layout.paddingRight -legendBoxStyles.layout.paddingLeft;
            	if(_legendPosition == 'bottom') {
            		legendY = pie.wrapper.height()-legendBoxStyles.layout.paddingBottom-legendBoxStyles.layout.height;
				}

			} else {
                legendHeight = pie.wrapper.height() - legendBoxStyles.layout.paddingTop -legendBoxStyles.layout.paddingBottom;
                if (_legendPosition == 'right') {
                    legendX = pie.wrapper.width() - legendBoxStyles.layout.width - legendBoxStyles.layout.paddingRight ;
                }
			}


            legend.css({
                'width': legendWidth,
                'height': legendHeight,
                'text-align': 'center',
                'position': 'absolute',
                'top': legendY,
                'left': legendX,
				'margin':0
            });

            for (var i = 0, len = data.length; i < len; i++) {
				var legendList = $("<li>");
				legendList.css({
					"text-align": "right",
					"width": "100%",
					"display": "block",
					"margin-bottom": "8px",
					"list-style-type": "none"
				});


            	var legendVal = "";

                if(!legendBoxOptions.use) {
                    legendVal = (legendFormat[i] == undefined )? '범례' + i : legendBoxOptions.format[i];
                } else {
                    legendVal = data[i][legendBoxOptions.use];
                }

                //사각형
                var color = legendBoxStyles.color[i] == undefined ? '#666' : legendBoxStyles.color[i];
                var legendRecHeight = legendBoxStyles.size.height == undefined ? '4px' : legendBoxStyles.size.height;
                var legendRecWidth = legendBoxStyles.size.width == undefined ? '10px' : legendBoxStyles.size.width;
                var legendRec = $("<div>");

                legendRec.css({
                    "width": legendRecWidth,
                    "height": legendRecHeight,
                    "background-color": color,
                    "margin-left": "8px",
                    "border-radius": "4px",
					"display" :"inline-block",
                    "vertical-align": "middle"
                });

                //글자
				var legendText = $("<span>");
                // var textWidth = legendWidth - parseInt(legendRecWidth) - parseInt(legendBoxStyles.gap) - 2;

                legendText.css({
                    'font-family': legendBoxStyles.text.family,
                    'font-size': legendBoxStyles.text.size + 'px',
                    'font': legendBoxStyles.text.size + " '" + legendBoxStyles.text.family + "'",
                    'fill': legendBoxStyles.text.color,
                    "vertical-align": "middle",
                    "display": "inline-block",
                    "padding-right":(_legendPosition=='top'||_legendPosition=='bottom' )?  parseInt(legendBoxStyles.gap):0,
                   // "width": textWidth + "px",
                    "word-break": "break-all"
                });
                legendText.html(legendVal);
                if(_legendPosition=='right'||_legendPosition=='left') {
                	legend.css('display','inline-block');
									legendRec.css("display","inline-block");
									legendList.append(legendText);
									legendList.append(legendRec);
									legend.append(legendList);
                } else {
                    legend.append(legendRec);
                    legend.append(legendText);
				}
            }
            pie.wrapper.append(legend);
            return legend;
		}

		function setWrapper (pie) {

			pie.settings.wrapper.width = pie.wrapper.width();
		}

		/**
		 * PIE 을 렌더링 하기 위한 전반적인 부분을 세팅한다.
		 * @param  {Object} pie 객체
		 * @param  {Node} wrapper pie 가 append 되는 DIV
		 * @param  {Object} styles pie 스타일
		 * @param  {Object} options pie 옵션
		 */
		function setup (pie, wrapper, styles, options) {

			pie.wrapper = wrapper;

			pie.wrapper.css({
				'position' : "relative"
			});

			pie.styles = extendStyles(styles);

			// url에 hash - #exportPDF를 붙이면 애니메이션이 동작하지 않는다.
			if (window.location.hash && window.location.hash.slice(1) === "skipAnimation" ||
				getElementType() === 'VML') {

				pie.styles.pie.animate.use = false;
			}

			pie.options = extendOptions(options);

			pie.data = loadData(pie.options);

			pie.items = {};

			pie.settings = cloneSettingModel();

			setWrapper(pie);

			drawSvg(pie);




			drawLayout(pie);

            if(pie.styles.legendBox.use) {
                if(pie.styles.legendBox.visible) {
                    drawLegendBox(pie);
                }
                remakeChartLayout(pie);
            }
			if (pie.data === 'error' || pie.data.length <= 0) {

				noData(pie);

			} else {

				settingData(pie);

				if (!pie.settings.data.dataTotalValue) {

					return;
				}

				drawItems(pie);

				itemsEvents(pie);
			}
		}

		/**
		 * PIE 에 이벤트를 붙여준다.
		 * @param  {Object} pie 객체
		 */
		function bindEvents (wrapper, pie) {

			/**
			 * pie 가 완성 되었을때 발생하는 이벤트
			 */
			pie.event.on('drawCompleted', function (e, pie) {

				if (pie.options.timeSlice.slider !== null) {

					pie.options.timeSlice.slider.slider('option', {disabled : false});
				}

				wrapper.trigger('drawCompleted');
			});

			/**
			 * pie 를 redraw 할 때 발생하는 이벤트
			 */
			pie.event.on('reDraw', function (e, pie) {


			});

			var waitForFinalEvent = (function () {

				var timers = {};

				return function (callback, ms, uniqueId) {

					if (!uniqueId) {

						uniqueId = "Don't call this twice without a uniqueId";
					}

					if (timers[uniqueId]) {

						clearTimeout (timers[uniqueId]);
					}

					timers[uniqueId] = setTimeout(callback, ms);
				};
			})();

			/**
			 * pie 의 resize 이벤트
			 */
			if (wrapper.data('resizeEventName')) {

				$(window).off(wrapper.data('resizeEventName'));
			}

			var wrapperUniqueId = getUniqueID();

			wrapper.data('resizeEventName', 'resize.' + wrapperUniqueId);

			$(window).on(wrapper.data('resizeEventName'), function (e) {

				var afterWrapperWidth = pie.settings.wrapper.width;
				var beforeWrapperWidth = pie.wrapper.width();

				if (afterWrapperWidth !== beforeWrapperWidth) {

					if (pie.options.resize.use) {

						waitForFinalEvent(function() {

							pie.resize();

						}, 500, "some unique string");
					}

					pie.settings.wrapper.width = pie.wrapper.width();
				}
			});
		}

		/**
		 * PIE 에 API 를 추가한다.
		 * @param  {Object} pie 객체
		 */
		function addApis (pie) {

			pie.on = function (eventName, callback) {

				pie.event.on(eventName, callback);
			};

			/**
			 * pie 의 옵션 및 스타일을 변경한다.
			 * @param {object} styles
			 * @param {object} options
			 */
			pie.setStylesAndOptions = function (styles, options) {

				pie.wrapper.children().remove();

				clearInterval(pie.settings.animation.firstDraw);
				clearInterval(pie.settings.animation.timeSlice);

				pie.styles = {};
				pie.options = {};
				pie.data = {};
				pie.items = {};
				pie.settings = {};

				setup(pie, pie.wrapper, styles, options);
			};

			/**
			 * pie 를 다시 그릴 경우 사용
			 */
            pie.reDraw = function (styles, options, redraw) {

            	pie.wrapper.children().remove();

				if(styles !== undefined &&  styles !== null){
                    pie.styles = extendStyles(styles);
				}
                if(options !== undefined &&  options !== null){
                    pie.options = extendOptions(options);
                    pie.data = loadData(pie.options);
                }
				if(redraw !== false){



                    clearInterval(pie.settings.animation.firstDraw);
                    clearInterval(pie.settings.animation.timeSlice);
                    if(pie.styles.legendBox.use) {
                        if(pie.styles.legendBox.visible) {
                            drawLegendBox(pie);
                        }
                        //remakeChartLayout(pie);
                    }
                    drawSvg(pie);

                    drawLayout(pie);


                    settingData(pie);
                    if (pie.data === 'error' || pie.data.length <= 0) {

                        noData(pie);

                    } else {

                        if (!pie.settings.data.dataTotalValue) {

                            return;
                        }

                        drawItems(pie);

                        itemsEvents(pie);
                    }
				}


                pie.event.trigger('reDraw', [pie]);
            };
			/**
			 * resize
			 */
			pie.resize = function () {

				pie.reDraw();
			};

			/**
			 * options.data.use 로 데이터가 나눠진 상태인 경우에
			 * 해당 데이터의 인덱스 값을 이용해 pie 의 데이터를 변경해 준다.
			 * @param {Number} idx          data index
			 * @param {boolean} usingAnimate 	애니메이션 사용 여부
			 * @param {number} aniSpeed     애니메이션 속도
			 * @param {string} aniType      애니메이션 타입
			 */
			pie.setData = function (idx, usingAnimate, aniSpeed, aniType) {

				var styles = pie.styles;

				pie.settings.data.renderedData =
						pie.settings.data.dividedData[idx];

				pie.settings.data.renderedDataIndex = idx;

				setDataTotalValue(pie);
				setMaxData(pie);
				setMinData(pie);

				reDrawPie(pie, usingAnimate, aniSpeed, aniType);

				for (var key in pie.items.legend) {

					pie.items.legend[key].remove();
				}

				if (styles.legend.use) {

					drawLegend(pie);
				}
			};

			/**
			 * pie 차트에 실시간으로 데이터를 입력하여 그린다.
			 * @param  {Array} data         데이터
			 * @param  {boolean} usingAnimate 애니메이션 사용 여부
			 * @param {number} aniSpeed     애니메이션 속도
			 * @param {string} aniType      애니메이션 타입
			 */
			pie.realTime = function (data, usingAnimate, aniSpeed, aniType) {

				pie.settings.data.dividedData.push(data);

				var idx = pie.settings.data.dividedData.length - 1;

				pie.setData(idx, usingAnimate, aniSpeed, aniType);
			};



			/**
			 * pie.options.data.data 를 json 형태의 데이터로 변경
			 * @param  {json} data
			 */
			pie.appendData = function (data) {

				pie.options.data.data = data;

				pie.wrapper.children().remove();

				pie = self.init(pie.wrapper, pie.styles, pie.options);
			};

            pie.drawText = function(text, x, y, size, unit) {
                var a = pie.svg.text();

				var sum = 0;

                if(text)
					$.each(pie.data, function(i, v) {
						sum += v[text];
					});

                a.attr({x : pie.svg.width / 2 + pie.styles.layout.position.x + x,
                    y : pie.svg.height / 2 + pie.styles.layout.position.y + y,
                    text : text ? String(sum) + unit : unit,
                    fill: '#333',
                    opacity : 1,
                    'font-family': "Nanum Gothic",
                    'font-size': size,
                    'font': "12 'Nanum Gothic'",
                    'font-weight': "bold",
                    'font-style': "nomal",
                    "text-anchor": "start"});
            }

            pie.appendLegend = function(datas, colors, key) {

                pie.legendInsidArr = [];
				var j = 0;
                $.each(datas.data.data, function (i, v) {
                    if(v['key'] == key.key) {
                        pie.legendInsidArr.push(pie.svg.text().attr({
                            x : 20,
                            y : j * 20 + 20,
                            text : String('■'),
                            fill: colors.pie.area.color[i],
                            opacity : pie.styles.legend.text.opacity,
                            'font-family': pie.styles.legend.text.family,
                            'font-size': 12,
                            'font': pie.styles.legend.text.size + " '" + pie.styles.legend.text.family + "'",
                            'font-weight': pie.styles.legend.text.weight,
                            'font-style': pie.styles.legend.text.style,
                            "text-anchor": 'start',
                        }));

                        pie.legendInsidArr.push(pie.svg.text().attr({
                            x : 35,
                            y : j * 20 + 20,
                            text : String(v[datas.legend.use]).split(":")[0],
                            fill: pie.styles.legend.text.color,
                            opacity : pie.styles.legend.text.opacity,
                            'font-family': pie.styles.legend.text.family,
                            'font-size': 12,
                            'font': pie.styles.legend.text.size + " '" + pie.styles.legend.text.family + "'",
                            'font-weight': pie.styles.legend.text.weight,
                            'font-style': pie.styles.legend.text.style,
                            "text-anchor": 'start',
                        }));

                        j++;
                    }
                });
            }
		}

		/**
		 * PIE 초기화 함수
		 * @param  {Node} 	wrapper pie 가 append 되는 DIV
		 * @param  {Object} styles  pie 스타일
		 * @param  {Object} options pie 옵션
		 * @return {Object}	pie 객체
		 */
		self.init = function (wrapper, styles, options) {

			var pie = {};

			pie.event = $({});

			bindEvents(wrapper, pie);

			setup(pie, wrapper, styles, options);

			addApis(pie);

			if (TRIAL_UI) {

				//appendTrialUi(wrapper);
			}

			/**
				license object chart 에 추가(ver.150915 평다진)
			*/
			pie.license = licenseObject;
			/**
			 * wrapper(jQuery selector)에 저장(ver. 160318 평다진)
			 */
			wrapper[0].instance = pie;

			return pie;
		};

		if (!window.webponent){
			window.webponent = {};
		}
		if (!window.webponent.visual) {
			window.webponent.visual = {};
		}

		window.webponent.visual.pie = self;

	})();

})();

