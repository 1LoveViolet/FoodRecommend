export default function MapLoader(positionInfo) {
  return new Promise((resolve, reject) => {
    let aMapScript = document.createElement("script");
    aMapScript.setAttribute(
      "src",
      "https://webapi.amap.com/maps?v=1.4.11&key=66be375bbee739346813eda698d5e2c8&plugin=AMap.CitySearch"
    );
    document.head.appendChild(aMapScript);

    aMapScript.onload = function () {
      AMap.plugin("AMap.Geolocation", function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: "RB",
        });

        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete);
        AMap.event.addListener(geolocation, "error", onError);

        function onComplete(data) {
          // data是具体的定位信息
          console.log("成功获取用户位置", data);
          // 更新positionInfo的值
          positionInfo = data;
          resolve(positionInfo); // 返回positionInfo
        }

        function onError(data) {
          console.log("定位出错", data);
          positionInfo = data;
          reject(positionInfo); // 定位出错时，reject Promise
        }
      });
    };
  });
}
