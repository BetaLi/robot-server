const express = require('express')
const app = express()
const mysql = require('mysql'); //调用MySQL模块
const moment = require('moment')
const mockjs = require('mock')
const fs = require('fs')
const url = require('url')
const path = require('path')
const redis = require('redis')

//Tencent Cloud Redis
const TencentRedis = {
  host: '203.195.164.46',
  port: 6379
}

//Aliyun
const Aliyun = {
  host: '119.23.106.227',
  port: 6379
}

client = redis.createClient(TencentRedis.port, TencentRedis.host, {
  db: 0
})

client.on('error', (err) => {
  console.log(err)
})

client.on('connect', () => {
  console.log('Redis is connected.')
})

client.on('ready', () => {
  console.log('Redis is ready to operate!')
})

client.on('reconnecting', () => {
  console.log('Redis is reconnecting now...')
})

client.on('end', () => {
  console.log('Redis id closed.')
})

const avatars = [
  './assets/ts-alert-shine.svg', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const avatars2 = [
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];

app.get('/api/notices', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");

  res.send([{
      id: '000000001',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
      title: '你收到了 14 份新周报',
      datetime: '2017-08-09',
      type: '通知',
    },

    {
      id: '000000012',
      title: 'ABCD 版本发布',
      description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
      extra: '进行中',
      status: 'processing',
      type: '待办',
    },
  ]);
})

app.get('/api/project/notice', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");

  let notices = []
  client.lrange('robotStatus810177203',0,-1,(err,list)=>{
    if(err) console.log(err)
    for(let i=0;i<list.length;i++){
      data = JSON.parse(list[i])
      notices.push({
        id: data.robotid,
          title: data.robottype,
          logo: avatars[0],
          description: [`设备状态：${data.status},   当前任务状态：空闲`,
            `当前位置：X: ${data.x}, Y:${data.y}, Angle: ${data.angle}°`,
            `当前温度：${data.temperature}℃`,
            `设备IP：${data.ip}`,
          ],
          updatedAt: new Date(),
          member: `当前电池电量${data.battery}%`,
          href: '',
          memberLink: '',
      })
      if(i === list.length-1){
        console.log(notices)
        res.send(notices)
      }
    }
  })

})

app.get('/api/project/order', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");

  let order = []
  client.get('serving',(err,serving)=>{
    if(err) console.log(err) 
    servingData = JSON.parse(serving)
    order.push(servingData)
    res.send(serving)
  })
})

app.get('/api/project/orderList', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  let r = []

  client.zrevrange('dishStatistics810177203', 0, 5,(err, data) => {
    if (err) console.log(err)
    for (let i = 0; i < data.length; i++) {
      const pData = JSON.parse(data[i])
      client.zscore('dishStatistics810177203', data[i], (err, score) => {
        if (err) console.log(err)
        r.push({
          title: pData.dishName,
          totlal: pData.price,
          operation: score,
        })
        if (i === data.length - 1) {
          res.send(r)
        }
      })
    }
  })
})

app.get('/api/project/devicesLocation', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");

  res.send([
    [
      [-13380, -5000, 170968690, 'Omron_AGV', 'Omron_AGV'],
      [4520, -18440, 170968690, 'Omron_AGV', 'Omron_AGV'],
    ],
    [
      [1390, 7500, 251553170, 'MKLM_AGV', 'MKLM_AGV'],
      [15000, -5600, 251553170, 'MKLM_AGV', 'MKLM_AGV'],
    ],
    [
      [-2529, 7500, 151553170, 'FANUC', 'FANUC'],
      [-2529, 9500, 151553170, 'FANUC', 'FANUC'],
      [-2529, 11500, 151553170, 'FANUC', 'FANUC'],
      [-2529, 13500, 151553170, 'FANUC', 'FANUC'],
    ],
  ])
})

app.get('/api/video', (req, res) => {
  let path = './assets/video.mp4';
  let stat = fs.statSync(path);
  let fileSize = stat.size;
  let range = req.headers.range;

  // fileSize 3332038

  if (range) {
    //有range头才使用206状态码

    let parts = range.replace(/bytes=/, "").split("-");
    let start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : start + 999999;

    // end 在最后取值为 fileSize - 1 
    end = end > fileSize - 1 ? fileSize - 1 : end;

    let chunksize = (end - start) + 1;
    let file = fs.createReadStream(path, {
      start,
      end
    });
    let head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    let head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }

})


