const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);

		if (!pageHelper.getOptions(this, options)) return;

		this._loadDetail();

	},

	_loadDetail: async function () {
		let id = this.data.id;
		if (!id) return;

		let params = {
			id,
		};
		let opt = {
			title: 'bar'
		};
		let goods = await cloudHelper.callCloudData('goods/view', params, opt);
		if (!goods) {
			this.setData({
				isLoad: null
			})
			return;
		}

		this.setData({
			isLoad: true,
			goods,
		});

	},

	bindReturnOrderTap: async function (e) {
		if (!await PassportBiz.loginMustCancelWin(this)) return;


		let cb = async () => {
			try {
				let params = {
					id: this.data.goods.myOrderId
				}
				let opts = {
					title: '提交中'
				}

				await cloudHelper.callCloudSumbit('goods/order_return_my', params, opts).then(res => {
					let callback = () => {
						wx.redirectTo({
							url: 'goods_detail?id=' + this.data.id,
						})
					}
					pageHelper.showSuccToast('归还成功', 1500, callback);
				});
			} catch (err) {
				console.log(err);
			}
		}

		pageHelper.showConfirm('确认归还该设备?', cb);

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () { },

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () { },

	url: function (e) {
		pageHelper.url(e, this);
	},

	onPageScroll: function (e) {
		// 回页首按钮
		pageHelper.showTopBtn(e, this);

	},

	bindOrderTap: async function (e) {
		if (!await PassportBiz.loginMustCancelWin(this)) return;

		wx.navigateTo({
			url: '../order/goods_order?id=' + this.data.goods._id,
		});

	},

	onShareAppMessage: function (res) {
		return {
			title: this.data.goods.GOODS_TITLE,
			imageUrl: this.data.goods.GOODS_OBJ.cover[0]
		}
	}
})