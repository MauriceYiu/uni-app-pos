<template>
  <view class="index">
    <view class="area">
      <ul>
        <li :class="nowAreaIndex==-1?'active':''" @tap.stop="changeIndex(-1,null)">全部区域</li>
        <li
          v-for="(item,index) in areaList"
          :key="index"
          :class="nowAreaIndex==index?'active':''"
          @tap.stop="changeIndex(index,item)"
        >{{item.partitionName}}</li>
      </ul>
    </view>
    <view class="clear-area"></view>
    <view class="desk-wrap">
      <view class="desk-list">
        <view class="desk" v-for="(item,index) in deskList" :key="index">
          <view class="par-name">{{item.parName}}</view>
          <ul v-if="item.desks.length">
            <li v-for="(deskItem,deskIndex) in item.desks" :key="deskIndex">
              <view
                :class="deskItem.status=='FREE'?'desk-item-wrap free':(deskItem.status=='BUSY'?'desk-item-wrap busy':'desk-item-wrap book')"
                @tap.stop="clickDesk(deskItem,index)"
              >
                <view class="desk-name">{{deskItem.deskName}}</view>
                <view
                  class="desk-time"
                >{{deskItem.status=='FREE'?'空闲中':(deskItem.status=='BUSY'?deskItem.inTime:'已预订')}}</view>
              </view>
            </li>
          </ul>
          <view class="no-desk" v-else>此区暂无台桌</view>
        </view>
      </view>
    </view>
    <view :class="showOpenOrBook?'click-desk show':'click-desk'" @tap="showOpenOrBook=false">
        <view class="open-or-book" @tap.stop="(showServerList=false,showSelStatus=false)">
            <view class="button">
                <button class="open-desk" @tap.stop="doOpenOrBook('BUSY')"><i class="iconfont icon-diancai"></i>开单</button>
                <button class="sure" @tap.stop="doOpenOrBook('BOOK')"><i class="iconfont icon-yuyue"></i>预定</button>
            </view>
        </view>
    </view>
  </view>
</template>
<script>
import { getAreaInfo,getDesks,getDeskDetail } from "./../../api/index/";
import {mapActions} from "vuex";

