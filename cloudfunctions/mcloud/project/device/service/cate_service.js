/**
 * Notes: 分类管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-01-11 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const CateModel = require('../model/cate_model.js');

class CateService extends BaseProjectService { 

	async getAllCateOptions(status = 1) {
		let cateList = await CateModel.getAll({ CATE_STATUS: status }, '*', { 'CATE_ORDER': 'asc', 'CATE_ADD_TIME': 'desc' });

		let arr = [];
		for (let k in cateList) {
			let cateId = cateList[k]._id;

			let cateNode = {
				level: 1,
				type: 'cateId',
				label: cateList[k].CATE_TITLE,
				val: cateId,
				value: cateId,
			}

			arr.push(cateNode);
		}

		return arr;
	}
}

module.exports = CateService;