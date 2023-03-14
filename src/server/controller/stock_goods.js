const stockBase = require('./stock_base.js');
/**
 * @class
 * @apiDefine stock_goods 物料管理
 */
module.exports = class extends stockBase {

	async listAction() {
		let {
			page,
			limit,
			param
		} = this.get();
		let wsql = {group_id : this.groupId};
		if (param) wsql = this.parseSearch(param, wsql);
		let cates = await this.getCate();
		let list = await this.model('stock_goods')
			.where(wsql)
			.page(page, limit)
			.order('id desc')
			.select();
		list.forEach(d => {
			let cateData = cates.find(e => e.id == d.cate_id)
			if(cateData) {
				d.cname = cateData.name;
			}
		})
		let count = await this.model('stock_goods')
		.where(wsql)
		.count();
		
		return this.success({
			list,
			count,
			cates
		})
	}
	async addBeforeAction() {
		let cates = await this.getCate()
		return this.success(cates);
	}
	async addAction() {
		let post = this.post();
		post.user_id = this.adminId;
		post.group_id = this.groupId;
		let id = await this.model('stock_goods').add(post);
		return this.success(id);
	}
	
	async editAction() {
		let post = this.post();
		let has = await this.model('stock_goods').where({
			id: post.id
		}).find();
		if (think.isEmpty(has)) return this.fail('编辑的数据不存在');
		await this.model('stock_goods').update(post);
		return this.success()
	}

	async editBeforeAction() {
		let id = this.get('id');
		let data = await this.model('stock_goods').where({
			id
		}).find()
		if (think.isEmpty(data)) return this.fail('数据为空')
		let cates = await this.getCate()
		return this.success({data, cates});
	}

	async delAction() {
		let id = this.post('id');
		if (!await this.hasData('stock_goods', {
				id
			}))
			return this.fail('数据不存在')
		await this.model('stock_goods').where({
			id
		}).delete()
		return this.success()
	}
}