app.get('/api/activities', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");

  res.send([{
      id: 'trend-1',
      updatedAt: new Date(),
      user: {
        name: '工程师A',
        avatar: avatars2[0],
      },
      group: {
        name: '机器人餐厅',
        link: 'http://github.com/',
      },
      project: {
        name: 'UR5',
        link: 'http://github.com/',
      },
      template: '在 @{group} 操作 @{project} 机器人',
    },
    {
      id: 'trend-2',
      updatedAt: new Date(),
      user: {
        name: '工程师A',
        avatar: avatars2[1],
      },
      group: {
        name: '机器人餐厅',
        link: 'http://github.com/',
      },
      project: {
        name: 'FANUC',
        link: 'http://github.com/',
      },
      template: '在 @{group} 操作 @{project} 机器人',
    },
    {
      id: 'trend-3',
      updatedAt: new Date(),
      user: {
        name: '工程师A',
        avatar: avatars2[2],
      },
      group: {
        name: '机器人餐厅',
        link: 'http://github.com/',
      },
      project: {
        name: 'UR3',
        link: 'http://github.com/',
      },
      template: '在 @{group} 操作 @{project} 机器人',
    },
    {
      id: 'trend-4',
      updatedAt: new Date(),
      user: {
        name: '工程师A',
        avatar: avatars2[4],
      },
      project: {
        name: '5 月日常迭代',
        link: 'http://github.com/',
      },
      template: '将 @{project} 更新至已发布状态',
    },
    {
      id: 'trend-5',
      updatedAt: new Date(),
      user: {
        name: '工程师A',
        avatar: avatars2[3],
      },
      project: {
        name: '工程效能',
        link: 'http://github.com/',
      },
      comment: {
        name: '留言',
        link: 'http://github.com/',
      },
      template: '在 @{project} 发布了 @{comment}',
    },
    {
      id: 'trend-6',
      updatedAt: new Date(),
      user: {
        name: '工程师A',
        avatar: avatars2[5],
      },
      group: {
        name: '程序员日常',
        link: 'http://github.com/',
      },
      project: {
        name: '品牌迭代',
        link: 'http://github.com/',
      },
      template: '在 @{group} 新建项目 @{project}',
    },
  ])
})

app.get('/api/currentUser', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");

  res.send({
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    notifyCount: 12,
  })
})

app.get('/api/users', (req, res) => {
  res.send([{
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ])
})

app.get('/api/rule', (req, res) => {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
})

app.post('/api/rule', (req, res) => {
  res.send({
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  })
})

app.post('/api/forms', (req, res) => {
  res.send({
    message: 'Ok'
  });
})


function fakeList(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      owner: user[i % 10],
      title: titles[i % 8],
      avatar: avatars[i % 8],
      cover: parseInt(i / 4, 10) % 2 === 0 ? covers[i % 4] : covers[3 - i % 4],
      status: ['active', 'exception', 'normal'][i % 3],
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: avatars[i % 8],
      href: 'https://ant.design',
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      subDescription: desc[i % 5],
      description: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      star: Math.ceil(Math.random() * 100) + 100,
      like: Math.ceil(Math.random() * 100) + 100,
      message: Math.ceil(Math.random() * 10) + 10,
      content: '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
      members: [{
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
        },
      ],
    });
  }
  return list;
}

app.get('/api/fake_list', (req, res) => {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  const count = params.count * 1 || 20;

  const result = fakeList(count);

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
})

