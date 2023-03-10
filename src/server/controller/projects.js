const Base = require('./base.js');
/**
 * @class
 * @apiDefine project 项目列表管理
 */
module.exports = class extends Base {

	async listAction() {
		let {
			page,
			limit,
			param
		} = this.get();
		let wsql = {};
		if (param) wsql = this.parseSearch(param, wsql);
		let list = await this.model('project').where(wsql).page(page, limit).order('project_id desc').select();
		let count = await this.model('project').where(wsql).count();
		return this.success({
			list,
			count
		})
	}
	async addBeforeAction() {
		let cates = await this.model('project_type').where({
			sys_id: 1
		}).select()
		return this.success(cates);
	}
	async addAction() {
		let post = this.post();
		post.user_id = this.adminId;
		post.start_time = this.now(post.start_time);
		post.end_time = this.now(post.end_time);
		let project_id = await this.model('project').add(post);
		return this.success(project_id);
	}

	async editAction() {
		let post = this.post();
		let condition = {
			project_id: post.project_id
		};
		let has = await this.model('project').where(condition).find();
		if (think.isEmpty(has)) return this.fail('编辑的数据不存在');
		post.start_time = this.now(post.start_time);
		post.end_time = this.now(post.end_time);
		await this.model('project').where(condition).update(post);
		return this.success()
	}

	async editBeforeAction() {
		let id = this.get('id');
		let data = await this.model('project').where({
			project_id: id
		}).find()
		let cates = await this.model('project_type').where({
			sys_id: 1
		}).select()
		if (think.isEmpty(data)) return this.fail('数据为空')
		return this.success({
			data,
			cates
		});
	}

	async delAction() {
		let id = this.post('id');
		if (!await this.hasData('project', {
				project_id: id
			}))
			return this.fail('数据不存在')
		await this.model('project').where({
			project_id: id
		}).delete()
		return this.success()
	}
}
