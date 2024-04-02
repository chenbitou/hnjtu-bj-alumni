const ProjectBiz = require('../../../biz/project_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const CateBiz = require('../../../biz/cate_biz.js');

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

		await this._getSearchMenu();

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

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},


	onShareAppMessage: function () {

	},

	_getSearchMenu: async function () {

		let sortItem1 = [
			{ label: '全部', type: 'cateId', value: '' },
			{ label: '可借用', type: 'status', value: '1' },
			{ label: '借用中', type: 'status', value: '2' },
			{ label: '已损坏', type: 'status', value: '9' },
			{ label: '借用次数↓', type: 'sort', value: 'GOODS_SALE_CNT|desc' },
			{ label: '借用次数↑', type: 'sort', value: 'GOODS_SALE_CNT|asc' }, 
		];

		let cateIdOptions = await CateBiz.getAllCateOptions();

		let cateItem = [{ label: '分类', type: '', value: 0 }];
		cateItem = cateItem.concat(cateIdOptions);

		let sortItems = [cateItem];
		this.setData({
			isLoad: true,
			sortItems,
			sortMenus: sortItem1
		})

	}

})