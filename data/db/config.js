module.exports = {
    "default": "worklog", "list": [{ "database": "gdcms", "prefix": "rt_", "encoding": "utf8", "host": "127.0.0.1", "port": "8889", "user": "root", "password": "root", "dateStrings": true, "safeList": ["admin", "admin_auth", "admin_map", "admin_oplog", "admin_viewlog", "error", "menu", "set", "form", "crons"] }, { "database": "admin", "user": "root", "password": "root", "host": "127.0.0.1", "port": "8889", "prefix": "rt_", "encoding": "utf8", "safeList": [] }, {
        "database": 'worklog',
        "prefix": 'rt_',
        "encoding": 'utf8mb4',
        "host": '127.0.0.1',
        "port": '',
        "user": 'root',
        "password": 'workLog20210927!#',
        "dateStrings": true, "safeList": [],
        "ssh": true, "sshConfig": {
            host: '113.140.72.10',
            user: 'root',
            port: '31',
            password: 'fanns@202120'
        } }] }