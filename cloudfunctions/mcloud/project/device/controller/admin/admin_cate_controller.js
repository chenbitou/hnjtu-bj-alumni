/**
 * Notes: 分类模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-01-06 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');
const AdminCateService = require('../../service/admin/admin_cate_service.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const CateModel = require('../../model/cate_model.js');

class AdminCateController extends BaseProjectAdminController { 

 
	async sortCate() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminCateService();
		await service.sortCate(input.id, input.sort);
	} 

	async statusCate() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminCateService();
		await service.statusCate(input.id, input.status);

	}


	async delCate() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let title = await CateModel.getOneField(input.id, 'CATE_TITLE');

		let service = new AdminCateService();
		await service.delCate(input.id);

		if (title)
			this.logNews('删除了分类《' + title + '》');

	}

	async getAdminCateList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminCateService();
		let result = await service.getAdminCateList(input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {

			list[k].CATE_ADD_TIME = timeUtil.timestamp2Time(list[k].CATE_ADD_TIME);

		}
		result.list = list;

		return result;
	}

	async insertCate() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			title: 'must|string|name=名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminCateService();
		let result = await service.insertCate(input);

		this.logNews('添加了分类《' + input.title + '》');

		return result;
	}

	async editCate() {
		await this.isAdmin();


		// 数据校验
		let rules = {
			id: 'must|id|name=id',
			title: 'must|string|name=名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminCateService();
		let result = await service.editCate(input);

		this.logNews('修改了分类《' + input.title + '》');

		return result;
	}

	async getCateDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminCateService();
		return await service.getCateDetail(input.id);

	}

	async updateCateForms() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminCateService();
		return await service.updateCateForms(input);
	} 
 

}

module.exports = AdminCateController;