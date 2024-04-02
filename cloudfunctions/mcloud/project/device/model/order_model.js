/**
 * Notes:  商品实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-05 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class OrderModel extends BaseProjectModel {

}

// 集合名
OrderModel.CL = BaseProjectModel.C('order');

OrderModel.DB_STRUCTURE = {
	_pid: 'string|true',
	ORDER_ID: 'string|true',
	ORDER_USER_ID: 'string|true',

	ORDER_GOODS_ID: 'string|true|comment=商品ID',
	ORDER_GOODS_TITLE: 'string|false|comment=标题',  

	ORDER_STATUS: 'int|true|default=1|comment=状态 0=取消,1=借用中,9=完成',

	ORDER_FORMS: 'array|true|default=[]|comment=表单',
	ORDER_OBJ: 'object|true|default={}',

	ORDER_RETURN_TIME: 'int|true|default=0',

	ORDER_ADD_TIME: 'int|true',
	ORDER_EDIT_TIME: 'int|true',
	ORDER_ADD_IP: 'string|false',
	ORDER_EDIT_IP: 'string|false',
};

// 字段前缀
OrderModel.FIELD_PREFIX = "ORDER_";

/**
 * 状态 0=未启用,1=使用中 
 */
OrderModel.STATUS = {
	CANCEL: 0,
	RENT: 1,
	OVER: 9
};

OrderModel.STATUS_DESC = {
	CANCEL: '未启用',
	RENT: '借用中',
	OVER: '已归还'
};



module.exports = OrderModel;