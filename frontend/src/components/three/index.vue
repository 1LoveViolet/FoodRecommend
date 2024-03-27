<template>
  <div>
    <div id="tooltip"></div>
    <div id="tubiao">
      <el-button
        type="primary"
        round
        v-if="meshLevel !== 'province' && prevLevel.length !== 0"
        @click="toprevLevel"
        >上一级</el-button
      >
      <el-button
        type="primary"
        round
        v-if="meshLevel !== 'district' && nextLevel.length !== 0"
        @click="tonextLevel"
        >下一级</el-button
      >
      <el-button type="primary" round v-if="isflyline" @click="hiddenFlyLine"
        >隐藏飞线</el-button
      >
      <el-button type="primary" round v-else @click="showFlyLine"
        >显示飞线</el-button
      >

      <el-button type="primary" round v-if="isCube" @click="hiddenCube"
        >隐藏中心城市</el-button
      >
      <el-button type="primary" round v-else @click="showCube"
        >显示中心城市</el-button
      >
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import dat from "dat.gui";
// 现在浏览器支持ES6语法，自然包括import方式引入js文件
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import * as d3 from "d3";
import axios from "network/axios";
//引入获取实例
import { AMapManager } from "vue-amap";
let amapManager = new AMapManager();
import { searchAllRestaurants } from "api/good";
import { searchUserById } from "api/user";
export default {
  data() {
    const gui = new dat.GUI();
    return {
      renderer: null,
      scene: null,
      camera: null,
      controls: null,
      v: null,
      circleYs: [],
      line: null,
      moveSpots: [],
      timestamp: 0,
      colorIndex: 0,
      // 用于计算整个图形的中心位置
      mapSideInfo: {
        minlon: Infinity,
        maxlon: -Infinity,
        minlat: Infinity,
        maxlat: -Infinity,
      },
      // 中心坐标，用于到时候将图形绘制到坐标系原点计算使用
      centerPos: {},
      merTrans: null,
      geoJson: null,
      featuresArr: null,
      provinceJson: null,
      meshArr: [],
      lineArr: [],
      cubeArr: [],
      mesh: null,
      flyLineArr: [],
      upz: 2,

      planewh: {
        width: 300,
        height: 300,
      },

      extrudeSettings: {
        steps: 1, //用于沿着挤出样条的深度细分的点的数量，默认值为1。
        depth: 3, //挤出的形状的深度，默认值为1。
        bevelEnabled: true, //对挤出的形状应用是否斜角，默认值为true。
        bevelThickness: 0.2, //设置原始形状上斜角的厚度。默认值为0.2。
        bevelSize: 0.1, //斜角与原始形状轮廓之间的延伸距离
        bevelOffset: 0,
        bevelSegments: 3, //斜角的分段层数
        // depth: 10,
        // bevelEnabled: false,
        // steps: 1,
      },

      mouse: null,
      mouseX: null,
      mouseY: null,
      raycaster: null,
      INTERSECTED: null,
      stats: null,
      meshLevel: null,
      line2Arr: [],
      flyLineZ: null,
      nowadcode: null,
      isflyline: true,
      isCube: true,
      prevLevel: [],
      nextLevel: [],
      // 设置评分和价格范围的阈值
      ratingThreshold: 0.3, // 评分差距阈值
      priceRangeThreshold: 50, // 价格范围差距阈值
      favorites: [],
      reviews: [],
      userFavorites: [],
      hotGoods: [],
      showGoods: [],
      hotcubeArr: [],
      hotLineArr: [],
    };
  },
  created() {
    this.getAllRestaurantInfo();
    this.searchUserByIdmethod();
    this.getGeoJson(100000);
  },
  mounted() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
    window.addEventListener("click", this.click);
    this.start();
  },
  methods: {
    restaurantSprite() {
      this.hotcubeArr = [];
      this.hotLineArr = [];
      if (this.meshLevel == "district") {
        this.hotGoods.map((item, index) => {
          console.log("item", item);
          item.position = this.merTrans(item.position);
          console.log("item.position", item.position);
          // 使用纹理加载器加载雪花图片
          const texture = new THREE.TextureLoader().load(item.image_url);
          // 精灵材质
          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
          });
          const group = new THREE.Group();
          // 循环创建精灵，并利用随机函数来设置每个精灵x、y、z的位置
          // 精灵
          const sprite = new THREE.Sprite(spriteMaterial);
          // 添加到组
          group.add(sprite);
          // 设置精灵缩放比例
          sprite.scale.set(1, 1, 1);
          // 设置精灵模型位置，在长方体空间上随机分布
          const x = item.position[0];
          const y = -item.position[1];
          const z = 2;
          sprite.position.set(x, y, z);
          this.scene.add(group);

          let geometry = new THREE.SphereGeometry(0.1, 32, 16);
          let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
          let sphere = new THREE.Mesh(geometry, material);
          sphere.position.set(
            // item.geometry.boundingSphere.center.x,
            // item.geometry.boundingSphere.center.y,
            item.position[0],
            -item.position[1],
            0.2
          );
          sphere.scale.set(0.2, 0.2, 0.2);
          this.hotcubeArr.push(sphere);
          this.scene.add(...this.hotcubeArr);

          const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(item.position[0], -item.position[1], 0.2),
            new THREE.Vector3(item.position[0], -item.position[1], 0.5),
            new THREE.Vector3(x, y, 2)
          );
          // console.log(curve);
          const points = curve.getPoints(50);
          //   this.moveLine(curve);
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          // line.geometry = lineGeometry;
          // 获取曲线 上的50个点
          var positions = [];
          var colors = [];
          var color = new THREE.Color();

          // 给每个顶点设置演示 实现渐变
          for (var j = 0; j < points.length; j++) {
            color.setHSL(3 + j, 1, 0.5 + j * 0.0025); // 粉色
            colors.push(color.r, color.g, color.b);
            positions.push(points[j].x, points[j].y, points[j].z);
          }
          // 放入顶点 和 设置顶点颜色
          // console.log(positions);
          // console.log(colors);
          lineGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(positions), 3)
          );
          lineGeometry.setAttribute(
            "color",
            new THREE.BufferAttribute(new Float32Array(colors), 3)
          );

          const materialhotline = new THREE.LineBasicMaterial({
            // vertexColors: THREE.VertexColors,
            vertexColors: true,
            linewidth: 1,
            side: THREE.DoubleSide,
            // color: "#FF7744",
            // color: 0x2e91c2,
          });
          const hotline = new THREE.Line(lineGeometry, materialhotline);
          this.hotLineArr.push(hotline);
          this.scene.add(...this.hotLineArr);
        });
      }
    },
    hiddenFlyLine() {
      this.scene.remove(...this.flyLineArr);
      this.isflyline = false;
    },
    showFlyLine() {
      this.scene.add(...this.flyLineArr);
      this.isflyline = true;
    },
    hiddenCube() {
      this.scene.remove(...this.cubeArr);
      this.scene.remove(...this.circleYs);
      this.isCube = false;
    },
    showCube() {
      this.scene.add(...this.cubeArr);
      this.scene.add(...this.circleYs);
      this.isCube = true;
    },
    toprevLevel() {
      if (this.meshLevel == "city") {
        let meshLevel = this.meshLevel;
        let adcode = this.nowadcode;
        this.nextLevel[0] = { meshLevel: meshLevel, adcode: adcode };
      }
      if (this.meshLevel == "district") {
        let meshLevel = this.meshLevel;
        let adcode = this.nowadcode;
        this.nextLevel[1] = { meshLevel: meshLevel, adcode: adcode };
      }
      if (this.meshLevel == "city" && this.prevLevel[0]) {
        this.getGeoJson(this.prevLevel[0].adcode, this.upz);
      }
      if (this.meshLevel == "district" && this.prevLevel[1]) {
        this.getGeoJson(this.prevLevel[1].adcode, this.upz);
      }
    },
    tonextLevel() {
      if (this.meshLevel == "province" && this.nextLevel[0]) {
        this.getGeoJson(this.nextLevel[0].adcode, this.upz);
      }
      if (this.meshLevel == "city" && this.nextLevel[1]) {
        this.getGeoJson(this.nextLevel[1].adcode, this.upz);
      }
    },
    getGeoJson(adcode, upz) {
      this.nowadcode = adcode;
      this.axios({
        url: `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${adcode}_full`,
        method: "get",
      })
        .then((response) => {
          if (this.meshArr.length != 0 && this.lineArr.length != 0) {
            this.scene.remove(...this.meshArr);
            this.scene.remove(...this.lineArr);
            this.scene.remove(...this.cubeArr);
            this.scene.remove(...this.circleYs);
            this.scene.remove(...this.flyLineArr);
            this.scene.remove(...this.moveSpots);
            // this.scene.remove(...this.line2Arr);
          }
          this.geoJson = response.data;
          this.featuresArr = this.geoJson.features;
          console.log(this.geoJson);
          if (this.geoJson.features[0].properties.level) {
            this.meshLevel = this.geoJson.features[0].properties.level;
            console.log("this.meshLevel", this.meshLevel);
          } else {
            console.log("层级不能再低了");
          }
          this.selectedScaleDown(this.geoJson);
          this.calcSide(this.geoJson);
          this.fn(this.geoJson);
          //调整基线z坐标
          switch (this.meshLevel) {
            case "province":
              this.line2Arr.map((item, index) => {
                item.position.z = -3.4;
              });
              this.flyLineZ = 20;
              break;
            case "city":
              this.line2Arr.map((item, index) => {
                item.position.z = -2.4;
              });
              this.flyLineZ = 10;
              break;
            case "district":
              this.line2Arr.map((item, index) => {
                item.position.z = -1.4;
              });
              this.flyLineZ = 3;
              break;
            default:
              break;
          }
          // console.log("this.line2Arr", this.line2Arr);
          // console.log("this.line2.position.z", this.line2.position.z);
          this.meshArr = this.drawMap(this.geoJson);
          // console.log("drawMap之后的this.meshArr", this.meshArr);
          this.lineArr = this.drawLine(this.geoJson);

          // this.cubeArr = this.cube();
          this.cube();
          this.flyLineArr = this.flyLine(this.meshArr);
          this.flyLine(this.meshArr);
          this.restaurantSprite();
          switch (this.meshLevel) {
            case "province":
              this.cubeArr.map((item, index) => {
                item.scale.set(1.2, 1.2, 1.2);
              });
              this.circleYs.map((item, index) => {
                item.scale.set(1.2, 1.2, 1.2);
              });
              break;
            case "city":
              this.cubeArr.map((item, index) => {
                item.scale.set(0.6, 0.6, 0.6);
              });
              this.circleYs.map((item, index) => {
                item.scale.set(0.6, 0.6, 0.6);
              });
              break;
            case "district":
              this.cubeArr.map((item, index) => {
                item.scale.set(0.3, 0.3, 0.3);
              });
              this.circleYs.map((item, index) => {
                item.scale.set(0.3, 0.3, 0.3);
              });
              break;
            default:
              break;
          }
          // console.log(this.meshArr);
          // console.log(this.lineArr);
          // console.log(this.scene);
          console.log("this.cubeArr", this.cubeArr);
          console.log("this.circleYs", this.circleYs);
          // scene.add(...meshArr);
          this.scene.add(...this.line2Arr);
          this.scene.add(...this.meshArr);
          this.scene.add(...this.lineArr);
          this.scene.add(...this.cubeArr);
          this.scene.add(...this.flyLineArr);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    getprovinceJson(item) {
      if (this.meshLevel == "province") {
        let meshLevel = this.meshLevel;
        let adcode = this.nowadcode;
        this.prevLevel[0] = { meshLevel: meshLevel, adcode: adcode };
      }
      if (this.meshLevel == "city") {
        let meshLevel = this.meshLevel;
        let adcode = this.nowadcode;
        this.prevLevel[1] = { meshLevel: meshLevel, adcode: adcode };
      }
      if (this.meshLevel !== "district") {
        this.getGeoJson(item.adcode, this.upz);
      }
    },
    // 初始化场景
    initScene() {
      this.scene = new THREE.Scene();
      //给场景添加烟雾效果
      // 参数：烟雾颜色，烟雾范围near，烟雾范围far
      // scene.background = new THREE.Color(0x111111);
      this.scene.fog = new THREE.Fog(0x000000, 0, 3000);
      // 给场景添加坐标轴
      // var axes = new THREE.AxesHelper(100);
      // scene.add(axes);
    },
    // 初始化渲染器
    initRenderer() {
      // antialias是否开启抗锯齿
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setClearAlpha(0.2);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      // renderer.setClearColor(0xeeeeee);
      this.renderer.physicallyCorrectLights = true;
      document.body.appendChild(this.renderer.domElement);
    },
    // 初始化相机
    initCamera() {
      this.v = new THREE.Vector3(32.499207496643066, 38.21255111694336, 0);
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      // camera.position.y = 0;
      this.camera.position.set(0, -100, 100);
      this.camera.lookAt(this.v);

      // camera.position.z = 220;
    }, // 初始化控制器
    initControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // controls.target.set(32.499207496643066, 38.21255111694336, 0);
      // controls.target.set(0, 0, 0);
      // 阻尼效果
      this.controls.enableDamping = true;
      // 摄像机自动旋转
      this.controls.autoRotate = false;
      // 控制垂直角度的旋转范围
      // controls;
    },
    initLight() {
      const directionalLight = new THREE.DirectionalLight(0xe8eaeb, 0.2);
      directionalLight.position.set(0, 10, 5);
      this.scene.add(directionalLight);
    },
    render() {
      this.onRay();
      this.renderCircle();
      // this.renderLine(); //移动小球
      // arclineAnimate();
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
      this.stats.update(); //更新性能插件
      requestAnimationFrame(this.render);
    },
    onRay() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      // const mapChildren = scene.children.filter((item) => {
      //   // console.log(item.geometry);
      //   item.type == "Mesh";
      // });
      // console.log(meshArr);
      const mapChildren = this.scene.children.filter((item) => {
        // console.log(item);
        // item.type == "Mesh";
      });
      // 被射线照射到的一组对象
      const intersects = this.raycaster.intersectObjects(this.meshArr);
      // console.log(intersects);
      const tooltip = document.getElementById("tooltip");
      // 如果有相交的物体
      if (intersects.length > 0) {
        tooltip.style.display = "block";
        tooltip.style.left = this.mouseX + "px";
        tooltip.style.top = this.mouseY + "px";
        tooltip.innerText = intersects[0].object.name;
        if (this.INTERSECTED != intersects[0].object) {
          // 这里选中的物体是上一个选中物体。
          if (this.INTERSECTED) {
            // 把上一个选中的物体设置为当前色。
            this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
            // INTERSECTED.position.z = 0;
          }
          // 设置当前选中的物体
          this.INTERSECTED = intersects[0].object;
          // 保留当前选中物体，**原本的颜色**
          this.INTERSECTED.currentHex =
            this.INTERSECTED.material.color.getHex();
          // console.log(INTERSECTED.currentHex);
          // 设置当前选中的物体颜色为红色
          this.INTERSECTED.material.color.setHex(0xff0000);
          // INTERSECTED.position.z = 3;
        }
        // 如果没有相交的物体，把选中的物体设置为原来的颜色
      } else {
        if (this.INTERSECTED) {
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
          // INTERSECTED.position.z = 0;
        }
        // 清空选中物体
        tooltip.style.display = "none";

        this.INTERSECTED = null;
      }
    },
    click() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const mapChildren = this.scene.children.filter(
        (item) => item.type === "Mesh"
      );
      // 被射线照射到的一组对象
      const intersects = this.raycaster.intersectObjects(mapChildren);
      console.log("被射线照射到的一组对象", intersects[0]);
      const tooltip = document.getElementById("tooltip");
      if (intersects.length > 0) {
        console.log(intersects[0]);
        this.upz = this.upz * 2;
        this.getprovinceJson(intersects[0].object);
        this.cameraLookAt(
          intersects[0].object.center[0],
          intersects[0].object.center[1]
        );
      } else {
        console.log("没有选中");
        // getGeoJson(100000);
      }
    },
    renderCircle() {
      this.circleYs.forEach(function (mesh) {
        // 目标 圆环放大 并 透明
        mesh._s += 0.01;
        mesh.scale.set(2 * mesh._s, 2 * mesh._s, 2 * mesh._s);
        if (mesh._s <= 2) {
          mesh.material.opacity = 2 - mesh._s;
        } else {
          mesh._s = 1;
        }
      });
    },
    cube() {
      this.cubeArr = [];
      this.circleYs = [];
      this.meshArr.forEach((item, index) => {
        if (item.center != null) {
          let geometry = new THREE.SphereGeometry(0.1, 32, 16);
          let material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
          let sphere = new THREE.Mesh(geometry, material);
          // 圆环
          const geometry2 = new THREE.RingGeometry(0.1, 0.11, 50);
          // transparent 设置 true 开启透明
          const material2 = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            // side: THREE.DoubleSide,
            transparent: true,
          });
          const circleY = new THREE.Mesh(geometry2, material2);
          // item.geometry.computeBoundingSphere();
          // console.log(item.center[0], item.center[1]);
          sphere.position.set(
            // item.geometry.boundingSphere.center.x,
            // item.geometry.boundingSphere.center.y,
            item.center[0],
            -item.center[1],
            0.2
          );
          circleY.position.set(item.center[0], -item.center[1], 0.2);
          this.cubeArr.push(sphere);
          // this.scene.add(circleY);
          this.circleYs.push(circleY);
        }
      });
      // return cubeArr;
    },
    flyLine(meshArr) {
      console.log(meshArr[0].center);
      let first = meshArr[0].center;
      let flyLineArr = [];
      meshArr.forEach((item, index) => {
        if (item.center != null && index != 0) {
          const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(first[0], -first[1], 0.2),
            new THREE.Vector3(
              (first[0] + item.center[0]) / 2,
              -(first[1] + item.center[1]) / 2,
              this.flyLineZ
            ),
            new THREE.Vector3(item.center[0], -item.center[1], 0.2)
          );
          // console.log(curve);
          const points = curve.getPoints(50);
          //   this.moveLine(curve);
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          // line.geometry = lineGeometry;
          // 获取曲线 上的50个点
          var positions = [];
          var colors = [];
          var color = new THREE.Color();

          // 给每个顶点设置演示 实现渐变
          for (var j = 0; j < points.length; j++) {
            color.setHSL(3 + j, 1, 0.5 + j * 0.0025); // 粉色
            colors.push(color.r, color.g, color.b);
            positions.push(points[j].x, points[j].y, points[j].z);
          }
          // 放入顶点 和 设置顶点颜色
          // console.log(positions);
          // console.log(colors);
          lineGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(positions), 3)
          );
          lineGeometry.setAttribute(
            "color",
            new THREE.BufferAttribute(new Float32Array(colors), 3)
          );

          const material = new THREE.LineBasicMaterial({
            // vertexColors: THREE.VertexColors,
            vertexColors: true,
            linewidth: 1,
            side: THREE.DoubleSide,
            // color: "#FF7744",
            // color: 0x2e91c2,
          });
          const flyline = new THREE.Line(lineGeometry, material);
          flyLineArr.push(flyline);
        }
      });
      return flyLineArr;
    },
    // 线上的移动物体
    // moveLine(curve) {
    //   // 线上的移动物体
    //   //圆球
    //   const aGeo = new THREE.SphereGeometry(0.2, 50, 50);
    //   const aMater = new THREE.MeshBasicMaterial({
    //     color: 0xff0000,
    //     side: THREE.DoubleSide,
    //   });
    //   const aMesh = new THREE.Mesh(aGeo, aMater);
    //   // 保存曲线实例
    //   aMesh.curve = curve;
    //   aMesh._s = 0;
    //   this.scene.add(aMesh);

    //   this.moveSpots.push(aMesh);
    // },
    renderLine() {
      this.moveSpots.forEach(function (mesh) {
        mesh._s += 0.006;
        let tankPosition = new THREE.Vector3();
        tankPosition = mesh.curve.getPointAt(mesh._s % 1);
        mesh.position.set(tankPosition.x, tankPosition.y, tankPosition.z);
      });
    },
    // 线的动画
    arclineAnimate() {
      console.log(line);
      // if (line.geometry == undefined) {
      //   return;
      // }
      let color = linegeometry.getAttribute("color");

      let now = Date.now();
      if (now - timestamp > 30) {
        timestamp = now;
        colorIndex++;
        if (colorIndex >= color.count) {
          colorIndex = 0;
        }
      }

      for (let i = 0; i < color.array.length; i += 3) {
        if (i / 3 === colorIndex) {
          color.array[i + 2] = 1;
        } else {
          color.array[i + 2] = 0;
        }
      }

      line.geometry.attributes.color.needsUpdate = true; // 更新颜色
    },
    fn(geoJson) {
      //原理：使用静态成员
      if (!this.fn.flag) {
        this.drawBasicLine(geoJson);
        this.fn.flag = 1;
      }
    },
    //获取下砖深度
    selectedScaleDown(geoJson) {
      switch (geoJson.features[0].properties.level) {
        case "province":
          this.extrudeSettings.depth = 3;
          break;
        case "city":
          this.extrudeSettings.depth = 2;
          break;
        case "district":
          this.extrudeSettings.depth = 1;
          break;
        default:
          break;
      }
    },
    createPlane() {
      var planeGeometry = new THREE.PlaneGeometry(
        this.planewh.width,
        this.planewh.height,
        1,
        1
      );
      //   const texture = new THREE.TextureLoader().load(
      //     "../../assets/images/mapback.png"
      //   );
      //   texture.wrapS = THREE.RepeatWrapping;
      //   texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(1911, 750);
      var planeMaterial = new THREE.MeshLambertMaterial({
        // map: texture,
        color: 0xffffff,
      });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.z = -3;
      this.scene.add(plane);
    },
    //包装一个根据geoJson格式数据获取经纬度坐标集合的方法
    dealWithCoord(geometry, callback) {
      const { type, coordinates } = geometry;

      // 多面处理
      if (type === "MultiPolygon") {
        coordinates.forEach((polyArray) => {
          polyArray.forEach((lonlatArr) => {
            callback(lonlatArr);
          });
        });
      } else
        coordinates.forEach((lonlatArr) => {
          callback(lonlatArr);
        });
    },
    //包装获取最大最小经纬度信息以及中心点坐标信息的方法，传递的参数就是获取到的geoJson数据
    calcSide(geoJson) {
      const { features } = geoJson;
      features.forEach((feature) => {
        this.dealWithCoord(feature.geometry, (lonlatArr) => {
          lonlatArr.forEach(([lon, lat]) => {
            if (lon > this.mapSideInfo.maxlon) this.mapSideInfo.maxlon = lon;
            if (lon < this.mapSideInfo.minlon) this.mapSideInfo.minlon = lon;
            if (lat > this.mapSideInfo.maxlat) this.mapSideInfo.maxlat = lat;
            if (lat < this.mapSideInfo.minlat) this.mapSideInfo.minlat = lat;
          });
        });
      });

      this.centerPos = {
        x: (this.mapSideInfo.maxlon + this.mapSideInfo.minlon) / 2,
        y: (this.mapSideInfo.maxlat + this.mapSideInfo.minlat) / 2,
      };
      // 设置地图中点为北京
      // centerPos = {
      //   x: 116.41995,
      //   y: 40.18994,
      // };
      // console.log([centerPos.x, centerPos.y]);
      this.merTrans = d3
        .geoMercator()
        .center([this.centerPos.x, this.centerPos.y])
        .translate([0, 0]);
      // console.log(merTrans);
    },
    //绘制二维地图用于拉伸成3d
    drawPlan(lonlatArr) {
      // 可以理解为canvas的绘制形状，moveTo、lineTo
      const shap = new THREE.Shape();
      lonlatArr.forEach((lonlat, index) => {
        // console.log(lonlatArr[0]);
        // console.log("this.merTrans(lonlat)", lonlat);
        const [x, y] = this.merTrans(lonlat);
        if (!index) shap.moveTo(x, y);
        else shap.lineTo(x, y);
      });
      return shap;
    },
    drawPoint(lonlatArr) {
      const pointsArray = new Array();
      lonlatArr.forEach((lonlat) => {
        const [x, y] = this.merTrans(lonlat);
        // 创建三维点
        pointsArray.push(new THREE.Vector3(x, -y, 0.2));
      });
      return pointsArray;
    },
    addmesh(lonlatArr) {
      // console.log(lonlatArr);
      const shap = this.drawPlan(lonlatArr);

      // 几何体
      const geo = new THREE.ExtrudeGeometry(shap, this.extrudeSettings);
      geo.rotateX(Math.PI);
      // 材质
      const material = new THREE.MeshStandardMaterial({
        // color: randomColor(),
        color: "#00BBFF",
        emissive: 0x000000,
        roughness: 0.45,
        metalness: 0.8,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      // material.backup = material.color.getHex();
      // 物体
      const mesh = new THREE.Mesh(geo, material);
      // 获取顶点数组
      // var vertices = geo.getAttribute("position").array;
      // console.log("获取顶点数组vertices", vertices);
      return mesh;
    },
    addLine(lonlatArr) {
      const lineGeometry = new THREE.BufferGeometry();
      const pointsArray = this.drawPoint(lonlatArr);
      lineGeometry.setFromPoints(pointsArray);
      const lineMaterial1 = new THREE.LineBasicMaterial({
        color: "#ffffff",
      });
      let line = new THREE.Line(lineGeometry, lineMaterial1);
      return line;
    },
    randomColor() {
      `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)})`;
    },
    drawMap(geoJson) {
      // console.log(geoJson);
      const meshArray = [];
      const { features } = geoJson;
      features.forEach((feature, index) => {
        this.dealWithCoord(feature.geometry, (lonlatArr) => {
          let mesh = this.addmesh(lonlatArr);
          mesh.name = feature.properties.name;
          mesh.adcode = feature.properties.adcode;
          meshArray.push(mesh);
        });
      });

      //给所有mesh的第一个数据添加center属性，用于定位最大板块的中心点
      features.forEach((obj, index) => {
        let key;
        key = meshArray.findIndex((item, k) => {
          return item.name == obj.properties.name;
        });
        if (index < 34) {
          meshArray[key].center = this.merTrans(obj.properties.center);
        }
      });

      return meshArray;
    },
    //只执行一次函数
    once(fn) {
      let caller = true;
      return function () {
        if (caller) {
          caller = false;
          fn.apply(this, arguments);
        }
      };
    },
    //地图基线
    drawBasicLine(geoJson) {
      const { features } = geoJson;
      features.forEach((feature) => {
        this.dealWithCoord(feature.geometry, (lonlatArr) => {
          let line2 = this.addLine(lonlatArr);
          line2.material.color.r = 0;
          line2.material.color.g = 0;
          line2.material.color.b = 0;
          // switch (this.meshLevel) {
          //   case "province":
          //     this.line2.position.z = -3.4;
          //     break;
          //   case "city":
          //     this.line2.position.z = -2.4;
          //     break;
          //   case "district":
          //     this.line2.position.z = -1.4;
          //     break;
          //   default:
          //     break;
          // }
          line2.position.z = -3.4;
          // this.scene.add(this.line2);
          this.line2Arr.push(line2);
        });
      });
    },
    //模型上地图线
    drawLine(geoJson) {
      const lineArray = [];
      const { features } = geoJson;
      features.forEach((feature) => {
        this.dealWithCoord(feature.geometry, (lonlatArr) => {
          let line = this.addLine(lonlatArr);
          // let line2 = addLine(lonlatArr);
          // line2.position.set(0, 0, -3);
          // scene.add(line2);
          // line.position.set(0, 9, 0);
          lineArray.push(line);
        });
      });
      return lineArray;
    },
    getSelMap() {
      const mapChildren = this.scene.children;
      this.raycaster = new THREE.Raycaster();
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      this.mouse = new THREE.Vector2();
      window.addEventListener("mousemove", (_event) => {
        this.mouse.x = (_event.clientX / sizes.width) * 2 - 1;
        this.mouse.y = -(_event.clientY / sizes.height) * 2 + 1;
        this.mouseX = _event.clientX;
        this.mouseY = _event.clientY;
      });
    },
    //相机看向
    cameraLookAt(x, y) {
      this.controls.target.set(x, -y, 0);
      this.v = new THREE.Vector3(x, -y, 0);
      // camera.position.y = 0;
      this.camera.position.set(x, -y - 30, 40);
      this.camera.lookAt(this.v);
    },
    addGui() {
      gui
        .add(this.extrudeSettings, "steps")
        .min(2)
        .max(10)
        .step(1)
        .name("steps")
        .onFinishChange(this.getGeoJson);
      gui
        .add(this.extrudeSettings, "depth")
        .min(2)
        .max(16)
        .step(1)
        .name("depth")
        .onFinishChange(this.getGeoJson);
    },
    start() {
      this.initRenderer();
      this.initScene();
      this.initCamera();
      this.initControls();
      this.initLight();
      // addGui();
      this.getSelMap();
      //   this.createPlane();
      // mousemove();
      this.render();
    },
    getAllRestaurantInfo() {
      searchAllRestaurants().then((res) => {
        this.showGoods = res.data;
        this.comprehensiveSort(
          this.showGoods,
          this.favorites,
          this.userFavorites,
          this.ratingThreshold,
          this.priceRangeThreshold
        );
        this.getHotGoods();
        this.showHotGoods();
        console.log("this.showGoods", this.showGoods);
        console.log("this.hotGoods", this.hotGoods);
      });
    },
    comprehensiveSort(
      shops,
      favorites,
      userFavorites,
      ratingThreshold,
      priceRangeThreshold
    ) {
      console.log("shops: ", shops);
      // 计算每个商家的初始权重值
      shops.forEach((shop) => {
        shop.weight = shop.rating * 0.2; // 初始权重为 (5 - rating) * 0.1
      });

      // 根据 price_range 使用 sort 排序，价格越低排名越高
      shops.sort((a, b) => b.price_range - a.price_range);

      // 计算 price_range 权重叠加值
      let priceRangeWeight = 0;
      let lastPriceRange = null;
      shops.forEach((shop) => {
        if (lastPriceRange === null || shop.price_range !== lastPriceRange) {
          priceRangeWeight += 0.01;
        }
        shop.weight += priceRangeWeight;
        lastPriceRange = shop.price_range;
      });

      // 计算 cuisine 和 category 权重叠加值
      shops.forEach((shop) => {
        // console.log(shop.restaurant_id);
        if (userFavorites.includes(shop.restaurant_id)) {
          // console.log("用户收藏商家权重加0.02");
          shop.weight += 0.1; // 用户收藏商家权重加0.02
        } else {
          // console.log("用户收藏没有这个");
        }
        favorites.forEach((favorite) => {
          // console.log("shop.cuisine: ", shop.cuisine);
          // console.log("shop.category: ", shop.category);
          // console.log("favorite.cuisine: ", favorite.cuisine);
          // console.log("favorite.category: ", favorite.category);

          if (
            shop.category == favorite.category &&
            shop.cuisine == favorite.cuisine
          ) {
            shop.weight += 0.1; // 用户收藏商家的category cuisine相同的其他商家权重加0.01
            // console.log("加了0.02");
          } else if (shop.category == favorite.category) {
            shop.weight += 0.05; // 用户收藏商家的category 相同的其他商家权重加0.01
            // console.log("加了0.015");
          } else if (shop.cuisine == favorite.cuisine) {
            shop.weight += 0.05; // 用户收藏商家的 cuisine  相同的其他商家权重加0.01
            // console.log("加了0.01");
          } else {
            // console.log("商家的cuisineh和category和收藏的商家不同");
          }
        });
      });

      // 如果 rating 或 price_range 差距到达阈值，特殊处理
      shops.forEach((shop) => {
        shops.forEach((otherShop) => {
          if (shop.id !== otherShop.id) {
            const ratingDifference = Math.abs(shop.rating - otherShop.rating);
            const priceRangeDifference = Math.abs(
              shop.price_range - otherShop.price_range
            );
            if (
              ratingDifference >= ratingThreshold &&
              priceRangeDifference >= priceRangeThreshold
            ) {
              // 对于 rating 或 price_range 差距到达阈值的商家，权重加上一个固定值
              shop.weight += 0;
            }
          }
        });
      });

      // 按照权重值和名称排序
      shops.sort((a, b) => {
        if (a.weight !== b.weight) {
          return b.weight - a.weight;
        } else {
          return a.name.localeCompare(b.name);
        }
      });

      // 打印排序后的权重值数组
      const weights = shops.map((shop) => shop.weight);
      console.log(weights);
    },
    searchUserByIdmethod() {
      if (this.$store.state.user[0].user_id) {
        console.log("执行了searchUserByIdmethod函数");
        searchUserById(this.$store.state.user[0].user_id).then((res) => {
          this.favorites = [];
          console.log(res);
          let Arr = res.data;
          Arr.forEach((item) => {
            switch (item.table_type) {
              case "favorites":
                // this.user.favorites = [];
                this.favorites.push(item);
                break;
              case "reviews":
                // this.user.favorites = [];
                this.reviews.push(item);
                break;
              default:
                break;
            }
          });
          console.log("this.favorites: ", this.favorites);
          this.favorites.forEach((item) => {
            this.userFavorites.push(item.restaurant_id);
          });
          console.log("this.userFavorites: ", this.userFavorites);
        });
      } else {
        console.log(
          "this.$store.state.user",
          this.$store.state.user[0].user_id
        );
        console.log("用户没登录，没有this.$store.state.user.user_id");
      }
    },
    getHotGoods() {
      this.hotGoods = [];
      this.showGoods.map((item, index) => {
        if (index <= 6) {
          this.hotGoods.push(item);
        }
      });
      this.showHotGoods();
    },
    showHotGoods() {
      this.hotGoods.map((item, index) => {
        this.onSearchAddress(item);
      });
      console.log("添加经纬度后的this.hotGoods", this.hotGoods);
      // console.log("item", item);
      // console.log("item.position", item.position);
      // // console.log("item.position", item.position[0]);
      // // console.log("item.position", item.position[1]);
      // const [x, y] = this.merTrans([103.519789, 30.193454]);
      // console.log([x, y]);
    },
    onSearchAddress(item) {
      console.log(" onSearchAddress方法的e:", item);
      AMap.plugin("AMap.Geocoder", () => {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: this.$store.state.position,
        });
        geocoder.getLocation(item.address, (status, result) => {
          if (status === "complete" && result.info === "OK") {
            item.position = [
              result.geocodes[0].location.lng,
              result.geocodes[0].location.lat,
            ];
          }
        });
      });
    },
  },
};
</script>
<style src="@/assets/style/three.css"  scoped></style>