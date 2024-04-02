const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');
const AdminGoodsBiz = require('../../../../biz/admin_goods_biz.js'); 
const CateBiz = require('../../../../biz/cate_biz.js');

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
		if (!AdminBiz.isAdmin(this)) return;

		this.setData(AdminGoodsBiz.initFormData());

		let cateIdOptions = await CateBiz.getAllCateOptions();
		this.setData({
			cateIdOptions,
			isLoad: true
		});

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

	url: function (e) {
		pageHelper.url(e, this);
	},

	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let data = this.data;
		data = validate.check(data, AdminGoodsBiz.CHECK_FORM, this);
		if (!data) return;

		let forms = this.selectComponent("#cmpt-form").getForms(true);
		if (!forms) return;
		data.forms = forms;

		data.cateName = CateBiz.getCateName(this.data.cateIdOptions, data.cateId);

		try {

			// 创建
			let result = await cloudHelper.callCloudSumbit('admin/goods_insert', data);
			let goodsId = result.data.id;

			// 图片
			await cloudHelper.transFormsTempPics(forms, 'goods/', goodsId, 'admin/goods_update_forms');


			let callback = async function () {
				PublicBiz.removeCacheList('admin-goods-list');
				PublicBiz.removeCacheList('goods-list');
				wx.navigateBack();

			}
			pageHelper.showSuccToast('添加成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},

})