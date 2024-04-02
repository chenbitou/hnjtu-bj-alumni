/**
 * Notes: 设备模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-07 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const GoodsModel = require('../model/goods_model.js');
const OrderModel = require('../model/order_model.js');
const UserModel = require('../model/user_model.js');

class GoodsService extends BaseProjectService {

	/**  借用前获取关键信息 */
	async detailForOrderGoods(userId, goodsId) {

		let where = {
			_id: goodsId,
			GOODS_STATUS: GoodsModel.STATUS.WAIT,
		}
		let goods = await GoodsModel.getOne(where);
		if (!goods)
			this.AppError('该设备不存在或者已被借用');


		// 取出本人最近一次的填写表单 
		let whereMy = {
			ORDER_USER_ID: userId,
		}
		let orderByMy = {
			ORDER_ADD_TIME: 'desc'
		}
		let orderMy = await OrderModel.getOne(whereMy, 'ORDER_FORMS', orderByMy);


		let myForms = orderMy ? orderMy.ORDER_FORMS : [];

		if (myForms.length == 0) {

			let user = await UserModel.getOne({ USER_MINI_OPENID: userId, USER_STATUS: UserModel.STATUS.COMM });
			if (!user) this.AppError('用户异常');

			// 取得我的信息
			myForms = [
				{ mark: 'name', type: 'text', title: '姓名', val: user.USER_NAME },
				{ mark: 'phone', type: 'mobile', title: '手机', val: user.USER_MOBILE },
				{ mark: 'dept', type: 'text', title: '部门', val: user.USER_OBJ.dept },
			]

		}

		goods.myForms = myForms;

		return goods;
	}


	// 借用下单
	async orderGoods(userId, goodsId, forms) {
		this.AppError('[设备借用]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	// 统计
	async statGoods(goodsId) {
		let whereSale = {
			ORDER_STATUS: ['in', [OrderModel.STATUS.RENT, OrderModel.STATUS.OVER]],
			ORDER_GOODS_ID: goodsId
		}
		let cntSale = await await OrderModel.count(whereSale);

		let data = {
			GOODS_SALE_CNT: cntSale
		}
		await GoodsModel.edit(goodsId, data);
	}

	/** 浏览信息 */
	async viewGoods(userId, id) {

		let fields = '*';

		let where = {
			_id: id,
			GOODS_STATUS: GoodsModel.STATUS.COMM
		}
		let goods = await GoodsModel.getOne(where, fields);
		if (!goods) return null;

		GoodsModel.inc(id, 'GOODS_VIEW_CNT', 1);

		// 判断我是否有借用
		let whereOrder = {
			ORDER_USER_ID: userId,
			ORDER_GOODS_ID: id,
			ORDER_STATUS: OrderModel.STATUS.RENT
		}
		let order = await OrderModel.getOne(whereOrder);
		if (order) {
			goods.myOrderId = order._id;
			goods.myOrderTag = '我已借用';
		}

		else {
			goods.myOrderId = '';
			goods.myOrderTag = '';
		}

		return goods;
	}


	/** 取得分页列表 */
	async getGoodsList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'GOODS_ORDER': 'asc',
		};
		let fields = 'GOODS_SALE_CNT,GOODS_OBJ,GOODS_VIEW_CNT,GOODS_TITLE,GOODS_CATE_ID,GOODS_ADD_TIME,GOODS_ORDER,GOODS_STATUS,GOODS_CATE_NAME';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		where.and.GOODS_STATUS = GoodsModel.STATUS.COMM; // 状态  


		if (util.isDefined(search) && search) {
			where.or = [
				{ GOODS_TITLE: ['like', search] },
			];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status': {
					if (sortVal) where.and.GOODS_STATUS = Number(sortVal);
					break;
				}
				case 'cateId': {
					if (sortVal) where.and.GOODS_CATE_ID = String(sortVal);
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

	//########################ORDER
	// 借用记录
	async getOrdersList({
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
			ORDER_GOODS_ID: goodsId,
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ ORDER_GOODS_TITLE: ['like', search] },
				{ 'user.USER_NAME': ['like', search] },
				{ 'user.USER_MOBILE': ['like', search] },
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

		let UserModel = require('../model/user_model.js');
		let joinParams = {
			from: UserModel.CL,
			localField: 'ORDER_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await OrderModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	async returnMyOrder(userId, orderId) {
		let where = {
			ORDER_USER_ID: userId,
			_id: orderId,
			ORDER_STATUS: OrderModel.STATUS.RENT
		};
		let order = await OrderModel.getOne(where);

		if (!order) {
			this.AppError('未找到可归还的设备');
		}

		await OrderModel.edit(orderId,
			{
				ORDER_STATUS: OrderModel.STATUS.OVER,
				ORDER_RETURN_TIME: this._timestamp
			}
		);

		await GoodsModel.edit(order.ORDER_GOODS_ID, { GOODS_STATUS: GoodsModel.STATUS.WAIT });


		this.statGoods(order.ORDER_GOODS_ID);
	}


	async getMyOrdersList(userId, {
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
		let fields = '*';

		let where = {};
		where.and = {
			ORDER_USER_ID: userId,
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ ORDER_GOODS_TITLE: ['like', search] },
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

		return await OrderModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

}

module.exports = GoodsService;