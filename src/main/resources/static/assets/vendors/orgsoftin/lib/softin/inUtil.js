var incmm = (incmm || {});

(function () {
	incmm.util = (function () {
		var _in_ = {};

		return {
			/**
			 */
			init: function () {
				_in_ = this;
				_in_._cachedData = {};
				_in_._dataMap = window._data_map;

				return _in_;
			},

			/**
			 * 모바일 디바이스 여부 확인
			 */
			isMobile: function () {
				var res = false;

				res = (/iPhone|Android/i).test(navigator.userAgent);
				return res;
			},

			/**
			 * Object 객체 deep copy
			 */
			copyObject: function (obj) {
				var res;

				res = JSON.parse(JSON.stringify(obj));

				return res;
			},

			/**
			 * min ~ max 사이의 랜덤값(정수)를 반환한다.
			 */
			rndValue: function (min, max) {
				var res;

				res = (Math.floor(Math.random() * (max - min + 1)) + min);

				return res;
			},

			/**
			 * min ~ max 사이의 랜덤값(정수)를 listLen 개수를 배열로 반환한다.
			 */
			rndList: function (min, max, listLen) {
				var that,
					res = [],
					rnd,
					i,
					j,
					len;

				that = this;

				for (i = 0; i < listLen; i++) {
					rnd = that.rndValue(min, max);
					res.push(rnd);

					for (j = 0, len = res.length - 1; j < len; j++) {
						if (rnd == res[j]) {
							i--;
							res.pop();
							break;
						}
					}
				}

				return res;
			},

			/**
			 * data_map 기준으로 field 변환 처리
			 */
			convertData: function (type, data) {
				var that,
					map,
					res = [],
					row,
					unit,
					field,
					val,
					i,
					j,
					len,
					len2;

				that = this;
				map = that._dataMap[type];

				if (!that._useConvertField) {
					return data;
				}

				for (i = 0, len = data.length; i < len; i++) {
					unit = {};
					row = data[i];

					// if (map) {
						for (j = 0, len2 = map.length; j < len2; j++) {
							field = map[j];

							if (row.hasOwnProperty(field.alias.code)) {
								if (typeof field.convert === "function") {
									val = field.convert(row);
								} else {
									val = row[field.alias.code];
								}
								unit[field.code] = val;
							}
						}
					// } else {
					// 	unit = JSON.parse(JSON.stringify(row));
					// }

					res.push(unit);
				}

				return res;
			},

			showLoading: function () {
				$("#softin-loading").show();
			},

			hideLoading: function () {
				$("#softin-loading").hide();
			}
		};
	})().init();
})();