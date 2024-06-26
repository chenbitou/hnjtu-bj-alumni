const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);
	},


	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
	},

	onPullDownRefresh: async function () {
		wx.stopPullDownRefresh();
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindScanTap: function (e) {
		wx.scanCode({
			async success(res) {
				console.log(res)
				if (res.scanType == 'WX_CODE' && res.path) {
					console.log(1111)
					wx.navigateTo({
						url: '/' + res.path,
					});
				}
				else {
					pageHelper.showModal('错误的二维码，请重新扫码');
				}

			},
			fail(err) {
				if (err && err.errMsg == 'scanCode:fail')
					pageHelper.showModal('扫码失败，请重新扫码');
			}
		});
	},


	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
})