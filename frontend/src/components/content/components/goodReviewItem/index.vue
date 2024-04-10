<template>
  <div class="review">
    <div class="rv-user">
      <img
        :src="ReviewsItem.user_avatar"
        @click="userDetail(ReviewsItem.user_id)"
        alt=""
      />
    </div>
    <div class="rv-content">
      <div class="rv-content-username" @click="userDetail(ReviewsItem.user_id)">
        {{ ReviewsItem.user_name }}
      </div>
      <el-rate
        v-model="ReviewsItem.rating"
        disabled
        show-score
        text-color="#ff9900"
        score-template="{value}"
      >
      </el-rate>
      <div>
        {{ this.dayjs(ReviewsItem.date).format("YYYY-MM-DD HH:mm:ss") }}
      </div>
      <div v-html="ReviewsItem.description"></div>
    </div>
  </div>
</template>
      
      <script>
export default {
  props: {
    ReviewsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  created() {
    this.formattedBr();
    this.formattedLocalTime();
    console.log("ReviewsItem: ", this.ReviewsItem);
  },
  methods: {
    formattedLocalTime() {
      console.log(this.ReviewsItem.date);
    },
    formattedBr() {
      // 换行转为换行符
      this.ReviewsItem.description = this.ReviewsItem.description.replace(
        /\n/g,
        "<br/>"
      );
      // 空格转为 &nbsp
      this.ReviewsItem.description = this.ReviewsItem.description.replace(
        / /g,
        " &nbsp"
      );
    },
    userDetail(id) {
      const newhref = this.$router.resolve({
        path: "/user",
        name: "user",
        query: { id: id },
        // params: this.goodsItem.restaurant_id,
      });

      window.open(newhref.href, "_blank");
    },
  },
};
</script>
      
<style scoped>
.review {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}
.rv-user {
  width: 10%;
}
.rv-user img {
  width: 50px;
  margin-top: 15px;
  cursor: pointer;
}
.rv-content {
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
}
.rv-content div {
  margin-bottom: 5px;
  font-size: 14px;
  line-height: 24px;
  word-break: break-all;
  word-wrap: break-word;
}
.rv-content-username {
  margin-top: 5px;
  color: #282828;
  font-size: 14px;
  cursor: pointer;
}
</style>