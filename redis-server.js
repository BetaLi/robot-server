const redis = require('redis')
//Tencent Cloud Redis
const TencentRedis={
    host: '203.195.164.46',
    port: 6379
}

//Aliyun
const Aliyun = {
    host: '119.23.106.227',
    port: 6379
}

client = redis.createClient(TencentRedis.port,TencentRedis.host,{db:0})

client.on('error',(err)=>{
    console.log(err)
})

client.on('connect',()=>{
    console.log('Redis is connected.')
})

client.on('ready',()=>{
    console.log('Redis is ready to operate!')
})

client.on('reconnecting',()=>{
    console.log('Redis is reconnecting now...')
})

client.on('end',()=>{
    console.log('Redis id closed.')
})

// client.zrevrange('dishStatistics810177203', 0, 5, (err, res) => {
//     if(err) console.log(err)
//     console.log(res)
// })

// client.quit()
