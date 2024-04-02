

module.exports = { //device 
	PROJECT_COLOR: '#0055BE',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#0055BE',


	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' },
		{ title: '用户注册与使用协议', key: 'SETUP_YS' },
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [
		{ mark: 'sex', title: '性别', type: 'select', selectOptions: ['男', '女'], must: true },
		{ mark: 'dept', title: '部门', type: 'text', must: true },
	],
	USER_CHECK_FORM: {
		name: 'formName|must|string|min:1|max:30|name=姓名',
		mobile: 'formMobile|must|mobile|name=手机',
		forms: 'formForms|array'
	},


	NEWS_NAME: '公告通知',
	NEWS_CATE: [
		{ id: 1, title: '公告通知' }, 

	],
	NEWS_FIELDS: [
	],


	GOODS_NAME: '设备',
	GOODS_CATE: [ 
	],
	GOODS_FIELDS: [
		{ mark: 'cover', title: '封面图片', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'detail', title: '详细介绍', type: 'content', must: false }, 
	],

	ORDER_FIELDS: [
		{ mark: 'name', type: 'text', title: '姓名', must: true, max: 30, edit: false },
		{ mark: 'phone', type: 'mobile', title: '手机', must: true, edit: false },
		{ mark: 'dept', type: 'text', title: '部门', must: true, edit: false }
	],


	CATE_NAME: '分类',
	CATE_FIELDS: [
		 
	],

}