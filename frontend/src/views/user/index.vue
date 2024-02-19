<template>
  <div>
    <myheader></myheader>
    <div class="user-content">
      <div class="head">
        <img :src="user.avatar_url" alt="" />
        <div class="head-content">
          <div class="head-content-namebox">
            <div class="head-content-name">{{ user.username }}</div>
            <div class="head-content-edit" @click="edit">编辑资料</div>
          </div>
          <div class="head-content-residence">{{ user.residence }}</div>
          <div class="tabbox">
            <div
              v-for="(item, index) in tabbox"
              :key="index"
              @click="tabItenClick(index)"
              :class="{ tabActive: index === currentindex }"
            >
              {{ item }}
            </div>
            <!-- <div @click="tabItenClick">首页</div>
            <div @click="tabItenClick">评价</div>
            <div @click="tabItenClick">收藏</div>
            <div @click="tabItenClick">签到</div>
            <div @click="tabItenClick">图片</div>
            <div @click="tabItenClick">帖子</div> -->
          </div>
        </div>
      </div>
      <div class="content">
        <div class="content-1" v-if="currentindex == 0">
          <div class="lside">
            <div class="lside-tabbox">
              <div class="lside-tabbox-item">
                <div>关注</div>
                <div>0</div>
              </div>
              <div class="lside-tabbox-item">
                <div>粉丝</div>
                <div>0</div>
              </div>
              <div class="lside-tabbox-item">
                <div>获赞</div>
                <div>0</div>
              </div>
            </div>
            <div class="lside-time">性别：{{ user.sex }}</div>
            <div class="lside-time">邮箱：{{ user.email }}</div>
            <div class="lside-time">
              注册时间：{{ this.dayjs(user.create_time).format("YYYY-MM-DD") }}
            </div>
          </div>
          <div class="rside">
            <div class="rside-item">
              <h3 class="rside-item-title">个性签名</h3>
              <div class="rside-item-context">{{ user.signature }}</div>
            </div>
            <div class="rside-item">
              <h3 class="rside-item-title">评价</h3>
              <div class="rside-item-context">
                哪家店特别让你满意？那家店让你深恶痛绝？写封评价记录一下！
              </div>
              <div class="rside-item-writeRV">写评价</div>
            </div>
            <div class="rside-item">
              <h3 class="rside-item-title">图片</h3>
              <div class="rside-item-context">
                无论是摄影粉，还是验毒派，还原现场分享给更多人是最大滴美德啊~一句话，有图有真相！
              </div>
            </div>
            <div class="rside-item">
              <h3 class="rside-item-title">帖子</h3>
              <div class="rside-item-context">
                社区就是资深dpers的大本营，谈美食、聊游记、扯八卦、抢赠品~快去社区发个处女帖
              </div>
            </div>
          </div>
        </div>
        <div class="content-2" v-if="currentindex == 1">
          <div class="content-2-tabTitle">
            <div class="cur">商家评论</div>
          </div>
          <el-empty
            v-if="!reviews.length"
            description="暂无数据,快写一条评论吧"
          />
          <div v-for="(item, index) in reviews" :key="index" class="cur-item">
            <div class="cur-name" @click="toGoodDetail(item.restaurant_id)">
              <div class="cur-name-box">{{ item.name }}</div>
            </div>
            <div class="cur-address">{{ item.address }}</div>
            <div class="cur-ratingAndprice">
              <el-rate
                v-model="item.RVrating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}"
              >
              </el-rate>
              <div class="cur-price">人均:￥{{ item.price }}</div>
            </div>
            <div v-html="item.comment" class="cur-comment"></div>
            <!-- <div>{{ item.date }}</div> -->

            <div class="cur-dateAnddelete">
              <div class="cur-date">
                发表于:{{ dayjs(item.date).format("YYYY-MM-DD") }}
              </div>
              <div class="cur-delete" @click="deleteRV(item.review_id)">
                删除
              </div>
            </div>
          </div>
        </div>
        <div class="content-3" v-if="currentindex == 2">
          <div class="content-3-left">
            <div class="content-3-tabTitle">
              <div class="cur">收藏商户</div>
            </div>

            <el-empty
              v-if="!favorites.length"
              description="暂无数据,收藏你喜欢的商家"
            />
            <div
              v-for="(item, index) in favorites"
              :key="index"
              class="favorite-item"
            >
              <div
                class="favorite-name-box"
                @click="toGoodDetail(item.restaurant_id)"
              >
                <div class="favorite-name">{{ item.name }}</div>
              </div>
              <div class="content-3-ratingAndaddressAndphone">
                <el-rate
                  v-model="item.Rrating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                >
                </el-rate>
                <div>{{ item.area }}</div>
                <div>{{ item.address }}</div>
                <div>{{ item.phone }}</div>
              </div>
              <div class="content-3-favoriteAnddelete">
                <div class="favorite-fdate">{{ item.fdate }}收藏</div>
                <div
                  class="favorite-delete"
                  @click="deleteFavorite(item.favorite_id)"
                >
                  删除
                </div>
              </div>
            </div>
          </div>
          <div class="content-3-right">
            <div class="hd">
              <h4>收藏一家商家</h4>
            </div>
            <div class="txt">
              <p>
                把平时想去的商户收集起来，想起的时候就能快速找到啦。还可以设置收藏的标签，区分不同种类的商户。
              </p>
              <div class="txt-look-box">
                <div class="txt-look" @click="toHome">看看人气商户»</div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-4" v-if="currentindex == 3">
          <el-form ref="form" v-model="editform" label-width="200px">
            <el-form-item label="用户名称">
              <el-input v-model="editform.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="editform.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="editform.email"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="editform.sex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="居住地">
              <el-input type="textarea" v-model="editform.residence"></el-input>
            </el-form-item>

            <el-form-item label="个性签名">
              <el-input type="textarea" v-model="editform.signature"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit">保存更改</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
          <div>
            头像上传
            <el-upload
              class="upload-demo"
              drag
              action="action"
              multiple
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
    <myfooter></myfooter>
  </div>
