

//    mysql数据库配置参数
const options = {
    'host': '127.0.0.1',
    'port': '3306',
    'database': 'koa-mysql',
    'user': 'root',
    'password': 'root',
    'charset': '',
    'connectionLimit': 5,
    'supportBigNumbers': true,
    'bigNumberStrings': true
}

const mysql = require('mysql2');
const pool = mysql.createPool(options);

//对mysql的封装，执行所有sql语句
function execQuery(sql, values, callback) {
    let errinfo;
    pool.getConnection((err, connection) => {//连接数据库
        if (err) {
            errinfo = 'DB-获取数据库连接异常！';
            console.log(errinfo)
            throw errinfo;
        } else {
            let querys = connection.query(sql, values, (err, rows) => {
                console.log(rows, 'rows')
                release(connection);
                if (err) {
                    errinfo = 'DB-SQL语句执行错误：' + err;
                    console.log(errinfo);
                    callback(err);
                } else {
                    callback(null, rows)
                }
            });
            console.log(querys.sql);//select * from `test` where `id` = 2
        }
    })
}

function release(connection) {
    try {
        connection.release((err) => {
            if (err) {
                console.log('DB-关闭数据库连接异常！')
            }
        })
    } catch (err) {
    }
}


/** 对外接口代码，包装成返回promise函数的形成
 * 创建数据库koa-mysql,数据表test,字段id+name;
 * @param tablename 数据表名
 * @param id 字段id
 * @returns {Promise<any>}
 */
exports.getById = function (tablename, id) {
    return new Promise((resolve, reject) => {
        let values = {id: id};
        let sql = 'select * from ?? where ?';//=select * form test(数据表) where id=2(查询条件)
        execQuery(sql, [tablename, values], (err, rows) => {//调用回调函数
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
};

/**
 * 查询对象，
 * @param tablename 数据表名
 * @param values 查询条件
 * @param callback
 */
exports.getObject = function (tablename, values, callback) {
    let sql = 'select * from ?? where ?';
    execQuery(sql, [tablename, values], result => {
        if (callback) {
            if (result && result.length > 0) {
                callback(result[0])
            } else {
                callback(null)
            }
        }
    })
}






