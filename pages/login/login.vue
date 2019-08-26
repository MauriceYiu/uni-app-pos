<template>
	<view class="login">
		<view class="login-cont">
			<input class="login-item username" v-model="username" type="text" placeholder="请输入用户名" />
			<input class="login-item password" v-model="password" type="password" placeholder="请输入密码" />
			<view class="sub">
				<button class="btn login" @tap.stop="doLogin">登录</button>
				<button class="btn register">注册</button>
			</view>
		</view>
		<view class="store-wrap" v-if="showSelStore" @tap.stop="showSelStore=false">
			<view class="store-list">
				<ul>
					<li v-for="(item,index) in storeList" 
					 @tap.stop="toThisStore(item)"
					:key="index" class="store-item">{{item.storeName}}</li>
				</ul>
			</view>
		</view>
	</view>
</template>

<script>
import { login } from "./../../api/login"
import { Base64 } from 'js-base64';
	export default {
		data() {
			return {
				username:"",
				password:"",
				storeList:[],
				showSelStore:false,
				token:"",
			}
		},
		onLoad() {
			uni.clearStorage();
		},
		methods: {
			toThisStore(item){
				uni.setStorage({
					key: 'storeInfo',
					data: JSON.stringify(item),
					success: function () {
						console.log('success storeInfo');
					}
				});
				uni.setStorage({
					key: 'token',
					data: JSON.stringify(this.token),
					success: function () {
						console.log('success token');
					}
				});
				uni.navigateTo({
					url: './../index/index'
				});
			},
			checkInfo(){
				if(!this.username){
					uni.showToast({
						title: "请输入用户名",
						duration: 2000,
						icon:"none"
					});
					return false;
				}
				if(!this.password){
					uni.showToast({
						title: "请输入密码",
						duration: 2000,
						icon:"none"
					});
					return false;
				}
				return true;
			},
			async doLogin(){
				let flag = this.checkInfo();
				if(!flag){
					return;
				}
				let data = {
					"username": this.username,
                    "password": this.password
				}
				let authStr = 'Basic '+ Base64.encode(data.username+':'+data.password);
				let res = await login(authStr);
				this.token = authStr;
				console.log(res)
				this.storeList = res.data;
				if(res.data.length==0){
					uni.showToast({
						title: "暂无店铺",
						duration: 2000,
						icon:"none"
					});
					this.showSelStore = false;
				}else{
					this.showSelStore = true;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		.login-cont{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 90%;
			background: #fff;
			border-radius: 20upx;
			// border: 1upx solid #ddd;
			.login-item{
				width: 80%;
				height: 100upx;
				margin-bottom: 20upx;
				font-size:30upx;
				border-bottom: 1upx solid #ddd;
				text-align: center;
			}
			.sub{
				width: 100%;
				margin-top: 10%;
				.btn{
					width: 80%;
					height: 100upx;
					line-height: 100upx;
					font-size: 28upx;
					margin-bottom: 30upx;
					color: #999;
					&.login{
						background: rgb(6, 231, 145);
						color: #fff;
					}
				}
			}
		}
		.store-wrap{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0,0,0,.3);
			z-index: 999;
			display: flex;
			justify-content: center;
			align-items: center;
			.store-list{
				width: 80%;
				max-height: 69%;
				overflow: hidden;
				overflow-y: auto;
				background: #fff;
				border-radius: 10upx;
				text-align: center;
				.store-item{
					width: 100%;
					height: 80upx;
					line-height: 80upx;
					border-bottom: 1px solid #ddd;
				}
			}
		}
	}
</style>
