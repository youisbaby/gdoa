const Base = require('./base.js');
/**
 * @class
 * @apiDefine logs 日志管理
 */
module.exports = class extends Base {
    /**
     * @api {get} logs/op 操作日志列表
     * @apiGroup logs
     *
     * @apiHeader {string} rttoken 必填
     *
     * @apiParam  {number} page 页码
     * @apiParam  {number} limit 每页显示数据
     *
     * @apiSuccess (200) {type} name description
     *
     */
    async opAction() {
        const { list, count } = await this.coms('admin_op')
        await this.adminViewLog('管理员操作日志');
        return this.success({ list, count })
    }
    /**
     * @api {get} logs/login 操作日志列表
     * @apiGroup logs
     *
     * @apiHeader {string} rttoken 必填
     *
     * @apiParam  {number} page 页码
     * @apiParam  {number} limit 每页显示数据
     *
     * @apiSuccess (200) {type} name description
     *
     */
     async loginAction() {
        const { list, count } = await this.coms('admin_login')
        await this.adminViewLog('管理员登陆日志');
        return this.success({ list, count })
    }
    /**
     * @api {get} logs/view 行为日志列表
     * @apiGroup logs
     *
     * @apiHeader {string} rttoken 必填
     *
     * @apiParam  {number} page 页码
     * @apiParam  {number} limit 每页显示数据
     *
     * @apiSuccess (200) {type} name description
     *
     */
    async viewAction() {
        const { list, count } = await this.coms('admin_view')
        await this.adminViewLog('管理员行为日志');
        return this.success({ list, count })
    }
    /**
     * @api {get} logs/err 错误日志列表
     * @apiGroup logs
     *
     * @apiHeader {string} rttoken 必填
     *
     * @apiParam  {number} page 页码
     * @apiParam  {number} limit 每页显示数据
     *
     * @apiSuccess (200) {type} name description
     *
     */
    async errAction() {
        const { list, count } = await this.coms('error')
        await this.adminViewLog('系统错误日志');
        return this.success({ list, count })
    }
    async coms(tableName) {
        let { page, limit, param } = this.get();
        let wsql = {type : tableName};
        if (param) wsql = this.parseSearch(param, wsql);
        let list = await this.model('adminlog').where(wsql).page(page, limit).order('addtime desc').select();
        for(let p in list){
            list[p].username = await this.model('admin').where({ admin_id: list[p].admin_id }).getField('username', true);
        };
        //console.log(list)
        let count = await this.model('adminlog').where(wsql).count();
        /*
        let list = await this.model(tableName)
            .alias('l')
            .field('l.*,u.admin_id,u.username')
            .join({
                table: 'admin',
                join: 'left',
                as: 'u',
                on: ['admin_id', 'admin_id']
            })
            .where(wsql)
            .page(page, limit)
            .order("l.addtime desc")
            .select();
        let count = await this.model(tableName)
            .alias('l')
            .field('l.*,u.admin_id,u.name')
            .join({
                table: 'admin',
                join: 'left',
                as: 'u',
                on: ['admin_id', 'admin_id']
            })
            .where(wsql).count();*/
        return { list, count }
    }
};
