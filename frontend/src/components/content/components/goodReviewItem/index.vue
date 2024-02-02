<template>
  <div class="review">
    <div class="rv-user">
      <img :src="ReviewsItem.user_avatar" alt="" />
    </div>
    <div class="rv-content">
      <div class="rv-content-username">{{ ReviewsItem.user_name }}</div>
      <el-rate
        v-model="ReviewsItem.rating"
        disabled
        show-score
        text-color="#ff9900"
        score-template="{value}"
      >
      </el-rate>
      <div>{{ ReviewsItem.date }}</div>
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
    this.formattedLocalTime();
    console.log("ReviewsItem: ", this.ReviewsItem);
  },
  methods: {
    formattedLocalTime() {
      console.log(this.ReviewsItem.date);
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
}
</style>