app.get('/api/fake_chart_data', (req, res) => {
  const visitData = [];
  const beginDay = new Date().getTime();

  const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
  for (let i = 0; i < fakeY.length; i += 1) {
    visitData.push({
      x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
      y: fakeY[i],
    });
  }

  const visitData2 = [];
  const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
  for (let i = 0; i < fakeY2.length; i += 1) {
    visitData2.push({
      x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
      y: fakeY2[i],
    });
  }

  const salesData = [];
  for (let i = 0; i < 12; i += 1) {
    salesData.push({
      x: `${i + 1}月`,
      y: Math.floor(Math.random() * 1000) + 200,
    });
  }
  const searchData = [];
  for (let i = 0; i < 50; i += 1) {
    searchData.push({
      index: i + 1,
      keyword: `搜索关键词-${i}`,
      count: Math.floor(Math.random() * 1000),
      range: Math.floor(Math.random() * 100),
      status: Math.floor((Math.random() * 10) % 2),
    });
  }
  const salesTypeData = [{
      x: '顺德菜',
      y: 4544,
    }, {
      x: '广州粤菜',
      y: 3321,
    },
    {
      x: '川菜',
      y: 3113,
    },
    {
      x: '鲁菜',
      y: 2341,
    },
    {
      x: '皖南菜系',
      y: 1231,
    },
    {
      x: '其他',
      y: 1231,
    },
  ];

  const salesTypeDataOnline = [{
      x: '顺德菜',
      y: 244,
    },
    {
      x: '广州粤菜',
      y: 321,
    },
    {
      x: '川菜',
      y: 311,
    },
    {
      x: '鲁菜',
      y: 41,
    },
    {
      x: '皖南菜系',
      y: 121,
    },
    {
      x: '其他',
      y: 111,
    },
  ];

  const salesTypeDataOffline = [{
      x: '顺德菜',
      y: 99,
    },
    {
      x: '广州粤菜',
      y: 188,
    },
    {
      x: '川菜',
      y: 344,
    },
    {
      x: '鲁菜',
      y: 255,
    },
    {
      x: '其他',
      y: 65,
    },
  ];

  const offlineData = [];
  for (let i = 0; i < 1; i += 1) {
    offlineData.push({
      name: `门店${i+1}`,
      // cvr: Math.ceil(Math.random() * 9) / 10,
    });
  }
  const offlineChartData = [];
  for (let i = 0; i < 20; i += 1) {
    offlineChartData.push({
      x: new Date().getTime() + 1000 * 60 * 30 * i,
      y1: Math.floor(Math.random() * 100) + 10,
      y2: Math.floor(Math.random() * 100) + 10,
    });
  }

  const radarOriginData = [{
      name: '个人',
      ref: 10,
      koubei: 8,
      output: 4,
      contribute: 5,
      hot: 7,
    },
    {
      name: '团队',
      ref: 3,
      koubei: 9,
      output: 6,
      contribute: 3,
      hot: 1,
    },
    {
      name: '部门',
      ref: 4,
      koubei: 1,
      output: 6,
      contribute: 5,
      hot: 7,
    },
  ];

  const radarData = [];
  const radarTitleMap = {
    ref: '引用',
    koubei: '口碑',
    output: '产量',
    contribute: '贡献',
    hot: '热度',
  };
  radarOriginData.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== 'name') {
        radarData.push({
          name: item.name,
          label: radarTitleMap[key],
          value: item[key],
        });
      }
    });
  });
  const getFakeChartData = {
    visitData,
    visitData2,
    salesData,
    searchData,
    offlineData,
    offlineChartData,
    salesTypeData,
    salesTypeDataOnline,
    salesTypeDataOffline,
    radarData,
  }
  res.send(getFakeChartData)
})

app.get('/api/tags', (req, res) => {
  res.send([{
    name: '顺德',
    'value|1-100': 150,
    'type|0-2': 1
  }])
})

app.post('/api/login/account', (req, res) => {
  const {
    password,
    userName,
    type
  } = req.body;
  if (password === '888888' && userName === 'admin') {
    res.send({
      status: 'ok',
      type,
      currentAuthority: 'admin',
    });
    return;
  }
  if (password === '123456' && userName === 'user') {
    res.send({
      status: 'ok',
      type,
      currentAuthority: 'user',
    });
    return;
  }
  res.send({
    status: 'error',
    type,
    currentAuthority: 'guest',
  });
})

app.post('/api/register', (req, res) => {
  res.send({
    status: 'ok',
    currentAuthority: 'user'
  });
})

const server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`应用实例，访问地址为 http://${host}:${port}`);
})