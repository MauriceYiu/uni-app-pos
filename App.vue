<script>
	export default {
		onLaunch: function() {
			// const token = uni.getStorageSync('token');
			// if (!token) {
			// 	uni.redirectTo({
			// 		url: './pages/login/login'
			// 	});
			// }
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page{
		width: 100%;
		height: 100%;
	}
</style>
