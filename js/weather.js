$(document).ready(function () {
    var toast = new auiToast({});
    var toastD = new auiToast({});
    $('.cloth').show();
    toastD.loading({
        title: '获取地理信息中...',
        duration: 2000,
    }, function (ret) {
        console.log(ret);
    });
    $('body').css('overflow', 'hidden');

    function getDate(warr) {
        var arr = [];
        for (var i = 0; i < warr.length; i++) {
            var evt = warr[i].date.substr(warr[i].date.length - 2, warr[i].date.length);
            arr[i] = evt;
        }
        return arr;
    }

    function getMax(warr) {
        var arr = [];
        for (var i = 0; i < warr.length; i++) {
            arr[i] = warr[i].tmp.max;
        }
        return arr;
    }

    function getMin(warr) {
        var arr = [];
        for (var i = 0; i < warr.length; i++) {
            arr[i] = warr[i].tmp.min;
        }
        return arr;
    }

    var city = '北京'; //默认城市
    function getWeather(mycity) {
        $.ajax({
            type: "get",
            url: "http://apis.baidu.com/heweather/weather/free",
            headers: {
                apikey: '2445439ae34005895c696291ff4864f5'
            },
            data: {
                city: mycity
            },
            dataType: 'json',
            success: function (ret) {
                toast.hide();
                $('.cloth').hide();
                $('body').css('overflow', 'visible');
                $('body').css('overflow-x', 'hidden');
                var allweather = ret['HeWeather data service 3.0'];
                var basic = allweather[0].basic; //地理位置
                var now = allweather[0].now; //实况天气
                var aqi = allweather[0].aqi; //空气质量
                var daily_forecast = allweather[0].daily_forecast; //七天天气预报
                var daily_forecast3 = allweather[0].daily_forecast.slice(0, 3); //将七天换成三天
                var hourly_forecast = allweather[0].hourly_forecast; //每天三小时天气预报
                var suggestion = allweather[0].suggestion; //生活指南
                console.log(suggestion);
                var sdate = getDate(daily_forecast); //获取七天日期
                var maxW = getMax(daily_forecast); //获取最高温度
                var minW = getMin(daily_forecast); //获取最低温度
                table(sdate, maxW, minW); //创建天气图表
                showKq(aqi.city.aqi, aqi.city.qlty); //创建空气质量图表
                var myVue = new Vue({ //创建vue对象
                    el: '.data',
                    data: {
                        now: now,
                        basic: basic,
                        aqi: aqi,
                        daily_forecast: daily_forecast,
                        daily_forecast3: daily_forecast3,
                        sugg: suggestion
                    }
                });
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    function getJoke() {
        $.ajax({
            url: 'http://apis.baidu.com/heweather/weather/free',
            type: 'get',
            headers: {
                apikey: '2445439ae34005895c696291ff4864f5'
            },
            data: {
                page: 1
            },
            success: function (ret) {
                console.log(ret);
            },
            error: function (err) {
                console.log('err:' + err);
            }
        });
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                //				var lat = position.coords.latitude; //纬度 
                //				var lag = position.coords.longitude; //经度 
                var latlon = position.coords.latitude + ',' + position.coords.longitude;
                var url = "http://api.map.baidu.com/geocoder/v2/?ak=C93b5178d7a8ebdb830b9b557abce78b&callback=renderReverse&location=" + latlon + "&output=json&pois=0";
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    url: url,
                    beforeSend: function () {
                    	$('.cloth').show();
                        console.log('正在获取地理位置...');
                    },
                    success: function (json) {
                        if (json.status == 0) {
                            var resultCity = json.result.addressComponent.city;
                            city = resultCity.substr(0, resultCity.length - 1);
                            getWeather(city);
                        }
                        toastD.hide();
                        toast.loading({
                            title: '获取城市天气信息中...',
                            duration: 2000,
                        }, function (ret) {
                            console.log(ret);
                        });
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log('获取当前城市失败!');
                    }
                });

            }, function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("定位失败,用户拒绝请求地理定位");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("定位失败,位置信息是不可用");
                        break;
                    case error.TIMEOUT:
                        alert("定位失败,请求获取用户位置超时");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("定位失败,定位系统失效");
                        break;
                }
            });
        } else {
            console.log('您的浏览器不支持地理定位!');
        }
    }

    getLocation();
    getJoke();
    function table(sdate, maxW, minW) {
        // 基于准备好的dom，初始化echarts实例,创建天气图表
        var myChart = echarts.init(document.getElementById('weather_table')); //只能用原生js获取
        // 指定图表的配置项和数据
        option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['最高气温', '最低气温']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: sdate
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C'
                }
            },
            series: [{
                name: '最高气温',
                type: 'line',
                data: maxW
            }, {
                name: '最低气温',
                type: 'line',
                data: minW,
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    function showKq(num, st) {
        var myChart = echarts.init(document.getElementById('kq_table'));
        option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [{
                name: '空气指标',
                type: 'gauge',
                detail: {
                    formatter: '{value}%'
                },
                data: [{
                    value: num,
                    name: '质量: ' + st
                }]
            }],
        };
        myChart.setOption(option);
    }
});