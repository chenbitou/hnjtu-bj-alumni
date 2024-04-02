/**
 * Notes:设备后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-01-04 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');

const dataUtil = require('../../../../framework/utils/data_util.js');
const util = require('../../../../framework/utils/util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const GoodsModel = require('../../model/goods_model.js');
const OrderModel = require('../../model/order_model.js');
const GoodService = require('../goods_service.js');
const exportUtil = require('../../../../framework/utils/export_util.js');

// 导出借用数据KEY
const EXPORT_GOODS_ORDER_DATA_KEY = 'EXPORT_GOODS_ORDER_DATA';

class AdminGoodsService extends BaseProjectAdminService {


	/**添加 */
	async insertGoods({
		title,
		cateId,
		cateName,
		order,
		forms
	}) {


		this.AppError('[设备借用]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**删除数据 */
	async delGoods(id) {
		this.AppError('[设备借用]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/**获取信息 */
	async getGoodsDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let goods = await GoodsModel.getOne(where, fields);
		if (!goods) return null;

		return goods;
	}

	// 更新forms信息
	async updateGoodsForms({
		id,
		hasImageForms
	}) {
		this.AppError('[设备借用]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	/**更新数据 */
	async editGoods({
		id,
		title,
		cateId, // 二级分类 
		cateName,
		order,
		forms,
	}) {

		this.AppError('[设备借用]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/**取得分页列表 */
	async getAdminGoodsList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'GOODS_ORDER': 'asc',
			'GOODS_ADD_TIME': 'desc'
		};
		let fields = 'GOODS_RENT_USER_NAME,GOODS_RENT_TIME,GOODS_TITLE,GOODS_CATE_ID,GOODS_CATE_NAME,GOODS_EDIT_TIME,GOODS_ADD_TIME,GOODS_ORDER,GOODS_STATUS,GOODS_VOUCH,GOODS_QR,GOODS_OBJ.limit,GOODS_SALE_CNT,GOODS_OVER_CNT';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ GOODS_TITLE: ['like', search] },
				{ GOODS_CATE_NAME: ['like', search] },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.GOODS_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.GOODS_STATUS = Number(sortVal);
					break;
				}
				case 'top': {
					where.and.GOODS_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'GOODS_ADD_TIME');
					break;
				}
			}
		}

		return await GoodsModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/**修改状态 */
	async statusGoods(id, status) {
		this.AppError('[设备借用]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**置顶与排序设定 */
	async sortGoods(id, sort) {
		this.AppError('[设备借用]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**首页设定 */
	async vouchGoods(id, vouch) {
		this.AppError('[设备借用]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	// #################### ORDER
	// 借用记录
	async getAdminOrdersList({
		goodsId,
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'ORDER_ADD_TIME': 'desc'
		};
		let fields = 'ORDER_FORMS,ORDER_RETURN_TIME,ORDER_ADD_TIME,ORDER_GOODS_TITLE,ORDER_STATUS,user.USER_NAME,user.USER_MOBILE';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (goodsId) {
			where.and['ORDER_GOODS_ID'] = goodsId;
		}

		if (util.isDefined(search) && search) {
			where.or = [
				{ ORDER_GOODS_TITLE: ['like', search] },
				//	{ 'user.USER_NAME': ['like', search] },
				//	{ 'user.USER_MOBILE': ['like', search] },
				{ 'ORDER_OBJ.name': ['like', search] },
				{ 'ORDER_OBJ.phone': ['like', search] },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status': {
					where.and.ORDER_STATUS = Number(sortVal);
					break;
				}
			}
		}

		let UserModel = require('../../model/user_model.js');
		let joinParams = {
			from: UserModel.CL,
			localField: 'ORDER_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await OrderModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	async statusOrder(id, status) {
		this.AppError('[设备借用]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	// #####################导出借用数据
	/**获取借用数据 */
	async getGoodsOrderDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_GOODS_ORDER_DATA_KEY);
	}

	/**删除借用数据 */
	async deleteGoodsOrderDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_GOODS_ORDER_DATA_KEY);
	}

	/**导出借用数据 */
	async exportGoodsOrderDataExcel({
		status,
		formSet,
		start,
		end,
	}) {

		this.AppError('[设备借用]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}
}

module.exports = AdminGoodsService;