</template>

<script>
const myheader = () => import("components/header/index.vue");
const myfooter = () => import("components/footer/index.vue");
import {
  searchUserById,
  deleteReviewById,
  deleteFavoriteById,
  uploadAvatar,
  updateUserInfo,
} from "api/user";
export default {
  components: {
    myheader,
    myfooter,
  },
  props: {
    ReviewsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      user: {},
      favorites: [],
      reviews: [],
      tabbox: ["首页", "评价", "收藏", "设置"],
      currentindex: 0,
      userRV: [],
      editform: {
        username: null,
        password: null,
        email: null,
        sex: null,
        residence: null,
        signature: null,
      },
    };
  },
  created() {
    this.searchUserByIdmethod();
    console.log(this.$route.query);
  },
  methods: {
    edit() {
      this.currentindex = 3;
    },
    tabItenClick(index) {
      this.currentindex = index;
      // switch (index) {
      //   case 0:
      //     this.currentindex = "首页";
      //     break;
      //   case 1:
      //     this.currentindex = "评价";
      //     break;
      //   case 2:
      //     this.currentindex = "收藏";
      //     break;
      //   case 3:
      //     this.currentindex = "设置";
      //     break;
      //   default:
      //     break;
      // }
    },
    searchUserByIdmethod() {
      searchUserById(this.$route.query.id).then((res) => {
        (this.user = []), (this.favorites = []), (this.reviews = []);
        console.log(res);
        let Arr = res.data;
        Arr.forEach((item) => {
          switch (item.table_type) {
            case "users":
              this.user = item;
              break;
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
        console.log("this.user: ", this.user);
        console.log("this.favorites: ", this.favorites);
        console.log("this.reviews: ", this.reviews);
      });
    },
    deleteRV(review_id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          deleteReviewById(review_id).then((res) => {
            console.log(res);
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.searchUserByIdmethod();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    deleteFavorite(favorite_id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          deleteFavoriteById(favorite_id).then((res) => {
            console.log(res);
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.searchUserByIdmethod();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    toGoodDetail(restaurant_id) {
      this.$router.push(`/detail?id=${restaurant_id}`);
    },
    toHome() {
      this.$router.push("/home");
    },
    beforeAvatarUpload(file) {
      let data = {
        user_id: this.user.user_id,
        file: file,
      };
      uploadAvatar(data);
      this.$router.go(0);
    },
    submit() {
      let data = {
        user_id: this.user.user_id,
        data: this.editform,
      };
      updateUserInfo(data).then((res) => {
        this.$confirm("修改成功，请重新登录", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {
          this.$store.dispatch("clearUser");
          this.$store.dispatch("clearToken");
          this.$store.dispatch("changeisLogin");
          this.$router.push("/home");
        });
      });
    },
  },
};
</script>

<style src="@/assets/style/user.css"  scoped></style>