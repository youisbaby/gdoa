const Base = require('./base.js');
/**
 * @class
 * @apiDefine project_file 项目文件管理
 */
module.exports = class extends Base {

	async listAction() {
		let {
			page,
			limit,
			param
		} = this.get();
		let wsql = {
			'a.group_id': this.groupId
		};
		if (param) wsql = this.parseSearch(param, wsql);
		let list = await this.model('project_file')
			.where(wsql)
			.alias('a')
			.join({
				table: 'project_type',
				join: 'left', //join 方式，有 left, right, inner 3 种方式
				as: 'c', // 表别名
				on: ['type', 'id'] //ON 条件
			})
			.page(page, limit)
			.field('a.*,c.name as cname')
			.order('id desc')
			.select();
		// list.forEach(async (el) => {
		// 	el.cname = await this.model('project_type').where({
		// 		id: el.type
		// 	}).getField('name', true)
		// })
		let count = await this.model('project_file').where(wsql)
			.alias('a')
			.join({
				table: 'project_type',
				join: 'left', //join 方式，有 left, right, inner 3 种方式
				as: 'c', // 表别名
				on: ['type', 'id'] //ON 条件
			}).count();
		return this.success({
			list,
			count
		})
	}
	async addBeforeAction() {
		let cates = await this.model('project_type').where({
			sys_id: 2
		}).select()
		return this.success(cates);
	}
	async addAction() {
		let post = this.post();
		post.user_id = this.adminId;
		post.group_id = this.groupId;
		let id = await this.model('project_file').add(post);
		return this.success(id);
	}

	async editAction() {
		let post = this.post();
		let has = await this.model('project_file').where({
			id: post.id
		}).find();
		if (think.isEmpty(has)) return this.fail('编辑的数据不存在');
		await this.model('project_file').update(post);
		return this.success()
	}

	async editBeforeAction() {
		let id = this.get('id');
		let data = await this.model('project_file').where({
			id
		}).find()
		if (think.isEmpty(data)) return this.fail('数据为空')
		let cates = await this.model('project_type').where({
			sys_id: 2
		}).select()
		return this.success({
			data,
			cates
		});
	}

	async delAction() {
		let id = this.post('id');
		if (!await this.hasData('project_file', {
				id
			}))
			return this.fail('数据不存在')
		await this.model('project_file').where({
			id
		}).delete()
		return this.success()
	}
}