export default {
  data() {
    return {
    showOpenOrBook:false,
    curSelTableOpenInfo:{
        numName:"",
        parName:"",
        people:1,
        beginTime:"",
        rules:[{ruleName:"",ruleId:-1}],
        notice:"",
        names:[],
      },//当前所选台桌的开台信息
      nowDeskOrderInfo:{},//当前台桌的信息
      showOpenTable:false,//是否显示开启台桌弹窗
      curSelDesk:{},//当前选择的台桌
      curSelDeskIndex:-1,//当前选择台桌的索引
      isChange:false,//当前是否处于更改台桌信息模式
      showInfoType:"normal",//当前的信息展现方式，根据这个字段来判断是预定后开台还是其他类型，从而来调用不同的接口,afterOpen:预定后开台
      isOpenOrBook:"BUSY",//当前是预定还是开台，对应字段BUSY，和BOOK
      storeInfo:{},//店铺信息
      deskList:[],//桌位信息
      areaList: [], //区域列表
      nowAreaIndex: -1, //当前所选择区域的索引
      nowSelArea: {
          id:0,
      } //当前所选择区域的索引
    };
  },
  watch: {
      nowAreaIndex(val){
          if(val == -1){
            this.doGetDeskList(0);
            return;
          }
          this.doGetDeskList(this.nowSelArea.id);
      }
  },
  methods: {
      // 点击台桌,进行预约或开台
    clickDesk(item,index){
        this.curSelDesk=item;
        this.saveNowSelDesk(item);
        this.curSelDeskIndex = index;
        if(item.status == "BUSY"){
            this.isChange = false;
            this.doGetDeskDetail(item.deskID);
            this.showInfoType = "normal";
        }else if(item.status == "BOOK"){
            this.isChange = true;
            // 修改当前显示的预定信息页面，和购物车同一组件
            this.isOpenOrBook = "BOOK";
            this.showInfoType = "afterOpen";
            this.doGetDeskDetail(this.curSelDesk.deskID,"BOOK");
            return;
        }else if(item.status == "FREE"){
            this.isChange = false;
            this.showInfoType = "normal";
            this.showOpenOrBook = true;
        }
    },
    async doGetDeskDetail(numId,type="BUSY"){
        let res = await getDeskDetail({numId});
        console.log(res);
        if(res.status == 200){
            // 成功返回后显示相关界面
            this.nowDeskOrderInfo = res.data;
            this.saveNowDeskOrderInfo(res.data);
            if(type=="BUSY"){
                // this.$router.push({path:'/goPay'});
            }else if(type=="BOOK"){
                this.curSelTableOpenInfo = {
                    addTime:res.data.numTrans.addTime,
                    bookTime:res.data.numTrans.bookTime,
                    cancelTime:res.data.numTrans.cancelTime,
                    bookMobile:res.data.numTrans.bookMobile,
                    bookName:res.data.numTrans.bookName,
                    rules:[
                        { ruleName: res.data.numTrans.rulesName, ruleId: res.data.numTrans.ruleId }
                    ],
                    people:res.data.numTrans.people,
                    parName:res.data.numTrans.partitionName,
                    parId:res.data.numTrans.parId,
                    numId:res.data.numTrans.numId,
                    numName:res.data.numTrans.numName,
                    names:[{
                        empId: res.data.numTrans.empId,
                        empName: res.data.numTrans.empName,
                        mobile: res.data.numTrans.mobile
                    }],
                    notice:res.data.numTrans.notice
                }
                this.showOpenTable = true;
            }
        }
    },
    changeIndex(index, item) {
      this.nowAreaIndex = index;
      this.nowSelArea = item;
    },
    async doGetAreaList(){
        let res = await getAreaInfo(this.storeInfo.storeId);
        this.areaList = res.data;
    },
    async doGetDeskList(parId){
        let params = {
            storeId:this.storeInfo.storeId,
            source:"ALL",
            parId
        }
        let res = await getDesks(params);
        this.deskList = res.data.pars;
    },
    ...mapActions(["saveNowDeskOrderInfo","saveNowSelDesk"]),
  },
  onLoad() {
    const storeInfo = JSON.parse(uni.getStorageSync("storeInfo"));
    this.storeInfo = storeInfo;
    this.doGetAreaList();
    this.doGetDeskList(this.nowSelArea.id);
  }
};
</script>
<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .area {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80upx;
    line-height: 80upx;
    overflow: hidden;
    overflow-x: auto;
    background: #f4f4f4;
    border-bottom: 1upx solid #ddd;
    ul {
      white-space: nowrap;
      li {
        display: inline-block;
        padding: 0 20upx;
        &.active {
          color: red;
        }
      }
    }
  }
  .clear-area{
      width: 100%;
      height: 80upx;
      background: #f4f4f4;
  }
  .desk-wrap {
    width: 100%;
    height: calc(100% - 80upx);
    overflow: hidden;
    overflow-y: auto;
    .desk-list {
      width: 100%;
      .desk {
        .par-name {
          padding:10upx;
          height: 69upx;
          line-height: 69upx;
          background: #eeeeee;
          font-size: 30upx;
        }
      }
      .no-desk {
        padding: 20upx;
      }
      ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding:0 20upx 20upx 20upx;
        box-sizing: border-box;
        li {
          width: 33.3%;
          padding: 0 20upx;
          margin-top: 20upx;
          height: 106upx;
          box-sizing: border-box;
          .desk-item-wrap {
            width: 100%;
            background: #a5b3c0;
            height: 100%;
            border-radius: 6upx;
            color: #fff;
            position: relative;
            .desk-name {
              width: 100%;
              text-align: center;
              padding-top: 18upx;
              font-size: 28upx;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .desk-time {
              padding-top: 10upx;
              display: inline-block;
              width: 100%;
              text-align: center;
              font-size: 24upx;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .desk-area-name {
              position: absolute;
              bottom: 10upx;
              left: 10upx;
              width: 90%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            &.free {
              background: #eeeeee;
              color: #000;
            }
            &.busy {
              background: #e66a6a;
              color: #fff;
            }
            &.book {
              background: #ff9f4c;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .click-desk{
      position: fixed;
      width: 100%;
      height: 100%;
      top: 100%;
      left: 0;
      right: 0;
      bottom: 0;
      transition: all .3s;
      .open-or-book{
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 30%;
          left: 0;
          right: 0;
          bottom: 0;
          background: #fff;
          box-shadow: 0 0 10upx rgba(0,0,0,.1);
          .button{
            width: 100%;
            height: 100%;
            padding: 5% 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            button{
                width: 90%;
                height: 90upx;
                line-height: 90upx;
                color: #fff;
                &.open-desk{
                    background: rgb(247, 144, 59);
                }
                &.sure{
                    background: rgb(29, 177, 61);
                }
            }
          }
      }
      &.show{
        top: 0%;
      }
  }
}
</style>