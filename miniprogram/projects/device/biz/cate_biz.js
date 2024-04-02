/**
 * Notes: 分类后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-11-14 07:48:00 
 */

const BaseBiz = require('../../../comm/biz/base_biz.js');
const cloudHelper = require('../../../helper/cloud_helper.js');

class CateBiz extends BaseBiz {

	//  取得所有分类 
	static async getAllCateOptions(title = 'bar') {
		return await cloudHelper.callCloudData('cate/all_options', {}, { title });
	}

	// 根据分类，获取名字
	static getCateName(allCateOptions, cateId) {
		for (let k = 0; k < allCateOptions.length; k++) {
			if (allCateOptions[k].val == cateId) return allCateOptions[k].label;
		}
		return '';
	}

 

	 
}

module.exports = CateBiz;