<template>
    <view class="open-or-book">
        <view class="set-item">
            <view class="item-info">
                <view class="info-tit">开单时间</view>
                <view class="info-val">{{curSelTableOpenInfo.beginTime}}</view>
            </view>
            <view class="span-line"></view>
        </view>
        <view class="set-item">
            <view class="item-info">
                <view class="info-tit">计费类型</view>
                <view class="info-val">2019/08/26-10:54:20<text class="iconfont icon-arrow-right-copy"></text></view>
            </view>
            <view class="span-line"></view>
        </view>
        <view class="set-item">
            <view class="item-info">
                <view class="info-tit">顾客人数</view>
                <view class="info-val">2019/08/26-10:54:20</view>
            </view>
            <view class="span-line"></view>
        </view>
        <view class="set-item">
            <view class="item-info">
                <view class="info-tit">服务员</view>
                <view class="info-val">2019/08/26-10:54:20</view>
            </view>
            <view class="span-line"></view>
        </view>
        <view class="span-height"></view>
        <view class="set-item other-sty">
            <view class="item-info">
                <view class="info-tit">备注信息</view>
                <view class="info-val">
                    <textarea placeholder='请填写备注内容'/>
                </view>
            </view>
        </view>
        <view class="btn">
            <button>确定</button>
            <button class="cancel" @click="$emit('closeOpenOrBookTable')">取消</button>
        </view>
    </view>
</template>
<script>
export default {
    props:['curSelTableOpenInfo']
}
</script>
<style lang="scss" scoped>
    @import "./open-or-book.scss";
</style>